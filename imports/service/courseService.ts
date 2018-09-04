import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { CourseDB } from "/imports/api/index";


@Injectable()
export class CourseService {
  // variables for institute management
  courseData = {
    _id: "",
    name: "",
    description: "",
    campusID: "",
    facultyID: "",
    instituteID: "",
    createdBy: "",
    createdAt: ""
  }

  isCampusSelected: boolean = false;
  isFacultySelected: boolean = false;
  isInstituteSelected: boolean = false;

  // temporaty variable to keep the initial course name
  // once clicked on edit button.
  tempCourseNameForDuplicateCheck: string = "";

  // temporary variable to keep initial campusID
  tempCampusIDForDuplicateCheck: string = "";

  // temporary variable to keep initial facultyID
  tempFacultyIDForDuplicateCheck: string = "";

  // temporary variable to keep initial instituteID
  tempInstituteIDForDuplicateCheck: string = "";

  isCourseAlreadyExistInDB: boolean = false;
  isNewCourseCreatedSuccessful: boolean = false;
  showNewCourseCreationMessage: boolean = false;

  isEditCourseEnabled: boolean = false;
  isEditCourseSuccessful: boolean = false;
  showUpdateCourseMessage: boolean = false;

  isCourseDeleteSuccessful: boolean = false;


  //  END of course mangement variables and flags


  constructor(public zone: NgZone,public router: Router) {


  } // END of constructor ----------

  getAllCourses(): Observable<any[]> {
    return CourseDB.find({}).fetch();
  } // END OF getAllCourses --------




  // The course CRUD method does both add and update of course
  courseCRUD() {
    // changing the institute already exist flag
    this.isCourseAlreadyExistInDB = false;
    // changing string to lowercase for duplicate checking
    this.courseData.name = this.courseData.name.toLowerCase();
    if (this.courseData.name === '') {
      return true;
    }

    // ===========================================================
    // we will create new institute if isEditCourseEnabled === false
    // ===========================================================
    if (this.isEditCourseEnabled === false) {
      MeteorObservable.call("isCourseExistInDB", this.courseData.name, this.courseData.campusID, this.courseData.facultyID, this.courseData.instituteID).subscribe((response) => {
        // Handle success and response from server!
        if (response["code"] === 200) {
          // let client know that this institute already exist in the system
          this.isCourseAlreadyExistInDB = true;
          // this.courseData.name = this.tempInstituteNameForDuplicateCheck;
          setTimeout(() => {
            this.isCourseAlreadyExistInDB = false;
          }, 3000);
          // console.log(response["feedback"]);
        }
        else if (response["code"] === 999) {

          // new institute creation request
          MeteorObservable.call("addNewCourse", this.courseData).subscribe((response) => {
            if (response["code"] === 200) {
              this.isNewCourseCreatedSuccessful = true;
              this.showNewCourseCreationMessage = true;
              // console.log(response);
              this.isCampusSelected = false;
              this.isFacultySelected = false;
              this.isInstituteSelected = false;
              this.courseData.name = "";
              this.courseData.description = "";
              this.courseData.campusID = "";
              this.courseData.facultyID = "";
              this.courseData.instituteID = "";
              this.courseData._id = "";
              setTimeout(() => {
                this.showNewCourseCreationMessage = false;
              }, 3000);
            }
          }, (err) => {
            // TODO: handle error
            console.log(err);
          });
        }
      }, (err) => {
        // Handle error
        // TODO: handle error
        console.log(err);
      });
    } // END OF if (this.isEditCourseEnabled === false)

    // =====================================================
    // we will update institute if isEditCourseEnabled === true
    // =====================================================
    if (this.isEditCourseEnabled === true) {
      // we need to check if user updating name to an existing name to protect duplication
      if ( this.tempCourseNameForDuplicateCheck === this.courseData.name &&
           this.tempCampusIDForDuplicateCheck === this.courseData.campusID &&
           this.tempFacultyIDForDuplicateCheck === this.courseData.facultyID &&
           this.tempInstituteIDForDuplicateCheck === this.courseData.instituteID ) {
        this.updateCourse();
      }

      if ( this.tempCourseNameForDuplicateCheck !== this.courseData.name ||
           this.tempCampusIDForDuplicateCheck !== this.courseData.campusID ||
           this.tempFacultyIDForDuplicateCheck !== this.courseData.facultyID ||
           this.tempInstituteIDForDuplicateCheck !== this.courseData.instituteID) {

        MeteorObservable.call("isCourseExistInDB", this.courseData.name, this.courseData.campusID, this.courseData.facultyID, this.courseData.instituteID).subscribe((response) => {
          // Handle success and response from server!
          if (response["code"] === 200) {
            // let client know that this course already exist in the system
            this.isCourseAlreadyExistInDB = true;
            setTimeout(() => {
              this.isCourseAlreadyExistInDB = false;
            }, 3000);
            // console.log(response["feedback"]);
          }
          else if (response["code"] === 999) {
            this.updateCourse();
          }
        }, (err) => {
          // Handle error
          // TODO: handle error
          console.log(err);
        });
      }


    }


  } // END OF instituteCRUD() -----------


  updateCourse() {
    MeteorObservable.call("updateCourse", this.courseData).subscribe((response) => {
      if (response["code"] === 200) {
        this.isEditCourseEnabled = false;
        this.isEditCourseSuccessful = true;
        this.showUpdateCourseMessage = true;
        this.isCampusSelected = false;
        this.isFacultySelected = false;
        this.isInstituteSelected = false;

        this.courseData.name = "";
        this.courseData.description = "";
        this.courseData.campusID = "";
        this.courseData.facultyID = "";
        this.courseData.instituteID = "";
        this.tempCourseNameForDuplicateCheck = "";
        setTimeout(() => {
          this.showUpdateCourseMessage = false;
        }, 3000);
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });
  } // END OF updateInstitute() -------------

  selectThisCampus(campusID) {
    if (campusID !== '' && campusID !== undefined) {
      this.isCampusSelected = true;
      this.courseData.campusID = campusID;
      this.courseData.facultyID = ''; // clear the facultyID to hide the institute select field in course management page
      this.isFacultySelected = false; // this resets the facultyselect select field to default value. i.e - select a faculty
    }
  } // END OF selectedCampus() -------------


  selectThisFaculty(facultyID) {
    if (facultyID !== '' && facultyID !== undefined) {
      this.isFacultySelected = true;
      this.isInstituteSelected = false;
      this.courseData.facultyID = facultyID;
    }
  } // END OF selectThisFaculty() -------------

  selectThisInstitute(instituteID) {
    if (instituteID !== '' && instituteID !== undefined) {
      this.isInstituteSelected = true;
      this.courseData.instituteID = instituteID;
    }
  } // END OF selectThisFaculty() -------------







}// END OF CourseService
