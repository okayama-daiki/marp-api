import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import os from "os";
import path from "path";

export async function POST(req: NextRequest) {
  const mdText = await req.text();

  const tmpdir = os.tmpdir();
  fs.writeFileSync(path.join(tmpdir, "new.md"), mdText);

  const mdBuffer = fs.readFileSync(path.join(tmpdir, "new.md"));
  return new NextResponse(mdBuffer, {
    status: 201,
    headers: {
      "Content-Type": "text/markdown",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
