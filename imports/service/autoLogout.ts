// The purpose of this service is to logout user
// once they don't check the remember me checkbox
// and they are idle for more than 30 minutes
// the user will automatically logout from the system
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { LocalStorageService } from 'angular-2-local-storage';

const MINUTES_UNITL_AUTO_LOGOUT = 30 // in mins
const CHECK_INTERVAL = 15000 // in ms
const STORE_KEY = 'lastAction';
@Injectable()
export class AutoLogoutService {

  public getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }
  public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }
  badgelorMemory;

  constructor(private router: Router, public localStorageService: LocalStorageService) {
    if (this.localStorageService.get('badgelorMemory')) {
      this.badgelorMemory = this.localStorageService.get('badgelorMemory');
    }

    if (this.badgelorMemory !== undefined) {
      if (this.badgelorMemory["rememberMe"] !== true ) {
        this.check();
        this.initListener();
        this.initInterval();
      }
    }

  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    if (isTimeout) {
      Meteor.logout();
      localStorage.clear();
      this.router.navigate(['/']);
    }
  }
}
