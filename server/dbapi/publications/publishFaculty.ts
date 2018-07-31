import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';

import { FacultyDB } from '/imports/api/index.ts';

if (Meteor.isServer) {



// ===== start of publishAllFaculty ======
Meteor.publish('publishAllFaculty', function () {

  return FacultyDB.find({});

});
// --- End of publishAllFaculty ---


// ===== start of publishFacultyByCampusID ======
Meteor.publish('publishFacultyByCampusID', function(campusID) {
  return FacultyDB.find({"campusID": campusID});
});
// --- End of publishFacultyByCampusID ---


} //end of if (Meteor.isServer)
