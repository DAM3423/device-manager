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
  describe("GET /devices/index", () => {
    it("should return 200", async () => {
      const response = await request(app)
        .post("/devices/index")
        .send({
          page: 1,
          itemsPerPage: 10,
          sortBy: ["brand"],
          sortDesc: ["true"],
          search: "Teszt",
        })
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
    });
  });
  describe("POST /devices/create", () => {
    it("creates a new device successfully", async () => {
      const res = await request(app)
        .post("/devices/create")
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
        .post("/devices/create")
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
        .post("/devices/create")
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
        .post("/devices/create")
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
        .post("/devices/create")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"brand" must be a string' });

      testDevice.brand = brandForAfter;
    });
    it("returns successful when release_date key missing from device object", async () => {
      // Moving the release_date name to a local var so we can reset it after the test
      const releaseDateForAfter = testDevice.release_date;
      delete testDevice.release_date;

      const res = await request(app)
        .post("/devices/create")
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
        .post("/devices/create")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"release_date" must be a string' });

      testDevice.release_date = releaseDateForAfter;
    });
    it("returns successful when os key missing from device object", async () => {
      // Moving the os name to a local var so we can reset it after the test
      const osForAfter = testDevice.os;
      delete testDevice.os;

      const res = await request(app)
        .post("/devices/create")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("model", testDevice.model);
      expect(res.body).toHaveProperty("brand", testDevice.brand);
      expect(res.body).toHaveProperty("release_date", testDevice.release_date);
      expect(res.body).toHaveProperty("os", null);
      expect(res.body).toHaveProperty("is_new", testDevice.is_new);
      expect(res.body).toHaveProperty(
        "received_datetime",
        testDevice.received_datetime
      );

      testDevice.os = osForAfter;
    });
    it("returns os should be string when os field is int", async () => {
      // Moving the os name to a local var so we can reset it after the test
      const osForAfter = testDevice.os;
      testDevice.os = 1;

      const res = await request(app)
        .post("/devices/create")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"os" must be a string' });

      testDevice.os = osForAfter;
    });
    it("returns successful when is_new key missing from device object", async () => {
      // Moving the is_new name to a local var so we can reset it after the test
      const isNewForAfter = testDevice.is_new;
      delete testDevice.is_new;

      const res = await request(app)
        .post("/devices/create")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("model", testDevice.model);
      expect(res.body).toHaveProperty("brand", testDevice.brand);
      expect(res.body).toHaveProperty("release_date", testDevice.release_date);
      expect(res.body).toHaveProperty("os", testDevice.os);
      expect(res.body).toHaveProperty("is_new", null);
      expect(res.body).toHaveProperty(
        "received_datetime",
        testDevice.received_datetime
      );

      testDevice.is_new = isNewForAfter;
    });
    it("returns is_new should be string when is_new field is string", async () => {
      // Moving the is_new name to a local var so we can reset it after the test
      const isNewForAfter = testDevice.is_new;
      testDevice.is_new = "this should not be a string";

      const res = await request(app)
        .post("/devices/create")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"is_new" must be a boolean' });

      testDevice.is_new = isNewForAfter;
    });
    it("returns successful when received_datetime key missing from device object", async () => {
      // Moving the received_datetime name to a local var so we can reset it after the test
      const receivedDateTimeForAfter = testDevice.received_datetime;
      delete testDevice.received_datetime;

      const res = await request(app)
        .post("/devices/create")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("model", testDevice.model);
      expect(res.body).toHaveProperty("brand", testDevice.brand);
      expect(res.body).toHaveProperty("release_date", testDevice.release_date);
      expect(res.body).toHaveProperty("os", testDevice.os);
      expect(res.body).toHaveProperty("is_new", testDevice.is_new);
      expect(res.body).toHaveProperty("received_datetime", null);

      testDevice.received_datetime = receivedDateTimeForAfter;
    });
    it("returns received_datetime should be string when received_datetime field is string", async () => {
      // Moving the received_datetime name to a local var so we can reset it after the test
      const receivedDateTimeForAfter = testDevice.received_datetime;
      testDevice.received_datetime = "this should not be a string";

      const res = await request(app)
        .post("/devices/create")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({
        error: '"received_datetime" must be a valid date',
      });

      testDevice.received_datetime = receivedDateTimeForAfter;
    });
  });
  describe("GET /devices/show/:id", () => {
    beforeEach(async () => {
      const res = await request(app)
        .post("/devices/create")
        .send(testDevice)
        .set("Accept", "application/json");

      testId = res.body.id;
    });

    it("should return a device by ID", async () => {
      const res = await request(app).get(`/devices/show/${testId}`);

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
        "/devices/show/4c9d86d5-004d-44d1-8019-6fd38047bd6f"
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("message", "Device not found");
    });

    it("should return 400 if route parameter for the ID is in the incorrect format", async () => {
      const res = await request(app).get("/devices/show/notauuid");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Invalid UUID format");
    });
  });
  describe("PUT /devices/update/:id", () => {
    beforeEach(async () => {
      const res = await request(app)
        .post("/devices/create")
        .send(testDevice)
        .set("Accept", "application/json");

      testId = res.body.id;
    });

    // Update the model name for submission
    testDevice.model = "updated phone model name";

    it("updates a model successfully", async () => {
      const res = await request(app)
        .put(`/devices/update/${testId}`)
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
    it("returns model required when model key missing from device object", async () => {
      // Moving the model name to a local var so we can reset it after the test
      const modelForAfter = testDevice.model;
      delete testDevice.model;

      const res = await request(app)
        .put(`/devices/update/${testId}`)
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
        .put(`/devices/update/${testId}`)
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
        .put(`/devices/update/${testId}`)
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
        .put(`/devices/update/${testId}`)
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"brand" must be a string' });

      testDevice.brand = brandForAfter;
    });
    it("returns successful when release_date key missing from device object", async () => {
      // Moving the release_date name to a local var so we can reset it after the test
      const releaseDateForAfter = testDevice.release_date;
      delete testDevice.release_date;

      const res = await request(app)
        .put(`/devices/update/${testId}`)
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(200);
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
        .put(`/devices/update/${testId}`)
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"release_date" must be a string' });

      testDevice.release_date = releaseDateForAfter;
    });
    it("returns successful when os key missing from device object", async () => {
      // Moving the os name to a local var so we can reset it after the test
      const osForAfter = testDevice.os;
      delete testDevice.os;

      const res = await request(app)
        .put(`/devices/update/${testId}`)
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("model", testDevice.model);
      expect(res.body).toHaveProperty("brand", testDevice.brand);
      expect(res.body).toHaveProperty("release_date", testDevice.release_date);
      expect(res.body).toHaveProperty("os", null);
      expect(res.body).toHaveProperty("is_new", testDevice.is_new);
      expect(res.body).toHaveProperty(
        "received_datetime",
        testDevice.received_datetime
      );

      testDevice.os = osForAfter;
    });
    it("returns os should be string when os field is int", async () => {
      // Moving the os name to a local var so we can reset it after the test
      const osForAfter = testDevice.os;
      testDevice.os = 1;

      const res = await request(app)
        .put(`/devices/update/${testId}`)
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"os" must be a string' });

      testDevice.os = osForAfter;
    });
    it("returns successful when is_new key missing from device object", async () => {
      // Moving the is_new name to a local var so we can reset it after the test
      const isNewForAfter = testDevice.is_new;
      delete testDevice.is_new;

      const res = await request(app)
        .put(`/devices/update/${testId}`)
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("model", testDevice.model);
      expect(res.body).toHaveProperty("brand", testDevice.brand);
      expect(res.body).toHaveProperty("release_date", testDevice.release_date);
      expect(res.body).toHaveProperty("os", testDevice.os);
      expect(res.body).toHaveProperty("is_new", null);
      expect(res.body).toHaveProperty(
        "received_datetime",
        testDevice.received_datetime
      );

      testDevice.is_new = isNewForAfter;
    });
    it("returns is_new should be string when is_new field is string", async () => {
      // Moving the is_new name to a local var so we can reset it after the test
      const isNewForAfter = testDevice.is_new;
      testDevice.is_new = "this should not be a string";

      const res = await request(app)
        .put(`/devices/update/${testId}`)
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"is_new" must be a boolean' });

      testDevice.is_new = isNewForAfter;
    });
    it("returns successful when received_datetime key missing from device object", async () => {
      // Moving the received_datetime name to a local var so we can reset it after the test
      const receivedDateTimeForAfter = testDevice.received_datetime;
      delete testDevice.received_datetime;

      const res = await request(app)
        .put(`/devices/update/${testId}`)
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("model", testDevice.model);
      expect(res.body).toHaveProperty("brand", testDevice.brand);
      expect(res.body).toHaveProperty("release_date", testDevice.release_date);
      expect(res.body).toHaveProperty("os", testDevice.os);
      expect(res.body).toHaveProperty("is_new", testDevice.is_new);
      expect(res.body).toHaveProperty("received_datetime", null);

      testDevice.received_datetime = receivedDateTimeForAfter;
    });
    it("returns received_datetime should be string when received_datetime field is string", async () => {
      // Moving the received_datetime name to a local var so we can reset it after the test
      const receivedDateTimeForAfter = testDevice.received_datetime;
      testDevice.received_datetime = "this should not be a string";

      const res = await request(app)
        .put(`/devices/update/${testId}`)
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({
        error: '"received_datetime" must be a valid date',
      });

      testDevice.received_datetime = receivedDateTimeForAfter;
    });
  });
  describe("DELETE /devices/delete/:id", () => {
    beforeEach(async () => {
      const res = await request(app)
        .post("/devices/create")
        .send(testDevice)
        .set("Accept", "application/json");

      testId = res.body.id;
    });

    it("should delete a device by ID", async () => {
      const res = await request(app).delete(`/devices/delete/${testId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Device deleted successfully");
    });

    it("should return 404 if device is not found", async () => {
      const res = await request(app).delete(
        "/devices/delete/4c9d86d5-004d-44d1-8019-6fd38047bd6f"
      );

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("message", "Device not found");
    });

    it("should return 400 if route parameter for the ID is in the incorrect format", async () => {
      const res = await request(app).delete("/devices/delete/notauuid");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error", "Invalid UUID format");
    });
  });
});
