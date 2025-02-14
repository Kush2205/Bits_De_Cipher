//// filepath: /d:/Projects/TypeScript Projects/Bits_De_Cipher/app/api/db/users/route.ts
// @ts-nocheck
import { prisma } from "../../../../lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  let payload;
  try {
    payload = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  // Ensure payload is a valid object and contains required fields.
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Payload must be an object" }, { status: 400 });
  }

  const { name, email } = payload;
  if (!name || !email) {
    return NextResponse.json(
      { error: "Missing fields: 'name' and 'email' are required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return NextResponse.json({ message: "User already exists" }, { status: 200 });
    } else {
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
        },
      });
      return NextResponse.json({ message: "User created successfully" }, { status: 200 });
    }
  } catch (error) {
    console.error("Error in user API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}