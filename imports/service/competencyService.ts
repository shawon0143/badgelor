import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { CompetencyDB } from "/imports/api/index";


@Injectable()
export class CompetencyService {
  // variables for competency management
  newCompetencyData = {
    _id: "",
    name: "",
    description: "",
    createdBy: "",
    createdAt: ""
  }

  // temporaty variable to keep the initial competency name
  // once clicked on edit button.
  tempCompetencyNameForDuplicateCheck: string = "";

  isCompetencyAlreadyExistInDB: boolean = false;
  isNewCompetencyCreatedSuccessful: boolean = false;
  showNewCompetencyCreationMessage: boolean = false;

  isEditCompetencyEnabled: boolean = false;
  isEditCompetencySuccessful: boolean = false;
  showUpdateCompetencyMessage: boolean = false;

  isCompetencyDeleteSuccessful: boolean = false;
  isCompetencyDeleteFailed: boolean = false;



  //  END of competency mangement variables and flags


  constructor(public zone: NgZone,public router: Router) {


  } // END of constructor ----------

  getAllCompetencies(): Observable<any[]> {
    return CompetencyDB.find({}).map(competency => {
      return competency;
    });
  } // END OF getAllCompetencies --------


  // The competency CRUD method does both add and update of competency
  competencyCRUD() {
    // changing the competency already exist flag
    this.isCompetencyAlreadyExistInDB = false;
    // changing string to lowercase for duplicate checking
    this.newCompetencyData.name = this.newCompetencyData.name.toLowerCase();
    if (this.newCompetencyData.name === '') {
      return true;
    }

    // ===========================================================
    // we will create new competency if isEditCompetencyEnabled === false
    // ===========================================================
    if (this.isEditCompetencyEnabled === false) {
      MeteorObservable.call("isCompetencyExistInDB", this.newCompetencyData.name).subscribe((response) => {
        // Handle success and response from server!
        if (response["code"] === 200) {
          // let client know that this competency already exist in the system
          this.isCompetencyAlreadyExistInDB = true;
          setTimeout(() => {
            this.isCompetencyAlreadyExistInDB = false;
          }, 3000);
          // console.log(response["feedback"]);
        }
        else if (response["code"] === 999) {

          // new competency creation request
          MeteorObservable.call("addNewCompetency", this.newCompetencyData).subscribe((response) => {
            if (response["code"] === 200) {
              this.isNewCompetencyCreatedSuccessful = true;
              this.showNewCompetencyCreationMessage = true;
              // console.log(response);
              this.newCompetencyData.name = "";
              this.newCompetencyData.description = "";
              setTimeout(() => {
                this.showNewCompetencyCreationMessage = false;
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
    } // END OF if (this.isEditCompetencyEnabled === false)

    // =====================================================
    // we will update competency if isEditCompetencyEnabled === true
    // =====================================================
    if (this.isEditCompetencyEnabled === true) {
      // we need to check if user updating name to an existing name to protect duplication
      if (this.tempCompetencyNameForDuplicateCheck === this.newCompetencyData.name) {
        this.updateCompetency();
      }

      if (this.tempCompetencyNameForDuplicateCheck !== this.newCompetencyData.name) {

        MeteorObservable.call("isCompetencyExistInDB", this.newCompetencyData.name).subscribe((response) => {
          // Handle success and response from server!
          if (response["code"] === 200) {
            // let client know that this competency already exist in the system
            this.isCompetencyAlreadyExistInDB = true;
            setTimeout(() => {
              this.isCompetencyAlreadyExistInDB = false;
            }, 3000);
            // console.log(response["feedback"]);
          }
          else if (response["code"] === 999) {
            this.updateCompetency();
          }
        }, (err) => {
          // Handle error
          // TODO: handle error
          console.log(err);
        });
      }

    }


  } // END OF competencyCRUD() -----------


  updateCompetency() {
    MeteorObservable.call("updateCompetency", this.newCompetencyData).subscribe((response) => {
      if (response["code"] === 200) {
        this.isEditCompetencyEnabled = false;
        this.isEditCompetencySuccessful = true;
        this.showUpdateCompetencyMessage = true;

        this.newCompetencyData.name = "";
        this.newCompetencyData.description = "";
        this.tempCompetencyNameForDuplicateCheck = "";
        setTimeout(() => {
          this.showUpdateCompetencyMessage = false;
        }, 3000);
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });
  } // END OF updateCampus() -------------



  deleteThisCompetency(competency) {
    // TODO: prevent from delete competency if competency is assigned to any badge.
    // check that using a method.
    window.scrollTo(0,0);// jump the window position to the top.

    MeteorObservable.call("deleteCompetency", competency).subscribe((response) => {
      if (response["code"] === 200) {
        this.isCompetencyDeleteSuccessful = true;
        setTimeout(() => {
          this.isCompetencyDeleteSuccessful = false;
        }, 3000);
        this.resetCompetencyForm();
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });

  } // END OF deleteThisCampus ------------

  resetCompetencyForm() {
    this.isEditCompetencyEnabled = false;
    this.newCompetencyData.name = "";
    this.newCompetencyData.description = "";
  }






}// END OF CompetencyService
