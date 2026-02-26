import React from "react";

export const AuroraBackground = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={`aurora-container ${className || ""}`}
            {...props}
        >
            <div className="aurora-inner" />
            <div className="aurora-mask" />
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                {children}
            </div>
        </div>
    );
};

