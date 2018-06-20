// =========================================================================
// ============================ THIS FILE IS NO LONGER IN USE ==============
// ================= we might use it if we can use angular httpClient ======
// =========================================================================



// this service is used for the interceptor to get
// the obfKey and obfCertificate

import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { MeteorObservable } from "meteor-rxjs";

@Injectable()
export class AuthService {
  key  : any;
  cert : any;

  constructor(private router: Router) {
    this.getObfKey();
    this.getObfCertificate();
  }


  getObfKey() {

    MeteorObservable.call("getObfKey").subscribe((response) => {
     this.key = response;
     return response;
   });
   // TODO: error handling

  }

  getObfCertificate() {

    MeteorObservable.call("getObfCertificate").subscribe((response) => {
     // console.log(response);
     this.cert = response;
     return response;
   });
   // TODO: error handling

  }



}
