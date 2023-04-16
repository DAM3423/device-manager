const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getDevices = async (page, itemsPerPage, sortBy, sortDesc, search) => {
  const client = await pool.connect();

  try {
    let queryString = "SELECT * FROM devices";
    let countQueryString = "SELECT COUNT(*) FROM devices";

    const values = [];
    const countValues = [];

    if (search) {
      const searchValue = `%${search}%`;
      queryString += ` WHERE (brand, model, os, release_date)::text ILIKE lower($${
        values.length + 1
      })`;
      countQueryString += ` WHERE (brand, model, os, release_date)::text ILIKE lower($${
        countValues.length + 1
      })`;
      values.push(searchValue);
      countValues.push(searchValue);
    }

    if (
      sortBy &&
      sortDesc &&
      sortBy.length &&
      sortDesc.length &&
      sortBy.length === sortDesc.length
    ) {
      queryString += " ORDER BY";
      for (let i = 0; i < sortBy.length; i++) {
        if (sortBy[i] && sortDesc[i] === true) {
          queryString += ` ${sortBy[i]} DESC`;
        } else if (sortBy[i]) {
          queryString += ` ${sortBy[i]}`;
        }
        if (i !== sortBy.length - 1) {
          queryString += ",";
        }
      }
    }

    if (page && itemsPerPage) {
      const offset = (page - 1) * itemsPerPage;
      queryString += ` LIMIT $${values.length + 1} OFFSET $${
        values.length + 2
      }`;
      values.push(itemsPerPage, offset);
    }

    const [result, countResult] = await Promise.all([
      client.query(queryString, values),
      client.query(countQueryString, countValues),
    ]);

    const count = parseInt(countResult.rows[0].count);

    return {
      rows: result.rows,
      count: count,
    };
  } finally {
    client.release();
  }
};

const getDeviceById = async (id) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM devices WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

const createDevice = async ({
  model,
  brand,
  release_date,
  os,
  is_new,
  received_datetime,
}) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO devices (model, brand, release_date, os, is_new, received_datetime) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [model, brand, release_date, os, is_new, received_datetime]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const updateDevice = async (
  id,
  { model, brand, release_date, os, is_new, received_datetime }
) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE devices SET model = $1, brand = $2, release_date = $3, os = $4, is_new = $5, received_datetime = $6 WHERE id = $7 RETURNING *",
      [model, brand, release_date, os, is_new, received_datetime, id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const deleteDevice = async (id) => {
  const client = await pool.connect();
  try {
    const result = await client.query("DELETE FROM devices WHERE id = $1", [
      id,
    ]);
    return result.rowCount === 1;
  } finally {
    client.release();
  }
};

module.exports = {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
};
