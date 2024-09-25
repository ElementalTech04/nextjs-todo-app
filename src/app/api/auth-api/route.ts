import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';
import { ClerkClient } from '@clerk/clerk-sdk-node';

const DEMO_SECRET_KEY = process.env.DEMO_SECRET_KEY || 'supersecretkey';
const JWT_EXPIRY = '1h';

// Clerk authentication logic
const authenticateWithClerk = async (req: NextApiRequest) => {
    try {
        const sessionToken = req.headers.authorization?.split(' ')[1];
        const clerkUser = await ClerkClient.verifySessionToken(sessionToken);
        return { isAuthenticated: true, user: clerkUser };
    } catch (error) {
        return { isAuthenticated: false, error: 'Invalid token' };
    }
};

// Fake authentication for demo mode
const authenticateWithDemo = (username: string, password: string) => {
    const userNumber = parseInt(username, 10);
    if (isNaN(userNumber)) {
        throw new Error('Invalid username.');
    }

    // Create a fake JWT with username and password
    const token = jwt.sign({ username, password }, DEMO_SECRET_KEY, { expiresIn: JWT_EXPIRY });
    return token;
};

// Set secure cookie
const setAuthCookie = (res: NextApiResponse, token: string) => {
    setCookie('tok-a-sym', token, {
        req: res,
        res,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',  // Prevent CSRF attacks
        maxAge: 60 * 60,     // 1 hour expiry
        path: '/',           // Available throughout the app
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authFlow } = req.query;
    const { username, password } = req.body;

    try {
        // When authFlow is not demo, authenticate with Clerk
        if (authFlow !== 'demo') {
            const authResult = await authenticateWithClerk(req);
            if (!authResult.isAuthenticated) {
                return res.status(401).json({ error: 'Authentication failed' });
            }

            // Set Clerk authentication token in cookie
            setAuthCookie(res, authResult.user.sessionToken);
            return res.status(200).json({ message: 'Authenticated with Clerk', user: authResult.user });
        }

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required in demo mode' });
        }

        // Authenticate in demo mode and generate a fake JWT
        const demoToken = authenticateWithDemo(username, password);
        setAuthCookie(res, demoToken);

        return res.status(200).json({ message: 'Authenticated in demo mode', token: demoToken });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
