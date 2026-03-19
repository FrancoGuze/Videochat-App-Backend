import request from "supertest";
import { describe, expect, it } from "vitest";
import { app, userService } from "../app";

describe("User routes", () => {
  it("returns 200 when username is available", async () => {
    const res = await request(app).get("/userExists/new-user");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      exists: false,
      message: "This user name can be used!",
    });
  });

  it("returns 409 when username already exists", async () => {
    userService.joinRoom("socket-1", "taken-user");

    const res = await request(app).get("/userExists/taken-user");
    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      exists: true,
      message: "This user name cannot be used...",
    });
  });

  it("returns pong for /ping", async () => {
    const res = await request(app).get("/ping");
    expect(res.status).toBe(200);
    expect(res.text).toBe("pong");
  });
});
