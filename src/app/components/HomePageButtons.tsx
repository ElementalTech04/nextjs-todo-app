'use client'

import React from "react";
import {useRouter} from "next/navigation";
import {AuthFlows} from "@/app/constants";

export const HomePageButtons = () => {

    const router = useRouter(); // Initialize router

    const handleAppRedirect = () => {
        const flow = process.env.ENVIRONMENT !== undefined && process.env.ENVIRONMENT.toLowerCase() === 'production'
            ? AuthFlows.PROD
            : AuthFlows.DEV;
        router.push(`/todo?flow=${flow}`);
    };

    const handleDemoRedirect = () => {
        router.push(`/todo?flow=${AuthFlows.DEMO}`);
    };
    return (
        <>
            <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition ease-in-out duration-200"
                    onClick={handleAppRedirect}>Use the App
            </button>
            <button
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow transition ease-in-out duration-200"
                onClick={handleDemoRedirect}>Use the Demo
            </button>
        </>
    )
}