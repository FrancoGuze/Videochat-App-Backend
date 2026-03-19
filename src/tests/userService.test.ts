import { describe, expect, it } from "vitest";
import { MemoryUserRepository } from "../repositories/memoryUserRepository";
import { UserService } from "../services/userService";

describe("UserService", () => {
  it("stores and retrieves users by userId", () => {
    const repo = new MemoryUserRepository();
    const service = new UserService(repo);

    service.joinRoom("socket-1", "alice");

    const found = service.findUserSocket("alice");
    expect(found).toEqual(["socket-1", "alice"]);
  });

  it("removes users by socket id", () => {
    const repo = new MemoryUserRepository();
    const service = new UserService(repo);

    service.joinRoom("socket-1", "alice");
    service.removeBySocket("socket-1");

    expect(service.findUserSocket("alice")).toBeUndefined();
  });

  it("lists socket ids", () => {
    const repo = new MemoryUserRepository();
    const service = new UserService(repo);

    service.joinRoom("socket-1", "alice");
    service.joinRoom("socket-2", "bob");

    expect(service.listSocketIds().sort()).toEqual(["socket-1", "socket-2"]);
  });
});
