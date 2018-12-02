import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { AccountService } from '/imports/service/accountService';
import { BadgeService } from '/imports/service/badgeService';
import { fadeInAnimation } from "/imports/service/animations";

import { TuiService } from 'ngx-tui-editor';



import template from './addNewBadge.html';

@Component({
  selector: 'addNewBadge-component',
  template,
  animations: [fadeInAnimation]

})



export class AddNewBadge implements OnInit {

  private meteorSubscriptionCourse;
  private meteorSubscriptionUser;
  private meteorSubscriptionLevel;
  private meteorSubscriptionCompetency;
  private meteorSubscriptionTool;

  badgeDataState: boolean = true;
  criteriaState: boolean = false;
  metadataState: boolean = false;

  errorMsg: string = "";
  // options for the markdow editor
  options = {
            initialValue: this.badgeService.newBadgeData.criteria_html ,
            initialEditType: 'markdown',
            previewStyle: 'vertical',
            height: 'auto',
            minHeight: '300px',
            exts: ['scrollSync','table']
          };

  constructor(public accountService: AccountService,
              public badgeService: BadgeService,
              private editorService: TuiService) {

              // Subscribe all courses
              this.meteorSubscriptionCourse = MeteorObservable.subscribe<any>("publishAllCourses").subscribe(() => {
                // Subscription is ready!
                MeteorObservable.autorun().subscribe(() => {
                 this.badgeService.allCourses = this.badgeService.getAllCourses();

                });
              });
              // Subscribe all users
              this.meteorSubscriptionUser = MeteorObservable.subscribe<any>("publishAllUserForAdmin").subscribe(() => {
                // Subscription is ready!
                MeteorObservable.autorun().subscribe(() => {
                 this.badgeService.allUsers = this.badgeService.getAllUsers();
                });
              });
              //Subscribe all Level
              this.meteorSubscriptionLevel = MeteorObservable.subscribe<any>("publishAllLevels").subscribe(() => {
                // Subscription is ready!
                MeteorObservable.autorun().subscribe(() => {
                 this.badgeService.allLevels = this.badgeService.getAllLevels();
                });
              });
              //subscribe all competency
              this.meteorSubscriptionCompetency = MeteorObservable.subscribe<any>("publishAllCompetencies").subscribe(() => {
                // Subscription is ready!
                MeteorObservable.autorun().subscribe(() => {
                 this.badgeService.allCompetencies = this.badgeService.getAllCompetencies();
                });
              });
              //subscribe all tool
              this.meteorSubscriptionTool = MeteorObservable.subscribe<any>("publishAllTools").subscribe(() => {
                // Subscription is ready!
                MeteorObservable.autorun().subscribe(() => {
                 this.badgeService.allTools = this.badgeService.getAllTools();
                });
              });

              // we assign the logged in admin/creator to badgeService.newBadgeData.creator and badgeService.metadata.selectedIssuer
             this.addIssuerAndCreatorEmail();



  }

  ngOnInit() {
    //resetting the previous successful badge message.
    this.badgeService.newBadgeCreationSuccessMsg = "";

  } // end of ngOnInit


  // ================================
  // Form wizard step related methods
  // ================================
  goToStepBadgeData() {
    this.badgeService.newBadgeCreationSuccessMsg = ""; // clear the success msg variable
    this.badgeDataState = true;
    this.criteriaState = false;
    this.metadataState = false;
  } // END OF goToStepBadgeData()

  goToStepCriteria() {
    // changing the markdown view
    this.options.initialValue = this.badgeService.newBadgeData.criteria_html;

    if (this.badgeService.newBadgeData.name !== '' && this.badgeService.newBadgeData.description !== '') {
      this.criteriaState = true;
      this.badgeDataState = false;
      this.metadataState = false;

      this.addBadgeNameToKeyword();
    } else {
      this.errorMsg = "Badge name and description is required.";
      setTimeout(() => {
        this.errorMsg = "";
      }, 3000);
    }
  } // END OF goToStepCriteria()

  goToStepMetadata() {

    if (this.badgeService.newBadgeData.name !== '' && this.badgeService.newBadgeData.description !== '') {
        this.metadataState = true;
        this.badgeDataState = false;
        this.criteriaState = false;
        this.addBadgeNameToKeyword();
        this.addIssuerAndCreatorEmail();

        // check the markdown editor value and load
        if (this.editorService.editor ) {
          this.badgeService.newBadgeData.criteria_html = this.editorService.getMarkdown();
        } else {
          this.options.initialValue = this.badgeService.newBadgeData.criteria_html;
        }

    } else {
        this.errorMsg = "Enter badge name and description then click next";
        setTimeout(() => {
          this.errorMsg = "";
        }, 3000);
    }
  } // END OF goToStepMetadata()

  addBadgeNameToKeyword() {
    this.badgeService.selectedKeywords[0] = this.badgeService.newBadgeData.name;
  }

  // add creator and issuer value as admin email
  addIssuerAndCreatorEmail() {
    // we assign the logged in admin/creator to badgeService.newBadgeData.creator and badgeService.metadata.selectedIssuer
    if (this.badgeService.showBadgeEditForm === false) {
      if (this.accountService.isUserLoggedIn && this.accountService.currentUser) {
        if (this.badgeService.selectedIssuers.length <= 0) {
          this.badgeService.selectedIssuers.push(this.accountService.currentUser.emails[0].address);
          this.badgeService.metadata.creator = this.accountService.currentUser.emails[0].address;
        }
      }
    }

  }

  // =================================
  // ======= upload image methods ====
  // =================================
  uploadImage(event) {

    var files = event.target.files;
    var file = files[0];
    var fileName = file.name;// reading the file name
    var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);// extracting extension

    if (file.size > 250000) {
      alert("File size limit exceeds. Max file size 250KB");
    }

    if (fileNameExt !== 'png') {
      alert("Supported file type is only png.");
    }

    if (file.size < 250000 && fileNameExt === 'png') {
         var reader = new FileReader();
         reader.onload =this._handleReaderLoaded.bind(this);
         reader.readAsBinaryString(file);
    }
  } // END OF uploadImage(event)

  _handleReaderLoaded(readerEvt) {
     var binaryString = readerEvt.target.result;
     var result= btoa(binaryString);
     this.badgeService.newBadgeData.image =  "data:image/jpg;base64," + result;
  } // END OF _handleReaderLoaded(readerEvt)

  // =========================================
  // ======= END OF upload image methods =====
  // =========================================

  ngOnDestroy() {
    if (this.meteorSubscriptionCourse) {
      this.meteorSubscriptionCourse.unsubscribe();
    }

    if (this.meteorSubscriptionUser) {
      this.meteorSubscriptionUser.unsubscribe();
    }

    if (this.meteorSubscriptionLevel) {
      this.meteorSubscriptionLevel.unsubscribe();
    }

    if (this.meteorSubscriptionCompetency) {
      this.meteorSubscriptionCompetency.unsubscribe();
    }

    if (this.meteorSubscriptionTool) {
      this.meteorSubscriptionTool.unsubscribe();
    }

    // resetting the form
    this.badgeService.resetBadgeCreateForm();

  }


} // end of class AddNewBadge
