// this module can be imported to any other server side module
// to use config data such as (api url, token etc).
// for production server, all the secrect values will be imported from settings.json file (production version) during deployment process.
import {Meteor} from 'meteor/meteor';

export class AppConfig {
    adminPassword : string;
    adminEmail : string;

    constructor() {
      this.adminPassword = Meteor["settings"]["private"]["adminlogin"];
      this.adminEmail = Meteor["settings"]["private"]["adminEmail"];

    }


} // end of class
