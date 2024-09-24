import React from "react";
import {AuthFlows} from "@/interface/types";

export default function TodoLayout({ children }: { children: React.ReactNode }) {
    const env = process.env.ENVIRONMENT;
    return (
        <>
            <main className="p-8 min-h-screen flex items-center justify-center">
                {children} {/* Render the specific page content here */}
            </main>
        </>
    );
}
