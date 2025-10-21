import { createUser, getUserByUsername } from '../../../helper-functions/authHelpers';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return Response.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return Response.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return Response.json(
                { error: 'Username already exists' },
                { status: 409 }
            );
        }

        // Create user
        const userId = await createUser(username, password);

        return Response.json(
            { message: 'User created successfully', userId },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}