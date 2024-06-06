import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import os from "os";
import path from "path";
import { execa } from "execa";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const theme = data.theme;
  let mdText: string;

  mdText = data.mdText;

  const tmpdir = os.tmpdir();
  try {
    fs.writeFileSync(path.join(tmpdir, "new.md"), mdText);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error }), {
      status: 501,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    await execa(
      "npx",
      [
        "@marp-team/marp-cli",
        "--theme",
        path.join("public", "css", `dakken_${theme}_theme.css`),
        "--html",
        "--pdf",
        path.join(tmpdir, "new.md"),
        "-o",
        path.join(tmpdir, "new.pdf"),
      ],
      { timeout: 1000 }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error }), {
      status: 502,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const pdfBuffer = fs.readFileSync(path.join(tmpdir, "new.pdf"));
    return new NextResponse(pdfBuffer, {
      status: 201,
      headers: {
        "Content-Type": "application/pdf",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error }), {
      status: 503,
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
