import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { LevelDB } from "/imports/api/index";


@Injectable()
export class LevelService {
  // variables for level management
  newLevelData = {
    _id: "",
    name: "",
    description: "",
    createdBy: "",
    createdAt: ""
  }

  // temporaty variable to keep the initial level name
  // once clicked on edit button.
  tempLevelNameForDuplicateCheck: string = "";

  isLevelAlreadyExistInDB: boolean = false;
  isNewLevelCreatedSuccessful: boolean = false;
  showNewLevelCreationMessage: boolean = false;

  isEditLevelEnabled: boolean = false;
  isEditLevelSuccessful: boolean = false;
  showUpdateLevelMessage: boolean = false;

  isLevelDeleteSuccessful: boolean = false;
  isLevelDeleteFailed: boolean = false;



  //  END of level mangement variables and flags


  constructor(public zone: NgZone,public router: Router) {


  } // END of constructor ----------

  getAllLevels(): Observable<any[]> {
    return LevelDB.find({}).map(level => {
      return level;
    });
  } // END OF getAllCampuses --------


  // The level CRUD method does both add and update of level
  levelCRUD() {
    // changing the level already exist flag
    this.isLevelAlreadyExistInDB = false;
    // changing string to lowercase for duplicate checking
    this.newLevelData.name = this.newLevelData.name.toLowerCase();
    if (this.newLevelData.name === '') {
      return true;
    }

    // ===========================================================
    // we will create new campus if isEditLevelEnabled === false
    // ===========================================================
    if (this.isEditLevelEnabled === false) {
      MeteorObservable.call("isLevelExistInDB", this.newLevelData.name).subscribe((response) => {
        // Handle success and response from server!
        if (response["code"] === 200) {
          // let client know that this level already exist in the system
          this.isLevelAlreadyExistInDB = true;
          setTimeout(() => {
            this.isLevelAlreadyExistInDB = false;
          }, 3000);
          // console.log(response["feedback"]);
        }
        else if (response["code"] === 999) {

          // new level creation request
          MeteorObservable.call("addNewLevel", this.newLevelData).subscribe((response) => {
            if (response["code"] === 200) {
              this.isNewLevelCreatedSuccessful = true;
              this.showNewLevelCreationMessage = true;
              // console.log(response);
              this.newLevelData.name = "";
              this.newLevelData.description = "";
              setTimeout(() => {
                this.showNewLevelCreationMessage = false;
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
    } // END OF if (this.isEditLevelEnabled === false)

    // =====================================================
    // we will update level if isEditLevelEnabled === true
    // =====================================================
    if (this.isEditLevelEnabled === true) {
      // we need to check if user updating name to an existing name to protect duplication
      if (this.tempLevelNameForDuplicateCheck === this.newLevelData.name) {
        this.updateLevel();
      }

      if (this.tempLevelNameForDuplicateCheck !== this.newLevelData.name) {

        MeteorObservable.call("isLevelExistInDB", this.newLevelData.name).subscribe((response) => {
          // Handle success and response from server!
          if (response["code"] === 200) {
            // let client know that this level already exist in the system
            this.isLevelAlreadyExistInDB = true;
            setTimeout(() => {
              this.isLevelAlreadyExistInDB = false;
            }, 3000);
            // console.log(response["feedback"]);
          }
          else if (response["code"] === 999) {
            this.updateLevel();
          }
        }, (err) => {
          // Handle error
          // TODO: handle error
          console.log(err);
        });
      }

    }


  } // END OF campusCRUD() -----------


  updateLevel() {
    MeteorObservable.call("updateLevel", this.newLevelData).subscribe((response) => {
      if (response["code"] === 200) {
        this.isEditLevelEnabled = false;
        this.isEditLevelSuccessful = true;
        this.showUpdateLevelMessage = true;

        this.newLevelData.name = "";
        this.newLevelData.description = "";
        this.tempLevelNameForDuplicateCheck = "";
        setTimeout(() => {
          this.showUpdateLevelMessage = false;
        }, 3000);
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });
  } // END OF updateCampus() -------------



  deleteThisLevel(level) {
    // TODO: prevent from delete level if level is assigned to any badge.
    // check that using a method.
    window.scrollTo(0,0);// jump the window position to the top.

    MeteorObservable.call("deleteLevel", level).subscribe((response) => {
      if (response["code"] === 200) {
        this.isLevelDeleteSuccessful = true;
        setTimeout(() => {
          this.isLevelDeleteSuccessful = false;
        }, 3000);
        this.resetLevelForm();
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });

  } // END OF deleteThisCampus ------------

  resetLevelForm() {
    this.isEditLevelEnabled = false;
    this.newLevelData.name = "";
    this.newLevelData.description = "";
  }






}// END OF MetadataService
