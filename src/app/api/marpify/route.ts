import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import os from "os";
import path from "path";
import { execa } from "execa";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const mdText = data.mdText;

  const tmpdir = os.tmpdir();
  // const tmpdir = path.join(process.cwd(), "tmp");
  fs.writeFileSync(path.join(tmpdir, "new.md"), mdText);

  let message = undefined;
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
    message = error;
  }

  try {
    const pdfBuffer = fs.readFileSync(path.join(tmpdir, "new.pdf"));
    return new NextResponse(
      JSON.stringify({ message: message, stdout: "ok!" }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/pdf",
        },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error, message: message }),
      {
        status: 501,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
