import { Component, OnInit } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { TranslatorService } from '/imports/service/translatorService';

import template from './homepageBannerTop.html';

@Component({
  selector: 'homepage-banner',
  template
})


export class HomepageBannerTop {

  constructor( public translatorService: TranslatorService ) {

  }

  ngOnInit() {

  }

}
