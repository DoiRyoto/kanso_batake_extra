/**
 * @jest-environment node
 */

import { GET } from "./route";
import { NextRequest } from "next/server";

describe("GET /api/users", () => {
  it("test test", async () => {
    const req = new NextRequest("http://localhost/api/users");
    const res = await GET(req);
    const data = await res.json();
    expect(data).toHaveLength(4);
  });
});
