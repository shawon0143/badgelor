import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";


@Injectable()
export class BadgeService {
private meteorEarnableBadgeSubscription: any;
private meteorSingleBadgeSubscription: any;

earnableBadges = [];

// variable to show and hide single badge modal
showSingleBadgeModalOnUI: boolean = false;

// variable to show and hide apply badge iframe modal
showApplyBadgeModalOnUI: boolean = false;
applyBadgeUrl: string = "";
singleBadgeDataLoading: boolean = true;

// flag for data loading ANIMATION
dataIsLoading : boolean = true;


// singleBadge = {
//   name: "",
//   description: "",
//   criteria: "",
//   image: "",
//   creator: "",
//   institution: "",
//   level: "",
//   competency: "",
//   tool: "",
//   keywords: []
// }

// the variable holds singleBadge data
singleBadge;

constructor( public zone: NgZone,
             public router: Router) {

   this.meteorEarnableBadgeSubscription = MeteorObservable.call('getEarnableBadges').subscribe((response) => {

     if (response != undefined || response != "") {
       this.dataIsLoading = false;
       for (let key in response) {
         // ************************************************************************
         // This if condition is used because of a glich in OBF database
         // because even though we deleted these two badges (badge_id = OUYELOaET7a2K and NP24NAo4RCoW)
         // the badgename still shows up when we get all earnableBadges
         // so I did this hack to skip that badge from showing in the badge library
         // We can skip this block of code if we can fix the problem with that OBF
         // database glitch. Then we will skip the if condition
         // ************************************************************************
         if(response[key].badge_id !== "OUYELOaET7a2K" && response[key].badge_id !== "NP24NAo4RCoW") {
           this.earnableBadges.push(response[key]);
         }
       }
     }
     //  else {
     //   // TODO: handle error
     // }

     });

} // END of constructor

showSingleBadgeModal(badge_id) {
  this.singleBadge = "";
  this.showSingleBadgeModalOnUI = true;
  this.singleBadgeDataLoading = true;
  document.body.classList.add('hideBodyScroll');
  document.body.classList.remove('showBodyScroll');

  this.meteorSingleBadgeSubscription = MeteorObservable.call('getSingleBadge', badge_id).subscribe((response) => {
    if (response != undefined || response != "") {
      this.singleBadgeDataLoading = false;
      // console.log(response);
      // ======================
      // Individual data assign
      // ======================
      // this.singleBadge.name = response["name"];
      // this.singleBadge.description = response["description"];
      // this.singleBadge.criteria = response["criteria_html"];
      // this.singleBadge.keywords = response["metadata"]["keywords"];
      // this.singleBadge.creator = response["metadata"]["creator"];
      // this.singleBadge.institution = response["metadata"]["institution"];
      // this.singleBadge.level = response["metadata"]["level"];
      // this.singleBadge.competency = response["metadata"]["competency"];
      // this.singleBadge.tool = response["metadata"]["tool"];

      // =======================
      // Assign the object =====
      // =======================
      this.singleBadge = response;



    }
  });
} // END of showSingleBadgeModal

hideSingleBadgeModalOnUI() {
  this.showSingleBadgeModalOnUI = false;
  document.body.classList.remove('hideBodyScoll');
  document.body.classList.add('showBodyScroll');
}

showApplyBadgeModal(badge_id) {
  this.showApplyBadgeModalOnUI = true;
  this.applyBadgeUrl = "https://openbadgefactory.com/c/earnablebadge/"+badge_id+"/apply";
  document.body.classList.add('hideBodyScroll');
  document.body.classList.remove('showBodyScroll');
}

hideApplyBadgeModalOnUI() {
  this.showApplyBadgeModalOnUI = false;
  document.body.classList.remove('hideBodyScoll');
  document.body.classList.add('showBodyScroll');
}




}// END OF BadgeService
