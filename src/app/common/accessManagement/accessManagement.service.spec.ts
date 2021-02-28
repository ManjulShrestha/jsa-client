import {inject, TestBed} from "@angular/core/testing";
import {RbacService} from "../rbac/rbac.service";
import {AccessManager} from "./accessManagement.service";
import {StorageService} from "../storage/storage.service";

describe('Access Management Service', () => {
    beforeEach(() => {
        this.roles = [
            {
                name: 'test',
                resourceList: [
                    {
                        id: 1,
                        name: 'action'
                    },
                    {
                        id: 2,
                        name: 'complain'
                    }
                ]
            },
            {
                name: 'test',
                resourceList: [
                    {
                        id: 4,
                        name: 'save'
                    },
                    {
                        id: 5,
                        name: 'new'
                    }
                ]
            }
        ];
        localStorage.setItem('_usrr__', JSON.stringify(this.roles));
        TestBed.configureTestingModule({
            providers: [AccessManager, RbacService, StorageService]
        });
    });

    it('should be created ', inject([AccessManager], (service: AccessManager) => {
        expect(service).toBeTruthy();
    }));

    it('Should return true when user has any of the given roles',inject([AccessManager], (service: AccessManager) => {
        const resources = ['action','asdf','complain'];
        expect(service.isAllowed(resources)).toBeTruthy();
    }));

    it('Should return true when user has any of the given roles',inject([AccessManager], (service: AccessManager) => {
        const resources = ['action','asdf','complain'];
        expect(service.isAllowed(resources)).toBeTruthy();
    }));

    it('Should return true when user has all of the given roles',inject([AccessManager], (service: AccessManager) => {
        const resources = ['action','complain'];
        expect(service.isAllowedAll(resources)).toBeTruthy();
    }));

    it('should return false when resource is null or undefined or no resource is sent',inject([AccessManager],(service:AccessManager)=>{
        let resources = [];
        expect(service.isAllowedAll(resources)).toBeFalsy();
        expect(service.isAllowed(resources)).toBeFalsy();
        resources = null;
        expect(service.isAllowedAll(resources)).toBeFalsy();
        expect(service.isAllowed(resources)).toBeFalsy();
        resources = undefined;
        expect(service.isAllowedAll(resources)).toBeFalsy();
        expect(service.isAllowed(resources)).toBeFalsy();
    }));

});