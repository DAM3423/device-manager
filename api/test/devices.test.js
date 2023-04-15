const request = require("supertest");
const app = require("../index");
const db = require("../db");

// Mock device data for testing
const testDevice = {
  model: "Teszt",
  brand: "Aefewfewn",
  release_date: "2014/07",
  os: "Android 4.2.2 Jelly Beasdfsdsdn",
  is_new: false,
  received_datetime: "2023-04-14T00:00:00.000Z",
};

let testId = "";

describe("Devices API", () => {
  describe("GET /devices", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return an array of devices", async () => {
      const devices = [
        {
          id: "123",
          model: "iPhone",
          brand: "Apple",
          release_date: "2019-09-20",
          os: "iOS",
          is_new: true,
        },
        {
          id: "456",
          model: "Galaxy S10",
          brand: "Samsung",
          release_date: "2019-03-08",
          os: "Android",
          is_new: false,
        },
        {
          id: "789",
          model: "Pixel 4",
          brand: "Google",
          release_date: "2019-10-24",
          os: "Android",
          is_new: true,
        },
      ];
      jest.spyOn(db, "getAllDevices").mockResolvedValue(devices);

      const response = await request(app).get("/devices");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(devices);
    });
  });
  describe("POST /devices", () => {
    beforeEach(() => {
      jest.spyOn(db, "createDevice").mockResolvedValue(testDevice);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("creates a new device successfully", async () => {
      const res = await request(app)
        .post("/devices")
        .send(testDevice)
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(testDevice);
    });

    it("returns an error when missing required fields", async () => {
      const res = await request(app)
        .post("/devices")
        .send({ brand: "Test Brand" })
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"model" is required' });
    });

    it("returns an error when input is in an invalid format", async () => {
      const res = await request(app)
        .post("/devices")
        .send("not a valid device object")
        .set("Accept", "application/json");

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: '"model" is required' });
    });
  });
  describe("GET /devices/:id", () => {
    beforeEach(async () => {
      const res = await request(app)
        .post("/devices")
        .send(testDevice)
        .set("Accept", "application/json");

      testId = res.body.id;
      console.log(testId);
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
      const res = await request(app).get("/devices/unknown-id");

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error", "Device not found");
    });
  });
});
