import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';

import { ToolDB } from '/imports/api/index.ts';

if (Meteor.isServer) {



// ===== start of publishAllTools ======
Meteor.publish('publishAllTools', function () {

  return ToolDB.find({});

});
// --- End of publishAllTools ---



} //end of if (Meteor.isServer)
