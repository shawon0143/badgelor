import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";
import { ProfileDB } from "/imports/api/index";
import { AccountService } from '/imports/service/accountService';


@Injectable()
export class ApplicantProfileService {
  private meteorBadgeApplicationSubscription: any;
  private meteorMyProfileSubscription: any;
  earnableIDlist = [];
  allEarnableBadges = [];
  myApplications = [];
  myProfile;
  totalApplicationCount;
  myApprovedApplications = [];
  constructor(public zone: NgZone,
    public router: Router,
    public accountService: AccountService) {


    this.meteorBadgeApplicationSubscription = MeteorObservable.call('getEarnableIdList').subscribe((response) => {

      if (response != undefined || response != "") {
        for (let key in response) {
          this.allEarnableBadges.push(response[key]);
          this.earnableIDlist.push(response[key]["earnable_id"]);
        }
        if (this.earnableIDlist.length >= 1) {
          this.meteorMyProfileSubscription = MeteorObservable.subscribe<any>("myProfileDB").subscribe(() => {
            this.myProfile = this.getMyProfile();
            this.getAllBadgeApplications();
          }, (err) => {
            // TODO: error handle
            console.log(err);
          });
        }
      }
      //  else {
      //   // TODO: handle error
      // }

    });

  }



  getMyProfile() {
    return ProfileDB.findOne({ "userAccountID": this.accountService.currentUserId });
  }

  getAllBadgeApplications() {

    for (let i = 0; i < this.earnableIDlist.length; i++) {

      if (this.myProfile !== undefined) {
        MeteorObservable.call('getAllBadgeApplication', this.earnableIDlist[i], Meteor.user().emails[0].address).subscribe((response) => {
        // MeteorObservable.call('getAllBadgeApplication', this.earnableIDlist[i], "gektor@uni-koblenz.de").subscribe((response) => {
          // console.log(response);
          if (response != undefined || response != "") {
            this.getMyApplications(response);
          }
          // else {
          //   // TODO: handle error
          // }

        });
      }
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
