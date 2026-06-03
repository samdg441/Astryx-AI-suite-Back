import { describe, it, before } from "node:test";
import assert from "node:assert/strict";

describe("signToken", () => {
  before(() => {
    process.env.JWT_SECRET = "test-secret-min-16-chars";
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    process.env.NODE_ENV = "test";
  });

  it("genera JWT con expiración verificable", async () => {
    const { signToken } = await import("./signToken.js");
    const { verifyAccessToken } = await import("./verifyToken.js");

    const token = signToken(1, "demo@test.com", "pro", "admin");
    const payload = verifyAccessToken(token);

    assert.equal(payload.sub, 1);
    assert.equal(payload.email, "demo@test.com");
    assert.equal(payload.planType, "pro");
    assert.equal(payload.globalRole, "admin");
  });
});
