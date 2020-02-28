import Joi from 'joi';
 
export const login = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
};

export const userValidation = {
  body: {
    forename: Joi.string().required(),
    surname: Joi.string().required(),
    sex: Joi.string().required()
  }
};

export const idParam = {
  params: {
      id: Joi.number()
             .integer()
             .min(1)
             .max(1000)
             .required(),
  }
};
