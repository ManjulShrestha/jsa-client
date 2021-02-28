import {Injectable} from '@angular/core';
import {StorageService} from "../storage/storage.service";


@Injectable()
export class RbacService {

    constructor(private storage: StorageService) {
    }

    hasSomeAuthority(resourceList: string[]): boolean {
        // if (resourceList == null || resourceList == undefined ) {
        //   return true;
        // }

        //    firstly get all the roles of that user
        const roles = this.storage.getCurrentUserRoles();
        // if there are no roles then conditions dont' meet i.e user does not have authority
        if (roles == null) {
            return false;
        }

        // now check if the user roles have at least one of the resource
        for (const role of roles) {
            for (const resource of role.resourceList) {
                if (resourceList.indexOf(resource.name) >= 0) {

                    return true;
                }
            }
        }
        return false;
    }

    hasAllAuthority(resourceList: string[]): boolean {
        if (resourceList.length <= 0)
            return false;
        const roles = this.storage.getCurrentUserRoles();
        let verdict : boolean = true;
        if (roles == null) {
            return false;
        }

        let currentResources = [];

        for (const role of roles) {
            for (let resource of role.resourceList) {
                currentResources.push(resource.name);
            }
        }

        for (const resource of resourceList) {
            if (currentResources.indexOf(resource) < 0) {
                return false;
            }
        }
        return verdict;
    }
}
