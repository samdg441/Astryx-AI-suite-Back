import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { canAccessPlan, planRank } from "./planAccess";

describe("planAccess", () => {
  it("planRank ordena tiers correctamente", () => {
    assert.equal(planRank("free"), planRank("sin_plan"));
    assert.ok(planRank("pro") > planRank("basico"));
    assert.ok(planRank("empresarial") > planRank("pro"));
  });

  it("canAccessPlan respeta plan mínimo", () => {
    assert.equal(canAccessPlan("free", "free"), true);
    assert.equal(canAccessPlan("free", "pro"), false);
    assert.equal(canAccessPlan("pro", "basico"), true);
    assert.equal(canAccessPlan(null, "free"), true);
  });
});
