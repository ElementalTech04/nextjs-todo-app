import {NextApiRequest, NextApiResponse} from 'next';
import jwt from 'jsonwebtoken';
import {getCookie, setCookie} from 'cookies-next';
import {NextRequest, NextResponse} from "next/server";
import {AuthFlows, TodoItem} from "@/interface/types";
import { v4 as uuidv4 } from 'uuid';
import {cookies} from "next/headers";

const DEMO_SECRET_KEY = process.env.DEMO_SECRET_KEY || 'supersecretkey';
const JWT_EXPIRY = '1h';

// Clerk authentication logic
const authenticateWithClerk = async (req: NextRequest): Promise<{
    isAuthenticated: boolean,
    user: any,
    error?: string
}> => {
    try {
        const sessionToken = req.headers.get('authorization')?.split(' ')[1];
        // const clerkUser = await ClerkClient.verifySessionToken(sessionToken);
        return {isAuthenticated: true, user: ''};
    } catch (error) {
        return {isAuthenticated: false, user: undefined, error: 'Invalid token'};
    }
};

// Fake authentication for demo mode
const authenticateWithDemo = async (username: string, password: string, authFlow: string) => {
    const userNumber = parseInt(username, 10);

    const totalTodoListResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todo-api?flow=${authFlow}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const totalTodoList: TodoItem[] = await totalTodoListResponse.json();
    let userList = new Set<number>();
    totalTodoList.forEach((item: TodoItem) => {
        userList.add(Number(item.userId));
    });

    if (!userList.has(userNumber) || isNaN(userNumber)) {
        throw new Error('Invalid username.');
    }

    // Create a fake JWT with username and password
    const token = jwt.sign({username, password}, DEMO_SECRET_KEY, {expiresIn: JWT_EXPIRY});
    return token;
};

const checkAuthStatus = (keyToken: string) => {
    console.log(cookies());
    const cookie = getCookie(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY);
    console.log(cookie)
    console.log(keyToken)
    return !!(cookie && cookie === keyToken);
}

// Set secure cookie
const setAuthCookie = (res: NextRequest, token: string) => {
    setCookie(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY, token, {
        req: res,
        res,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',  // Prevent CSRF attacks
        maxAge: 60 * 60,     // 1 hour expiry
        path: '/',           // Available throughout the app
    });
};

export async function GET(request: NextRequest) {
    const searchParams = new URL(request.url).searchParams;
    const keyToken = searchParams.get('token') || '';
    if (keyToken) {
        return NextResponse.json({success: true} );
    } else {
        return NextResponse.json({success: false, error: 'No token found'});
    }
}

export async function POST(request: NextRequest) {
    const searchParams = new URL(request.url).searchParams;
    const {username, password} = await request.json();
    const authFlow = searchParams.get('flow') || AuthFlows.DEMO;

    try {
        // TODO When authFlow is not demo, authenticate with Clerk
        if (authFlow !== 'demo') {
            const authResult: {
                isAuthenticated: boolean,
                user: any,
                error?: string
            } = await authenticateWithClerk(request);
            if (!authResult.isAuthenticated) {
                return NextResponse.json({error: 'Authentication failed'});
            }

            return NextResponse.json({message: 'Authenticated with Clerk', user: authResult.user});
        }

        if (!username || !password) {
            return NextResponse.json({error: 'Username and password are required in demo mode'});
        }

        // Authenticate in demo mode and generate a fake JWT if not already authenticated
        const demoToken = await authenticateWithDemo(username, password, authFlow);

        setAuthCookie(request, demoToken);
        return NextResponse.json({message: 'Authenticated in demo mode', token: demoToken});

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.message});
    }
}

