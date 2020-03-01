import express from 'express';
import { Location, validationResult } from 'express-validator';


type data = { text: string; id: number };

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

//const body: Location= 'body';
const nameCharacters = "'.ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";

export const idParamSchema =  {
    id: {
        in: 'query' as Location,
        isInt: {
            options:{ min: 1, max: 30},
            errorMessage: 'Id out of range'
        }
    }
};

export const userSchema = {
    'forename': {
        in: 'body' as Location,
        isAlpha: { 
            errorMessage: 'Not alphabetic',
        },
        isLength: {
            errorMessage: 'forename should be at least 7 chars long',
            options: { min: 3 }
        },
        trim: {
          options: " "
        }
    },
    'surname': {
        in: 'body' as Location,
        isLength: {
            errorMessage: 'surname should be at least 7 chars long',
            options: { min: 3 }
        },
        isWhitelisted : { options: nameCharacters,
                          errorMessage: 'Invalid character entered' },
        trim: {
          options: " "
        }
    },
    'sex': {
        isIn: {options: [['Male', 'Female']] },
    }
};

export function checkValidationResults(req: express.Request): void{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("Hi here found some issues.")

        console.log(errors);

        const keys = Object.keys(req.body);

        const userErrors = errorMapper(keys, errors.array());

        throw userErrors;
    }
}