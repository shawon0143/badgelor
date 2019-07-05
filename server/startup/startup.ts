// startup codes for server - e.g : api init for remote services

// --- adding some seed data if the db is empty - just for bootstrapping ---
import { Meteor } from "meteor/meteor";
import { AppConfig } from "/server/startup/appconfig";
import { CampusDB, FacultyDB, InstituteDB, CompetencyDB, LevelDB, ToolDB } from "../../imports/api";

Meteor.startup(function() {}); //end Meteor.startup
// ---------------------------------------------------------------------------------------------
// ------------------------ Creating admin account on startup ----------------------------------
// ---------------------------------------------------------------------------------------------

var badgelorAppConfig = new AppConfig();

// creating an admin account if none exists.

if (Meteor.users.find({ username: "admin" }).count() != 1) {
  //
  //   // creating admin user for the first time
  //
  try {
    Accounts.createUser({
      email: badgelorAppConfig.adminEmail,
      password: badgelorAppConfig.adminPassword,
      username: "admin"
    });

    // now admin account is created. so setting this user role as admin

    let adminDB = Meteor.users.findOne({ username: "admin" });

    Meteor.users.update(adminDB._id, {
      $set: {
        role: "admin",
        obfID: ""
      }
    });
  } catch (e) {
    //end try

    console.log("error : " + e);
  }
} //end if admin doesn't exist

// if there is no campus in the server
// ---------------------------------------------------------------------------------------------
// ------------------------------- create campuses on startup ----------------------------------
// ---------------------------------------------------------------------------------------------
if (CampusDB.collection.find({}).count() == 0) {
  try {
    for (let key in badgelorAppConfig.campusArray) {
      CampusDB.collection.insert({
        name: badgelorAppConfig.campusArray[key],
        description: "",
        createdBy: badgelorAppConfig.adminEmail,
        createdAt: new Date()
      }); //end insert
    } // end of for loop
  } catch (e) {
    console.log("error : " + e);
  }
}

// -------------------------------------------------------------------------------------------------------------
// ------------------------------- create Faculties and institutes on startup ----------------------------------
// -------------------------------------------------------------------------------------------------------------

// now we load the faculties for campuses [Koblenz, Landau]
let koblenzCampusDB = CampusDB.collection.findOne({ name: "koblenz" });
// console.log(koblenzCampusDB["_id"]);
let landauCampusDB = CampusDB.collection.findOne({ name: "landau" });
// console.log(landauCampusDB["_id"]);

if (FacultyDB.collection.find({}).count() == 0) {
  try {
    // =============================================
    // first enter koblenz faculties and institutes
    // =============================================
    for (let key in badgelorAppConfig.koblenzFaculties) {
      FacultyDB.collection.insert({
        name: badgelorAppConfig.koblenzFaculties[key]["name"],
        description: "",
        campusID: koblenzCampusDB["_id"],
        createdBy: badgelorAppConfig.adminEmail,
        createdAt: new Date()
      }); //end insert
      let thisFaculty = FacultyDB.collection.findOne({
        name: badgelorAppConfig.koblenzFaculties[key]["name"]
      });
      if (badgelorAppConfig.koblenzFaculties[key].institutes.length > 0) {
        for (let i in badgelorAppConfig.koblenzFaculties[key].institutes) {
          InstituteDB.collection.insert({
            name: badgelorAppConfig.koblenzFaculties[key].institutes[i],
            description: "",
            campusID: koblenzCampusDB["_id"],
            facultyID: thisFaculty["_id"],
            createdBy: badgelorAppConfig.adminEmail,
            createdAt: new Date()
          });
        }
      }
    }
    // =============================================
    // Then landau faculties and institutes ========
    // =============================================
    for (let key in badgelorAppConfig.landauFaculties) {
      FacultyDB.collection.insert({
        name: badgelorAppConfig.landauFaculties[key]["name"],
        description: "",
        campusID: landauCampusDB["_id"],
        createdBy: badgelorAppConfig.adminEmail,
        createdAt: new Date()
      }); //end insert
      let thisFaculty = FacultyDB.collection.findOne({
        name: badgelorAppConfig.landauFaculties[key]["name"]
      });
      if (badgelorAppConfig.landauFaculties[key].institutes.length > 0) {
        for (let i in badgelorAppConfig.landauFaculties[key].institutes) {
          InstituteDB.collection.insert({
            name: badgelorAppConfig.landauFaculties[key].institutes[i],
            description: "",
            campusID: landauCampusDB["_id"],
            facultyID: thisFaculty["_id"],
            createdBy: badgelorAppConfig.adminEmail,
            createdAt: new Date()
          });
        }
      }
    }
  } catch (e) {
    console.log("error :" + e);
  }
}

if (LevelDB.collection.find({}).count() == 0) {
    try {
        for (let key in badgelorAppConfig.levels) {
            LevelDB.collection.insert({
                name: badgelorAppConfig.levels[key],
                description: '',
                createdBy: badgelorAppConfig.adminEmail,
                createdAt: new Date()
            });
        }
    } catch (e) {
        console.log("error :" + e);
    }
}

if (CompetencyDB.collection.find({}).count() == 0) {
    try {
        for (let key in badgelorAppConfig.competencies) {
            CompetencyDB.collection.insert({
                name: badgelorAppConfig.competencies[key],
                description: '',
                createdBy: badgelorAppConfig.adminEmail,
                createdAt: new Date()
            });
        }
    } catch (e) {
        console.log("error :" + e);
    }
}

if (ToolDB.collection.find({}).count() == 0) {
    try {
        for (let key in badgelorAppConfig.tools) {
            ToolDB.collection.insert({
                name: badgelorAppConfig.tools[key],
                description: '',
                createdBy: badgelorAppConfig.adminEmail,
                createdAt: new Date()
            });
        }
    } catch (e) {
        console.log("error :" + e);
    }
}

// TODO : reset password and email from the settings file on each startup - so that admin password is
// always up to date as per the latest settings.json file.

// --------------------------------------------
// ----- END of database seed on startup ------
// --------------------------------------------
