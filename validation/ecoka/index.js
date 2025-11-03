function validate(data, schema, reply) {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
    });
    if (error) throw error;
    return value;
  } catch (error) {
    const message = error.details
      .map((item) => item.message)
      .join(', ');
    reply.status(400).send({
      message: message,
    });
    return false;
  }
}

module.exports = {
  validate,
  ProductSchema: require('./product'),
};
