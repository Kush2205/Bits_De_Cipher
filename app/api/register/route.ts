import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();
    
   
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }
    
   
    const existingUser = await prisma.registeredUser.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      
      return NextResponse.json(
        { 
          message: 'User with this email already exists',
          userExists: true 
        },
        { status: 409 }
      );
    }
    
    // Create new user
    try {
      const user = await prisma.registeredUser.create({
        data: {
          name,
          email,
        }
      });
      
      return NextResponse.json(
        { 
          message: 'Registration successful', 
          userId: user.id,
          registered: true 
        },
        { status: 201 }
      );
    } catch (dbError) {
      // Check specifically for unique constraint errors
      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (dbError.code === 'P2002') {
          return NextResponse.json(
            { 
              message: 'User with this email already exists',
              userExists: true 
            },
            { status: 409 }
          );
        }
      }
      
      // Re-throw for other types of errors
      throw dbError;
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}