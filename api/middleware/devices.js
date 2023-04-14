const Joi = require("joi");

const device = Joi.object({
  model: Joi.string().required(),
  brand: Joi.string().required(),
  release_date: Joi.string().allow(null),
  os: Joi.string().allow(null),
  is_new: Joi.boolean().allow(null),
  received_datetime: Joi.date().allow(null),
});

const validateDevice = (req, res, next) => {
  const { error } = device.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = {
  validateDevice,
};
