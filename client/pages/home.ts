import 'zone.js';
import 'reflect-metadata';

import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";

import template from '/client/pages/home.html';

@Component({
  selector: 'home-page',
  template
})



export class HomePage implements OnInit {


  constructor() {
    //this.senderId = Meteor.userId();
  }

  ngOnInit() {

  } // end of ngOnInit


} // end of class homePage
