import React from "react"
import {AuthFlows, TodoItem} from "@/interface/types";
import {DemoLogin} from "@/app/components/DemoLogin";
import {ClerkLogin} from "@/app/components/ClerkLogin";

export default async function SignupPage({searchParams}: { searchParams: { [key: string]: string | undefined } }) {
    const userSet = new Set<number>();
    const authFlow = searchParams.authFlow || AuthFlows.DEMO;
    const originPath = searchParams.originPath || '';

    return (
        <>
            {authFlow === AuthFlows.DEMO ?
                <DemoLogin users={userSet} authFlow={authFlow} originPath={originPath} />
                :
                <ClerkLogin/>
            }
        </>
    );
}