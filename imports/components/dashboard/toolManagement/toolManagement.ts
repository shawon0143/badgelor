import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meteor } from 'meteor/meteor';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorObservable } from "meteor-rxjs";
import { Observable } from "rxjs";
import { AccountService } from '/imports/service/accountService';
import { ToolService } from '/imports/service/toolService';
import { ToolDB } from "/imports/api/index";
import { list1, fadeInAnimation } from "/imports/service/animations";

import template from './toolManagement.html';




@Component({
  selector: 'tool-management',
  template,
  animations: [list1, fadeInAnimation]
})



export class ToolManagement implements OnInit {
  private meteorSubscriptionTool;
  allTools: any;


  constructor(private route: ActivatedRoute,
              private router: Router,
              public accountService: AccountService,
              public toolService: ToolService) {

    this.meteorSubscriptionTool = MeteorObservable.subscribe<any>("publishAllTools").subscribe(() => {
      // Subscription is ready!
      // MeteorObservable.autorun().subscribe(() => {
      //  this.allCampuses = this.getAllCampuses();
      // });
    });
  }

  editThisTool(tool) {
    window.scrollTo(0,0);// this line will take the window position to the top.
    this.toolService.isEditToolEnabled = true;
    this.toolService.tempToolNameForDuplicateCheck = tool.name;
    this.toolService.newToolData._id = tool._id;
    this.toolService.newToolData.name = tool.name;
    this.toolService.newToolData.description = tool.description;
  }


  ngOnInit(): void {
    this.allTools = this.toolService.getAllTools();
    // console.log(this.allCampuses);
  }// end of ngOnInit




  ngOnDestroy() {
    if (this.meteorSubscriptionTool) {
      this.meteorSubscriptionTool.unsubscribe();
    }
  }



} // end of class CampusManagement
