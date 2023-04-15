const request = require("supertest");
const app = require("../index");

// Device for testing
const testDevice = {
  model: "Teszt",
  brand: "Aefewfewn",
  release_date: "2014/07",
  os: "Android 4.2.2 Jelly Beasdfsdsdn",
  is_new: false,
  received_datetime: "2023-04-14T00:00:00.000Z",
};

// Test UUID which will be used for get, update and delete tests
let testId = "";

describe("Devices API", () => {
  describe("GET /devices", () => {
    beforeEach(async () => {
      // Create a new device in the database, this way we know there is at least 1 device here
      await request(app)
        .post("/devices")
        .send(testDevice)
        .set("Accept", "application/json");
    });

    it("should return an array of devices", async () => {
      const response = await request(app).get("/devices");

      expect(response.status).toEqual(200);
      // There should be at least 1 entry ion the return array
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
  describe("POST /devices", () => {
    it("creates a new device successfully", async () => {
      const res = await request(app)
        .post("/devices")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("model", testDevice.model);
      expect(res.body).toHaveProperty("brand", testDevice.brand);
      expect(res.body).toHaveProperty("release_date", testDevice.release_date);
      expect(res.body).toHaveProperty("os", testDevice.os);
      expect(res.body).toHaveProperty("is_new", testDevice.is_new);
      expect(res.body).toHaveProperty(
        "received_datetime",
        testDevice.received_datetime
      );
    });

    it("returns model required when model key missing from device object", async () => {
      // Moving the model name to a local var so we can reset it after the test
      const modelForAfter = testDevice.model;
      delete testDevice.model;

      const res = await request(app)
        .post("/devices")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"model" is required' });

      testDevice.model = modelForAfter;
    });
    it("returns model should be string when model field is null", async () => {
      // Moving the model name to a local var so we can reset it after the test
      const modelForAfter = testDevice.model;
      testDevice.model = null;

      const res = await request(app)
        .post("/devices")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"model" must be a string' });

      testDevice.model = modelForAfter;
    });
    it("returns brand required when brand key missing from device object", async () => {
      // Moving the brand name to a local var so we can reset it after the test
      const brandForAfter = testDevice.brand;
      delete testDevice.brand;

      const res = await request(app)
        .post("/devices")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"brand" is required' });

      testDevice.brand = brandForAfter;
    });
    it("returns brand should be string when brand field is null", async () => {
      // Moving the brand name to a local var so we can reset it after the test
      const brandForAfter = testDevice.brand;
      testDevice.brand = null;

      const res = await request(app)
        .post("/devices")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"brand" must be a string' });

      testDevice.brand = brandForAfter;
    });
    it("returns release_date required when release_date key missing from device object", async () => {
      // Moving the release_date name to a local var so we can reset it after the test
      const releaseDateForAfter = testDevice.release_date;
      delete testDevice.release_date;

      const res = await request(app)
        .post("/devices")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("model", testDevice.model);
      expect(res.body).toHaveProperty("brand", testDevice.brand);
      expect(res.body).toHaveProperty("release_date", null);
      expect(res.body).toHaveProperty("os", testDevice.os);
      expect(res.body).toHaveProperty("is_new", testDevice.is_new);
      expect(res.body).toHaveProperty(
        "received_datetime",
        testDevice.received_datetime
      );

      testDevice.release_date = releaseDateForAfter;
    });
    it("returns release_date should be string when release_date field is int", async () => {
      // Moving the release_date name to a local var so we can reset it after the test
      const releaseDateForAfter = testDevice.release_date;
      testDevice.release_date = 1;

      const res = await request(app)
        .post("/devices")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"release_date" must be a string' });

      testDevice.release_date = releaseDateForAfter;
    });
  });
  describe("GET /devices/:id", () => {
    beforeEach(async () => {
      const res = await request(app)
        .post("/devices")
        .send(testDevice)
        .set("Accept", "application/json");

      testId = res.body.id;
    });

    it("should return a device by ID", async () => {
      const res = await request(app).get(`/devices/${testId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("model", testDevice.model);
      expect(res.body).toHaveProperty("brand", testDevice.brand);
      expect(res.body).toHaveProperty("release_date", testDevice.release_date);
      expect(res.body).toHaveProperty("os", testDevice.os);
      expect(res.body).toHaveProperty("is_new", testDevice.is_new);
      expect(res.body).toHaveProperty(
        "received_datetime",
        testDevice.received_datetime
      );
    });

    it("should return 404 if device is not found", async () => {
      const res = await request(app).get(
        "/devices/4c9d86d5-004d-44d1-8019-6fd38047bd6f"
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("message", "Device not found");
    });

    it("should return 400 if route parameter for the ID is in the incorrect format", async () => {
      const res = await request(app).get("/devices/notauuid");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Invalid UUID format");
    });
  });
  describe("PUT /devices/:id", () => {
    beforeEach(async () => {
      const res = await request(app)
        .post("/devices")
        .send(testDevice)
        .set("Accept", "application/json");

      testId = res.body.id;
    });

    // Update the model name for submission
    testDevice.model = "updated phone model name";

    it("updates a model successfully", async () => {
      const res = await request(app)
        .put(`/devices/${testId}`)
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("model", testDevice.model);
      expect(res.body).toHaveProperty("brand", testDevice.brand);
      expect(res.body).toHaveProperty("release_date", testDevice.release_date);
      expect(res.body).toHaveProperty("os", testDevice.os);
      expect(res.body).toHaveProperty("is_new", testDevice.is_new);
      expect(res.body).toHaveProperty(
        "received_datetime",
        testDevice.received_datetime
      );
    });
  });
  describe("DELETE /devices/:id", () => {
    beforeEach(async () => {
      const res = await request(app)
        .post("/devices")
        .send(testDevice)
        .set("Accept", "application/json");

      testId = res.body.id;
    });

    it("should delete a device by ID", async () => {
      const res = await request(app).delete(`/devices/${testId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Device deleted successfully");
    });

    it("should return 404 if device is not found", async () => {
      const res = await request(app).delete(
        "/devices/4c9d86d5-004d-44d1-8019-6fd38047bd6f"
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("message", "Device not found");
    });

    it("should return 400 if route parameter for the ID is in the incorrect format", async () => {
      const res = await request(app).delete("/devices/notauuid");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Invalid UUID format");
    });
  });
});
