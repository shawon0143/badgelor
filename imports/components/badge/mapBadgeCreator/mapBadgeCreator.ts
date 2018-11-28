import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { AccountService } from '/imports/service/accountService';
import { BadgeService } from '/imports/service/badgeService';

import { cartShowAnimation } from '/imports/service/animations';

import template from './mapBadgeCreator.html';

@Component({
  selector: 'mapBadge-creator',
  template,
  animations: [ cartShowAnimation ]
})


  export class MapBadgeCreator implements OnInit {
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

    constructor(
                 public accountService: AccountService,
                 private badgeService: BadgeService) {

    }

    ngOnInit() {

    } // end of ngOnInit




} // end of class MapBadgeCreator
