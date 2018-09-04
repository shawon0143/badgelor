import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';

import { InstituteDB } from '/imports/api/index.ts';

if (Meteor.isServer) {



// ===== start of publishAllInstitute ======
Meteor.publish('publishAllInstitutes', function () {

  return InstituteDB.find({});

});
// --- End of publishAllInstitute ---



} //end of if (Meteor.isServer)
