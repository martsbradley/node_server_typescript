
export default class User {
    id: number;
    forename: string;
    surname: string;
    sex: number;
    dob: Date;

    constructor(id: number,
                forename: string,
                surname: string,
                sex: number,
                dob: Date) 
    {
        this.id = id;
        this.forename = forename;
        this.surname = surname;
        this.sex = sex;
        this.dob = dob;
    }
}
