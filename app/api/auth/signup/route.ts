import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    console.log('Received signup request for:', email) // Log incoming request

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing email or password" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })

    console.log('Created user:', { email: user.email }) // Log success

    return NextResponse.json(
      { message: "User created successfully", user: { email: user.email } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in signup route:', error) // Log error
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
} 