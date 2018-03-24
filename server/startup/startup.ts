// startup codes for server - e.g : api init for remote services

// --- adding some seed data if the db is empty - just for bootstrapping ---
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { Mongo } from 'meteor/mongo';
import { MongoObservable } from 'meteor-rxjs';
import { AppConfig } from '/server/startup/appconfig';


Meteor.startup(function() {


}); //end Meteor.startup
