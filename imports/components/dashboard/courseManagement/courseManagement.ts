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
import { CourseService } from '/imports/service/courseService';
import { list1, fadeInAnimation } from "/imports/service/animations";

import template from './courseManagement.html';




@Component({
  selector: 'course-management',
  template,
  animations: [list1, fadeInAnimation]
})



export class CourseManagement implements OnInit {
private meteorSubscriptionCampus;
private meteorSubscriptionFaculty;
private meteorSubscriptionInstitute;
private meteorSubscriptionCourse;

allCampuses: any;
allFaculties: any;
allInstitutes: any;
allCourses: any;
facultyOfThisCampus: any;
instituteOfThisFaculty: any;

  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService,
               public facultyService: FacultyService,
               public campusService: CampusService,
               public instituteService: InstituteService,
               public courseService: CourseService) {


               this.meteorSubscriptionCampus = MeteorObservable.subscribe<any>("publishAllCampuses").subscribe(() => {
                 this.allCampuses = this.campusService.getAllCampuses();
               });

               this.meteorSubscriptionCampus = MeteorObservable.subscribe<any>("publishAllFaculties").subscribe(() => {
                 this.allFaculties = this.facultyService.getAllFaculties();
               });

               this.meteorSubscriptionInstitute = MeteorObservable.subscribe<any>("publishAllInstitutes").subscribe(() => {
                 this.allInstitutes = this.instituteService.getAllInstitutes();
               });


               this.meteorSubscriptionCourse = MeteorObservable.subscribe<any>("publishAllCourses").subscribe(() => {
                 // Subscription is ready!
                 MeteorObservable.autorun().subscribe(() => {
                   this.allCourses = this.courseService.getAllCourses();
                   if (this.allCourses !== undefined) {
                     this.allCourses.forEach(course => {
                       course["campusName"] = this.campusService.getCampusByID(course["campusID"]);
                       course["facultyName"] = this.facultyService.getFacultyByID(course["facultyID"]);
                       course["instituteName"] = this.instituteService.getInstituteByID(course["instituteID"]);
                     });
                   }
                 });
               });
  }



  ngOnInit(): void {
    // reset the flags and variable in the InstituteService so that the selection resets
    // everytime we come to this page.
    this.courseService.isCampusSelected = false;
    this.courseService.courseData.campusID = "";
    this.courseService.isFacultySelected = false;
    this.courseService.courseData.facultyID = "";
    this.courseService.isInstituteSelected = false;
    this.courseService.courseData.instituteID = "";
    this.courseService.isEditCourseEnabled = false;
    this.courseService.courseData.name = "";
    this.courseService.courseData.description = "";
  }// end of ngOnInit

  getAllFacultyOfThisCampus() {

    this.facultyOfThisCampus = this.facultyService.getfacultiesofSelectedCampus(this.courseService.courseData.campusID);

  } // END OF getAllFacultyOfThisCampus()

  getAllInstituteOfThisFaculty() {

    this.instituteOfThisFaculty = this.instituteService.getInstitutesOfSelectedFaculty(this.courseService.courseData.facultyID);

  } // END OF getAllInstituteOfThisFaculty()

  editThisCourse(course) {
    window.scrollTo(0,0);// this line will take the window position to the top.
    this.courseService.isCampusSelected = true; // because its edit
    this.courseService.isFacultySelected = true; // because it is edit
    this.courseService.isInstituteSelected = true; // because it is edit
    this.courseService.isEditCourseEnabled = true;
    this.courseService.tempCourseNameForDuplicateCheck = course.name;
    this.courseService.tempCampusIDForDuplicateCheck = course.campusID;
    this.courseService.tempFacultyIDForDuplicateCheck = course.facultyID;
    this.courseService.tempInstituteIDForDuplicateCheck = course.instituteID;
    this.courseService.courseData._id = course._id;
    this.courseService.courseData.name = course.name;
    this.courseService.courseData.description = course.description;
    this.courseService.courseData.campusID = course.campusID;
    this.courseService.courseData.facultyID = course.facultyID;
    this.courseService.courseData.instituteID = course.instituteID;
    this.getAllFacultyOfThisCampus();
    this.getAllInstituteOfThisFaculty();
  }

  resetCourseForm() {

    this.courseService.isCampusSelected = false;
    this.courseService.isFacultySelected = false;
    this.courseService.isInstituteSelected = false;
    this.courseService.isEditCourseEnabled = false;
    this.courseService.courseData.name = "";
    this.courseService.courseData.description = "";
    this.courseService.courseData.campusID = "";
    this.courseService.courseData.facultyID = "";
    this.courseService.courseData.instituteID = "";
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

  }



} // end of class CourseManagement
