import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import os from "os";
import path from "path";
import { execa } from "execa";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const mdText = data.mdText;

  let message = "";

  const tmpdir = os.tmpdir();
  try {
    fs.writeFileSync(path.join(tmpdir, "new.md"), mdText);
  } catch (error) {
    message += error + "\n";
  }

  try {
    await execa(
      "npx",
      [
        "@marp-team/marp-cli",
        "--html",
        "--pdf",
        path.join(tmpdir, "new.md"),
        "-o",
        path.join(tmpdir, "new.pdf"),
      ],
      { timeout: 5000 }
    );
  } catch (error) {
    message += error;
  }

  try {
    // const mdBuffer = fs.readFileSync(path.join(tmpdir, "new.md"));
    // return new NextResponse(mdBuffer, {
    //   status: 201,
    //   headers: {
    // "Content-Type": "text/markdown",
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    // "Access-Control-Allow-Headers": "Content-Type, Authorization",
    //   },
    // });
    const ls = await execa`ls`;
    const lspar = await execa`ls ../`;
    return new NextResponse(JSON.stringify({ ls: ls, lspar: lspar }), {
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

export async function OPTIONS() {
  return new NextResponse(
    JSON.stringify({ message: "preflight request is accepted" }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      status: 201,
    }
  );
}
