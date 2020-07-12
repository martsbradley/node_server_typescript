import Store from './store';

export const MockStore  = {
      createPatient     : jest.fn(),
      createPrescription: jest.fn(),
      deletePrescription: jest.fn(),
      updatePatient     : jest.fn(),
      queryUser         : jest.fn(),
      queryAllPatients  : jest.fn(),
      loadMedicines     : jest.fn(),
      closeDatabase     : jest.fn()
 };
