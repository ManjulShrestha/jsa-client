import {Injectable} from '@angular/core';
import {User} from '../models/identity/user';
import {Category} from '../models/metadata/category';
import {MetadataService} from './metadata.service';
import {Skill} from '../models/metadata/skill';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  mapName: any = [];
  list: any = [];
  user: User = new User();
  newCategory: Category = new Category();
  newSkill: Skill = new Skill();


  constructor(private metadataService: MetadataService) {
  }

  public populateDropdown(response, dropDownList) {
    response.then(
      (response) => {
        this.mapName = response;
        this.mapName.map(
          (value) => {
            if (!value.deleted) {
              dropDownList.push(
                {id: value.id, data: value, itemName: value.nameEnglish}
              );
            }
          }
        );
      }
    );
    return dropDownList;
  }

  setDropDowns(dropdownSettings) {
    dropdownSettings = {
      singleSelection: true,
      text: 'Select',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
      enableCheckAll: false,
      showCheckbox: true,
      searchPlaceholderText: 'Search',
    };
    return dropdownSettings;
  }

  setDropDownsCategory(dropDownSettingsCategory) {
    dropDownSettingsCategory = {
      singleSelection: false,
      text: 'Select',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      enableCheckAll: true,
      showCheckbox: true,
      searchPlaceholderText: 'Search',
      addNewItemOnFilter: true
    };
    return dropDownSettingsCategory;
  }

  onAddItem(event, category, selectedCategory) {
    this.newCategory.nameEnglish = event;
    this.metadataService.addCatagory(this.newCategory).then((response) => {
        this.newCategory = response;
        category.push({
          id: this.newCategory.id, data: this.newCategory, itemName: this.newCategory.nameEnglish
        });
        selectedCategory.push({
          id: this.newCategory.id, data: this.newCategory, itemName: this.newCategory.nameEnglish
        });
      },
      (error) => {
        console.log(error);
      });
  }

  onAddSkill(event, skill, selectedSkill) {
    this.newSkill.nameEnglish = event;
    this.metadataService.addSkill(this.newSkill).then((response) => {
        this.newSkill = response;
        skill.push({
          id: this.newSkill.id, data: this.newSkill, itemName: this.newSkill.nameEnglish
        });
        selectedSkill.push({
          id: this.newSkill.id, data: this.newSkill, itemName: this.newSkill.nameEnglish
        });
      },
      (error) => {
        console.log(error);
      });
  }
}


