import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { AccountService } from '/imports/service/accountService';



import template from './earnedBadges.html';



@Component({
  selector: 'earned-badges',
  template
})



export class EarnedBadges implements OnInit {

  constructor( private route: ActivatedRoute,
               private router: Router,
               public accountService: AccountService) {

  }

  ngOnInit() {

  }



} // end of class EarnedBadges
