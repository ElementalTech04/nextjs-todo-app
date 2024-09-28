import React from "react";
import {HomePageButtons} from "@/app/components/HomePageButtons";
import welcomeSvg from "@/assets/images/welcome.svg";
import Image from "next/image";

export default function HomePage() {


    return (
        <>
            <div className=" h-[90vh] m-4">
                <div className="flex flex-col justify-center row-span-full bg-gray-700 rounded-lg w-full h-full p-6 text-center p-24">
                    <div className="flex items-center justify-center F">
                        <Image src={welcomeSvg} alt="welcome" width={250} height={250}/>
                    </div>
                    <h1 className="text-5xl font-bold leading-tight p-4">Hello! <br /> Welcome to my Todo App.</h1>
                    <p>I built this Todo App to demonstrate some of the possibilities of Next.js, Redux, Tailwind CSS,
                        Clerk, React Beautiful DND, and Framer Motion.</p>
                    <br />
                    <p>Select which path to go down below. Use the app or use the demo?</p>
                    <div>
                        <HomePageButtons/>
                    </div>
                </div>
            </div>
        </>
    );
}
