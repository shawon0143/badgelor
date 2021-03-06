import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { AccountService } from '/imports/service/accountService';
import { BadgeService } from '/imports/service/badgeService';

import { flyFromTop, fadeInAnimation } from '/imports/service/animations';

import template from './applyBadgeModal.html';




@Component({
  selector: 'applyBadge-modal',
  template,
  animations: [ flyFromTop, fadeInAnimation ]

})


export class ApplyBadgeModal implements OnInit {
  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService,
               private badgeService: BadgeService) {

  }


  ngOnInit() {


  } // end of ngOnInit




} // end of class ApplyBadgeModal
