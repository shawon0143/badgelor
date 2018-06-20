import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { TranslatorService } from '/imports/service/translatorService';


import template from './contactUs.html';



@Component({
  selector: 'contact-us',
  template
})



export class ContactUs {

  constructor(public translatorService: TranslatorService) {  }

  ngOnInit() {

  }

} // end of class ContactUs
