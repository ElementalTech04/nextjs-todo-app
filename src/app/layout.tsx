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
            <meta name="description" content="This is my Next.js app"/>
        </head>
        <body className="bg-gray-200 max-h-screen">
        <main className="container mx-auto">
            {children} {/* Page content is rendered here */}
        </main>
        <footer className="bg-darkGreen p-4 text-white text-center">
            &copy; 2024 Frankie Rodriguez. All rights reserved.
        </footer>
        </body>
        </html>
    );
}
