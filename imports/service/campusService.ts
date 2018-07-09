import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { CampusDB } from "/imports/api/index";


@Injectable()
export class CampusService {
  // variables for campus management
  newCampusData = {
    _id: "",
    name: "",
    description: "",
    createdBy: "",
    createdAt: ""
  }

  // temporaty variable to keep the initial campus name
  // once clicked on edit button.
  tempCampusNameForDuplicateCheck: string = "";

  isCampusAlreadyExistInDB: boolean = false;
  isNewCampusCreatedSuccessful: boolean = false;
  showNewCampusCreationMessage: boolean = false;

  isEditCampusEnabled: boolean = false;
  isEditCampusSuccessful: boolean = false;
  showUpdateCampusMessage: boolean = false;

  isCampusDeleteSuccessful: boolean = false;
  isCampusDeleteFailed: boolean = false;


  // usernameList;

  //  END of campus mangement variables and flags


  constructor(public zone: NgZone,public router: Router) {


  } // END of constructor ----------

  getAllCampuses(): Observable<any[]> {
    return CampusDB.find({}).map(campus => {
      return campus;
    });
  } // END OF getAllCampuses --------

  // this method is used in facultymanagement component
  getCampusByID(campusID) {
    var thisCampus = CampusDB.findOne({"_id":campusID});
    if (thisCampus !== undefined) {
      return thisCampus.name;
    }
  } // END of getCampusByID


  // The campus CRUD method does both add and update of campus
  campusCRUD() {
    // changing the campus already exist flag
    this.isCampusAlreadyExistInDB = false;
    // changing string to lowercase for duplicate checking
    this.newCampusData.name = this.newCampusData.name.toLowerCase();
    if (this.newCampusData.name === '') {
      return true;
    }

    // ===========================================================
    // we will create new campus if isEditCampusEnabled === false
    // ===========================================================
    if (this.isEditCampusEnabled === false) {
      MeteorObservable.call("isCampusExistInDB", this.newCampusData.name).subscribe((response) => {
        // Handle success and response from server!
        if (response["code"] === 200) {
          // let client know that this campus already exist in the system
          this.isCampusAlreadyExistInDB = true;
          setTimeout(() => {
            this.isCampusAlreadyExistInDB = false;
          }, 3000);
          // console.log(response["feedback"]);
        }
        else if (response["code"] === 999) {

          // new campus creation request
          MeteorObservable.call("addNewCampus", this.newCampusData).subscribe((response) => {
            if (response["code"] === 200) {
              this.isNewCampusCreatedSuccessful = true;
              this.showNewCampusCreationMessage = true;
              // console.log(response);
              this.newCampusData.name = "";
              this.newCampusData.description = "";
              setTimeout(() => {
                this.showNewCampusCreationMessage = false;
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
    } // END OF if (this.isEditCampusEnabled === false)

    // =====================================================
    // we will update campus if isEditCampusEnabled === true
    // =====================================================
    if (this.isEditCampusEnabled === true) {
      // we need to check if user updating name to an existing name to protect duplication
      if (this.tempCampusNameForDuplicateCheck === this.newCampusData.name) {
        this.updateCampus();
      }

      if (this.tempCampusNameForDuplicateCheck !== this.newCampusData.name) {

        MeteorObservable.call("isCampusExistInDB", this.newCampusData.name).subscribe((response) => {
          // Handle success and response from server!
          if (response["code"] === 200) {
            // let client know that this campus already exist in the system
            this.isCampusAlreadyExistInDB = true;
            setTimeout(() => {
              this.isCampusAlreadyExistInDB = false;
            }, 3000);
            // console.log(response["feedback"]);
          }
          else if (response["code"] === 999) {
            this.updateCampus();
          }
        }, (err) => {
          // Handle error
          // TODO: handle error
          console.log(err);
        });
      }

    }


  } // END OF campusCRUD() -----------


  updateCampus() {
    MeteorObservable.call("updateCampus", this.newCampusData).subscribe((response) => {
      if (response["code"] === 200) {
        this.isEditCampusEnabled = false;
        this.isEditCampusSuccessful = true;
        this.showUpdateCampusMessage = true;

        this.newCampusData.name = "";
        this.newCampusData.description = "";
        this.tempCampusNameForDuplicateCheck = "";
        setTimeout(() => {
          this.showUpdateCampusMessage = false;
        }, 3000);
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });
  } // END OF updateCampus() -------------



  deleteThisCampus(campus) {
    // first check if this campus has any faculty
    // if yes show message to user that it is not possible to delete this campus
    // unless you delete the correspondent faculty
    // TODO: implement delete after faculty availability check for this campus

    MeteorObservable.call("isCampusHasFaculty", campus._id).subscribe((response) => {
      if (response["code"] === 999) {
        this.isCampusDeleteFailed = true;
        setTimeout(() => {
          this.isCampusDeleteFailed = false;
        }, 3000);

      }

      if (response["code"] === 200) {
        // the campus doesn't have any faculty so delete possible
        MeteorObservable.call("deleteCampus", campus).subscribe((response) => {
          if (response["code"] === 200) {
            this.isCampusDeleteSuccessful = true;
            setTimeout(() => {
              this.isCampusDeleteSuccessful = false;
            }, 3000);
            this.resetCampusForm();
          }
        });
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });


  } // END OF deleteThisCampus ------------

  resetCampusForm() {
    this.isEditCampusEnabled = false;
    this.newCampusData.name = "";
    this.newCampusData.description = "";
  }






}// END OF MetadataService
