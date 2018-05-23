import 'zone.js';
import 'reflect-metadata';
import {Component} from '@angular/core';
import {Meteor} from 'meteor/meteor';
import { AccountService } from '/imports/service/accountService';
import { BadgeService } from "/imports/service/badgeService";

import template from '/client/app/app.html';


@Component({
    selector: 'app-root',
    template

})
export class AppComponent {

    constructor(public accountService: AccountService, public badgeService: BadgeService) {

    }

    ngOnInit() {

    } // end of ngOnInit
}
