import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class StorageService {

    constructor() {
    }

    private storageSystem: Object = {};

    public set(key: string, value: object, override: Boolean = false) {
        if (override) {
            this.storageSystem[key] = value;
        } else {
            if (!(key in this.storageSystem)) {
                this.storageSystem[key] = value;
            }
        }
    }

    public get(key: string) {
        return this.storageSystem[key];
    }

    public remove(key: string) {
        delete this.storageSystem[key];
    }

    public lset(key: string, value: object, override: Boolean = false) {
        if (override) {
            localStorage.setItem(key, JSON.stringify(value));

        } else {
            if (localStorage.getItem(key) == null)
                localStorage.setItem(key, JSON.stringify(value));
        }
    }

    public lget(key: string) {
        let value = localStorage.getItem(key);
        return value != null ? JSON.parse(value) : null;
    }

    public lremove(key: string) {
        localStorage.removeItem(key);
    }

    public setCurrentUserToken(token: string) {
        this.lset("_tkn__", {data: token}, true);
    }

    public getCurrentUserToken(): string {
        if (this.lget("_tkn__") != null) {
            return this.lget("_tkn__");

        }

    }

    public storeCurrentUser(data: Object) {
        this.lset("_usrd__", data, true);
    }

    public getCurrentUser() {
        if (this.lget("_usrd__") != null) {
            return this.lget("_usrd__");
        }

    }

    public storeCurrentUserRoles(data) {
        // this.lremove("_usrr__");
        this.lset("_usrr__", data, true);
    }

    public getCurrentUserRoles() {
        return this.lget("_usrr__");
    }

    public storeCompany(data: Object) {
      this.lset('_company_',data,true);
    }

    public getCompany(){
      return this.lget('_company_');
    }

    public storeCandidate(data: Object) {
      this.lset('_candidate_',data,true);
    }

    public getCandidate(){
      return this.lget('_candidate_');
    }


    clear() {
        localStorage.clear();
    }

}
