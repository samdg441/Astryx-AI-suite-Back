import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildPaginationMeta } from "./pagination";

describe("buildPaginationMeta", () => {
  it("calcula totalPages con datos", () => {
    const meta = buildPaginationMeta(2, 10, 25);
    assert.deepEqual(meta, { page: 2, limit: 10, total: 25, totalPages: 3 });
  });

  it("totalPages es 0 sin registros", () => {
    const meta = buildPaginationMeta(1, 10, 0);
    assert.equal(meta.totalPages, 0);
  });
});
