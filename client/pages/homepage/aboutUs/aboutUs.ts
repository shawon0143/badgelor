import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";


import template from './aboutUs.html';



@Component({
  selector: 'about-us',
  template
})



export class AboutUs {

  constructor() {  }

  ngOnInit() {

  }

} // end of class AboutUs
