import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";

import { AccountService } from '/imports/service/accountService';


@Injectable()
export class ApplicantProfileService {
  private meteorBadgeApplicationSubscription: any;
  earnableIDlist = [];
  allEarnableBadges = [];
  myApplications = [];
  myProfile;
  totalApplicationCount;
  myApprovedApplications = [];
constructor( public zone: NgZone,
             public router: Router,
             public accountService: AccountService) {

          this.getAllEarnableIdList();
          // we can implement a reload function in the front-end
          // for the user to load changes rather than reloading
          // the whole page.
          // So we can just call the getAllEarnableIdList function
}


  getAllEarnableIdList() {

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

  } // END OF getAllEarnableIdList()


  getMyProfile() {
    return Meteor.users.findOne({"_id": this.accountService.currentUserId});
  }

  getAllBadgeApplications() {

    for (let i=0; i< this.earnableIDlist.length; i++) {

      // MeteorObservable.call('getAllBadgeApplication', this.earnableIDlist[i], this.myProfile.emails[0].address).subscribe((response) => {
        MeteorObservable.call('getAllBadgeApplication', this.earnableIDlist[i], "gektor@uni-koblenz.de").subscribe((response) => {

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
    this.getMyApplicationTotal();
    this.getMyApprovedApplications();
  } // END OF setNameAndBadgeId()

  getMyApplicationTotal() {
    this.totalApplicationCount = this.myApplications.length;
  } // END OF getMyApplicationTotal()

  getMyApprovedApplications() {
    this.myApprovedApplications = [];
    for (let key in this.myApplications) {
      if (this.myApplications[key].status === 'approved') {
        this.myApprovedApplications.push(this.myApplications[key]);
      }
    }
  } // END OF getMyApprovedApplications()


}// END OF ApplicantProfileService
