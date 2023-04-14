const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getAllDevices = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM devices");
    return result.rows;
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

const createDevice = async ({ id, model, brand, release_date, os, is_new }) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO devices (model, brand, release_date, os, is_new) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [model, brand, release_date, os, is_new]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const updateDevice = async (id, { model, brand, release_date, os, is_new }) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE devices SET model = $1, brand = $2, release_date = $3, os = $4, is_new = $5 WHERE id = $6 RETURNING *",
      [model, brand, release_date, os, is_new, id]
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
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
};
