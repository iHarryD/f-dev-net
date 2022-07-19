import * as Joi from "@hapi/joi";

export function postValidation(data: any) {
  const postSchema = Joi.object({
    caption: Joi.string().required(),
    category: Joi.string().valid("general", "query").required(),
    media: Joi.string().allow(""),
  });
  return postSchema.validate(data);
}
