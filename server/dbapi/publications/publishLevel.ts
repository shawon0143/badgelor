import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';

import { LevelDB } from '/imports/api/index.ts';

if (Meteor.isServer) {



// ===== start of publishAllCategories ======
Meteor.publish('publishAllLevels', function () {

  return LevelDB.find({});

});
// --- End of publishAllCategories ---



} //end of if (Meteor.isServer)
