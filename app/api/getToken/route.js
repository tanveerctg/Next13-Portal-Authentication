import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { sign, verify } from "../../lib/utils.js";

export async function GET(request) {
  const token = request.cookies.get("token");
  const decodeJwt = await verify(token.value, "zoho");
  return NextResponse.json({ token: decodeJwt });
}
