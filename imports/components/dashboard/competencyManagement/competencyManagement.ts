import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { AccountService } from '/imports/service/accountService';
import { CompetencyService } from '/imports/service/competencyService';
import { CompetencyDB } from "/imports/api/index";
import { list1, fadeInAnimation } from "/imports/service/animations";

import template from './competencyManagement.html';




@Component({
  selector: 'competency-management',
  template,
  animations: [list1, fadeInAnimation]
})



export class CompetencyManagement implements OnInit {
  private meteorSubscriptionCompetency;
  allCompetencies: any;


  constructor(private route: ActivatedRoute,
              private router: Router,
              public accountService: AccountService,
              public competencyService: CompetencyService) {

    this.meteorSubscriptionCompetency = MeteorObservable.subscribe<any>("publishAllCompetencies").subscribe(() => {
      // Subscription is ready!
      // MeteorObservable.autorun().subscribe(() => {
      //  this.allCampuses = this.getAllCampuses();
      // });
    });
  }

  editThisCompetency(competency) {
    window.scrollTo(0,0);// this line will take the window position to the top.
    this.competencyService.isEditCompetencyEnabled = true;
    this.competencyService.tempCompetencyNameForDuplicateCheck = competency.name;
    this.competencyService.newCompetencyData._id = competency._id;
    this.competencyService.newCompetencyData.name = competency.name;
    this.competencyService.newCompetencyData.description = competency.description;
  }


  ngOnInit(): void {
    this.allCompetencies = this.competencyService.getAllCompetencies();
    // console.log(this.allCampuses);
  }// end of ngOnInit




  ngOnDestroy() {
    if (this.meteorSubscriptionCompetency) {
      this.meteorSubscriptionCompetency.unsubscribe();
    }
  }



} // end of class CampusManagement
