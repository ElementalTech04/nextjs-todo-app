'use client';
import {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {getCookie, setCookie} from "cookies-next";

export const DemoLogin = ({users: users, authFlow: authFlow, originPath: originPath}: { users: Set<number>, authFlow: string, originPath: string }) => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [storedUsers, setStoredUsers] = useState(new Set<number>());
    const [lowestUserId, setLowestUserId] = useState(0);
    const [highestUserId, setHighestUserId] = useState(0);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [subheader, setSubheader] = useState('Type any password to login. Enter a number for the username.');

    useEffect(() => {
        setStoredUsers(users);
        let minUserId = Infinity;
        let maxUserId = -Infinity;
        if (users.size === 0) {
            return;
        }
        users.forEach((userId: number) => {
            if (userId > maxUserId) {
                maxUserId = userId;

            }
            if (userId < minUserId) {
                minUserId = userId;
            }
        })
        if (minUserId && maxUserId) {
            setSubheader(`Type any password to login. Enter a number between ${minUserId} and ${maxUserId} for the username.`);
        }

        setLowestUserId(minUserId);
        setHighestUserId(maxUserId);

    }, [users])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userNum = parseInt(username, 10);

        if (!userNum || !storedUsers.has(userNum)) {
            setErrorMessage(`Please enter a number between ${lowestUserId} and ${highestUserId} for the username.`);
        } else {
            setErrorMessage('');
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth-api?flow=${authFlow}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                })
            }).then((response) => {
                if (response.ok) {
                    response.json().then((responseJson: {message: string, token: string}) => {
                        alert(responseJson.message);
                        setCookie(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY, responseJson.token, { maxAge: 60 * 60 * 24 * 7, path: '/' })
                        originPath = originPath || '/';
                        setTimeout(() => {
                            router.replace(`${originPath}?authFlow=${authFlow}`);
                        }, 100); // 100ms delay
                    });
                } else {
                    throw new Error('Network response was not ok');
                }
            }).catch((error) => {
                console.error('Error:', error);
            })
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center text-black">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-4">Demo Login</h1>
                    <p className="text-sm text-black text-center mb-6">
                        {subheader}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Enter a number for the usernamefield."
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Enter any password"
                                required
                            />
                        </div>

                        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-darkGreen hover:bg-green-900 text-white font-bold py-2 px-4 rounded-lg transition ease-in-out duration-200"
                            >
                                Log In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
