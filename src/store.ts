import User, { MedicineResult, PatientResult } from './user';
import PageInfo from './pageInfo';

export default interface Store {
    createPatient(user: User): Promise<number>;
    updatePatient(user: User): Promise<boolean>;
    queryUser(id: number): Promise<User>;
    queryAllPatients(pageInfo: PageInfo): Promise<PatientResult>;
    loadMedicines(pageInfo: PageInfo): Promise<MedicineResult>;
    closeDatabase(): void;
}
  

  //createPatient:    (user: User) => Promise<number>;
  //updatePatient:    (user: User) => Promise<boolean>;
  //queryUser:        (id: number) => Promise<User>;
  //queryAllPatients: (pageInfo: PageInfo) => Promise<PatientResult>;
  //loadMedicines:    (pageInfo: PageInfo) => Promise<MedicineResult>;
  //closeDatabase:    () => void;