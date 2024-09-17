import request from "supertest";
import * as chai from "chai"; // Import all named exports from chai

const expect = chai.expect;

// Base URL untuk API yang akan diujikan
const baseUrl = "https://kasir-api.zelz.my.id";

describe("POST /login and use token for adding user", () => {
  let accessToken;

  // Test untuk login dan menyimpan token
  it("Login dengan email dan password yang valid", async () => {
    const response = await request(baseUrl).post("/authentications").send({
      email: "switch@yopmail.com",
      password: "switch@123",
    });

    // Verifikasi response dari login
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property(
      "message",
      "Authentication berhasil ditambahkan"
    );
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("status", "success");
    expect(response.body).to.have.property(
      "message",
      "Authentication berhasil ditambahkan"
    );
    expect(response.body).to.have.property("data");

    // Simpan token untuk digunakan di request berikutnya
    accessToken = response.body.data.accessToken;
  });

  // Test untuk menambah user menggunakan token dari login
  it("Menambahkan pengguna baru dengan data yang valid", async () => {
    const addUserResponse = await request(baseUrl)
      .post("/users") // Endpoint untuk menambah user
      .set("Authorization", `Bearer ${accessToken}`) // Set token di header
      .send({
        name: "user43",
        email: "user43@yopmail.com",
        password: "user43",
      });

    // Verifikasi response dari permintaan add user
    expect(addUserResponse.status).to.equal(201);
    expect(addUserResponse.body).to.have.property("status", "success");
    expect(addUserResponse.body).to.have.property(
      "message",
      "User berhasil ditambahkan"
    );
    expect(addUserResponse.body.data).to.have.property("name", "user43"); // Cek ID user yang ditambahkan
  });

  it("Menambahkan pengguna yang sudah ditambahkan", async () => {
    const addUserResponse = await request(baseUrl)
      .post("/users") // Endpoint untuk menambah user
      .set("Authorization", `Bearer ${accessToken}`) // Set token di header
      .send({
        name: "user41",
        email: "user41@yopmail.com",
        password: "user41",
      });

    // Verifikasi response dari permintaan add user
    expect(addUserResponse.status).to.equal(400);
    expect(addUserResponse.body).to.have.property("status", "fail");
    expect(addUserResponse.body).to.have.property(
      "message",
      "Email sudah digunakan"
    );
  });
});
