// this module can be imported to any other server side module
// to use config data such as (api url, token etc).
// for production server, all the secrect values will be imported from settings.json file (production version) during deployment process.
import {Meteor} from 'meteor/meteor';

export class AppConfig {
    adminPassword : string;
    adminEmail : string;
    obfCertificate : string;
    obfKey : string;
    campusArray;
    koblenzFaculties;
    landauFaculties;
    levels;
    competencies;
    tools;

    constructor() {
      this.adminPassword = Meteor["settings"]["private"]["adminLogin"];
      this.adminEmail = Meteor["settings"]["private"]["adminEmail"];
      this.obfCertificate = Meteor["settings"]["private"]["obfCertificate"].join('\n');
      this.obfKey = Meteor["settings"]["private"]["obfKey"].join('\n');
      this.campusArray = Meteor["settings"]["private"]["campuses"];
      this.koblenzFaculties = Meteor["settings"]["private"]["koblenzFaculties"];
      this.landauFaculties = Meteor["settings"]["private"]["landauFaculties"];
      this.levels = Meteor["settings"]["private"]["levels"];
      this.competencies = Meteor["settings"]["private"]["competencies"];
      this.tools = Meteor["settings"]["private"]["tools"];
    }


} // end of class
