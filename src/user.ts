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
    _dateOfBirth: Date;

    prescriptions: Prescription[] = [];

    constructor(id: number,
                forename: string,
                surname: string,
                sex: string,
                dateOfBirth: Date) 
    {
        this.id = id;
        this.forename = forename;
        this.surname = surname;
        this.sex = sex;
        this._dateOfBirth = dateOfBirth;
    }

    copy(): User { 
        const copy = new User( this.id,
                               this.forename,
                               this.surname,
                               this.sex,
                               new Date(this.dateOfBirth));
        return copy
    }

    addPrescription(p: Prescription): void {
        this.prescriptions.push(p);
    }

    set dateOfBirth(dateOfBirth: string) {
        this._dateOfBirth = new Date(dateOfBirth);
    }

    get dateOfBirth(): string {
        const iso = this._dateOfBirth.toISOString();
        const res = iso.slice(0, 10);
        //console.log(`${iso} becomes ${res}`);
        return res;
    }
}

export class MedicineResult extends PageResult<Medicine>{
}
export class PatientResult extends PageResult<User>{
}