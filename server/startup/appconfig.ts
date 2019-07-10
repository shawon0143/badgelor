// this module can be imported to any other server side module
// to use config data such as (api url, token etc).
// for production server, all the secret values will be imported from settings.json file (production version) during deployment process.
import {Meteor} from 'meteor/meteor';
import * as data from '../../seedData.json';

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
      this.campusArray = data.campuses;
      this.koblenzFaculties = data.koblenzFaculties;
      this.landauFaculties = data.landauFaculties;
      this.levels = data.levels;
      this.competencies = data.competencies;
      this.tools = data.tools;
    }


} // end of class
