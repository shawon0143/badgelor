import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { ToolDB } from "/imports/api/index";


@Injectable()
export class ToolService {
  // variables for tool management
  newToolData = {
    _id: "",
    name: "",
    description: "",
    createdBy: "",
    createdAt: ""
  }

  // temporaty variable to keep the initial tool name
  // once clicked on edit button.
  tempToolNameForDuplicateCheck: string = "";

  isToolAlreadyExistInDB: boolean = false;
  isNewToolCreatedSuccessful: boolean = false;
  showNewToolCreationMessage: boolean = false;

  isEditToolEnabled: boolean = false;
  isEditToolSuccessful: boolean = false;
  showUpdateToolMessage: boolean = false;

  isToolDeleteSuccessful: boolean = false;
  isToolDeleteFailed: boolean = false;



  //  END of tool mangement variables and flags


  constructor(public zone: NgZone,public router: Router) {


  } // END of constructor ----------

  getAllTools(): Observable<any[]> {
    return ToolDB.find({}).map(tool => {
      return tool;
    });
  } // END OF getAllCampuses --------


  // The tool CRUD method does both add and update of tool
  toolCRUD() {
    // changing the tool already exist flag
    this.isToolAlreadyExistInDB = false;
    // changing string to lowercase for duplicate checking
    this.newToolData.name = this.newToolData.name.toLowerCase();
    if (this.newToolData.name === '') {
      return true;
    }

    // ===========================================================
    // we will create new tool if isEditToolEnabled === false
    // ===========================================================
    if (this.isEditToolEnabled === false) {
      MeteorObservable.call("isToolExistInDB", this.newToolData.name).subscribe((response) => {
        // Handle success and response from server!
        if (response["code"] === 200) {
          // let client know that this tool already exist in the system
          this.isToolAlreadyExistInDB = true;
          setTimeout(() => {
            this.isToolAlreadyExistInDB = false;
          }, 3000);
          // console.log(response["feedback"]);
        }
        else if (response["code"] === 999) {

          // new tool creation request
          MeteorObservable.call("addNewTool", this.newToolData).subscribe((response) => {
            if (response["code"] === 200) {
              this.isNewToolCreatedSuccessful = true;
              this.showNewToolCreationMessage = true;
              // console.log(response);
              this.newToolData.name = "";
              this.newToolData.description = "";
              setTimeout(() => {
                this.showNewToolCreationMessage = false;
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
    } // END OF if (this.isEditToolEnabled === false)

    // =====================================================
    // we will update tool if isEditToolEnabled === true
    // =====================================================
    if (this.isEditToolEnabled === true) {
      // we need to check if user updating name to an existing name to protect duplication
      if (this.tempToolNameForDuplicateCheck === this.newToolData.name) {
        this.updateTool();
      }

      if (this.tempToolNameForDuplicateCheck !== this.newToolData.name) {

        MeteorObservable.call("isToolExistInDB", this.newToolData.name).subscribe((response) => {
          // Handle success and response from server!
          if (response["code"] === 200) {
            // let client know that this tool already exist in the system
            this.isToolAlreadyExistInDB = true;
            setTimeout(() => {
              this.isToolAlreadyExistInDB = false;
            }, 3000);
            // console.log(response["feedback"]);
          }
          else if (response["code"] === 999) {
            this.updateTool();
          }
        }, (err) => {
          // Handle error
          // TODO: handle error
          console.log(err);
        });
      }

    }


  } // END OF toolCRUD() -----------


  updateTool() {
    MeteorObservable.call("updateTool", this.newToolData).subscribe((response) => {
      if (response["code"] === 200) {
        this.isEditToolEnabled = false;
        this.isEditToolSuccessful = true;
        this.showUpdateToolMessage = true;

        this.newToolData.name = "";
        this.newToolData.description = "";
        this.tempToolNameForDuplicateCheck = "";
        setTimeout(() => {
          this.showUpdateToolMessage = false;
        }, 3000);
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });
  } // END OF updateCampus() -------------



  deleteThisTool(tool) {
    // TODO: prevent from delete tool if tool is assigned to any badge.
    // check that using a method.
    window.scrollTo(0,0);// jump the window position to the top.

    MeteorObservable.call("deleteTool", tool).subscribe((response) => {
      if (response["code"] === 200) {
        this.isToolDeleteSuccessful = true;
        setTimeout(() => {
          this.isToolDeleteSuccessful = false;
        }, 3000);
        this.resetToolForm();
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });

  } // END OF deleteThisCampus ------------

  resetToolForm() {
    this.isEditToolEnabled = false;
    this.newToolData.name = "";
    this.newToolData.description = "";
  }






}// END OF MetadataService
