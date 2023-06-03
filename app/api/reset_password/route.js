import axios from "axios";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { sign, verify } from "../../lib/utils";

export async function POST(request) {
  try {
    const getAccessToken = await axios.get(process.env.ACCESSTOKEN_URL);
    // Get password and password_repeat from request body
    const { password, password_repeat, record_id } = await request.json();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // update Hashed_Password and Force_Password_Change
    const data = JSON.stringify({
      data: [
        {
          id: record_id,
          Hashed_Password: hashedPassword,
          Force_Password_Change: false,
        },
      ],
    });
    const updateDb = await axios.put(
      `https://www.zohoapis.com/crm/v2/Accounts/${record_id}`,
      data,
      {
        headers: {
          Authorization: getAccessToken.data.access_token,
        },
      }
    );

    // if error occured
    if (!updateDb.data) {
      return NextResponse.json({
        ok: false,
        error: "Something went wrong",
      });
      return;
    }
    const token = request.cookies.get("token");
    let decodeJwt = await verify(token.value, "zoho");
    decodeJwt.go_to = "dashboard";
    //set important data to cookies
    const jwtToken = await sign(
      {
        email: decodeJwt.email,
        record_id: decodeJwt.record_id,
        name: decodeJwt.name,
        go_to: decodeJwt.go_to,
      },
      "zoho",
      24 * 60 * 60
    );
    cookies().set("token", jwtToken, {
      secure: true,
      maxAge: 24 * 60 * 60,
      httpOnly: true,
    });

    console.log({ res: JSON.stringify(updateDb.data), decodeJwt });

    if (updateDb.data) {
      return NextResponse.json({
        ok: true,
        message: "Password successfully updated",
        go_to: "/dashboard",
      });
    }
  } catch (err) {
    console.log("CATCH ERR", err);
    return NextResponse.json({
      error: err,
    });
  }
}
