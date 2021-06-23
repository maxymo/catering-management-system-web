const mongoose = require("mongoose");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const sinon = require("sinon");

const expect = chai.expect;
chai.use(chaiAsPromised);

const unitController = require("../../../controllers/unit");
var unitModel = require("../../../models/unit");

let mongoServer;
const opts = { useUnifiedTopology: true, useNewUrlParser: true };
describe("Unit Controller", () => {
  before(async () => {
    console.log("running before function");
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, opts);
    console.log("before function complete");
  });

  after(async () => {
    console.log("stopping mongoServer");
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should return list of units", function (done) {
    // Arrange
    const req = {
      query: {
        pageSize: 10,
        currentPage: 1,
      },
    };
    const res = {
      statusCode: 0,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      setHeader: function () {},
      count: 0,
      data: [],
      message: "",
      json: function (data) {
        console.log(data);
        this.message = data.message;
        this.data = data.data;
        this.count = data.count;
        return this;
      },
    };
    unitModel.create(unitsSample, function (err, data) {
      unitController
        .getUnits(req, res, () => {})
        .then(function (result) {
          // Assert
          expect(res.statusCode).to.be.equal(200);
          expect(res.count).to.be.equal(4);
          unitModel.deleteMany({}).then((_) => {
            done();
          });
        });
    });
  });

  it("should return error 500 if database fails when getting list of units", function () {
    const req = {
      query: {
        pageSize: 10,
        currentPage: 1,
      },
    };
    const res = {
      statusCode: 0,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.message = data.message;
        this.data = data.data;
        this.count = data.count;
        return this;
      },
    };
    sinon.stub(unitModel, "find").returns({
      skip: function () {},
      limit: function () {},
      then: function () {
        return Error("Simulated database error");
      },
    });

    unitController.getUnits(req, res, () => {});

    expect(res.statusCode).to.be.equal(500);

    unitModel.find.restore();
  });

  it("should return error 500 if exception is thrown when getting list of units", function () {
    const req = {
      query: {
        pageSize: 10,
        currentPage: 1,
      },
    };
    const res = {
      statusCode: 0,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.message = data.message;
        this.data = data.data;
        this.count = data.count;
        return this;
      },
    };
    sinon.stub(unitModel, "find").throws("Simulated exception");

    unitController.getUnits(req, res, () => {});

    expect(res.statusCode).to.be.equal(500);

    unitModel.find.restore();
  });

  it("should return error 400 is data is invalid when creating unit", function () {
    const req = {
      body: {
        wrongname: "unit1",
      },
    };
    const res = {
      statusCode: 0,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.message = data.message;
        this.data = data.data;
        this.count = data.count;
        return this;
      },
    };

    unitController.createUnit(req, res, () => {});

    expect(res.statusCode).to.be.equal(400);
  });

  // it("should return error 500 if database fails when creating unit", async function () {
  //   const req = {
  //     body: {
  //       name: "unit1",
  //       description: "desc",
  //       type: "type1",
  //     },
  //   };
  //   const res = {
  //     statusCode: 0,
  //     id: "",
  //     message: "",
  //     status: function (code) {
  //       this.statusCode = code;
  //       return this;
  //     },
  //     json: function (data) {
  //       console.log(data);
  //       this.message = data.message;
  //       this.id = data.id;
  //       return this;
  //     },
  //   };

  //   await mongoose.disconnect();
  //   await mongoServer.stop();
  //   var result = unitController.createUnit(req, res, () => {});
  //   const mongoUri = await mongoServer.getUri();
  //   await mongoose.connect(mongoUri, opts);

  //   return expect(result).to.be.rejected;
  // });
});

const unitsSample = [
  new unitModel({
    name: "mm",
    readonly: true,
    description: "Milimeter",
    type: "Length",
    __v: 0,
  }),
  new unitModel({
    name: "cm",
    readonly: true,
    description: "Centimeter",
    type: "Length",
    __v: 0,
  }),
  new unitModel({
    name: "m",
    readonly: true,
    description: "Meter",
    type: "Length",
    __v: 0,
  }),
  new unitModel({
    name: "in",
    readonly: true,
    description: "Inch",
    type: "Length",
    __v: 0,
  }),
];
