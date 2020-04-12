import { PageResult } from './pageInfo';

export class Medicine {
    medicineId: number;
    name: string;
    manufacturer: string;
    deliveryMethod: string;

    constructor(medicineId: number,
                name: string,
                manufacturer: string,
                deliveryMethod: string){
        this.medicineId = medicineId;
        this.name = name;
        this.manufacturer = manufacturer;
        this.deliveryMethod = deliveryMethod;
    }
}

export class Prescription {
    startDate: Date;
    endDate: Date;
    amount: string;
    medicine: Medicine;

    constructor(medicineId: number,
                startDate: Date,
                endDate: Date,
                amount: string,
                name: string) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.amount = amount;
        this.medicine = new Medicine(medicineId, name, '','');
    }

    get medicineId(): number{
        return this.medicine.medicineId;
    }

    get name(): string {
        return this.medicine.name;
    }


    get startDateStr(): string {
        const res = this.startDate.toISOString().slice(0, 10);
        return res;
    }
    get endDateStr(): string {
        const res = this.endDate.toISOString().slice(0, 10);
        return res;
    }
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
      //const res = this.dob.toISOString().slice(0, 10);
      //console.log(`XXX dateOfBirth is ... ${res}`);
    }

    addPrescription(p: Prescription): void {
        this.prescriptions.push(p);
    }

    get dateOfBirth(): string {
        const res = this.dob.toISOString().slice(0, 10);
        //console.log(`yyy dateOfBirth is ... ${res}`);
        return res;
    }
}

export class MedicineResult extends PageResult<Medicine>{
}
export class PatientResult extends PageResult<User>{
}