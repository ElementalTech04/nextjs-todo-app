import React from "react";
import RootLayout from "@/app/layout";
import {HomePageButtons} from "@/app/components/HomePageButtons";

export function HomePage() {


    return (
        <>
            <div className="grid grid-cols-[1fr 2fr 1 fr] grid-rows-4 gap-4 h-screen bg-gray-100 p-4 rounded-lg">
                <h1 className="text-3xl leading-tight">Hello! Welcome to my Todo App.</h1>
                <p>I built this Todo App to demonstrate some of the possibilities of Next.js, Redux, tailwind,
                    Clerk,
                    and Framer Motion. Select which path to go down below. Use the app or use the demo?</p>
                <div>
                    <HomePageButtons/>
                </div>
            </div>
        </>
    );
}

HomePage.getInitialProps = async ({query, req, asPath}) => {
    throw new Error('Application is crashing without catch');
}

export default HomePage;
