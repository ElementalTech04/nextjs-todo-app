import jwt from 'jsonwebtoken';
import {getCookie, setCookie} from 'cookies-next';
import {NextRequest, NextResponse} from "next/server";
import {AuthFlows, TodoItem} from "@/interface/types";
import {LogError, LogInfo} from "@/app/api/api-utils/log-utils";
import {BASE_URL, TODO_API_URL} from "@/app/constants";

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
        LogError('Failed to authenticate with Clerk', 'authenticateWithClerk', error as Error);
        return {isAuthenticated: false, user: undefined, error: 'Invalid token'};
    }
};

// Fake authentication for demo mode
const authenticateWithDemo = async (username: string, password: string, authFlow: string) => {
    const userNumber = parseInt(username, 10);
    LogInfo(`Authenticating with demo mode for user ${userNumber}`);
    const totalTodoListResponse = await fetch(BASE_URL.concat(TODO_API_URL.replace(':flow', authFlow)), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const totalTodoList: TodoItem[] = await totalTodoListResponse.json();
    const userList = new Set<number>();
    totalTodoList.forEach((item: TodoItem) => {
        userList.add(Number(item.userId));
    });

    if (!userList.has(userNumber) || isNaN(userNumber)) {
        const errorMessage = 'Invalid username.';
        const errorObj = new Error(errorMessage);
        LogError(errorMessage, 'authenticateWithDemo', errorObj);
        throw errorObj;
    }

    LogInfo(`Successfully fetched demo todos list to validate user ${userNumber}`);

    // Create a fake JWT with username and password
    const token = jwt.sign({username, password}, DEMO_SECRET_KEY, {expiresIn: JWT_EXPIRY});
    return token;
};

// TODO: Integrate with redis to keep track of sessions
const checkAuthStatus = (keyToken: string) => {
    const cookie = getCookie(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token');
    return !!(cookie && cookie === keyToken);
}

// Set secure cookie
const setAuthCookie = (res: NextRequest, token: string, userName: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setCookie(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'token', token, { req: res, res,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',  // Prevent CSRF attacks
        maxAge: 60 * 60,     // 1 hour expiry
        path: '/',           // Available throughout the app
    });
    LogInfo(`Session token generated for user ${userName} and will expire in ${JWT_EXPIRY}`);
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
                return NextResponse.json({error: 'Authentication failed', isAuthenticated: false});
            }

            return NextResponse.json({message: 'Authenticated with Clerk', isAuthenticated: true, user: authResult.user});
        }

        if (!username || !password) {
            return NextResponse.json({error: 'Username and password are required in demo mode'});
        }

        // Authenticate in demo mode and generate a fake JWT if not already authenticated
        const demoToken = await authenticateWithDemo(username, password, authFlow);

        setAuthCookie(request, demoToken, username);
        return NextResponse.json({message: 'Authenticated in demo mode', token: demoToken});

    } catch (error) {
        const errorObj = error as Error;
        return NextResponse.json({error: errorObj.message});
    }
}

