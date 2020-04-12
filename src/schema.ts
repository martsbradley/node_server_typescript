import { Location } from 'express-validator';

export const nameCharacters = "'.ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";


export const nameValid = (part: string, minLen: number, maxLen: number): object => {
    return {
        in: 'body' as Location,
        isAlpha: { 
            errorMessage: 'Please enter alphabetic names',
        },
        isLength: {
            errorMessage: `Please enter between ${minLen} and ${maxLen} characters`,
            options: { min: minLen,
                    max: maxLen }
        },
        trim: {
        options: " "
        }
    };
}

export const validId = { 
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

export const inBody = {
    in: 'body' as Location
}

export const NewUserSchema = {

    'forename': nameValid("forname", 1, 20),
    'surname':  nameValid("surname", 1, 50),
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