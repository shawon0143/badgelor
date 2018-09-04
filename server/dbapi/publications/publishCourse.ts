import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';

import { CourseDB } from '/imports/api/index.ts';

if (Meteor.isServer) {



// ===== start of publishAllInstitute ======
Meteor.publish('publishAllCourses', function () {

  return CourseDB.find({});

});
// --- End of publishAllInstitute ---



} //end of if (Meteor.isServer)
