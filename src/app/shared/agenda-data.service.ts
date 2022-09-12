import { Injectable } from '@angular/core';
import { NgCloneDeepService } from 'ng-clone-deep';
import { BehaviorSubject } from 'rxjs';
import {IPerson} from './agenda-data.model'

@Injectable({
  providedIn: 'root'
})
export class AgendaDataService {
  private _agendaData = new BehaviorSubject<IPerson[]>(agendaDataSource)

  constructor(private cloneDeep: NgCloneDeepService) {

  }

  getList() {
    return this._agendaData
  }

  getPerson(id: number) {
    let foundPersons = agendaDataSource.filter((object: IPerson) => {
      return object.id === id
    })

    if (foundPersons.length === 0) {
      return null
    }
    return foundPersons[0]
  }


  createPerson(person: IPerson) {
    let currentMaxId: number = 0
    if (agendaDataSource.length > 0) {
      currentMaxId = agendaDataSource[agendaDataSource.length - 1].id
    }
    person.id = currentMaxId + 1
    agendaDataSource.push(person)
    this._agendaData.next(agendaDataSource)
    return person
  }

  updatePerson(person: IPerson) {
    let currentPersonIndex = agendaDataSource.findIndex((object: IPerson) => {
      return object.id === person.id
    })

    agendaDataSource[currentPersonIndex] = this.cloneDeep.clone(person)
    this._agendaData.next(agendaDataSource)
  }

  deletePerson(id: number) {
    agendaDataSource.splice(agendaDataSource.findIndex(item => item.id === id), 1)
    this._agendaData.next(agendaDataSource)
  }
}

const agendaDataSource: IPerson[] = [
  {
    id: 1,
    firstName: "Andrei",
    lastName: "Ionescu",
    birthDate: "2012-11-05",
    phoneNumber: [{
      number: "0722222222",
      type: "Personal"
    }],
    address: [{
      street: "Trandafirilor",
      city: "Valcea",
      country: "Romania",
      type: "Serviciu"
    }],
    notes: "super"
  },
  {
    id: 2,
    firstName: "Gheoghe",
    lastName: "Ionescu",
    birthDate: "1999-01-01",
    phoneNumber: [{
      number: "0722222222",
      type: "Personal"
    }],
    address: [{
      street: "Trandafirilor",
      city: "Valcea",
      country: "Romania",
      type: "Serviciu"
    }],
    notes: "super"
  },
  {
    id: 3,
    firstName: "Alin",
    lastName: "Ionescu",
    birthDate: "2012-05-11",
    phoneNumber: [{
      number: "0722222222",
      type: "Personal"
    }],
    address: [{
      street: "Trandafirilor",
      city: "Valcea",
      country: "Romania",
      type: "Serviciu"
    }],
    notes: "super"
  }
]
