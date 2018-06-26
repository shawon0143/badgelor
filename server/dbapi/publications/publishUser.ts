import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';


if (Meteor.isServer) {


  Meteor.publish("publishAllUserForAdmin", function() {

    if (this.userId) {

      return Meteor.users.find();
    }
    return this.ready();

  });




} //end of if (Meteor.isServer)
