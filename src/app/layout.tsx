import '../styles/globals.css';
import React from 'react';

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <title>My App</title>
            <meta name="description" content="This is my Next.js app" />
        </head>
        <body className="min-h-screen bg-gray-100">
        <main className="container mx-auto py-8">
            {children}  {/* Page content is rendered here */}
        </main>
        <footer className="bg-blue-500 p-4 text-white text-center">
            &copy; 2024 My App. All rights reserved.
        </footer>
        </body>
        </html>
    );
}
