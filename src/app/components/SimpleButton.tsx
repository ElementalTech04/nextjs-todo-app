'use client';

import React from "react";


export const SimpleButton = ({text, click, className  }: { text: string, click: () => void, className?: string }) => {
    return (
        <button
            onClick={click}
            className={className}
        >
            <p>{text}</p>
        </button>
    )
}