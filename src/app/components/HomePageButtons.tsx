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
            <button className="btn btn-primary btn-lg btn-primary btn-lg btn-block"
                    onClick={handleAppRedirect}>Use the App
            </button>
            <button className="btn btn-primary btn-lg btn-primary btn-lg btn-block"
                    onClick={handleDemoRedirect}>Use the Demo
            </button>
        </>
    )
}