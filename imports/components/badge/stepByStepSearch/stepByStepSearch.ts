import { Component, OnInit } from '@angular/core';
import { SearchService } from '/imports/service/searchService';
import { BadgeService } from '/imports/service/badgeService';
import { CampusService } from '/imports/service/campusService';
import { MeteorObservable } from "meteor-rxjs";
import { CampusDB } from "/imports/api/index";

import template from './stepByStepSearch.html';

@Component({
  selector: 'stepByStep-search',
  template
})

export class StepByStepSearch implements OnInit {
  meteorSubscriptionCampus;
  campuses;
  faculties;
  institutes;
  courses;
  stepOne: boolean = true;
  stepTwo: boolean = false;
  stepThree: boolean = false;
  stepFour: boolean = false;


  constructor(private searchService: SearchService,
              private badgeService: BadgeService,
              public campusService: CampusService) {

        this.meteorSubscriptionCampus = MeteorObservable.subscribe<any>("publishAllCampuses").subscribe(() => {
            this.campuses = this.campusService.getAllCampuses();
        });

      console.log(this.campuses);
  }
  ngOnInit() {

  }

  goToStepTwo() {
    this.stepOne = false;
    this.stepTwo = true;
  }
  goToStepThree() {
    this.stepTwo = false;
    this.stepThree = true;
  }
  goToStepFour() {
    this.stepThree = false;
    this.stepFour = true;
  }

}
