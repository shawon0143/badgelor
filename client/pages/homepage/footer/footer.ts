import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";


import template from './footer.html';



@Component({
  selector: 'app-footer',
  template
})



export class Footer {

  constructor() {  }

  ngOnInit() {

  }

} // end of class Footer
