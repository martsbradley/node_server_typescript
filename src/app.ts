import express from 'express';
import { query, saveName, queryUser, queryUserThrow } from './databaseInterface';
import nunjucks from 'nunjucks';
import Joi from 'joi';
import { checkSchema, validationResult } from 'express-validator';

const app = express();

nunjucks.configure('template', {
    autoescape: true,
    express: app
});

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

type data = { text: string; id: number };


const idValidation = Joi.object().keys({
    id: Joi.number().integer().min(1).max(30).required()
})


app.get('/user/edit/:id',
    async (req, res) => {

        const validation = Joi.validate(req.params, idValidation);
        if (validation.error) {
            return res.render('error.html', validation.error);
        }
        const id = parseInt(req.params.id, 10);
        console.log(`Handling the /user/edit/${id}`);

        const user = await queryUser(id);

        if (user) {
            res.render('edit.html', user);
        }
        else {
            console.log(`User id ${id} not found`);
            res.redirect('/user/list');
        }
    });

export const userSchema = {
    forename: {
        isLength: {
            errorMessage: 'forename should be at least 7 chars long',
            options: { min: 3 }
        }
    },
    surname: {
        isLength: {
            errorMessage: 'surname should be at least 7 chars long',
            options: { min: 3 }
        }
    }
};


interface MyType {
    [x: string]: string;
}

// This maps from the express-validator results into
// something that is easier the nunjucks template to consume 
function errorMapper(keys: string[], 
                     errorList: {param: string; msg: string}[]): MyType 
{
    const result: MyType = {};

    errorList.map(e => {
        if (keys.indexOf(e.param) != -1) {
           result[e.param] =  e.msg;
        }
    });
    return result;
}

app.post('/user/save', checkSchema(userSchema),
    async (req: express.Request, res: express.Response) => {
    console.log("hit save");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Hi here found some issues.")

        const user = req.body;

        const keys = Object.keys(req.body);

        user.errors = errorMapper(keys, errors.array());

        console.log(user);
        console.log(`keys are ${keys}`);
        console.log("Replying..");
        return res.render('edit.html', user);
    }

    const data = req.body;
    console.log('Need to save' + data)

    try {
        await saveName(data);
    } catch (err) {
        console.log("Yes hit error " + err);

        const user = req.body;
        user.errors = {'general': '' + err};
        return res.render('edit.html', user);
    }

    return res.redirect('/user/list');
});

app.get('/bad', async (req, res, next) => {
    try {
        const user = await queryUserThrow(202);

        console.log("got user " + user);
        res.redirect('/user/list');
    }
    catch (err) {
        console.log("passing the error to next()");
        next(err);
    }
})

app.get('/user/list', async function (req, res) {

    const users = await query();

    const data = {
        'mynames': ['joan', 'paul', 'lisa'],
        'firstName': 'Marty',
        'users': users,
        'lastName': 'Bradley',
    };

    return res.render('home.html', data);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
