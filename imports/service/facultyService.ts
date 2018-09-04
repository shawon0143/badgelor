import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { FacultyDB } from "/imports/api/index";


@Injectable()
export class FacultyService {
  // variables for faculty management
  facultyData = {
    _id: "",
    name: "",
    description: "",
    campusID: "",
    createdBy: "",
    createdAt: ""
  }

  isCampusSelected: boolean = false;

  // temporaty variable to keep the initial faculty name
  // once clicked on edit button.
  tempFacultyNameForDuplicateCheck: string = "";

  // temporary variable to keep initial campusID
  tempCampusIDForDuplicateCheck: string = "";

  isFacultyAlreadyExistInDB: boolean = false;
  isNewFacultyCreatedSuccessful: boolean = false;
  showNewFacultyCreationMessage: boolean = false;

  isEditFacultyEnabled: boolean = false;
  isEditFacultySuccessful: boolean = false;
  showUpdateFacultyMessage: boolean = false;

  isFacultyDeleteSuccessful: boolean = false;
  isFacultyDeleteFailed: boolean = false;

  //  END of faculty mangement variables and flags


  constructor(public zone: NgZone,public router: Router) {


  } // END of constructor ----------

  getAllFaculties(): Observable<any[]> {
    return FacultyDB.find({}).fetch();
  } // END OF getAllFaculties --------

  getfacultiesofSelectedCampus(campusID): Observable<any[]> {
    return FacultyDB.find({"campusID": campusID}).map(faculty => {
      return faculty;
    });
  } // END OF getAllCampuses --------

  getFacultyByID(facultyID) {
    var thisFaculty = FacultyDB.findOne({"_id":facultyID});

    if (thisFaculty !== undefined) {
      return thisFaculty.name;
    }
  } // END of getCampusByID


  // The faculty CRUD method does both add and update of faculty
  facultyCRUD() {
    // changing the faculty already exist flag
    this.isFacultyAlreadyExistInDB = false;
    // changing string to lowercase for duplicate checking
    this.facultyData.name = this.facultyData.name.toLowerCase();
    if (this.facultyData.name === '') {
      return true;
    }

    // ===========================================================
    // we will create new faculty if isEditFacultyEnabled === false
    // ===========================================================
    if (this.isEditFacultyEnabled === false) {
      MeteorObservable.call("isFacultyExistInDB", this.facultyData.name, this.facultyData.campusID).subscribe((response) => {
        // Handle success and response from server!
        if (response["code"] === 200) {
          // let client know that this faculty already exist in the system
          this.isFacultyAlreadyExistInDB = true;
          // this.facultyData.name = this.tempFacultyNameForDuplicateCheck;
          setTimeout(() => {
            this.isFacultyAlreadyExistInDB = false;
          }, 3000);
          // console.log(response["feedback"]);
        }
        else if (response["code"] === 999) {

          // new faculty creation request
          MeteorObservable.call("addNewFaculty", this.facultyData).subscribe((response) => {
            if (response["code"] === 200) {
              this.isNewFacultyCreatedSuccessful = true;
              this.showNewFacultyCreationMessage = true;
              // console.log(response);
              this.isCampusSelected = false;
              this.facultyData.name = "";
              this.facultyData.description = "";
              this.facultyData.campusID = "";
              this.facultyData._id = "";
              setTimeout(() => {
                this.showNewFacultyCreationMessage = false;
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
    } // END OF if (this.isEditFacultyEnabled === false)

    // =====================================================
    // we will update faculty if isEditFacultyEnabled === true
    // =====================================================
    if (this.isEditFacultyEnabled === true) {
      // we need to check if user updating name to an existing name to protect duplication
      if (this.tempFacultyNameForDuplicateCheck === this.facultyData.name && this.tempCampusIDForDuplicateCheck === this.facultyData.campusID) {
        this.updateFaculty();
      }

      if (this.tempFacultyNameForDuplicateCheck !== this.facultyData.name || this.tempCampusIDForDuplicateCheck !== this.facultyData.campusID) {

        MeteorObservable.call("isFacultyExistInDB", this.facultyData.name, this.facultyData.campusID).subscribe((response) => {
          // Handle success and response from server!
          if (response["code"] === 200) {
            // let client know that this faculty already exist in the system
            this.isFacultyAlreadyExistInDB = true;
            setTimeout(() => {
              this.isFacultyAlreadyExistInDB = false;
            }, 3000);
            // console.log(response["feedback"]);
          }
          else if (response["code"] === 999) {
            this.updateFaculty();
          }
        }, (err) => {
          // Handle error
          // TODO: handle error
          console.log(err);
        });
      }


    }


  } // END OF facultyCRUD() -----------


  updateFaculty() {
    MeteorObservable.call("updateFaculty", this.facultyData).subscribe((response) => {
      if (response["code"] === 200) {
        this.isEditFacultyEnabled = false;
        this.isEditFacultySuccessful = true;
        this.showUpdateFacultyMessage = true;
        this.isCampusSelected = false;

        this.facultyData.name = "";
        this.facultyData.description = "";
        this.facultyData.campusID = ""
        this.tempFacultyNameForDuplicateCheck = "";
        setTimeout(() => {
          this.showUpdateFacultyMessage = false;
        }, 3000);
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });
  } // END OF updateFaculty() -------------

  selectThisCampus(campusID) {
    if (campusID !== '' && campusID !== undefined) {
      this.isCampusSelected = true;
      this.facultyData.campusID = campusID;
    }
  } // END OF selectThisCampus() -------------

  deleteThisFaculty(faculty) {
    window.scrollTo(0,0);// jump the window position to the top.
    MeteorObservable.call("isFacultyHasInstitute", faculty._id).subscribe((response) => {

      if (response["code"] === 999) {
        this.isFacultyDeleteFailed = true;
        setTimeout(() => {
          this.isFacultyDeleteFailed = false;
        }, 3000);

      }

      if (response["code"] === 200) {
        // the faculty doesn't have any institute so delete possible
        MeteorObservable.call("deleteFaculty", faculty).subscribe((response) => {
          if (response["code"] === 200) {
            this.isFacultyDeleteSuccessful = true;
            setTimeout(() => {
              this.isFacultyDeleteSuccessful = false;
            }, 3000);
            this.resetFacultyForm();
          }
        });
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });

  } // END OF deleteThisFaculty ------------

  resetFacultyForm() {
    this.isCampusSelected = false;
    this.isEditFacultyEnabled = false;
    this.facultyData.name = "";
    this.facultyData.description = "";
    this.facultyData.campusID = "";
  }






}// END OF FacultyService
