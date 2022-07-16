import * as Joi from "@hapi/joi";

export function postValidation(data: any) {
  const postSchema = Joi.object({
    caption: Joi.string().required(),
    media: Joi.array().required().max(3),
  });
  return postSchema.validate(data);
}