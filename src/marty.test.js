//import { queryAllPatients} from './databaseInterface';



describe('Test Environment', () => {
  it('show env', () => {
    console.log(`The database for the test is ${process.env.PG_DATABASE}`);
    console.log(`The user     for the test is ${process.env.PG_USER}`);
  })
})