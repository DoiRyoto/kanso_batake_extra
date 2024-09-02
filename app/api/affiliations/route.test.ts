/**
 * @jest-environment node
 */

import { prisma } from "@/lib/prisma/prisma-client";
import { GET } from "./route";
import { NextRequest } from "next/server";

describe("GET /api/affiliations", () => {
  it("test test", async () => {
    const req = new NextRequest("http://localhost/api/affiliations");
    const res = await GET(req);
    const data = await res.json();
    expect(data).toHaveLength(2);
  });
});
