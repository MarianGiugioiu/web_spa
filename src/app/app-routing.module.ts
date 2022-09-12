import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormDeactivateGuardGuard } from './guards/form-deactivate-guard.guard';
import { PersonInformationCreateComponent } from './person-information/person-information-create/person-information-create.component';
import { PersonInformationDetailsComponent } from './person-information/person-information-details/person-information-details.component';
import { PersonInformationEditComponent } from './person-information/person-information-edit/person-information-edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/persons', pathMatch: 'full'},
  { path: 'persons/:id', component: PersonInformationDetailsComponent },
  { path: 'persons/:id/edit', component: PersonInformationEditComponent, canDeactivate: [FormDeactivateGuardGuard] },
  { path: 'persons', component: PersonInformationCreateComponent, canDeactivate: [FormDeactivateGuardGuard] },
  { path: '**', redirectTo: '/persons'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
