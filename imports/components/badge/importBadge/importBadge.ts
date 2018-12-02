import { Component, OnInit, OnDestroy } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { MetadataDB } from "/imports/api/index";
import { AccountService } from '/imports/service/accountService';
import { BadgeService } from '/imports/service/badgeService';

import { flyFromTop, fadeInAnimation } from '/imports/service/animations';

import template from './importBadge.html';




@Component({
  selector: 'import-badge',
  template,
  animations: [ flyFromTop, fadeInAnimation ]
})


export class ImportBadge implements OnInit, OnDestroy {
  private metadataSubscription: any;
  private meteorSubscriptionAllUser: any;
  allBadges = [];
  allImportBadges = [];
  isDataLoading: boolean = true; // for loading animation

  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService,
               private badgeService: BadgeService) {

               // getting all badges from OBF data base.
               MeteorObservable.call('getAllBadges').subscribe((response) => {
                 if (response != undefined || response != "") {
                   // console.log(response);
                   for (let key in response) {
                     this.allBadges.push(response[key]);
                   }
                   this.metadataSubscription = MeteorObservable.subscribe<any>("publishAllMetadata").subscribe(() => {
                     // Subscription is ready!
                     MeteorObservable.autorun().subscribe(() => {
                       this.isDataLoading = false;
                       this.allImportBadges = this.getImportBadgeList();
                       // console.log(this.allImportBadges);
                     });
                   });

                   this.meteorSubscriptionAllUser = MeteorObservable.subscribe<any>("publishAllUserForAdmin").subscribe(() => {

                   });
                 } else {
                   this.isDataLoading = false;
                   // console.log(this.allImportBadges);
                 }
               }, (err) => {
                 // TODO: handle error
                 console.log(err);
               });



  } // END of constructor


  ngOnInit() {

  } // end of ngOnInit

  getImportBadgeList() {
    var localBadgeIdList = MetadataDB.find().fetch().map(function(it) { return it.badge_id});

    if (localBadgeIdList !== undefined && this.allBadges.length > 0) {
      // filtering the badges that are not in badgelor db
      var filteredBadges = this.allBadges.filter((res) => {
        return localBadgeIdList.indexOf(res.id) === -1;
      } );
    }
    return filteredBadges;
  }

  importThisBadge(badge_id) {

    // step 1: call getsinglebadge
    // step 2: check lastmodifiedby in the user database obfID
    // if found assign the email address as creator email address
    // if not-found open the iframe with the creator details and ask user to enter the email address in the input field.
    // click on save.
    // upon successful import of the badge NOTIFY the creator

    MeteorObservable.call('getSingleBadge', badge_id).subscribe((response) => {
      if (response != undefined || response != "") {
        // console.log(response);

        var userDB = Meteor.users.findOne({"obfID": response["lastmodifiedby"]});
        if (userDB !== undefined) {
          // user obfID already saved in the database so import the badge
          var creatorEmail = userDB.emails[0].address;
          this.badgeService.importBadge(creatorEmail, badge_id);
          window.scrollTo(0,0);// jump the window position to the top.

        } else {
          // creating the OBF creator profile  URL
          this.badgeService.selectedBadgeCreatorObfProfileURL = "https://openbadgefactory.com/c/user/"+response["lastmodifiedby"]+"/edit";
          this.badgeService.newObfBadgeCreatorObfID = response["lastmodifiedby"];
          // slide in the side menu for user to update creator email
          this.badgeService.showSideMenuOnUI();

        }
        // ============= END oF map creator badge iframe =====================

      }
    }, (err) => {
      console.log(err);
    });


  }



  ngOnDestroy() {
    if (this.metadataSubscription) {
      this.metadataSubscription.unsubscribe();
    }
    if (this.meteorSubscriptionAllUser) {
      this.meteorSubscriptionAllUser.unsubscribe();
    }


  }



} // end of class importBadge
