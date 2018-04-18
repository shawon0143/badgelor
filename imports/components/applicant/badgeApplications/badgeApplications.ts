import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { AccountService } from '/imports/service/accountService';



import template from './badgeApplications.html';



@Component({
  selector: 'badge-applications',
  template
})



export class BadgeApplications implements OnInit {
  private meteorBadgeApplicationSubscription: any;
  earnableIDlist = [];
  allEarnableBadges = [];
  myApplications = [];
  myProfile;
  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService) {

      this.meteorBadgeApplicationSubscription = MeteorObservable.call('getEarnableIdList').subscribe((response) => {

          if (response != undefined || response != "") {
            for (let key in response) {
              this.allEarnableBadges.push(response[key]);
              this.earnableIDlist.push(response[key]["earnable_id"]);
            }
              this.myProfile = this.getMyProfile();
              this.getAllBadgeApplications();
          }
          //  else {
          //   // TODO: handle error
          // }

        });

  } // END OF constructor

  ngOnInit() {

  } // END OF ngOnInit()

  getMyProfile() {
    return Meteor.users.findOne({"_id": this.accountService.currentUserId});
  }

  getAllBadgeApplications() {

    for (let i=0; i< this.earnableIDlist.length; i++) {

      MeteorObservable.call('getAllBadgeApplication', this.earnableIDlist[i], this.myProfile.emails[0].address).subscribe((response) => {

        if (response != undefined || response != "") {
          this.getMyApplications(response);
        }
        // else {
        //   // TODO: handle error
        // }

      });

    }

  } // END OF getAllBadgeApplications()

  getMyApplications(res) {

    if (res.length >= 1) {
      for (let key in res) {
        this.myApplications.push(res[key]);
      }

      this.setNameAndBadgeId();
    }
  } // END OF getMyApplications(res)

  setNameAndBadgeId() {
    for (let key in this.myApplications) {
      for (let i in this.allEarnableBadges) {
        if (this.allEarnableBadges[i].earnable_id === this.myApplications[key].earnable_id) {
          this.myApplications[key]["badge_id"] = this.allEarnableBadges[i].badge_id;
          this.myApplications[key]["name"] = this.allEarnableBadges[i].name;
        }
      }
    }
  } // END OF setNameAndBadgeId()




} // end of class BadgeApplications
