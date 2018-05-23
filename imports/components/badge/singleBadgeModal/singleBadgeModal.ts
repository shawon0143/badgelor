import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { AccountService } from '/imports/service/accountService';
import { BadgeService } from '/imports/service/badgeService';

import { trigger,state,style,transition,animate,keyframes, query } from '@angular/animations';
import { flyFromTop, fadeInAnimation } from '/imports/service/animations';

import template from './singleBadgeModal.html';




@Component({
  selector: 'singleBadge-modal',
  template,
  animations: [ flyFromTop, fadeInAnimation ]
})


export class SingleBadgeModal implements OnInit {

  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService,
               private badgeService: BadgeService) {

  }


  ngOnInit() {


  } // end of ngOnInit



} // end of class SingleBadgeModal
