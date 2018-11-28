// startup codes for server - e.g : api init for remote services

// --- adding some seed data if the db is empty - just for bootstrapping ---
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { Mongo } from 'meteor/mongo';
import { MongoObservable } from 'meteor-rxjs';
import { AppConfig } from '/server/startup/appconfig';


Meteor.startup(function() {


}); //end Meteor.startup



// ------------------------ Creating admin account on startup ----------------------------------

var badgelorAppConfig = new AppConfig();

// creating an admin account if none exists.

if (Meteor.users.find({ "username": "admin" }).count() != 1) {

  // creating admin user for the first time

  try {

    Accounts.createUser({
      email: badgelorAppConfig.adminEmail,
      password: badgelorAppConfig.adminPassword,

    });

    // now admin account is created. so setting this user role as admin

    var adminDB = Meteor.users.findOne({ "username": "admin" });

    Meteor.users.update(
      adminDB._id,
      {
        $set: {
          "role": "admin",
          "obfID": ""
        }
      }
    )

  } //end try

  catch (e) {

    console.log("error : " + e);

  }

} //end if admin doesn't exist

// TODO : reset password and email from the settings file on each startup - so that admin password is
// always up to date as per the latest settings.json file.

// ----- END of Creating admin account on startup ------
