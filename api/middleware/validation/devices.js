const Joi = require("joi");

const device = Joi.object({
  model: Joi.string().required(),
  brand: Joi.string().required(),
  release_date: Joi.date().allow(null),
  os: Joi.string().allow(null),
  is_new: Joi.boolean().allow(null),
  received_datetime: Joi.date().allow(null),
});

const uuid = Joi.string().uuid();

const pagination = Joi.object({
  page: Joi.number().integer().min(1).allow(null),
  itemsPerPage: Joi.number().integer().min(1).allow(null),
  sortBy: Joi.array().allow(null),
  sortDesc: Joi.array().allow(null),
  search: Joi.string().allow(null, ""),
});

const validateDevice = (req, res, next) => {
  const { error } = device.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const validateUUID = (req, res, next) => {
  // Validate the UUID in the route param
  const { error } = uuid.validate(req.params.id);
  if (error) {
    // Return a 400 Bad Request error if the UUID is invalid
    return res.status(400).json({ error: "Invalid UUID format" });
  }

  next();
};

const validatePagination = (req, res, next) => {
  const { error } = pagination.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = {
  validateDevice,
  validateUUID,
  validatePagination,
};
