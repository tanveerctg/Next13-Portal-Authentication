import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import bcrypt from "bcrypt";

import { sign } from "../../lib/utils";

export async function POST(request) {
  await cookies().delete("token");
  return NextResponse.json({ ok: true });
}
