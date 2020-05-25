import User, { MedicineResult, PatientResult, Prescription} from './user';
import PageInfo from './pageInfo';

export default interface Store {
    createPatient(user: User): Promise<number>;
    createPrescription(patientId: number, 
                       prescription: Prescription): Promise<number>;
    updatePatient(user: User): Promise<boolean>;
    queryUser(id: number): Promise<User>;
    queryAllPatients(pageInfo: PageInfo): Promise<PatientResult>;
    loadMedicines(pageInfo: PageInfo): Promise<MedicineResult>;
    closeDatabase(): void;
}
