'use client';

import React from "react";
import logoutSvg from "@/assets/images/account-in-person-user-group-people.svg";
import {useRouter} from "next/navigation";
import {AuthFlows} from "@/interface/types";
import {IconButton} from "@/app/components/IconButton";
import {LOGIN_PATH} from "@/app/constants";

export const LogoutButton = () => {
    const router = useRouter();

    return (
        <>
            <IconButton icon={logoutSvg} iconDimensions={{width: 35, height: 35}} text="Logout"
                        altText="Logout Icon"
                        click={() => {
                            document.cookie = `${process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY}=; Max-Age=0; path=/`;
                            router.replace(LOGIN_PATH);
                        }}
                        className="col-span-10 row-span-2 justify-self-end hover:scale-110 transition-all flex items-center flex-col"/>
        </>
    )
}