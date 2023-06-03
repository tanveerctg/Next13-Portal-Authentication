import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import bcrypt from "bcrypt";

import { sign } from "../../lib/utils";

export async function POST(request) {
  const { email, password } = await request.json();
  console.log({ password });
  try {
    const response = await axios.get(process.env.ACCESSTOKEN_URL);
    console.log({ response });
    // if response doesn't contain accesstoken then return null
    if (!response.data.access_token) {
      return NextResponse.json({
        ok: false,
        error: "Access token not found",
      });
    }
    const userFound = await axios.get(
      `https://www.zohoapis.com/crm/v2/Accounts/search?criteria=(Email:equals:${email})`,
      {
        headers: {
          Authorization: response.data.access_token,
        },
      }
    );
    console.log({ userFound: userFound.data });
    //if user not found with this email
    if (!userFound.data) {
      return NextResponse.json({
        ok: false,
        error: "Please input valid data",
      });
    }
    console.log("Active False");
    //if user is not active
    if (userFound.data.data[0].Status !== "Active") {
      return NextResponse.json({
        ok: false,
        error: "User is not Active now",
      });
    }
    //Check the password with DB password
    const checkPassword = await bcrypt.compare(
      password,
      userFound.data.data[0].Hashed_Password
    );

    console.log({ checkPassword });

    //if password not matched
    if (!checkPassword) {
      return NextResponse.json({
        ok: false,
        error:
          "That email address/password is not recognised, please try again",
      });
    }

    //set important data to cookies
    const jwtToken = await sign(
      {
        email: userFound.data.data[0].Email,
        record_id: userFound.data.data[0].id,
        name: userFound.data.data[0].Name1,
        fname: userFound.data.data[0].First_Name,
        go_to: userFound.data.data[0].Force_Password_Change
          ? "/reset_password"
          : "/dashboard",
      },
      "zoho",
      24 * 60 * 60
    );
    cookies().set("token", jwtToken, {
      secure: true,
      maxAge: 24 * 60 * 60,
      httpOnly: true,
    });

    console.log({
      force_password: userFound.data.data[0].Force_Password_Change,
    });
    //if email,password matched and forced password true then go to the reset password page
    if (userFound.data.data[0].Force_Password_Change) {
      return NextResponse.json({ ok: true, go_to: "/reset_password" });
    }
    //if email and password matched but forced password false then go to the dashboard page
    if (!userFound.data.data[0].Force_Password_Change) {
      return NextResponse.json({ ok: true, go_to: "/dashboard" });
    }
  } catch (err) {
    console.log({ err });
    return NextResponse.json({ ok: false, err: JSON.stringify(err) });
  }
}
