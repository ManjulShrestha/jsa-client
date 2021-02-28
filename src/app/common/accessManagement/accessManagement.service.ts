import { Injectable, OnInit } from "@angular/core";
import {RbacService} from "../rbac/rbac.service";

@Injectable()
export class AccessManager {
    constructor(
        private rbacService:RbacService
    ) {
    }

    public isAllowed(condition: string[]) {
        let verdict = false;
        // check the user meets the above conditions
        //there must be 1 or more conditions or Conditions should not be null or undefined
        if (condition === null || condition === undefined || condition.length === 0) {
            verdict = false;
        } else {
            //now check if the user meets the above conditions or not
            verdict = this.rbacService.hasSomeAuthority(condition);
        }
        return verdict;
    }

    isAllowedAll(condition: string[] ) {
        let verdict = false;
        if (condition === null || condition === undefined || condition.length === 0) {
            verdict = false;
        } else {
            //now check if the user meets the above conditions or not
            verdict = this.rbacService.hasAllAuthority(condition);
        }
        return verdict;
    }
    isTokenValid(token){

            let parsedToken = this.parseJwt(token);
            let expiry = parsedToken.exp;
            return this.checkTokenExpiry(expiry*1000)

    }

    parseJwt (token) {
        let base64Url;

        base64Url= token['data'].split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));

    }

    checkTokenExpiry(expiry){
        if((new Date(expiry).getTime()-new Date().getTime())<120000 && (new Date(expiry).getTime()-new Date().getTime())>0){
            this.reValidateToken();
        }
        return ((new Date(expiry).getTime()-new Date().getTime())>0)

    }

    reValidateToken() {
    //    Write sth here to revalidate the token
    }
}
