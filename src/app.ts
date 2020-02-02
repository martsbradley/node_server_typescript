import  express from 'express';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => res.send('Hello World!'));

type data= { text: string; id: number};

const messages: data[] = [];
let idCount = 0;


app.get('/users', (req, res) => res.send('GET HTTP method on user resource'));

app.post('/users', (req, res) => res.send('POST HTTP method on user resource'));

app.put('/users', (req, res) => res.send('PUT HTTP method on user resource'));

app.delete('/users', (req, res) => res.send('DELETE HTTP method on user resource'));


const es6Arrow = (arg: string): string => {
  const log = `logging ${arg}`;
  console.log(log);
  return "";
};

app.post('/messages', (req, res) => {
  idCount += 1;
  const data = req.body;
  console.log(data);
  console.log(Object.keys(data));

  const message = {
    id: idCount,
    text: data.text,
  };

  console.log('Post message');
  console.log(message);
  console.log('^^^^ ^^^^');

  messages[idCount] = message;
  return res.send(message);
});

app.get('/messages/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  console.log(`Get HTTP method on messages/${id} resource`);

  const item = messages.filter((val) => val.id === id);
  es6Arrow('Marty');

  console.log('*******');
  console.log(item);

  if (item && item.length === 1) {
    return res.send(item[0]);
  }

  return res.send('Not found');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
