import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import os from "os";
import path from "path";

export async function POST(req: NextRequest) {
  const mdText = await req.text();

  let message = "";

  const tmpdir = os.tmpdir();
  try {
    fs.writeFileSync(path.join(tmpdir, "new.md"), mdText);
  } catch (error) {
    message += error + "\n";
  }

  try {
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
  } catch (error) {
    message += error;
    return new NextResponse(JSON.stringify({ message: message }), {
      status: 501,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
}
