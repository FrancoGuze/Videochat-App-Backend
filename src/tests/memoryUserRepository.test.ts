import { describe, expect, it } from "vitest";
import { MemoryUserRepository } from "../repositories/memoryUserRepository";

describe("MemoryUserRepository", () => {
  it("adds a new user", () => {
    const repo = new MemoryUserRepository();
    repo.add("socket-1", "Franco");

    expect(repo.findBySocketId("socket-1")).toBe("Franco");
    expect(repo.findByUserId("Franco")).toEqual(["socket-1", "Franco"]);
  });

  it("finds a user by socketId and userId", () => {
    const repo = new MemoryUserRepository();
    repo.add("socket-1", "Franco");

    expect(repo.findBySocketId("socket-1")).toBe("Franco");
    expect(repo.findByUserId("Franco")).toEqual(["socket-1", "Franco"]);
  });

  it("List of connected SocketIds", () => {
    const repo = new MemoryUserRepository()
    repo.add("socket-1", "Franco")
    repo.add("socket-2", "Pedro")
    repo.add("socket-3", "Miguel")
    expect(repo.listSocketIds()).toStrictEqual(["socket-1", "socket-2", "socket-3"])
  })
});
