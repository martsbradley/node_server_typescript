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


function nameValid(part: string, minLen: number, maxLen: number) {
    return {
        in: 'body' as Location,
        isAlpha: { 
            errorMessage: 'Not alphabetic',
        },
        isLength: {
            errorMessage: `${part}should be at least 7 chars long`,
            options: { min: minLen,
                       max: maxLen }
        },
        trim: {
          options: " "
        }
    };
}

const validId = { 
    isInt: {
        options:{ min: 1, max: 30},
        errorMessage: 'Id out of range'
    }
};

export const idParamSchema =  {
    id: {
        in: 'query' as Location,
        ...validId
    }
};

const inBody = {
    in: 'body' as Location
}

export const NewUserSchema = {

    'forename': nameValid("forname", 3, 20),
    'surname':  nameValid("surname", 3, 20),
    'sex': {
        ...inBody,
        isIn: {options: [['Male', 'Female']] },
    }
};

export const UserSchema = {
    id: {
        ...inBody,
        ...validId
    },
    ...NewUserSchema
}

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