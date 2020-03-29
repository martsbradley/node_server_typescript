import express from 'express';
import Database  from './database';
//import { Location,checkSchema, validationResult } from 'express-validator';
//import { Location,checkSchema, validationResult } from 'express-validator';

import {checkValidationResults, UserSchema} from './validation';
import { validationResult } from 'express-validator';
import { AssertionError } from 'assert';

export default class Routes {

    db: Database;

    constructor(dab: Database) {
        this.db = dab;
    }


}