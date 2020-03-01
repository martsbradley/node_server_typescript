//import { number, string } from "joi";

export interface Prescription {
    medicineId: number;
    startDate: Date;
    endDate: Date;
    amount: string;
    name: string;
}

export default class User {
    id: number;
    forename: string;
    surname: string;
    sex: string;
    dob: Date;

    prescriptions: Prescription[] = [];

    constructor(id: number,
                forename: string,
                surname: string,
                sex: string,
                dob: Date) 
    {
        this.id = id;
        this.forename = forename;
        this.surname = surname;
        this.sex = sex;
        this.dob = dob;
    }

    addPrescription(p: Prescription): void {
        this.prescriptions.push(p);
    }
}