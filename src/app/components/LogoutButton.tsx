'use client';

import React from "react";
import logoutSvg from "@/assets/images/account-in-person-user-group-people.svg";
import {useRouter} from "next/navigation";
import {IconButton} from "@/app/components/IconButton";
import {LOGIN_PATH} from "@/app/constants";
import {setCookie} from "cookies-next";

export const LogoutButton = ({flow, redirectPath}: { flow: string, redirectPath: string }) => {
    const router = useRouter();

    return (
        <>
            <IconButton icon={logoutSvg} iconDimensions={{width: 35, height: 35}} text="Logout"
                        altText="Logout Icon"
                        click={() => {
                            setCookie(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || '', '', {
                                path: '/',
                                maxAge: -1
                            });
                            router.push(LOGIN_PATH.replace(':flow', flow).replace(':redirectPath', redirectPath));
                        }}
                        className="col-span-10 row-span-2 justify-self-end hover:scale-110 transition-all flex items-center flex-col w-[7%] sm:w-[17%] text-xs sm:text-xl"/>
        </>
    )
}