// All applicant related API call methods are in this file
// This methods are used in the following files
// 1. applicantProfile.ts
// 2.
// 3.


import {MeteorObservable} from "meteor-rxjs";
import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { MongoObservable } from 'meteor-rxjs';
import { check } from 'meteor/check';

import { AppConfig } from '/server/startup/appconfig';

const apiUrl = 'https://openbadgefactory.com/v1/badge/NM70OHe7HCeO';

if (Meteor.isServer) {

  Meteor.methods({


  }); // end Meteor.methods

} //end if (Meteor.isServer)
