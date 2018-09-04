import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';

import { CompetencyDB } from '/imports/api/index.ts';

if (Meteor.isServer) {



// ===== start of publishAllCategories ======
Meteor.publish('publishAllCompetencies', function () {

  return CompetencyDB.find({});

});
// --- End of publishAllCategories ---



} //end of if (Meteor.isServer)
