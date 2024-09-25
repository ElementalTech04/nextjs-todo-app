'use client';
import {useEffect, useState} from 'react';
import {User} from "@clerk/backend";
import {TodoItem} from "@/interface/types";

const header = ""
const subheader = ""

export const DemoLogin = ({users: users}: { users: string[] }) => {
    const [username, setUsername] = useState('');
    const [storedUsers, setStoredUsers] = useState<string[]>([]);
    const [highestUserId, setHighestUserId] = useState(0);
    const [lowestUserId, setLowestUserId] = useState(0);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [subheader, setSubheader] = useState('Type any password to login. Enter a number for the username.');

    useEffect(() => {
        setStoredUsers(users);
        if (users.length === 0) {
            return;
        }
        users.entries().forEach(([key, value]) => {
            if (value > highestUserId) {
                setHighestUserId(key);
            } else if (value < lowestUserId) {
                setLowestUserId(key);
            }
        });
        setSubheader(`Type any password to login. Enter a number between ${lowestUserId} and ${highestUserId} for the username.`);
        console.log(users);
        console.log(highestUserId);
        console.log(lowestUserId);

    }, [users])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userNum = parseInt(username, 10);

        if (!userNum || userNum <= lowestUserId || userNum >= highestUserId) {
            setErrorMessage(`Please enter a number between ${lowestUserId} and ${highestUserId} for the username.`);
        } else {
            setErrorMessage('');
            // Simulate login success for demo
            alert(`Logged in as User ${userNum}`);
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
                                placeholder="Enter a number for the username field."
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
