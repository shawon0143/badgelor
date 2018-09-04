import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { AccountService } from '/imports/service/accountService';
import { CampusService } from '/imports/service/campusService';
import { CampusDB } from "/imports/api/index";
import { list1, fadeInAnimation } from "/imports/service/animations";

import template from './campusManagement.html';




@Component({
  selector: 'campus-management',
  template,
  animations: [list1, fadeInAnimation]
})



export class CampusManagement implements OnInit {
  private meteorSubscriptionCampus;
  allCampuses: any;


  constructor(private route: ActivatedRoute,
    private router: Router,
    public accountService: AccountService,
    public campusService: CampusService) {

    this.meteorSubscriptionCampus = MeteorObservable.subscribe<any>("publishAllCampuses").subscribe(() => {
      // Subscription is ready!
      // MeteorObservable.autorun().subscribe(() => {
      //  this.allCampuses = this.getAllCampuses();
      // });
    });
  }

  editThisCampus(campus) {
    window.scrollTo(0,0);// this line will take the window position to the top.
    this.campusService.isEditCampusEnabled = true;
    this.campusService.tempCampusNameForDuplicateCheck = campus.name;
    this.campusService.newCampusData._id = campus._id;
    this.campusService.newCampusData.name = campus.name;
    this.campusService.newCampusData.description = campus.description;
  }


  ngOnInit(): void {
    this.allCampuses = this.campusService.getAllCampuses();
    // console.log(this.allCampuses);
  }// end of ngOnInit




  ngOnDestroy() {
    if (this.meteorSubscriptionCampus) {
      this.meteorSubscriptionCampus.unsubscribe();
    }
  }



} // end of class CampusManagement
