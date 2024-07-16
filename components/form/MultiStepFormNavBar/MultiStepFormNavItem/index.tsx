"use client";

import clsx from "clsx";
import React, { forwardRef } from "react";

type Props = {
  label: string;
  isSelected?: boolean;
} & React.ComponentPropsWithoutRef<"li">;

export const MultiStepFormNavItem = forwardRef<HTMLLIElement, Props>(
  function multiStepNavItem({ label, isSelected, className, ...props }, ref) {
    return (
      <li
        className={clsx(
          className,
          "hover:cursor-pointer",
          isSelected ? "text-black" : "text-gray-500"
        )}
        {...props}
        ref={ref}
      >
        {label}
      </li>
    );
  }
);
