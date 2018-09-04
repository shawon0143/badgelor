import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';

import { FacultyDB } from '/imports/api/index.ts';

if (Meteor.isServer) {



// ===== start of publishAllFaculty ======
Meteor.publish('publishAllFaculties', function () {

  return FacultyDB.find({});

});
// --- End of publishAllFaculty ---


} //end of if (Meteor.isServer)
