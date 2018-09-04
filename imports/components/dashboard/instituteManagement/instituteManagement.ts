import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { AccountService } from '/imports/service/accountService';
import { FacultyService } from '/imports/service/facultyService';
import { CampusService } from '/imports/service/campusService';
import { InstituteService } from '/imports/service/instituteService';
import { list1, fadeInAnimation } from "/imports/service/animations";

import template from './instituteManagement.html';




@Component({
  selector: 'institute-management',
  template,
  animations: [list1, fadeInAnimation]
})



export class InstituteManagement implements OnInit {
private meteorSubscriptionCampus;
private meteorSubscriptionFaculty;
private meteorSubscriptionInstitute;
allInstitutes: any;
allCampuses: any;
allFaculties: any;
facultyOfThisCampus: any;

  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService,
               public facultyService: FacultyService,
               public campusService: CampusService,
               public instituteService: InstituteService) {


               this.meteorSubscriptionCampus = MeteorObservable.subscribe<any>("publishAllCampuses").subscribe(() => {
                 this.allCampuses = this.campusService.getAllCampuses();
               });

               this.meteorSubscriptionCampus = MeteorObservable.subscribe<any>("publishAllFaculties").subscribe(() => {
                 this.allFaculties = this.facultyService.getAllFaculties();
               });

               this.meteorSubscriptionInstitute = MeteorObservable.subscribe<any>("publishAllInstitutes").subscribe(() => {
                 // Subscription is ready!
                 MeteorObservable.autorun().subscribe(() => {
                   this.allInstitutes = this.instituteService.getAllInstitutes();
                   if (this.allInstitutes !== undefined) {
                     this.allInstitutes.forEach(institute => {
                       institute["campusName"] = this.campusService.getCampusByID(institute["campusID"]);
                       institute["facultyName"] = this.facultyService.getFacultyByID(institute["facultyID"]);
                     });
                   }
                 });
               });
  }



  ngOnInit(): void {
    // reset the flags and variable in the InstituteService so that the selection resets
    // everytime we come to this page.
    this.instituteService.isCampusSelected = false;
    this.instituteService.instituteData.campusID = "";
    this.instituteService.isFacultySelected = false;
    this.instituteService.instituteData.facultyID = "";
    this.instituteService.isEditInstituteEnabled = false;
    this.instituteService.instituteData.name = "";
    this.instituteService.instituteData.description = "";
  }// end of ngOnInit

  getAllFacultyOfThisCampus() {

    this.facultyOfThisCampus = this.facultyService.getfacultiesofSelectedCampus(this.instituteService.instituteData.campusID);

  } // END OF getAllFacultyOfThisCampus()

  editThisInstitute(institute) {
    window.scrollTo(0,0);// jump the window position to the top.
    this.instituteService.isCampusSelected = true; // because its edit
    this.instituteService.isFacultySelected = true; // because it is edit
    this.instituteService.isEditInstituteEnabled = true;
    this.instituteService.tempInstituteNameForDuplicateCheck = institute.name;
    this.instituteService.tempCampusIDForDuplicateCheck = institute.campusID;
    this.instituteService.tempFacultyIDForDuplicateCheck = institute.facultyID;
    this.instituteService.instituteData._id = institute._id;
    this.instituteService.instituteData.name = institute.name;
    this.instituteService.instituteData.description = institute.description;
    this.instituteService.instituteData.campusID = institute.campusID;
    this.instituteService.instituteData.facultyID = institute.facultyID;
    this.getAllFacultyOfThisCampus();
  }


  ngOnDestroy() {
    if (this.meteorSubscriptionCampus) {
      this.meteorSubscriptionCampus.unsubscribe();
    }

    if (this.meteorSubscriptionFaculty) {
      this.meteorSubscriptionFaculty.unsubscribe();
    }

    if (this.meteorSubscriptionInstitute) {
      this.meteorSubscriptionInstitute.unsubscribe();
    }

  }



} // end of class InstituteManagement
