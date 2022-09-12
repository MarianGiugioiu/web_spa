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
  templateUrl: './person-information-edit.component.html',
  styleUrls: ['../person-information.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class PersonInformationEditComponent implements OnInit{
  //Initial object
  initialPerson: string
  //Form's data
  person: IPerson
  //Form's error messages
  personError: IPersonError
  //Subscription to ActivatedRoute
  routeSub: any
  //Index of the current element in phoneNumber array (-1 if the array is empty)
  phoneIndex: number = -1
  //Index of the current element in address array (-1 if the array is empty)
  addressIndex: number = -1
  //Keeps track of the position of the first invalid element in phoneNumber array, relative to the current element (-1 for previous; 0 for no error or current element; 1 for next)
  phoneError: number = 0
  //Keeps track of the position of the first invalid element in address array, relative to the current element (-1 for previous; 0 for no error or current element; 1 for next)
  addressError: number = 0

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

    this.initialPerson = JSON.stringify(this.person)

    this.personError = {
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
          returnedPerson.birthDate = moment(returnedPerson.birthDate)
        }

        //Set phoneIndex to first element if there are elements in the array and add empty error messages for the phoneNumber array
        if (returnedPerson.phoneNumber.length > 0) {
          for (let i = 0; i < returnedPerson.phoneNumber.length; i++) {
            this.personError.phoneNumber.push({
              number: ""
            })
          }
          this.phoneIndex = 0
        }

        //Set address to first element if there are elements in the array and add empty error messages for the address array
        if (returnedPerson.address.length > 0) {
          for (let i = 0; i < returnedPerson.address.length; i++) {
            this.personError.address.push({
              street: "",
              city: "",
              country: ""
            })
          }
          this.addressIndex = 0
        }

        this.person = returnedPerson

        this.initialPerson = JSON.stringify(this.person)

      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  handleLastNameChange() {
    let pattern = /[A-z\'-]+/g

    //Empty field validation
    if(this.person.lastName === "") {
      //Check if firstName field is also empty
      if (this.person.firstName === "") {
        //Move error to lastName (only one field will display the error message if both are empty)
        this.personError.lastName = "Campul este obligatoriu"
        this.personError.firstName = ""
      } else {
        this.personError.lastName = ""
      }
    } else {
      //Remove error from firstName field
      if (this.personError.firstName === "Campul este obligatoriu") {
        this.personError.firstName = ""
      }

      if (!this.person.lastName.match(pattern)) {
        //Pattern validation
        this.personError.lastName = "Camp invalid"
      } else if (this.person.lastName.length > 20) {
        //Max length validation
        this.personError.lastName = "Maxim 20 de caractere"
      } else {
        //No error
        this.personError.lastName = ""
      }
    }
  }

  //Analogous to previous method
  handleFirstNameChange() {
    let pattern = /[A-z\'-]+/g
    if(this.person.firstName === "") {
      if (this.person.lastName === "") {
        this.personError.firstName = "Campul este obligatoriu"
        this.personError.lastName = ""
      } else {
        this.personError.firstName = ""
      }
    } else {
      if (this.personError.lastName === "Campul este obligatoriu") {
        this.personError.lastName = ""
      }

      if (!this.person.firstName.match(pattern)) {
        this.personError.firstName = "Camp invalid"
      } else if (this.person.firstName.length > 20) {
        this.personError.firstName = "Maxim 20 de caractere"
      } else {
        this.personError.firstName = ""
      }
    }
  }

  handleNotesChange() {
    if (this.person.notes.length > 300) {
      //Max length validation
      this.personError.notes = "Maxim 300 de caractere"
    } else {
      //No error
      this.personError.notes = ""
    }
  }

  handlePhoneFieldChange() {
    let pattern = /[ +()0-9]{10,12}/g

    if (!this.person.phoneNumber[this.phoneIndex]["number"].match(pattern) && this.person.phoneNumber[this.phoneIndex]["number"] !== "") {
      //Pattern validation (empty field is allowed)
      this.personError.phoneNumber[this.phoneIndex]["number"] = "Camp invalid"
    } else {
      //No error
      this.personError.phoneNumber[this.phoneIndex]["number"] = ""
    }
    this.checkPhone()
  }

  addPhone() {
    //Adds a new element to phoneNumber array with default values
    this.person.phoneNumber.push({
      number: "",
      type: "Acasă"
    })

    //Add corresponding error mesages
    this.personError.phoneNumber.push({
      number: ""
    })

    //Move index to the newest element of the array
    this.phoneIndex = this.person.phoneNumber.length - 1

    //Update errors
    this.checkPhone()
  }

  removePhone() {
    //Remove current element from phoneArray array
    this.person.phoneNumber.splice(this.phoneIndex,1)

    //Remove corresponding errors
    this.personError.phoneNumber.splice(this.phoneIndex,1)

    //Index goes back one position (if the first element of the array is removed, index remains the same)
    if (this.phoneIndex > 0) {
      this.phoneIndex--
    }

    //Update errors if there are elements left in the array
    if (this.person.phoneNumber.length > 0) {
      this.checkPhone()
    }
  }

  //Go to next element in the array, or previous element if next parameter is false
  goToPhone(next: boolean) {
    if (next && this.phoneIndex < this.person.phoneNumber.length - 1) {
      //Check if there is an element in the array after the current one
      this.phoneIndex++
    } else if (!next && this.phoneIndex > 0) {
      this.phoneIndex--
    }

    //Update eerors
    this.checkPhone()
  }

  checkPhone() {
    //Errors for the current element
    let currentItem = this.personError.phoneNumber[this.phoneIndex]

    if (currentItem.number !== "") {
      //If current element is invalid reset phoneError
      this.phoneError = 0
    } else {
      //Search for the first invalid element in the array
      let index = 0
      for (index; index < this.personError.phoneNumber.length; index++) {
        let item = this.personError.phoneNumber[index]
        if (item.number !== "") {
          break
        }
      }

      //If there is an invalid element update phoneError with the corresponding value
      if (index < this.personError.phoneNumber.length) {
        if (index < this.phoneIndex) {
          this.phoneError = -1
        } else if (index > this.phoneIndex) {
          this.phoneError = 1
        } else {
          this.phoneError = 0
        }
      }
    }
  }

  //Analogous to handlePhoneFieldChange method but works for the "street", "city" and "country" properties
  handleAddressFieldChange(type: "street" | "city" | "country") {
    if (this.person.address[this.addressIndex][type].length > 30) {
      this.personError.address[this.addressIndex][type] = "Maxim 30 de caractere"
    } else {
      this.personError.address[this.addressIndex][type] = ""
    }

    this.checkAddress()
  }

  //Analogous to AddPhone method
  addAddress() {
    this.person.address.push({
      street: "",
      city: "",
      country: "",
      type: "Acasă"
    })

    this.personError.address.push({
      street: "",
      city: "",
      country: ""
    })

    this.addressIndex = this.person.address.length - 1
    this.checkAddress()
  }

  //Analogous to removePhone method
  removeAddress() {
    this.person.address.splice(this.addressIndex,1)
    this.personError.address.splice(this.addressIndex,1)

    if (this.addressIndex > 0) {
      this.addressIndex--
    }

    if (this.person.address.length > 0) {
      this.checkAddress()
    }
  }

  //Analogous to goToPhone method
  goToAddress(next: boolean) {
    if (next && this.addressIndex < this.person.address.length - 1) {
      this.addressIndex++
    } else if (!next && this.addressIndex > 0) {
      this.addressIndex--
    }

    this.checkAddress()
  }

  ////Analogous to checkPhone method
  checkAddress() {
    let currentItem = this.personError.address[this.addressIndex]

    if (currentItem.street !== "" || currentItem.city !== "" || currentItem.country !== "") {
      this.addressError = 0
    } else {
      let index = 0
      for (index; index < this.personError.address.length; index++) {
        let item = this.personError.address[index]
        if (item.street !== "" || item.city !== "" || item.country !== "") {
          break
        }
      }

      if (index < this.personError.address.length) {
        if (index < this.addressIndex) {
          this.addressError = -1
        } else if (index > this.addressIndex) {
          this.addressError = 1
        } else {
          this.addressError = 0
        }
      }
    }
  }

  goToGoogleMaps() {
    //Current element of address array
    let currentAddress = this.person.address[this.addressIndex]
    //Corresponding errors
    let currentAddressError = this.personError.address[this.addressIndex]
    //List with all the words in the values of current address
    let addressKeywords: string[] = []
    //Joins the words of the addressKeywords list with '+' between
    let searchString = ""
    for (let key of Object.keys(currentAddressError) as (keyof typeof currentAddressError)[]) {
      if (currentAddressError[key] === "" && currentAddress[key] !== "") {
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

  //Checks if the form is valid
  checkFormValidity() {
    //If first name and last name are empty and unchanged, show error message
    if (this.person.firstName === "" && this.person.lastName === "") {
      this.personError.lastName = "Campul este obligatoriu"
      return false
    }

    //If any error message is different from '', the form is not valid
    if (this.personError.firstName !== "" || this.personError.lastName !== "" || this.personError.birthDate !== "" || this.personError.notes !== "") {
      return false
    }

    for (let item of this.personError.phoneNumber) {
      if (item.number !== "") {
        return false
      }
    }

    for (let item of this.personError.address) {
      if (item.street !== "" || item.city !== "" || item.country !== "") {
        return false
      }
    }

    return true
  }

  onSubmit() {
    //Check if form is valid
    if (this.checkFormValidity()) {
      //Convert date from moment to string
      if (this.person.birthDate == null || this.person.birthDate === "") {
        this.person.birthDate = ""
      } else {
        this.person.birthDate = (this.person.birthDate as unknown as Moment).format('YYYY-MM-DD')
      }

      //Update list of persons
      this.agendaDataService.updatePerson(this.person)

      //Make initial object equal to the current object in order to navigate
      this.initialPerson = JSON.stringify(this.person)

      //Navigate to details page for the current person
      this.router.navigate(['/persons/' + this.person.id])
    }
  }

  //Check if any field was modified
  isDirty() {
    if (this.initialPerson === JSON.stringify(this.person)) {
      return false
    }
    return true
  }
}
