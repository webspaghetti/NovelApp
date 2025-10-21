import { getServerSession } from 'next-auth';
import { updatePassword } from '@/app/helper-functions/authHelpers';
import {authOptions} from "@/lib/auth";


export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { userId, newPassword } = await request.json();

        if (!newPassword) {
            return Response.json(
                { error: 'New password is required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return Response.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Verify the user is updating their own password
        if (session.user.id !== parseInt(userId)) {
            return Response.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await updatePassword(userId, newPassword);

        return Response.json(
            { message: 'Password updated successfully', shouldReauthenticate: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Password reset error:', error);
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}