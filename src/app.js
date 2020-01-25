const express = require('express')
//const bodyParser = require('body-parser');

const app = express()
const port = 3000


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => res.send('Hello World!'))


const messages = [];
let idCount = 0


app.get('/users', (req, res) => {
  return res.send('GET HTTP method on user resource');
});

app.post('/users', (req, res) => {
  return res.send('POST HTTP method on user resource');
});

app.put('/users', (req, res) => {
  return res.send('PUT HTTP method on user resource');
});

app.delete('/users', (req, res) => {
  return res.send('DELETE HTTP method on user resource');
});



app.post('/messages', (req, res) => {
    const id = idCount++;
    const data = req.body
    console.log(`Post message ${data} `);
    console.log(data);

    const message = {
        id,
        text: data
    };
    messages[id] = message;
    return res.send(message);
});

app.get('/messages/:id', (req, res) => {
    var id = parseInt(req.params.id);
    console.log(`Get HTTP method on user/${id} resource`);

    const item = messages.filter(val => val.id === id);

    console.log("*******");
    console.log(item);

    if (item && item.length === 1)
      return res.send(item[0]);
    else
      return res.send("Not found");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
