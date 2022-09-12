import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgCloneDeepService } from 'ng-clone-deep';
import { IPerson } from '../shared/agenda-data.model';
import { AgendaDataService } from '../shared/agenda-data.service';
import { PersonSortService } from './person-sort.service';

interface Column {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {
  persons: IPerson[] = []
  nameFilter: string = ""
  isSortedBy: string = ""
  groupedPersons: any = {}
  filteredPersons: IPerson[] = []
  groupKeys: string[] = []
  activeGroups: any = {}

  //Sorting options for select
  columns: Column[] = [
    {value: '', viewValue: '--'},
    {value: 'firstName', viewValue: 'Prenume'},
    {value: 'lastName', viewValue: 'Nume'},
    {value: 'age', viewValue: 'Varsta'},
    {value: 'birthDate', viewValue: 'Data nasterii'},
  ];


  constructor(private agendaDataService: AgendaDataService,
    private personSortService: PersonSortService,
    private cloneDeep: NgCloneDeepService,
    private router: Router) { }

  ngOnInit(): void {
    //Subscribe to list of persons
    this.agendaDataService.getList().subscribe(data => {
      this.persons = data
      //Filter
      this.filteredPersons = this.filterByName(this.cloneDeep.clone(this.persons))
      //Sort
      this.sortPersons(this.cloneDeep.clone(this.filteredPersons))
    })
  }

  //Change sorting options
  changeColumn(value: string) {
    this.isSortedBy = value;
    this.sortPersons(this.cloneDeep.clone(this.filteredPersons))
  }

  goToPerson(id: number) {
    this.router.navigate(['/persons/' + id])
  }

  //Make all groups active when sorting is active
  activateGroups() {
    this.groupKeys = Object.keys(this.groupedPersons)
    for (let key of this.groupKeys) {
      this.activeGroups[key] = true
    }
  }

  toggleGroup(key: string) {
    this.activeGroups[key] = !this.activeGroups[key]
  }

  //Sort persons by sorting option
  sortPersons(persons: IPerson[]) {
    if (this.isSortedBy !== "") {
      switch (this.isSortedBy) {
        case "firstName": {
          this.groupedPersons = this.personSortService.sortByFirstName(persons)
          this.activateGroups()
          break
        }
        case "lastName": {
          this.groupedPersons = this.personSortService.sortByLastName(persons)
          this.activateGroups()
          break
        }
        case "age": {
          this.groupedPersons = this.personSortService.sortByAge(persons)
          this.activateGroups()
          break
        }
        case "birthDate": {
          this.groupedPersons = this.personSortService.sortByBirthDate(persons)
          this.activateGroups()
          break
        }
      }
    } else {

    }
  }

  //Filter persons
  handleNameFilterChange() {
    this.filteredPersons = this.filterByName(this.cloneDeep.clone(this.persons))
    this.sortPersons(this.cloneDeep.clone(this.filteredPersons))
  }

  filterByName(persons: IPerson[]) {
    return persons.filter((person: IPerson) => person.firstName.toLocaleLowerCase().includes(this.nameFilter.toLocaleLowerCase()) ||
      person.lastName.toLocaleLowerCase().includes(this.nameFilter.toLocaleLowerCase()))
  }

  addPerson() {
    this.router.navigate(['/persons'])
  }

  logData() {
    console.log(this.persons);
    console.log(this.filteredPersons);
    console.log(this.groupedPersons);
  }

}
