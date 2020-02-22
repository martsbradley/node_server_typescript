import  express from 'express';
import { query, saveName, queryUser} from './databaseInterface';
import validate from 'express-validation';
import {login, userValidation} from './validation/login';
import nunjucks from 'nunjucks';

const app = express();

nunjucks.configure('template', {
    autoescape: true,
    express: app
});

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

type data= { text: string; id: number};

app.post('/user/save', validate(userValidation), async (req, response) => {
    const data = req.body;
    console.log('Need to save' + data)
  
    const result = await saveName(data);
    return response.redirect('/user/list');
});

app.get('/user/edit/:id', async (req, response) => {
    const id = parseInt(req.params.id, 10);
    console.log(`Get HTTP method on messages/${id} resource`);
    
    const user = await queryUser(id);
    console.log("editing user " + user);
    return response.render('edit.html',  user);
});

app.get('/user/list', async function(req, res) {

    const users  = await query();

    const data = { 'mynames' : ['joan','paul','lisa'],
                   'firstName': 'Marty',
                   'users': users,
                   'lastName': 'Bradley',};

    return res.render('home.html',  data);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

/// const es6Arrow = (arg: string): string => {
///   const log = `logging ${arg}`;
///   console.log(log);
///   return "";
/// };
