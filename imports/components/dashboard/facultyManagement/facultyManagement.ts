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
import { list1, fadeInAnimation } from "/imports/service/animations";

import template from './facultyManagement.html';




@Component({
  selector: 'faculty-management',
  template,
  animations: [list1, fadeInAnimation]
})



export class FacultyManagement implements OnInit {
  private meteorSubscriptionFaculty;
  private meteorSubscriptionCampus;
  allFaculties: any;
  allCampuses: any;

  constructor(private route: ActivatedRoute, private router: Router, public accountService: AccountService, public facultyService: FacultyService, public campusService: CampusService) {

    this.meteorSubscriptionCampus = MeteorObservable.subscribe<any>("publishAllCampus").subscribe(() => {
      this.allCampuses = this.campusService.getAllCampuses();
    });

    this.meteorSubscriptionFaculty = MeteorObservable.subscribe<any>("publishAllFaculty").subscribe(() => {
      // Subscription is ready!
      MeteorObservable.autorun().subscribe(() => {
        this.allFaculties = this.facultyService.getAllFaculties();
        if (this.allFaculties !== undefined) {
          this.allFaculties.forEach(faculty => {
            faculty["campusName"] = this.campusService.getCampusByID(faculty["campusID"]);
          });

        }
      });
    });
  }


  editThisFaculty(faculty) {
    this.facultyService.isCampusSelected = true; // because its edit
    this.facultyService.isEditFacultyEnabled = true;
    this.facultyService.tempFacultyNameForDuplicateCheck = faculty.name;
    this.facultyService.tempCampusIDForDuplicateCheck = faculty.campusID;
    this.facultyService.facultyData._id = faculty._id;
    this.facultyService.facultyData.name = faculty.name;
    this.facultyService.facultyData.description = faculty.description;
    this.facultyService.facultyData.campusID = faculty.campusID;
  }

  ngOnInit(): void {

  }// end of ngOnInit




  ngOnDestroy() {
    if (this.meteorSubscriptionCampus) {
      this.meteorSubscriptionCampus.unsubscribe();
    }
    if (this.meteorSubscriptionFaculty) {
      this.meteorSubscriptionFaculty.unsubscribe();
    }
  }



} // end of class CampusManagement
