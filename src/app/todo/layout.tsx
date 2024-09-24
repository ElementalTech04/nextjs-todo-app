import React from "react";

export default function TodoLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-gray-900 text-white p-4">
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="/auth" className="hover:underline">login</a></li>
                        <li><a href="/account" className="hover:underline">Account</a></li>
                    </ul>
                </nav>
            </header>
            <main className="p-8">
                {children} {/* Render the specific page content here */}
            </main>
            <footer className="bg-gray-900 p-4 text-white text-center">
                &copy; 2024 Frankie Rodriguez. All rights reserved.
            </footer>
        </div>
    );
}
