import React from "react";

export default function TodoLayout({children}: { children: React.ReactNode }) {
    return (
        <>
            <main className="p-2 flex items-center justify-center">
                {children}
            </main>
        </>
    );
}
