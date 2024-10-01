'use client';

import React from "react";
import {useRouter} from "next/navigation";
import {AuthFlows} from "@/interface/types";
import {SimpleButton} from "@/app/components/SimpleButton";

export const DemoModeButton = () => {
    const router = useRouter();
    return (
        <>
            <SimpleButton text="Demo Mode" click={() => router.replace(`/todo?flow=${AuthFlows.DEMO}`)}
                          className="mt-4 bg-white text-black hover:bg-black hover:text-white rounded-lg px-4 py-2 font-bold"/>
        </>
    )
}