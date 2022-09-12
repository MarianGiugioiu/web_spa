import { Injectable } from '@angular/core';
import { CanDeactivate} from '@angular/router';
import { PersonInformationCreateComponent } from '../person-information/person-information-create/person-information-create.component';

@Injectable({
  providedIn: 'root'
})
export class FormDeactivateGuardGuard implements CanDeactivate<any> {
  canDeactivate(component: any){
    if (component.isDirty())
    {
      return confirm()
    }
    return true;
  }

}
