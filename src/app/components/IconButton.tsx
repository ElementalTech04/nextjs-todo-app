'use client';

import Image from "next/image";
import React from "react";


export const IconButton = ({ icon, iconDimensions, text, altText, click, className  }: { icon: string, iconDimensions: { width: number, height: number }, text: string, altText: string, click: () => void, className?: string }) => {
    return (
        <button
            onClick={click}
            className={className}
        >
            <Image src={icon} alt={altText} width={iconDimensions.width} height={iconDimensions.height} />
            <p>{text}</p>
        </button>
    )
}