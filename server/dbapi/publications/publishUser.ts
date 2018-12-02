import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';
import { AppConfig } from '../../startup/appconfig';

var badgelorAppConfig = new AppConfig();
const systemAdminEmail = badgelorAppConfig.adminEmail;

if (Meteor.isServer) {




  Meteor.publish("publishAllUserForAdmin", function() {

    if (this.userId) {

      return Meteor.users.find();
    }
    return this.ready();

  });

  Meteor.publish("publishAllUserForAdminStatistics", function() {

    if (this.userId) {


      return Meteor.users.find({"emails.address":{$ne:systemAdminEmail}});
    }
    return this.ready();

  });




} //end of if (Meteor.isServer)
