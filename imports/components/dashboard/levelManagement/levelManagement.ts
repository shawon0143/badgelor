import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { AccountService } from '/imports/service/accountService';
import { LevelService } from '/imports/service/levelService';
import { LevelDB } from "/imports/api/index";
import { list1, fadeInAnimation } from "/imports/service/animations";

import template from './levelManagement.html';




@Component({
  selector: 'level-management',
  template,
  animations: [list1, fadeInAnimation]
})



export class LevelManagement implements OnInit {
  private meteorSubscriptionLevel;
  allLevels: any;


  constructor(private route: ActivatedRoute,
              private router: Router,
              public accountService: AccountService,
              public levelService: LevelService) {

    this.meteorSubscriptionLevel = MeteorObservable.subscribe<any>("publishAllLevels").subscribe(() => {
      // Subscription is ready!
      // MeteorObservable.autorun().subscribe(() => {
      //  this.allCampuses = this.getAllCampuses();
      // });
    });
  }

  editThisLevel(level) {
    window.scrollTo(0,0);// this line will take the window position to the top.
    this.levelService.isEditLevelEnabled = true;
    this.levelService.tempLevelNameForDuplicateCheck = level.name;
    this.levelService.newLevelData._id = level._id;
    this.levelService.newLevelData.name = level.name;
    this.levelService.newLevelData.description = level.description;
  }


  ngOnInit(): void {
    this.allLevels = this.levelService.getAllLevels();
    // console.log(this.allCampuses);
  }// end of ngOnInit




  ngOnDestroy() {
    if (this.meteorSubscriptionLevel) {
      this.meteorSubscriptionLevel.unsubscribe();
    }
  }



} // end of class CampusManagement
