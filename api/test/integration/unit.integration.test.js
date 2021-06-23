const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");

const unitModel = require("../../../models/unit");
const { expect } = require("chai");

// Configure chai
chai.use(chaiHttp);
chai.should();

let app;

describe("Integration Teests - Units", () => {
  describe("GET /", () => {
    before((done) => {
      process.env.MONGO_ATLAS_CONNECTION_STRING =
        "mongodb+srv://nodeuser:Test1234@cluster0-hmpes.mongodb.net/catering-integration-tests?w=majority";
      process.env.PORT = 3001;
      app = require("../../../server");
      app.on("databaseReady", function () {
        console.log("databaseReady mitted");
        done();
      });
    });

    it("should get all units", (done) => {
      console.log("start of should get all units");
      console.log(unitModel.systemUnits().length);
      const totalUnitsExpected = unitModel.systemUnits().length;

      chai
        .request(app)
        .get("/api/units")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(res.body).to.have.property("data");
          expect(res.body).to.have.property("count");
          expect(res.body.count).to.be.equal(totalUnitsExpected);
          done();
        });
    });

    // it("should get 4 first units", (done) => {
    //   const totalUnitsExpected = unitModel.systemUnits(unitModel).length;

    //   chai
    //   .request(app)
    //   .get("/api/units")
    //   .end((err, res) => {
    //     res.should.have.status(200);
    //     res.body.should.be.a("object");
    //     console.log(res);
    //     done();
    //   });
    // });

    after(async () => {
      await cleanDatabase();
      require("../../../server").stop();
    });
  });
});

async function cleanDatabase() {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.drop();
  }
}
