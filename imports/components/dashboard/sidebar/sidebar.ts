import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';
import { AccountService } from '/imports/service/accountService';
import { BadgeService } from '/imports/service/badgeService';
import { TranslatorService } from '/imports/service/translatorService';

import template from './sidebar.html';

@Component({
  selector: 'dashboard-sidebar',
  template

})



export class DashboardSidebar implements OnInit {

  constructor(public accountService: AccountService,
              public badgeService: BadgeService,
              public translatorService: TranslatorService) {


  }

  ngOnInit() {


  } // end of ngOnInit

  hideBadgeEditForm() {
    this.badgeService.showBadgeEditForm = false;
  }



} // end of class DashboardSidebar
