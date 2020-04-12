import express from 'express';
import { validationResult } from 'express-validator';

type data = { text: string; id: number };

interface MyType {
    [x: string]: string;
}
export default class Validation {

    // This maps from the express-validator results into
    // something that is easier the nunjucks template to consume 
    private errorMapper(keys: string[], 
                        errorList: {param: string; msg: string}[]): MyType {
        const result: MyType = {};

        errorList.map(e => {
            if (keys.indexOf(e.param) != -1) {
            result[e.param] =  e.msg;
            }
        });
        return result;
    }

    checkValidationResults(req: express.Request): void {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Validation issues!!!");

            console.log(errors);

            const keys = Object.keys(req.body);

            const userErrors = this.errorMapper(keys, errors.array());

            console.log(userErrors);
            throw userErrors;
        }
    }
}