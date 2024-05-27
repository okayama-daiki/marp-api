import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import os from "os";
import path from "path";
import { execa } from "execa";

export async function POST(req: NextRequest) {
  const mdText = await req.text();

  const tmpdir = os.tmpdir();
  fs.writeFileSync(path.join(tmpdir, "new.md"), mdText);

  let message = undefined;
  try {
    await execa(
      "npx",
      [
        "@marp-team/marp-cli",
        "--html",
        "--pptx",
        path.join(tmpdir, "new.md"),
        "-o",
        path.join(tmpdir, "new.pdf"),
      ],
      { timeout: 5000 }
    );
  } catch (error) {
    message = error;
  }

  try {
    const pptxBuffer = fs.readFileSync(path.join(tmpdir, "new.pdf"));
    return new NextResponse(pptxBuffer, {
      status: 201,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error, message: message }),
      {
        status: 501,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}
