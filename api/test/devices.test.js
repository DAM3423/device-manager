const request = require("supertest");
const app = require("../index");
const db = require("../db");

// Mock device data for testing
const testDevice = {
  model: "Test Model",
  brand: "Test Brand",
  release_date: "2022-01-01",
  os: "Test OS",
  is_new: true,
  received_datetime: "2022-01-01T00:00:00.000Z",
};

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
});
