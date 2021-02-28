import { TestBed, inject } from '@angular/core/testing';

import { RbacService } from './rbac.service';
import {StorageService} from "../storage/storage.service";

describe('RbacService', () => {
    beforeEach(() => {
        this.roles =  [
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
        localStorage.setItem('_usrr__',JSON.stringify(this.roles));
        TestBed.configureTestingModule({
            providers: [RbacService,StorageService]
        });
    });

  it('should be created ', inject([RbacService], (service: RbacService) => {
    expect(service).toBeTruthy();
  }));

  it('Should return true when user has any of the given roles',inject([RbacService],(service:RbacService)=>{
      const resources = ['action','asdf','complain'];
      expect(service.hasSomeAuthority(resources)).toBeTruthy();
  }));

  it('should return false when no resource is sent',inject([RbacService],(service:RbacService)=>{
      const resources = [];
      expect(service.hasSomeAuthority(resources)).toBeFalsy();
      expect(service.hasAllAuthority(resources)).toBeFalsy();
  }));

  it('should return true when the user has all given resources',inject([RbacService],(service:RbacService)=>{
      const resources = ['action','complain'];
      expect(service.hasAllAuthority(resources)).toBeTruthy();
  }));

    it('should return false when the user does not have all given resources',inject([RbacService],(service:RbacService)=>{
        const resources = ['action','complain','pqrst'];
        expect(service.hasAllAuthority(resources)).toBeFalsy();
    }));

});
