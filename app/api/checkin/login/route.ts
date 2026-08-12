import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const password =
      typeof body?.password === "string"
        ? body.password
        : "";

    const correctPassword =
      process.env.CHECKIN_PASSWORD;

    if (!correctPassword) {
      console.error(
        "CHECKIN_PASSWORD is not configured."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Check-In access is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    if (password !== correctPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect Check-In Access Code.",
        },
        {
          status: 401,
        }
      );
    }

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set(
      "checkin_authorized",
      "yes",
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 12,
      }
    );

    return response;
  } catch (error) {
    console.error("Check-in login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify Check-In access.",
      },
      {
        status: 500,
      }
    );
  }
}