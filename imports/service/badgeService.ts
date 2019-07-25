import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";
import { CourseDB, LevelDB, CompetencyDB, ToolDB, MetadataDB } from "/imports/api/index";


@Injectable()
export class BadgeService {

private meteorSingleBadgeSubscription: any;

// variable to show and hide single badge modal
showSingleBadgeModalOnUI: boolean = false;

// variable to show and hide apply badge iframe modal
showApplyBadgeModalOnUI: boolean = false;
applyBadgeUrl: string = "";
singleBadgeDataLoading: boolean = true;

// flag for data loading ANIMATION
dataIsLoading : boolean = true;

// ==========================================
// START OF badge creation related variables
// ==========================================




isNewBadgeCreatedSuccessful: boolean = false;
isEditBadgeSuccessful: boolean = false;

courseOptions: any = [];
courseToSearch: string = "";
allCourses: any =[];
selectedCourses: any=[];
selectedCourseNames: any=[];
courseMetaMissingErrorMsg: string = '';

issuerOptions: any = [];
issuerToSearch: string = "";
allUsers: any =[];
selectedIssuers: any=[];

selectThisKeyword: string = "";
selectedKeywords: any=[];

allLevels: any = [];
isLevelSelectedForNewBadge: boolean = false;
levelMetaMissingErrorMsg: string = "";


allCompetencies: any = [];
isCompetencySelectedForNewBadge: boolean = false;
competencyMetaMissingErrorMsg: string = "";

toolOptions: any = [];
toolToSearch: string = "";
allTools: any = [];
selectedTools: any = [];
selectedToolNames: any = [];
toolMetaMissingErrorMsg: string = '';

// the variables below assign empty array
applicantsOfThisBadge: any = [];
earnersOfThisBadge: any = [];

// variable for badge import
newBadgeImportSuccessMsg: string = "";
newObfBadgeCreatorEmail: string = "";
newObfBadgeCreatorObfID: string = "";
userObfIdUpdateSubmitMsg: string = "";

// variable for badge metadata update
listOfUpdateMetadataBadges: any = [];
isAnyBadgeMetaMissing: boolean = false;

// variable for badge edit form / metadata edit form
showBadgeEditForm: boolean = false;
selectedBadgeIdForEdit: string = "";

//variables for view all badge component
listOfAllBadges: any = [];
isTheSystemHasBadges: boolean = true;

metadata = {
  courses: [],
  issuers: [],
  keywords: [],
  levelID: '',
  competencyID: '',
  tools: [],
  creator: '',
  applicants: [],
  earners: []
};
metadataReset;
newBadgeData = {
  name: "",
  description: "",
  image: "",
  criteria_html: "",
  draft: false,
  metadata: this.metadata
};
newBadgeDataReset;

newBadgeCreationSuccessMsg: string = "";
newBadgeCreationLoading: boolean = false;
// ========================================
// END OF badge creation related variables
// ========================================

// singleBadge = {
//   name: "",
//   description: "",
//   criteria: "",
//   image: "",
//   creator: "",
//   institution: "",
//   level: "",
//   competency: "",
//   tool: "",
//   keywords: []
// }

// the variable holds singleBadge data
singleBadge;


// variable to hold mapcreator component animation state
creatorSideMenuAnimationState: string = "hide";
showSideMenu: boolean = false;
selectedBadgeCreatorObfProfileURL: string = "";

// search badge related variables
enableTextBasedSearch: boolean = true;
enableStepByStepSearch: boolean = false;

constructor( public zone: NgZone,
             public router: Router) {

     // Saving the initial state of these two objects for reset purpose
     this.metadataReset = JSON.parse(JSON.stringify(this.metadata));
     this.newBadgeDataReset = JSON.parse(JSON.stringify(this.newBadgeData));


} // END of constructor

getAllCourses() {
  return CourseDB.find({}).fetch();
} // END OF getAllCourses --------

getAllUsers() {
  return Meteor.users.find({}).fetch();
} // END OF getAllUsers() -------------

getAllLevels() {
  return LevelDB.find({}).fetch();
} // END OF getAllLevels() -------------

getAllCompetencies() {
  return CompetencyDB.find({}).fetch();
} // END OF getAllCompetencies() -------------

getAllTools() {
  return ToolDB.find({}).fetch();
} // END OF getAllTools()  -------------

showStepByStepSearch() {
  this.enableTextBasedSearch = false;
}

hideStepByStepSearch() {
  this.enableTextBasedSearch = true;
}

showSingleBadgeModal(badge_id) {
  this.singleBadge = "";
  this.showSingleBadgeModalOnUI = true;
  this.singleBadgeDataLoading = true;
  document.body.classList.add('hideBodyScroll');
  document.body.classList.remove('showBodyScroll');

  this.meteorSingleBadgeSubscription = MeteorObservable.call('getSingleBadge', badge_id).subscribe((response) => {
    if (response != undefined || response != "") {
      this.singleBadgeDataLoading = false;
      // console.log(response);
      // ======================
      // Individual data assign
      // ======================
      // this.singleBadge.name = response["name"];
      // this.singleBadge.description = response["description"];
      // this.singleBadge.criteria = response["criteria_html"];
      // this.singleBadge.keywords = response["metadata"]["keywords"];
      // this.singleBadge.creator = response["metadata"]["creator"];
      // this.singleBadge.institution = response["metadata"]["institution"];
      // this.singleBadge.level = response["metadata"]["level"];
      // this.singleBadge.competency = response["metadata"]["competency"];
      // this.singleBadge.tool = response["metadata"]["tool"];

      // =======================
      // Assign the object =====
      // =======================
      this.singleBadge = response;



    }
  });
} // END of showSingleBadgeModal

hideSingleBadgeModalOnUI() {
  this.showSingleBadgeModalOnUI = false;
  document.body.classList.remove('hideBodyScoll');
  document.body.classList.add('showBodyScroll');
}

showApplyBadgeModal(badge_id) {
  this.showApplyBadgeModalOnUI = true;
  this.applyBadgeUrl = "https://openbadgefactory.com/c/earnablebadge/"+badge_id+"/apply";
  document.body.classList.add('hideBodyScroll');
  document.body.classList.remove('showBodyScroll');
}

hideApplyBadgeModalOnUI() {
  this.showApplyBadgeModalOnUI = false;
  document.body.classList.remove('hideBodyScoll');
  document.body.classList.add('showBodyScroll');
}


// ========================================
// ===== badge create related methods =====
// ========================================

toggleDraft() {
  this.newBadgeData.draft = !this.newBadgeData.draft;
}

// ======= methods for tool field ======
findTool(toolName) {

  this.toolOptions = [];
    if (toolName) {
      let searchedWord = toolName;
      for(let key in this.allTools) {
        let r = this.allTools[key].name.search(new RegExp(searchedWord, "i"));
        if (r != -1) {
          this.toolOptions.push(this.allTools[key]);
        }
      }
    } else {
      this.toolOptions = []
    }
}

addToolToMetadata(tool) {

  this.toolToSearch = '';
  this.toolOptions = [];
  var toolFoundInArray  = false;

  for (let key in this.selectedTools) {
    if (this.selectedTools[key] === tool._id) {
      toolFoundInArray = true;
    }
  }

  if (toolFoundInArray === false) {
    this.selectedToolNames.push(tool.name);
    this.selectedTools.push(tool._id);
  }

} // END OF addToolToMetadata(course)

removeToolToMetadata(index) {
  this.selectedToolNames.splice(index, 1);
  this.selectedTools.splice(index, 1);
} // END OF removeCourseToMetadata(index)

// ===== end of tool field methods =====

findCourse(courseName) {

  this.courseOptions = [];
    if (courseName) {
      let searchedWord = courseName;
      for(let key in this.allCourses) {
        let r = this.allCourses[key].name.search(new RegExp(searchedWord, "i"));
        if (r != -1) {
          this.courseOptions.push(this.allCourses[key]);
        }
      }
    } else {
      this.courseOptions = []
    }
}

addCourseToMetadata(course) {

  this.courseToSearch = '';
  this.courseOptions = [];
  var courseFoundInArray  = false;

  for (let key in this.selectedCourses) {
    if (this.selectedCourses[key] === course._id) {
      courseFoundInArray = true;
    }
  }

  if (courseFoundInArray === false) {
    this.selectedCourseNames.push(course.name);
    this.selectedCourses.push(course._id);
  }

} // END OF addCourseToMetadata(course)

removeCourseToMetadata(index) {
  this.selectedCourseNames.splice(index, 1);
  this.selectedCourses.splice(index, 1);
} // END OF removeCourseToMetadata(index)

findIssuer(emailAddress) {
  this.issuerOptions = [];
    if (emailAddress) {
      let searchedWord = emailAddress;
      for(let key in this.allUsers) {
        let r = this.allUsers[key].emails[0].address.search(new RegExp(searchedWord, "i"));
        if (r != -1) {
          this.issuerOptions.push(this.allUsers[key].emails[0].address);
        }
      }
    } else {
      this.issuerOptions = []
    }
}

addIssuerToMetadata(issuerEmail) {

  this.issuerToSearch = '';
  this.issuerOptions = [];
  var issuerFoundInArray  = false;

  for (let key in this.selectedIssuers) {
    if (this.selectedIssuers[key] === issuerEmail) {
      issuerFoundInArray = true;
    }
  }

  if (issuerFoundInArray === false) {
    this.selectedIssuers.push(issuerEmail);
  }

} // END OF addCourseToMetadata(course)

removeIssuerToMetadata(index) {
  this.selectedIssuers.splice(index, 1);
}

addKeywordToMetadata() {

  var keywordFoundInArray = false;

  for (let key in this.selectedKeywords) {
    if (this.selectedKeywords[key] === this.selectThisKeyword) {
      keywordFoundInArray = true;
    }
  }

  if (keywordFoundInArray === false && this.selectThisKeyword !== '') {
    this.selectedKeywords.push(this.selectThisKeyword);
    this.selectThisKeyword = '';
  }

}

removeKeywordToMetadata(index) {
  this.selectedKeywords.splice(index, 1);
}

selectThisLevel(levelID) {
  this.isLevelSelectedForNewBadge = true;
  this.metadata.levelID = levelID;
}

selectThisCompetency(competencyID) {
  this.isCompetencySelectedForNewBadge = true;
  this.metadata.competencyID = competencyID;
}

createNewBadge() {

  // console.log(this.newBadgeData);
  // console.log(this.metadata);
  // console.log(this.selectedCourses);


  this.metadata.courses = this.selectedCourses;
  this.metadata.issuers = this.selectedIssuers;
  this.metadata.keywords = this.selectedKeywords;
  this.metadata.applicants = this.applicantsOfThisBadge;
  this.metadata.earners = this.earnersOfThisBadge;
  this.metadata.tools = this.selectedTools;

  if (this.metadata.levelID === '') {
    this.levelMetaMissingErrorMsg = "A level for this badge must be selected";
    setTimeout(() => {
      this.levelMetaMissingErrorMsg = "";
    }, 3000);

    return true;
  }

  if (this.metadata.competencyID === '') {
    this.competencyMetaMissingErrorMsg = "A competency for this badge must be selected";
    setTimeout(() => {
      this.competencyMetaMissingErrorMsg = "";
    }, 3000);

    return true;
  }

  if (this.metadata.courses.length <= 0) {
    this.courseMetaMissingErrorMsg = "Course metadata must be entered.";
    setTimeout(() => {
      this.courseMetaMissingErrorMsg = "";
    }, 3000);

    return true;
  }

  // console.log(this.newBadgeData);

  MeteorObservable.call('createBadge', this.newBadgeData).subscribe((response) => {
    this.newBadgeCreationLoading = true;
    // console.log(response);
    var badge_id = (response["headers"]["location"]).slice(23);
    // console.log("badge_id: "+ badge_id);

    // now that badge is created in OBF we can save metadata details in our local DB

    this.metadata["badge_id"] = badge_id;

    MeteorObservable.call('insertMetadataToLocalDB', this.metadata).subscribe((response) => {
      // console.log(response);
      this.newBadgeCreationSuccessMsg = response["feedback"];
      this.resetBadgeCreateForm();
      this.newBadgeCreationLoading = false;

    }, (err) => {
      // TODO: handle error
      console.log(err);
    });



  }, (err) => {
    // TODO: handle error
    console.log(err);
  });

} // END OF createNewBadge() ===========


updateBadge() {

    this.metadata.courses = this.selectedCourses;
    this.metadata.issuers = this.selectedIssuers;
    this.metadata.keywords = this.selectedKeywords;
    this.metadata.applicants = this.applicantsOfThisBadge;
    this.metadata.earners = this.earnersOfThisBadge;
    this.metadata.tools = this.selectedTools;

    if (this.metadata.levelID === '') {
      this.levelMetaMissingErrorMsg = "A level for this badge must be selected";
      setTimeout(() => {
        this.levelMetaMissingErrorMsg = "";
      }, 3000);

      return true;
    }

    if (this.metadata.competencyID === '') {
      this.competencyMetaMissingErrorMsg = "A competency for this badge must be selected";
      setTimeout(() => {
        this.competencyMetaMissingErrorMsg = "";
      }, 3000);

      return true;
    }

    if (this.metadata.courses.length <= 0) {
      this.courseMetaMissingErrorMsg = "Course metadata must be entered.";
      setTimeout(() => {
        this.courseMetaMissingErrorMsg = "";
      }, 3000);

      return true;
    }

    this.metadata["badge_id"] = this.selectedBadgeIdForEdit;
    this.newBadgeData["badge_id"] = this.selectedBadgeIdForEdit;

    MeteorObservable.call('updateSingleBadge', this.newBadgeData).subscribe((response) => {
      this.newBadgeCreationLoading = true;
      // console.log(response);
      // now that badge is updated in OBF we can update metadata details in our local DB
      if (response != undefined || response != "") {
        MeteorObservable.call('updateMetadata', this.metadata).subscribe((response) => {
          // console.log(response);
          this.newBadgeCreationSuccessMsg = response["feedback"];
          this.resetBadgeCreateForm();
          this.newBadgeCreationLoading = false;

        }, (err) => {
          // TODO: handle error
          console.log(err);
        });
      }


    }, (err) => {
      // TODO: handle error
      console.log(err);
    });




} // END OF updateBadge()  ==============

resetBadgeCreateForm() {

  this.isCompetencySelectedForNewBadge = false;
  this.isLevelSelectedForNewBadge = false;
  this.selectedTools = [];
  this.selectedCourses = [];
  this.selectedCourseNames = [];
  this.selectedIssuers = [];
  this.selectedKeywords = [];
  // clearing all variables in the service.
  this.metadata = JSON.parse(JSON.stringify(this.metadataReset));
  this.newBadgeData = JSON.parse(JSON.stringify(this.newBadgeDataReset));

} // END OF resetBadgeCreateForm()
// ======================================================
// ===== END OF badge create & edit related methods =====
// ======================================================



// ======================================================
// ===== START OF badge import related methods ==========
// ======================================================

showSideMenuOnUI() {
    this.showSideMenu = true;
    this.creatorSideMenuAnimationState = 'show';
    document.body.classList.add('hideBodyScroll');
    document.body.classList.remove('showBodyScroll');

  } // --------- end of showCartOnUI ---------


  hideSideMenuOnUI() {
    this.showSideMenu = false;
    this.creatorSideMenuAnimationState = 'hide';
    this.newObfBadgeCreatorEmail = "";
    document.body.classList.add('showBodyScroll');
    document.body.classList.remove('hideBodyScoll');

  } // --------- end of hideCartOnUI ---------

  mapObfCreatorWithBadgelor() {
    // the user is not mapped with obf so call that function
    // call a method to update
    MeteorObservable.call('insertUserObfID', this.newObfBadgeCreatorEmail,this.newObfBadgeCreatorObfID). subscribe((response) => {
      // console.log(response);
      //successfully updated creator ObfID;
      if (response["code"] === 200) {
        this.newObfBadgeCreatorEmail = "";
        this.userObfIdUpdateSubmitMsg = response["feedback"];
        setTimeout(() => {
          this.userObfIdUpdateSubmitMsg = "";
        }, 3000);
      }

      // user doesn't exist in badgelor
      if (response["code"] === 999) {
        this.userObfIdUpdateSubmitMsg = response["feedback"];
        setTimeout(() => {
          this.userObfIdUpdateSubmitMsg = "";
        }, 3000);
      }

    }, (err) => {
      console.log(err);
    });

  } // END OF mapObfCreatorWithBadgelor() =============

  importBadge(creatorEmail, badge_id) {

    this.metadata.courses = [];
    this.metadata.issuers = [];
    this.metadata.keywords = [];
    this.metadata.applicants = [];
    this.metadata.earners = [];
    this.metadata.tools = [];
    this.metadata.levelID = '';
    this.metadata.competencyID = '';
    this.metadata.creator = creatorEmail;
    this.metadata["badge_id"] = badge_id;

    MeteorObservable.call('importNewBadgeFromOBF', this.metadata).subscribe((response) => {
      // console.log(response);
      this.newBadgeImportSuccessMsg = response["feedback"];

      setTimeout(() => {
        this.newBadgeImportSuccessMsg = "";
      }, 3000);

    }, (err) => {
      // TODO: handle error
      console.log(err);
    });


  } // -------- end of importBadge() ---------

  // ======================================================
  // ===== END OF badge import related methods =======
  // ======================================================


  // ==============================================================
  // ===== START OF badge metadata update related methods =========
  // ==============================================================
  getMissingMetadataBadges() {
    this.dataIsLoading = true;
    this.isAnyBadgeMetaMissing = false;
    // this.listOfUpdateMetadataBadges = [];
    // console.log(this.listOfUpdateMetadataBadges);
    var localBadgeIdList = MetadataDB.find({"levelID":""}).fetch().map(function(it) { return it.badge_id});

    if (localBadgeIdList.length > 0) {

      localBadgeIdList = localBadgeIdList.join("|");

      MeteorObservable.call('getBadgesByID',localBadgeIdList).subscribe((response) => {
        if (response != undefined || response != "") {
          this.dataIsLoading = false;

          this.listOfUpdateMetadataBadges = [];

          for (let key in response) {
            this.listOfUpdateMetadataBadges.push(response[key]);
          }
          this.isAnyBadgeMetaMissing = false;
        }
         // console.log(this.listOfUpdateMetadataBadges);
      }, (err) => {
        console.log(err);
      });
    } else {
      this.dataIsLoading = false;
      this.isAnyBadgeMetaMissing = true;
    }

  } // END OF getMissingMetadataBadges()

  editThisBadge(badge_id) {

    this.showBadgeEditForm = true; // show badge edit form flag
    this.selectedBadgeIdForEdit = badge_id;
    this.isLevelSelectedForNewBadge = true;
    this.isCompetencySelectedForNewBadge = true;


    this.meteorSingleBadgeSubscription = MeteorObservable.call('getSingleBadge', badge_id).subscribe((response) => {
      if (response != undefined || response != "") {
        // console.log(response);
        this.selectedToolNames = [];
        this.selectedCourseNames = [];

        this.selectedIssuers = response['metadata']['issuers'];
        for (let key in response['metadata'].tools) {
          let tool = ToolDB.findOne({"_id": response['metadata'].tools[key]});
          if (tool !== undefined) {
            this.addToolToMetadata(tool)
          }
        }
        for (let i in response['metadata'].courses) {
          let course = CourseDB.findOne({"_id": response['metadata'].courses[i]});
          if (course !== undefined) {
            this.addCourseToMetadata(course)
          }
        }


        this.metadata = response['metadata'];
        this.newBadgeData = {
          name: response["name"],
          description: response["description"],
          image: response["image"],
          criteria_html: response["criteria_html"],
          draft: response["draft"],
          metadata: this.metadata
        };
        window.scrollTo(0,0);// jump the window position to the top.
        // console.log(this.newBadgeData)

      }
    });

  } // END OF enterMetadataOfThisBadge(badge_id)

  // ==============================================================
  // ===== END OF badge metadata update related methods ===========
  // ==============================================================


  // ==============================================================
  // ===== START OF view all badges  related methods ==============
  // ==============================================================

  getAllBadges() {
    this.dataIsLoading = true; // show loading animation
    this.isTheSystemHasBadges = false;
    var localBadgeIdList = MetadataDB.find().fetch().map(function(it) { return it.badge_id});

    if (localBadgeIdList.length > 0) {

      localBadgeIdList = localBadgeIdList.join("|");

      MeteorObservable.call('getBadgesByID',localBadgeIdList).subscribe((response) => {
        if (response != undefined || response != "") {
          this.dataIsLoading = false; // hide loading animation
          this.listOfAllBadges = [];
          for (let key in response) {
            this.listOfAllBadges.push(response[key]);
          }
          this.isTheSystemHasBadges = true;
        }
         // console.log(this.listOfUpdateMetadataBadges);
      }, (err) => {
        console.log(err);
      });
    } else {
      this.dataIsLoading = false; // hide loading animation
      this.isTheSystemHasBadges = false;
    }

  } // END OF getAllBadges()
  // ==============================================================
  // ===== END OF view all badges  related methods ================
  // ==============================================================

  // ==============================================================
  // ===== START OF step by step search related methods ===========
  // ==============================================================


  // ==============================================================
  // ===== END OF step by step search related methods ===========
  // ==============================================================





}// END OF BadgeService
