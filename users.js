import request from "supertest";
import * as chai from "chai";

const expect = chai.expect;

const baseUrl = "https://kasir-api.zelz.my.id";

describe("Test Suite Users", () => {
  let accessToken;
  it("Sukses login dengan email dan password yang valid", async () => {
    const response = await request(baseUrl).post("/authentications").send({
      email: "switch@yopmail.com",
      password: "switch@123",
    });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("status", "success");
    expect(response.body).to.have.property(
      "message",
      "Authentication berhasil ditambahkan"
    );
    expect(response.body).to.have.property("data");

    accessToken = response.body.data.accessToken;
  });

  it("Sukses menambahkan user baru", async () => {
    const addUserResponse = await request(baseUrl)
      .post("/users")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "user53",
        email: "user53@yopmail.com",
        password: "user53",
      });

    expect(addUserResponse.status).to.equal(201);
    expect(addUserResponse.body).to.have.property("status", "success");
    expect(addUserResponse.body).to.have.property(
      "message",
      "User berhasil ditambahkan"
    );
    expect(addUserResponse.body.data).to.have.property("name", "user53");
  });

  it("Gagal menambahkan user yang sudah ditambahkan", async () => {
    const addUserResponse = await request(baseUrl)
      .post("/users")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "user49",
        email: "user49@yopmail.com",
        password: "user49",
      });

    expect(addUserResponse.status).to.equal(400);
    expect(addUserResponse.body).to.have.property("status", "fail");
    expect(addUserResponse.body).to.have.property(
      "message",
      "Email sudah digunakan"
    );
  });

  it("Sukses menampilkan semua data user", async () => {
    const getUsersResponse = await request(baseUrl)
      .get("/users")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(getUsersResponse.status).to.equal(200);
    expect(getUsersResponse.body).to.have.property("status", "success");
    expect(getUsersResponse.body.data.meta).to.have.property("total", "26");
  });

  it("Sukses menampilkan detail user", async () => {
    const userId = "15e3663c-02f3-4ebd-953f-a408c74d12da";
    const getUsersResponse = await request(baseUrl)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(getUsersResponse.status).to.equal(200);
    expect(getUsersResponse.body).to.have.property("status", "success");
    expect(getUsersResponse.body).to.have.property("data");
    expect(getUsersResponse.body.data.user).to.have.property("name", "user28");
  });

  it("Sukses menghapus user", async () => {
    const userId = "0e06bf77-8b9f-4c19-bdf5-2a6ec73079f8";
    const getUsersResponse = await request(baseUrl)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(getUsersResponse.status).to.equal(200);
    expect(getUsersResponse.body).to.have.property("status", "success");
    expect(getUsersResponse.body).to.have.property(
      "message",
      "User berhasil dihapus"
    );
  });
  it("Sukses mengupdate user", async () => {
    const userId = "7be3f795-a425-42fe-88b2-a66cb2aa4a8c";
    const getUsersResponse = await request(baseUrl)
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "user edited",
        email: "user01@yopmail.com",
      });

    expect(getUsersResponse.status).to.equal(200);
    expect(getUsersResponse.body).to.have.property("status", "success");
    expect(getUsersResponse.body).to.have.property(
      "message",
      "User berhasil diupdate"
    );
    expect(getUsersResponse.body.data).to.have.property("name", "user edited");
  });
});
