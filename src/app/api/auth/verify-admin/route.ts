import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// List of admin emails - in production, this should come from environment variables or database
const ADMIN_EMAILS = [
  'admin@codeclash.com',
  'kartikay@codeclash.com',
  // Add more admin emails as needed
];

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { isAdmin: false, message: 'No access token found' },
        { status: 401 }
      );
    }

    // TODO: Replace with actual user data from your authentication system
    // For now, this is a placeholder that checks against a mock user email
    // In a real implementation, you would decode the JWT token or make an API call
    // to get the user's email from your authentication service
    
    // Example of what you might do:
    // const userResponse = await fetch(`${process.env.API_URL}/auth/me`, {
    //   headers: { Authorization: `Bearer ${accessToken}` }
    // });
    // const userData = await userResponse.json();
    // const userEmail = userData.email;
    
    // For demonstration, let's assume we can extract email from a cookie or token
    const userEmail = cookieStore.get('userEmail')?.value;
    
    if (!userEmail) {
      return NextResponse.json(
        { isAdmin: false, message: 'User email not found' },
        { status: 401 }
      );
    }

    const isAdmin = ADMIN_EMAILS.includes(userEmail.toLowerCase());
    
    if (!isAdmin) {
      return NextResponse.json(
        { isAdmin: false, message: 'User is not an admin' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      isAdmin: true,
      email: userEmail,
      message: 'Admin access granted'
    });
    
  } catch (error) {
    console.error('Error verifying admin status:', error);
    return NextResponse.json(
      { isAdmin: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
