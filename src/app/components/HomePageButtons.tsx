'use client'

import React from "react";
import {useRouter} from "next/navigation";
import {AuthFlows} from "@/interface/types";

export const HomePageButtons = () => {

    const router = useRouter(); // Initialize router

    const handleAppRedirect = () => {
        const flow = process.env.ENVIRONMENT !== undefined && process.env.ENVIRONMENT.toLowerCase() === AuthFlows.PROD
            ? AuthFlows.PROD
            : AuthFlows.DEV;
        router.push(`/todo?flow=${flow}`);
    };

    const handleDemoRedirect = () => {
        router.push(`/todo?flow=${AuthFlows.DEMO}`);
    };
    return (
        <>
            <div className="flex justify-center items-center p-[2rem]">
            <button className="bg-darkGreen hover:bg-yellow hover:text-black text-white font-bold py-2 px-4 rounded-lg shadow-lg transition ease-in-out duration-200 m-5"
                    onClick={handleAppRedirect}>Use the App
            </button>
            <button
                className="bg-white hover:bg-gray-500 text-gray-800 hover:text-white font-semibold py-2 px-4 rounded-lg shadow transition ease-in-out duration-200 m5x       "
                onClick={handleDemoRedirect}>Use the Demo
            </button>
            </div>
        </>
    )
}