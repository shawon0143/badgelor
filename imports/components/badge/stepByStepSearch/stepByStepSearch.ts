import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '/imports/service/searchService';
import { BadgeService } from '/imports/service/badgeService';
import { CampusService } from '/imports/service/campusService';
import { FacultyService } from '/imports/service/facultyService';
import { InstituteService } from '/imports/service/instituteService';
import { CourseService } from '/imports/service/courseService';
import { MeteorObservable } from "meteor-rxjs";
import { CampusDB, FacultyDB, InstituteDB, CourseDB } from "/imports/api/index";

import template from './stepByStepSearch.html';

@Component({
  selector: 'stepByStep-search',
  template
})

export class StepByStepSearch implements OnInit, OnDestroy {
  meteorSubscriptionCampus;
  meteorSubscriptionFaculty;
  meteorSubscriptionInstitute;
  meteorSubscriptionCourse;
  campuses;
  faculties;
  institutes;
  courses;
  stepOne: boolean = true;
  stepTwo: boolean = false;
  stepThree: boolean = false;
  stepFour: boolean = false;
  errorMsg: string = "";


  constructor(private searchService: SearchService,
              private badgeService: BadgeService,
              public campusService: CampusService,
              public facultyService: FacultyService,
              public instituteService: InstituteService,
              public courseService: CourseService) {

        this.meteorSubscriptionCampus = MeteorObservable.subscribe<any>("publishAllCampuses").subscribe(() => {
            this.campuses = this.campusService.getAllCampuses();
        });

        this.meteorSubscriptionFaculty = MeteorObservable.subscribe<any>("publishAllFaculties").subscribe(() => {

        });

        this.meteorSubscriptionInstitute = MeteorObservable.subscribe<any>("publishAllInstitutes").subscribe(() => {

        });

        this.meteorSubscriptionCourse = MeteorObservable.subscribe<any>("publishAllCourses").subscribe(() => {

        });

  }
  ngOnInit() {

  }

  goToStepOne() {
    this.stepOne = true;
    this.stepTwo = false;
    this.stepThree = false;
    this.stepFour = false;
  }

  goToStepTwo(campusID) {

    this.faculties = FacultyDB.find({"campusID": campusID}).fetch();
    if (this.faculties.length > 0) {
      this.stepOne = false;
      this.stepTwo = true;
      this.stepThree = false;
      this.stepFour = false;
    } else {
      this.errorMsg = "This campus doesn't have any faculty";
      setTimeout(() => {
        this.errorMsg = "";
      }, 1500);
    }

  }
  goToStepThree(facultyID) {
    this.institutes = InstituteDB.find({"facultyID": facultyID}).fetch();
    if (this.institutes.length > 0) {
      this.stepOne = false;
      this.stepTwo = false;
      this.stepThree = true;
      this.stepFour = false;
    } else {
      this.errorMsg = "This faculty doesn't have any institute";
      setTimeout(() => {
        this.errorMsg = "";
      }, 1500);
    }

  }
  goToStepFour(instituteID) {
    this.courses = CourseDB.find({"instituteID": instituteID}).fetch();
    if (this.courses.length > 0) {
      this.stepOne = false;
      this.stepTwo = false;
      this.stepThree = false;
      this.stepFour = true;
    } else {
      this.errorMsg = "This Institute doesn't have any course";
      setTimeout(() => {
        this.errorMsg = "";
      }, 1500);
    }

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

    if (this.meteorSubscriptionCourse) {
      this.meteorSubscriptionCourse.unsubscribe();
    }
    this.errorMsg = "";
  }

}
