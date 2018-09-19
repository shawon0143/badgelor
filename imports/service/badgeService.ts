import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { CourseDB, LevelDB, CompetencyDB, ToolDB } from "/imports/api/index";


@Injectable()
export class BadgeService {
private meteorEarnableBadgeSubscription: any;
private meteorSingleBadgeSubscription: any;

earnableBadges = [];

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

metadata = {
  courses: '',
  issuers: '',
  keywords: '',
  levelID: '',
  competencyID: '',
  tools: '',
  creator: '',
  applicants: '',
  earners: ''
};
metadataReset;
newBadgeData = {
  name: "",
  description: "",
  image: "",
  criteria_html: "",
  draft: "No",
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

constructor( public zone: NgZone,
             public router: Router) {

   this.meteorEarnableBadgeSubscription = MeteorObservable.call('getEarnableBadges').subscribe((response) => {

     if (response != undefined || response != "") {
       this.dataIsLoading = false;
       for (let key in response) {
         // ************************************************************************
         // This if condition is used because of a glich in OBF database
         // because even though we deleted these two badges (badge_id = OUYELOaET7a2K and NP24NAo4RCoW)
         // the badgename still shows up when we get all earnableBadges
         // so I did this hack to skip that badge from showing in the badge library
         // We can skip this block of code if we can fix the problem with that OBF
         // database glitch. Then we will skip the if condition
         // ************************************************************************
         if(response[key].badge_id !== "OUYELOaET7a2K" && response[key].badge_id !== "NP24NAo4RCoW") {
           this.earnableBadges.push(response[key]);
         }
       }
     }
     //  else {
     //   // TODO: handle error
     // }

     });

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
  this.newBadgeData.draft = this.newBadgeData.draft === "No" ? "Yes" : "No";
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

} // END OF addCourseToMetadata(course)

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
  this.newBadgeCreationLoading = true;
  // console.log(this.newBadgeData);
  console.log(this.metadata);
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



  MeteorObservable.call('createBadge', this.newBadgeData).subscribe((response) => {
    // console.log(response);
    var badge_id = (response["headers"]["location"]).slice(23);
    // console.log("badge_id: "+ badge_id);

    // now that badge is created in OBF we can save metadata details in our local DB

    this.metadata["badge_id"] = badge_id;

    MeteorObservable.call('insertMetadataToLocalDB', this.metadata).subscribe((response) => {
      console.log(response);
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





}// END OF BadgeService
