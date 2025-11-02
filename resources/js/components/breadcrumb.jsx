import React from "react";

export default function OsBreadCrumb({ children, className = "" }) {
    const items = React.Children.toArray(children);

    return (
        <nav
            className={`w-full border-os-1 border-os-black p-os-8 bg-os-white rounded-lg text-os-regular flex flex-wrap gap-1 ${className}`}
        >
            {items.map((child, index) => {
                const isLast = index === items.length - 1;
                return (
                    <span
                        key={index}
                        className={`flex items-center ${
                            isLast ? "opacity-100 font-semibold" : "opacity-75"
                        }`}
                    >
                        {child}
                        {!isLast && <span className="ms-1 ">/</span>}
                    </span>
                );
            })}
        </nav>
    );
}
