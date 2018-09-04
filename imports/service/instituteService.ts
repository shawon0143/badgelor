import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { InstituteDB } from "/imports/api/index";


@Injectable()
export class InstituteService {
  // variables for institute management
  instituteData = {
    _id: "",
    name: "",
    description: "",
    campusID: "",
    facultyID: "",
    createdBy: "",
    createdAt: ""
  }

  isCampusSelected: boolean = false;


  isFacultySelected: boolean = false;

  // temporaty variable to keep the initial institute name
  // once clicked on edit button.
  tempInstituteNameForDuplicateCheck: string = "";

  // temporary variable to keep initial campusID
  tempCampusIDForDuplicateCheck: string = "";

  // temporary variable to keep initial facultyID
  tempFacultyIDForDuplicateCheck: string = "";

  isInstituteAlreadyExistInDB: boolean = false;
  isNewInstituteCreatedSuccessful: boolean = false;
  showNewInstituteCreationMessage: boolean = false;

  isEditInstituteEnabled: boolean = false;
  isEditInstituteSuccessful: boolean = false;
  showUpdateInstituteMessage: boolean = false;

  isInstituteDeleteSuccessful: boolean = false;
  isInstituteDeleteFailed: boolean = false;


  //  END of institute mangement variables and flags


  constructor(public zone: NgZone,public router: Router) {


  } // END of constructor ----------

  getAllInstitutes(): Observable<any[]> {
    return InstituteDB.find({}).fetch();
  } // END OF getAllFaculties --------

  getInstitutesOfSelectedFaculty(facultyID): Observable<any[]> {
    return InstituteDB.find({"facultyID": facultyID}).map(institute => {
      return institute;
    });
  } // END OF getInstitutesOfSelectedFaculty --------

  getInstituteByID(instituteID) {
    var thisInstitute = InstituteDB.findOne({"_id":instituteID});
    if (thisInstitute !== undefined) {
      return thisInstitute.name;
    }
  } // END of getInstituteByID

  // The institute CRUD method does both add and update of institute
  instituteCRUD() {
    // changing the institute already exist flag
    this.isInstituteAlreadyExistInDB = false;
    // changing string to lowercase for duplicate checking
    this.instituteData.name = this.instituteData.name.toLowerCase();
    if (this.instituteData.name === '') {
      return true;
    }

    // ===========================================================
    // we will create new institute if isEditInstituteEnabled === false
    // ===========================================================
    if (this.isEditInstituteEnabled === false) {
      MeteorObservable.call("isInstituteExistInDB", this.instituteData.name, this.instituteData.campusID, this.instituteData.facultyID).subscribe((response) => {
        // Handle success and response from server!
        if (response["code"] === 200) {
          // let client know that this institute already exist in the system
          this.isInstituteAlreadyExistInDB = true;
          // this.instituteData.name = this.tempInstituteNameForDuplicateCheck;
          setTimeout(() => {
            this.isInstituteAlreadyExistInDB = false;
          }, 3000);
          // console.log(response["feedback"]);
        }
        else if (response["code"] === 999) {

          // new institute creation request
          MeteorObservable.call("addNewInstitute", this.instituteData).subscribe((response) => {
            if (response["code"] === 200) {
              this.isNewInstituteCreatedSuccessful = true;
              this.showNewInstituteCreationMessage = true;
              // console.log(response);
              this.isCampusSelected = false;
              this.isFacultySelected = false;
              this.instituteData.name = "";
              this.instituteData.description = "";
              this.instituteData.campusID = "";
              this.instituteData.facultyID = "";
              this.instituteData._id = "";
              setTimeout(() => {
                this.showNewInstituteCreationMessage = false;
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
    } // END OF if (this.isEditInstituteEnabled === false)

    // =====================================================
    // we will update institute if isEditInstituteEnabled === true
    // =====================================================
    if (this.isEditInstituteEnabled === true) {
      // we need to check if user updating name to an existing name to protect duplication
      if ( this.tempInstituteNameForDuplicateCheck === this.instituteData.name &&
           this.tempCampusIDForDuplicateCheck === this.instituteData.campusID &&
           this.tempFacultyIDForDuplicateCheck === this.instituteData.facultyID ) {
        this.updateInstitute();
      }

      if ( this.tempInstituteNameForDuplicateCheck !== this.instituteData.name ||
           this.tempCampusIDForDuplicateCheck !== this.instituteData.campusID ||
           this.tempFacultyIDForDuplicateCheck !== this.instituteData.facultyID) {

        MeteorObservable.call("isInstituteExistInDB", this.instituteData.name, this.instituteData.campusID, this.instituteData.facultyID).subscribe((response) => {
          // Handle success and response from server!
          if (response["code"] === 200) {
            // let client know that this institute already exist in the system
            this.isInstituteAlreadyExistInDB = true;
            setTimeout(() => {
              this.isInstituteAlreadyExistInDB = false;
            }, 3000);
            // console.log(response["feedback"]);
          }
          else if (response["code"] === 999) {
            this.updateInstitute();
          }
        }, (err) => {
          // Handle error
          // TODO: handle error
          console.log(err);
        });
      }


    }


  } // END OF instituteCRUD() -----------


  updateInstitute() {
    MeteorObservable.call("updateInstitute", this.instituteData).subscribe((response) => {
      if (response["code"] === 200) {
        this.isEditInstituteEnabled = false;
        this.isEditInstituteSuccessful = true;
        this.showUpdateInstituteMessage = true;
        this.isCampusSelected = false;
        this.isFacultySelected = false;

        this.instituteData.name = "";
        this.instituteData.description = "";
        this.instituteData.campusID = "";
        this.instituteData.facultyID = "";
        this.tempInstituteNameForDuplicateCheck = "";
        setTimeout(() => {
          this.showUpdateInstituteMessage = false;
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
      this.instituteData.campusID = campusID;
    }

    if (this.isEditInstituteEnabled === true ) {
      // if user changes the campus while editing
      // we will reset the facultyID
      this.isFacultySelected = false;
      this.instituteData.facultyID = '';
    }
  } // END OF selectedCampus() -------------


  selectThisFaculty(facultyID) {
    if (facultyID !== '' && facultyID !== undefined) {
      this.isFacultySelected = true;
      this.instituteData.facultyID = facultyID;
    }
  } // END OF selectThisFaculty() -------------

  deleteThisInstitute(institute) {

    // first check if this institute has any course
    // if yes show message to user that it is not possible to delete this institute
    // unless you delete the correspondent courses
    // TODO: implement delete after course availability check for this institute
    // see previous example.

    MeteorObservable.call("isInstituteHasCourse", institute._id).subscribe((response) => {

      if (response["code"] === 999) {
        this.isInstituteDeleteFailed = true;
        setTimeout(() => {
          this.isInstituteDeleteFailed = false;
        }, 3000);

      }

      if (response["code"] === 200) {
        // the institute doesn't have any course so delete possible
        MeteorObservable.call("deleteInstitute", institute).subscribe((response) => {
          if (response["code"] === 200) {
            this.isInstituteDeleteSuccessful = true;
            setTimeout(() => {
              this.isInstituteDeleteSuccessful = false;
            }, 3000);
            this.resetInstituteForm();
          }
        });
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });




  } // END OF deleteThisInstitute ------------

  resetInstituteForm() {
    this.isCampusSelected = false;
    this.isFacultySelected = false;
    this.isEditInstituteEnabled = false;
    this.instituteData.name = "";
    this.instituteData.description = "";
    this.instituteData.campusID = "";
    this.instituteData.facultyID = "";
  }






}// END OF InstituteService
