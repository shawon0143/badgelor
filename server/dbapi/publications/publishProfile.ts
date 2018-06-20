import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Checkdbaccess } from '/server/dbapi/tools/checkdbaccess.ts';

import { ProfileDB } from '/imports/api/index.ts';

if (Meteor.isServer) {



  // ===== start of myProfileDB ======
  Meteor.publish("myProfileDB", function() {
    // publishing ProfileDB for a single requesting user
    if (this.userId) {
      return ProfileDB.find({ "userAccountID": this.userId });
    }

    return this.ready();

  });

  // --- End of myProfileDB ---



} //end of if (Meteor.isServer)
