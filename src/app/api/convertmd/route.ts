import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import os from "os";
import path from "path";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const mdText = data.mdText;

  const tmpdir = os.tmpdir();
  fs.writeFileSync(path.join(tmpdir, "new.md"), mdText);

  const mdBuffer = fs.readFileSync(path.join(tmpdir, "new.md"));
  return new NextResponse(mdBuffer, {
    status: 201,
    headers: {
      "Content-Type": "text/markdown",
    },
  });
}
