import  express from 'express';
import { query, saveName} from './databaseInterface';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

app.get('/', (req, res) => res.send('Hello World!'));

type data= { text: string; id: number};


app.post('/messages', (req, httpResponse) => {
  const data = req.body;
  console.log('Need to save')
  console.log('id  :"' + data.id   +'"');
  console.log('name:"' + data.name +'"');

  const id = parseInt(data.id)
  saveName(id, data.name, httpResponse);
});

app.get('/messages/:id', (req, response) => {

  const id = parseInt(req.params.id, 10);
  console.log(`Get HTTP method on messages/${id} resource`);

  query(response);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


/// app.get('/users', (req, res) => res.send('GET HTTP method on user resource'));
/// app.post('/users', (req, res) => res.send('POST HTTP method on user resource'));
/// app.put('/users', (req, res) => res.send('PUT HTTP method on user resource'));
/// app.delete('/users', (req, res) => res.send('DELETE HTTP method on user resource'));

/// const es6Arrow = (arg: string): string => {
///   const log = `logging ${arg}`;
///   console.log(log);
///   return "";
/// };
