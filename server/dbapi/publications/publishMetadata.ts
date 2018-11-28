import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';

import { MetadataDB } from '/imports/api/index.ts';

if (Meteor.isServer) {



// ===== start of publishAllMetadata ======
Meteor.publish('publishAllMetadata', function () {

  return MetadataDB.find({});

});
// --- End of publishAllMetadata ---



} //end of if (Meteor.isServer)
