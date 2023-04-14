const request = require("supertest");
const app = require("../index");
const db = require("../db");

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
});
