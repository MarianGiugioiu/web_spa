import { Moment } from "moment"

export interface IAddress {
  street: string
  city: string
  country: string
  type: "Serviciu" | "Acasă"
}

export interface IPhoneNumber {
  number: string
  type: "Serviciu" | "Acasă" | "Personal"
}

export interface IPerson {
  id: number
  firstName: string
  lastName: string
  birthDate: string | Moment
  phoneNumber: IPhoneNumber[]
  address: IAddress[]
  notes: string
}

export interface IAddressError {
  street: string
  city: string
  country: string
}

export interface IPhoneNumberError {
  number: string
}

export interface IPersonError {
  firstName: string
  lastName: string
  birthDate: string
  phoneNumber: IPhoneNumberError[]
  address: IAddressError[]
  notes: string
}



