import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IPerson, IPersonError } from '../../shared/agenda-data.model';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Moment } from 'moment';
import { AgendaDataService } from '../../shared/agenda-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-person-information-create',
  templateUrl: './person-information-details.component.html',
  styleUrls: ['../person-information.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class PersonInformationDetailsComponent implements OnInit {
  //Form's data
  person: IPerson
  //Subscription to ActivatedRoute
  routeSub: any
  //Index of the current element in phoneNumber array (-1 if the array is empty)
  phoneIndex: number = -1
  //Index of the current element in address array (-1 if the array is empty)
  addressIndex: number = -1

  constructor(private fb: FormBuilder, private agendaDataService: AgendaDataService, private router: Router, private route: ActivatedRoute) {
    this.person = {
      id: 0,
      firstName: "",
      lastName: "",
      birthDate: "",
      phoneNumber: [],
      address: [],
      notes: ""
    }
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      //Get person with the id from the current URL
      let returnedPerson = this.agendaDataService.getPerson(+params['id'])

      //If there is no person with the specified id, navigate to create page
      if (!returnedPerson) {
        this.router.navigate(['/persons'])
      } else {
        //Convert data string to moment
        if (returnedPerson.birthDate !== '') {
          returnedPerson.birthDate = moment(returnedPerson.birthDate).format("DD/MM/YYYY")
        }

        //Set phoneIndex to first element if there are elements in the array
        if (returnedPerson.phoneNumber.length > 0) {
          this.phoneIndex = 0
        }

        //Set address to first element if there are elements in the array
        if (returnedPerson.address.length > 0) {
          this.addressIndex = 0
        }

        this.person = returnedPerson
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  goToPhone(next: boolean) {
    if (next && this.phoneIndex < this.person.phoneNumber.length - 1) {
      this.phoneIndex++
    } else if (!next && this.phoneIndex > 0) {
      this.phoneIndex--
    }
  }

  goToAddress(next: boolean) {
    if (next && this.addressIndex < this.person.address.length - 1) {
      this.addressIndex++
    } else if (!next && this.addressIndex > 0) {
      this.addressIndex--
    }
  }

  goToGoogleMaps() {
    //Current element of address array
    let currentAddress = this.person.address[this.addressIndex]
    //List with all the words in the values of current address
    let addressKeywords: string[] = []
    //Joins the words of the addressKeywords list with '+' between
    let searchString = ""
    for (let key of Object.keys(currentAddress) as (keyof typeof currentAddress)[]) {
      if (currentAddress[key] !== "") {
        let words: string[] = currentAddress[key].split(' ')
        addressKeywords = addressKeywords.concat(words)
      }
    }
    searchString = addressKeywords.join('+')

    //URL for goodle maps search
    let url = "https://www.google.com/maps/place/" + searchString

    //Open google maps in another tab
    window.open(url, '_blank');
  }

  //Navigate to edit page
  goToEdit() {
    this.router.navigate([`/persons/${this.person.id}/edit`])
  }

  //Delete current person and navigate to create page
  delete() {
    this.agendaDataService.deletePerson(this.person.id)
    this.router.navigate([`/persons`])
  }

}
