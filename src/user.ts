import { PageResult } from './pageInfo';

export class Medicine {
    id: number;
    name: string;
    manufacturer: string;
    deliveryMethod: string;

    constructor(id: number,
                name: string,
                manufacturer: string,
                deliveryMethod: string){
        this.id = id;
        this.name = name;
        this.manufacturer = manufacturer;
        this.deliveryMethod = deliveryMethod;
    }
}

export class Prescription {
    prescriptionId: number;
    startDate: Date;
    endDate: Date;
    amount: string;
    medicine: Medicine;

    constructor(prescriptionId: number,
                startDate: Date,
                endDate: Date,
                amount: string,
                medicine: Medicine) {
        this.prescriptionId = prescriptionId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.amount = amount;
        this.medicine = medicine;
    }

    get medicineId(): number{
        return this.medicine.id;
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
    dateOfBirth: string;

    prescriptions: Prescription[] = [];

    constructor(id: number,
                forename: string,
                surname: string,
                sex: string,
                dateOfBirth: string) 
    {
        this.id = id;
        this.forename = forename;
        this.surname = surname;
        this.sex = sex;
        this.dateOfBirth = dateOfBirth;
    }

    copy(): User { 
        const copy = new User( this.id,
                               this.forename,
                               this.surname,
                               this.sex,
                               this.dateOfBirth);
        return copy
    }

    addPrescription(p: Prescription): void {
        this.prescriptions.push(p);
    }
}

export class MedicineResult extends PageResult<Medicine>{
}
export class PatientResult extends PageResult<User>{
}
