import * as Joi from "@hapi/joi";
import { emailRegExp } from "../regExp";

export function userValidation(data: any) {
  const userSchema = Joi.object({
    email: Joi.string().regex(emailRegExp).required(),
    name: Joi.string().required(),
    password: Joi.string().min(6).required(),
    username: Joi.string()
      .regex(/[a-z\d]/)
      .required(),
  });
  return userSchema.validate(data);
}
