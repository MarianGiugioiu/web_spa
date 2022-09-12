import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { IPerson } from '../shared/agenda-data.model';

@Injectable({
  providedIn: 'root'
})
export class PersonSortService {

  constructor() { }

  sortByFirstName(persons: IPerson[]) {
    persons.sort((a,b) => (a.firstName >= b.firstName) ? 1 : -1)
    return this.groupByFirstName(persons)
  }

  groupByFirstName(persons: IPerson[]) {
    //Creates a map with the names of the groups as keys and the list of corresponding groups of persons as values
    const map = persons.reduce((acc: {}, val: IPerson) => {
      let char = val.firstName.charAt(0).toUpperCase();
      if ((acc as any)[char] === undefined)  {
        (acc as any)[char] = [val]
      } else {
        (acc as any)[char].push(val)
      }
      return acc;
   }, {});
    return map;
  }

  sortByLastName(persons: IPerson[]) {

    persons.sort((a,b) => (a.lastName >= b.lastName) ? 1 : -1)
    return this.groupByFirstName(persons)

  }

  groupByLastName(persons: IPerson[]) {
    //Creates a map with the names of the groups as keys and the list of corresponding groups of persons as values
    const map = persons.reduce((acc: {}, val: IPerson) => {
      let char = val.lastName.charAt(0).toUpperCase();
      if ((acc as any)[char] === undefined)  {
        (acc as any)[char] = [val]
      } else {
        (acc as any)[char].push(val)
      }
      return acc;
   }, {});
    return map
  }

  sortByAge(persons: IPerson[]) {
    persons.sort((a,b) => (a.birthDate <= b.birthDate) ? 1 : -1)

    return this.groupByAge(persons)

  }

  groupByAge(persons: IPerson[]) {
    let map: any = {}
    let intervalCounter: number = -1
    persons.forEach((person:IPerson) => {
      //If birthDate is '' add 'Necunoscuta key to the map
      if (person.birthDate === "") {
        if (!map["Necunoscută"]) {
          map["Necunoscută"] = [person]
        } else {
          map["Necunoscută"].push(person)
        }
      } else {
        //Get difference between birthDate and current date
        let years = moment().diff(moment(person.birthDate), 'years')

        //Get corresponding interval
        intervalCounter = Math.floor(years / 10)
        let interval = `${intervalCounter * 10} - ${intervalCounter * 10 + 9}`

        if (!map[interval]) {
          map[interval] = [person]
        } else {
          map[interval].push(person)
        }
      }
    })

    //Make 'Necunoscuta' key first in the list of keys
    if (map["Necunoscută"]) {
      const auxObject = {
        "Necunoscută" : map["Necunoscută"]
      }

      map = Object.assign(auxObject, map)
    }
    return map
  }

  sortByBirthDate(persons: IPerson[]) {
    persons.sort((a,b) => (a.birthDate >= b.birthDate) ? 1 : -1)

    return this.groupByBirthDateMonth(persons)

  }

  groupByBirthDateMonth(persons: IPerson[]) {
    //Initialize map keys
    let map: any = {
      "Necunoscută": [],
      "Ianuarie": [],
      "Februarie": [],
      "Martie": [],
      "Aprilie": [],
      "Mai": [],
      "Iunie": [],
      "Iulie": [],
      "August": [],
      "Septembrie": [],
      "Octombrie": [],
      "Noiembrie": [],
      "Decembrie": []
    }
    persons.forEach((person:IPerson) => {
      if (person.birthDate === "") {
        map["Necunoscută"].push(person)
      } else {
        //Get moth from birthDate
        let month = +moment(person.birthDate).month()
        //Add person to corresponding month group
        switch (month) {
          case 0: {
            map["Ianuarie"].push(person)
            break
          }
          case 1: {
            map["Februarie"].push(person)
            break
          }
          case 2: {
            map["Martie"].push(person)
            break
          }
          case 3: {
            map["Aprilie"].push(person)
            break
          }
          case 4: {
            map["Mai"].push(person)
            break
          }
          case 5: {
            map["Iunie"].push(person)
            break
          }
          case 6: {
            map["Iulie"].push(person)
            break
          }
          case 7: {
            map["August"].push(person)
            break
          }
          case 8: {
            map["Septtembrie"].push(person)
            break
          }
          case 9: {
            map["Octombrie"].push(person)
            break
          }
          case 10: {
            map["Noiembrie"].push(person)
            break
          }
          case 11: {
            map["Decembrie"].push(person)
            break
          }
        }
      }
    })

    this.removeUnusedObjectKeys(map)

    return map
  }

  //Delete unused keys
  removeUnusedObjectKeys(obj: any) {
    for (var propName in obj) {
      if (obj[propName].length === 0) {
        delete obj[propName];
      }
    }
    return obj
  }
}
