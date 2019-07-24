import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';
import { AccountService } from '/imports/service/accountService';
import { BadgeService } from '/imports/service/badgeService';
import { MetadataDB } from "/imports/api/index";

import template from './statistics.html';

@Component({
  selector: 'dashboard-statistics',
  template

})



export class DashboardStatistics implements OnInit, OnDestroy {
  private meteorSubscriptionAllUser: any;
  private meteorSubscriptionAllBadges: any;
  totalUsers;
  totalBadges;
  totalMissingMetadata;
  allBadges = [];
  allImportBadges = [];
  totalImportBadgesCount;

  constructor(public accountService: AccountService,
              public router: Router,
              private badgeService: BadgeService) {

    this.meteorSubscriptionAllUser = MeteorObservable.subscribe<any>("publishAllUserForAdminStatistics").subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
       this.totalUsers = this.getNumberOfUsers();
      });
    });

    this.meteorSubscriptionAllBadges = MeteorObservable.subscribe<any>("publishAllMetadata").subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
       this.totalBadgesCount();
      });
    });


    // getting all badges from OBF data base.
    MeteorObservable.call('getEarnableBadges').subscribe((response) => {
      if (response != undefined || response != "") {
        // console.log(response);
        for (let key in response) {
          this.allBadges.push(response[key]);
        }
        this.totalImportBadgesCount = this.getNumberOfBadgesToImport();

      } else {
        // handle error
      }
    }, (err) => {
      // TODO: handle error
      console.log(err);
    });


    MeteorObservable.call('missingMetadataCount').subscribe((response) => {
      this.totalMissingMetadata = response;
    }, (err) => {
      console.log(err);
    });



  }

  ngOnInit() {

  } // end of ngOnInit

  getNumberOfUsers() {
    return Meteor.users.find().count();
  }

  totalBadgesCount() {
    MeteorObservable.call('getNumberOfBadges').subscribe((response) => {
      this.totalBadges = response;
      // console.log(response);
    }, (err) => {
      console.log(err);
    })
  }



  getNumberOfBadgesToImport() {
    var localBadgeIdList = MetadataDB.find().fetch().map(function(it) { return it.badge_id});

    if (localBadgeIdList !== undefined && this.allBadges.length > 0) {
      // filtering the badges that are not in badgelor db
      var filteredBadges = this.allBadges.filter((res) => {
        return localBadgeIdList.indexOf(res.badge_id) === -1;
      } );
    }
    return filteredBadges.length;
  }

  ngOnDestroy() {
    if (this.meteorSubscriptionAllUser) {
      this.meteorSubscriptionAllUser.unsubscribe();
    }

    if (this.meteorSubscriptionAllBadges) {
      this.meteorSubscriptionAllBadges.unsubscribe();
    }
  }





} // end of class DashboardStatistics
