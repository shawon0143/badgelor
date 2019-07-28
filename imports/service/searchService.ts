import { Injectable, NgZone, ApplicationRef } from "@angular/core";
import { Accounts } from "meteor/accounts-base";
import { Router, ActivatedRoute, Params, NavigationEnd } from "@angular/router";
import { Meteor } from "meteor/meteor";
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import {
  CourseDB,
  LevelDB,
  CompetencyDB,
  ToolDB,
  MetadataDB,
  CampusDB,
  FacultyDB,
  InstituteDB
} from "/imports/api/index";

@Injectable()
export class SearchService {
  //pass null as collection name, it will create
  //local only collection
  earnableBadges;
  badges = [];
  numberOfBadges;

  allLevels;
  allCompetencies;
  allTools;

  // variables for filter
  selectedCompetencyForFilter = [];
  selectedLevelForFilter = [];
  selectedToolForFilter = [];

  //RegEx search variables
  searchKeywords: string = "";
  resetFilterCheckbox: boolean;

  // flag for data loading ANIMATION
  dataIsLoading: boolean = true;

  // variable slideinout animation of filter sidebar
  slideinAnimationState: string = "in";

  // flag for step by step search
  selectedCampusForStepByStepSearch;
  selectedFacultyForStepByStepSearch;
  selectedInstituteForStepByStepSearch;
  selectedCourseForStepByStepSearch;

  constructor(public zone: NgZone, public router: Router) {} // END of constructor

  getEarnableBadges() {
    this.earnableBadges = new Mongo.Collection(null);
    MeteorObservable.call("getEarnableBadges").subscribe(response => {
      if (response != undefined || response != "") {
        console.log(response);
        // var localBadgeIdList = MetadataDB.find({"levelID": { "$nin": [ "" ] }}).fetch().map(function(it) { return it.badge_id});
        var localBadgeList = MetadataDB.find({
          levelID: { $nin: [""] }
        }).fetch();

        for (let key in response) {
          for (let i in localBadgeList) {
            if (response[key].badge_id === localBadgeList[i].badge_id) {
              localBadgeList[i]["badge_image"] = response[key].badge_image;
              localBadgeList[i]["name"] = response[key].name;
              localBadgeList[i]["id"] = response[key].id;

              // get course name
              let courseDB = CourseDB.findOne({_id: localBadgeList[i].courses[0]});
              if (courseDB !== undefined) {
                localBadgeList[i].courses[0] = courseDB["name"];
              }
              // get campus name
              let campusDB = CampusDB.findOne({_id: courseDB.campusID});
              if (campusDB !== undefined) {
                localBadgeList[i]["campusName"] = campusDB["name"];
              }
              // get faculty name
              let facultyDB = FacultyDB.findOne({_id: courseDB.facultyID});
              if (facultyDB !== undefined) {
                localBadgeList[i]["facultyName"] = facultyDB["name"];
              }
              // get institute name
              let instituteDB = InstituteDB.findOne({_id: courseDB.instituteID});
              if (instituteDB !== undefined) {
                localBadgeList[i]["instituteName"] = instituteDB["name"];
              }
              // get competency name
              let competencyDB = CompetencyDB.findOne({_id: localBadgeList[i].competencyID});
              if (competencyDB !== undefined) {
                localBadgeList[i]["competencyName"] = competencyDB["name"];
              }
              // get level name
              let levelDB = LevelDB.findOne({_id: localBadgeList[i].levelID});
              if (levelDB !== undefined) {
                localBadgeList[i]["levelName"] = levelDB["name"];
              }

              // get tool names
              for (let j in localBadgeList[i].tools) {
                let toolDB = ToolDB.findOne({_id: localBadgeList[i].tools[j]});
                if (toolDB !== undefined) {
                  localBadgeList[i].tools[j] = toolDB["name"];
                }
              }

              this.earnableBadges.insert(localBadgeList[i]);
            }
          }
        }

        // getting all badges to display in template
        this.badges = this.earnableBadges.find().fetch();

        // console.log(this.badges);
        // getting the number of badges
        this.countTotalBadges();
        // getting all filter details
        this.setFilterDetails();

        this.dataIsLoading = false;
      }
      //  else {
      //   // TODO: handle error
      // }
    });
  }

  countTotalBadges() {
    this.numberOfBadges = this.badges.length;
  }

  setFilterDetails() {
    // Load all levels via method call from server
    MeteorObservable.call("getAllLevelName").subscribe(
      response => {
        this.allLevels = response;

        for (var key in this.allLevels) {
          let countNumber = 0;
          for (var i in this.badges) {
            if (this.allLevels[key]._id === this.badges[i].levelID) {
              countNumber = countNumber + 1;
              this.allLevels[key]["count"] = countNumber;
            }
          }
        }
      },
      err => {
        // TODO: handle error
        console.log(err);
      }
    );
    // Load all competencies via method call from server
    MeteorObservable.call("getAllCompetencyName").subscribe(
      response => {
        this.allCompetencies = response;

        for (var key in this.allCompetencies) {
          let countNumber = 0;
          for (var i in this.badges) {
            if (this.allCompetencies[key]._id === this.badges[i].competencyID) {
              countNumber = countNumber + 1;
              this.allCompetencies[key]["count"] = countNumber;
            }
          }
        }
      },
      err => {
        // TODO: handle error
        console.log(err);
      }
    );
    // Load all tools via method call from server
    MeteorObservable.call("getAllToolName").subscribe(
      response => {
        this.allTools = response;

        for (var key in this.allTools) {
          let countNumber = 0;
          for (var i in this.badges) {
            for (var j in this.badges[i].tools)
              if (this.allTools[key].name === this.badges[i].tools[j]) {
                countNumber = countNumber + 1;
                this.allTools[key]["count"] = countNumber;
              }
          }
        }
        //===================================================
        // call the reset method after all data load complete
        //===================================================
        this.resetAllFilter();
      },
      err => {
        // TODO: handle error
        console.log(err);
      }
    );
  } // -----  END OF setFilterDetails() ------- /////

  // hide and show filter sidebar
  collapseSideBar() {
    this.slideinAnimationState =
      this.slideinAnimationState === "in" ? "out" : "in";
  }

  resetAllFilter() {
    this.slideinAnimationState = "in";
    // first check if the search keywords are empty or not.
    // only resets if search keywords are empty
    if (this.searchKeywords === "") {
      // clearing the filter array for each category
      this.selectedCompetencyForFilter = [];
      this.selectedLevelForFilter = [];
      this.selectedToolForFilter = [];

      this.allLevels.forEach(level => {
        level["checked"] = false;
      });

      this.allCompetencies.forEach(competency => {
        competency["checked"] = false;
      });

      this.allTools.forEach(tool => {
        tool["checked"] = false;
      });

      this.badges = this.earnableBadges.find().fetch();
      this.countTotalBadges();
    }
  }

  filterbyLevel(event, levelID) {
    // if the level is checked
    if (event.target.checked === true) {
      this.selectedLevelForFilter.push(levelID);
      this.allLevels.forEach(level => {
        if (level._id === levelID) {
          level["checked"] = true;
        }
      });
    }
    // if the level is unchecked
    if (event.target.checked === false) {
      for (var i = 0; i < this.selectedLevelForFilter.length; i++) {
        if (this.selectedLevelForFilter[i] === levelID) {
          this.selectedLevelForFilter.splice(i, 1);
        }
      }

      this.allLevels.forEach(level => {
        if (level._id === levelID) {
          level["checked"] = false;
        }
      });
    }

    this.applyFilter();
  } // ----- END OF filterbyLevel() ------ ////

  filterByCompetency(event, competencyID) {
    // if the competency is checked
    if (event.target.checked === true) {
      this.selectedCompetencyForFilter.push(competencyID);
      this.allCompetencies.forEach(competency => {
        if (competency._id === competencyID) {
          competency["checked"] = true;
        }
      });
    }
    // if the competency is unchecked
    if (event.target.checked === false) {
      for (var i = 0; i < this.selectedCompetencyForFilter.length; i++) {
        if (this.selectedCompetencyForFilter[i] === competencyID) {
          this.selectedCompetencyForFilter.splice(i, 1);
        }
      }

      this.allCompetencies.forEach(competency => {
        if (competency._id === competencyID) {
          competency["checked"] = false;
        }
      });
    }

    this.applyFilter();
  } // ----- END OF filterByCompetency() ---------////

  filterByTool(event, toolID) {
    // if the tool is checked
    if (event.target.checked === true) {
      this.selectedToolForFilter.push(toolID);
      this.allTools.forEach(tool => {
        if (tool.name === toolID) {
          tool["checked"] = true;
        }
      });
    }
    // if the tool is unchecked
    if (event.target.checked === false) {
      for (var i = 0; i < this.selectedToolForFilter.length; i++) {
        if (this.selectedToolForFilter[i] === toolID) {
          this.selectedToolForFilter.splice(i, 1);
        }
      }

      this.allTools.forEach(tool => {
        if (tool.name === toolID) {
          tool["checked"] = false;
        }
      });
    }

    this.applyFilter();
  }

  applyFilter() {
    this.badges = this.earnableBadges.find().fetch();

    this.badges.forEach(badge => {
      badge["isCompetencyFiltered"] = false;
      badge["isLevelFiltered"] = false;
      badge["isToolFiltered"] = false;
    });

    // =============================
    // apply level Filter ==========
    // =============================
    // apply filter if there are level checkbox checked
    if (this.selectedLevelForFilter.length >= 1) {
      for (var a = 0; a < this.badges.length; a++) {
        for (var b = 0; b < this.selectedLevelForFilter.length; b++) {
          if (this.badges[a].levelID === this.selectedLevelForFilter[b]) {
            this.badges[a]["isLevelFiltered"] = true;
          }
        }
      }
    }

    // =============================
    // apply competency filter =====
    // =============================

    // apply filter if there are competency checkbox checked
    if (this.selectedCompetencyForFilter.length >= 1) {
      for (var c = 0; c < this.badges.length; c++) {
        for (var d = 0; d < this.selectedCompetencyForFilter.length; d++) {
          if (
            this.badges[c].competencyID === this.selectedCompetencyForFilter[d]
          ) {
            this.badges[c]["isCompetencyFiltered"] = true;
          }
        }
      }
    }

    // =============================
    // apply tool Filter ===========
    // =============================

    // apply filter if there are tool checkbox checked
    if (this.selectedToolForFilter.length >= 1) {
      for (var key in this.selectedToolForFilter) {
        for (var i in this.badges) {
          for (var j in this.badges[i].tools)
            if (this.selectedToolForFilter[key] === this.badges[i].tools[j]) {
              this.badges[i]["isToolFiltered"] = true;
            }
        }
      }
    }

    // how many scenarios can there be
    // 1. only level filter enabled
    // 2. only competency filter enabled
    // 3. only tool filter enabled
    // 1 & 2
    // 1 & 3
    // 2 & 3
    // 1 & 2 & 3
    // none of them are selected

    // 1. only level filter enabled
    if (
      this.selectedLevelForFilter.length >= 1 &&
      this.selectedCompetencyForFilter.length < 1 &&
      this.selectedToolForFilter.length < 1
    ) {
      let filteredBadges = this.badges.filter(badge => {
        if (badge.isLevelFiltered === true) return badge;
      });

      this.badges = filteredBadges;
      this.countTotalBadges();
      return true;
    }

    // 2. only competency filter enabled ----------
    if (
      this.selectedLevelForFilter.length < 1 &&
      this.selectedCompetencyForFilter.length >= 1 &&
      this.selectedToolForFilter.length < 1
    ) {
      let filteredBadges = this.badges.filter(badge => {
        if (badge.isCompetencyFiltered === true) return badge;
      });

      this.badges = filteredBadges;
      this.countTotalBadges();
      return true;
    }

    // 3. only tool filter enabled ------------
    if (
      this.selectedLevelForFilter.length < 1 &&
      this.selectedCompetencyForFilter.length < 1 &&
      this.selectedToolForFilter.length >= 1
    ) {
      let filteredBadges = this.badges.filter(badge => {
        if (badge.isToolFiltered === true) return badge;
      });

      this.badges = filteredBadges;
      this.countTotalBadges();
      return true;
    }

    // 1 & 2 ---------------
    if (
      this.selectedLevelForFilter.length >= 1 &&
      this.selectedCompetencyForFilter.length >= 1 &&
      this.selectedToolForFilter.length < 1
    ) {
      let filteredBadges = this.badges.filter(badge => {
        if (
          badge.isLevelFiltered === true &&
          badge.isCompetencyFiltered === true
        )
          return badge;
      });

      this.badges = filteredBadges;
      this.countTotalBadges();
      return true;
    }
    // 1 & 3 ---------------
    if (
      this.selectedLevelForFilter.length >= 1 &&
      this.selectedCompetencyForFilter.length < 1 &&
      this.selectedToolForFilter.length >= 1
    ) {
      let filteredBadges = this.badges.filter(badge => {
        if (badge.isLevelFiltered === true && badge.isToolFiltered === true)
          return badge;
      });

      this.badges = filteredBadges;
      this.countTotalBadges();
      return true;
    }

    // 2 & 3 ----------------
    if (
      this.selectedLevelForFilter.length < 1 &&
      this.selectedCompetencyForFilter.length >= 1 &&
      this.selectedToolForFilter.length >= 1
    ) {
      let filteredBadges = this.badges.filter(badge => {
        if (
          badge.isCompetencyFiltered === true &&
          badge.isToolFiltered === true
        )
          return badge;
      });

      this.badges = filteredBadges;
      this.countTotalBadges();
      return true;
    }

    // 1 & 2 & 3 ------------------
    if (
      this.selectedLevelForFilter.length >= 1 &&
      this.selectedCompetencyForFilter.length >= 1 &&
      this.selectedToolForFilter.length >= 1
    ) {
      let filteredBadges = this.badges.filter(badge => {
        if (
          badge.isCompetencyFiltered === true &&
          badge.isToolFiltered === true &&
          badge.isLevelFiltered === true
        )
          return badge;
      });

      this.badges = filteredBadges;
      this.countTotalBadges();
      return true;
    }

    // none of them are selected --------------
    if (
      this.selectedLevelForFilter.length < 1 &&
      this.selectedCompetencyForFilter.length < 1 &&
      this.selectedToolForFilter.length < 1
    ) {
      this.countTotalBadges();
    }
  } // ----------- END OF applyFilter() ------//////

  search() {
    // *************  checking input field empty or not ---------------------------
    if (
      this.searchKeywords.length !== undefined &&
      this.searchKeywords.length >= 1
    ) {
      this.slideinAnimationState = "out";
      // =============================================================
      // search result helper.
      // More info - https://themeteorchef.com/tutorials/simple-search
      // =============================================================

      check(this.searchKeywords, Match.OneOf(String, null, undefined));
      let query = {},
        projection = { limit: 10, sort: { name: 1 } };

      if (this.searchKeywords) {
        let regex = new RegExp(this.searchKeywords, "i");

        query = {
          $or: [
            { name: regex },
            { courses: regex },
            { creator: regex },
            { keywords: regex },
            { tools: regex },
            { competencyName: regex },
            { levelName: regex },
            { campusName: regex },
            { facultyName: regex },
            { instituteName: regex }
          ]
        };

        projection.limit = 100;

        this.badges = this.earnableBadges.find(query, projection).fetch();
        this.countTotalBadges();
      } // END of if ( search )
    } else {
      this.slideinAnimationState = "in";
      this.badges = this.earnableBadges.find().fetch();
      this.countTotalBadges();
    }
  }

  performStepByStepSearch(searchString, step) {
    // step-1: user clicks campus
    // we go to the next level is it has next level
    // for example if a faculty doesn't have institute it ends there
    // step-2: user clicks faculty
    // step-3: user clicks institute
    // step-4: user clicks course
    this.slideinAnimationState = "out";

    let query = {},
      projection = { limit: 10, sort: { name: 1 } };

    if (searchString) {
      // let regex = new RegExp( searchString, 'i' );

      if (step === "stepOne") {
        this.selectedCampusForStepByStepSearch = searchString;
        query = {
          $or: [{ campusName: this.selectedCampusForStepByStepSearch }]
        };
      } else if (step === "stepTwo") {
        this.selectedFacultyForStepByStepSearch = searchString;
        query = {
          $and: [
            { campusName: this.selectedCampusForStepByStepSearch },
            { facultyName: this.selectedFacultyForStepByStepSearch }
          ]
        };
      } else if (step === "stepThree") {
        this.selectedInstituteForStepByStepSearch = searchString;
        query = {
          $and: [
            { campusName: this.selectedCampusForStepByStepSearch },
            { facultyName: this.selectedFacultyForStepByStepSearch },
            { instituteName: this.selectedInstituteForStepByStepSearch }
          ]
        };
      } else if (step === "stepFour") {
        this.selectedCourseForStepByStepSearch = searchString;
        query = {
          $and: [
            { campusName: this.selectedCampusForStepByStepSearch },
            { facultyName: this.selectedFacultyForStepByStepSearch },
            { instituteName: this.selectedInstituteForStepByStepSearch },
            { courses: this.selectedCourseForStepByStepSearch }
          ]
        };
      }

      projection.limit = 100;

      this.badges = this.earnableBadges.find(query, projection).fetch();
      this.countTotalBadges();
    }
  }

  resetStepByStepSearch() {
    this.badges = this.earnableBadges.find().fetch();
  }

  resetStepByStepSearchBreadcrumb() {
    this.selectedCampusForStepByStepSearch = undefined;
    this.selectedFacultyForStepByStepSearch = undefined;
    this.selectedInstituteForStepByStepSearch = undefined;
    this.selectedCourseForStepByStepSearch = undefined;
  }
} // END OF SearchService
