import React from "react";
import {AuthFlows} from "@/interface/types";

export default function TodoLayout({ children }: { children: React.ReactNode }) {
    const env = process.env.ENVIRONMENT;
    return (
        <div className="min-h-screen bg-gray-100">
            <main className="p-8">
                {children} {/* Render the specific page content here */}
            </main>
        </div>
    );
}
