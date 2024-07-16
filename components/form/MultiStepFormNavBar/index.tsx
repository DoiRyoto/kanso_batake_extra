"use client";

import { multiStepFormNavItemList } from "@/constants";
import { MultiStepFormNavItem } from "./MultiStepFormNavItem";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

type Props = {
  currentStep: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const MultiStepFormNavBar = ({ currentStep = 1, setStep }: Props) => {
  const clickHandler = (e: React.MouseEvent<HTMLLIElement>) => {
    setStep(e.currentTarget.value);
  };

  return (
    <nav>
      <ul className="flex flex-row items-center justify-evenly font-bold">
        {multiStepFormNavItemList.map((multiStepNavItem) => {
          return (
            <>
              <MultiStepFormNavItem
                label={multiStepNavItem.label}
                isSelected={currentStep === multiStepNavItem.step}
                onClick={clickHandler}
                value={multiStepNavItem.step}
              />
              {multiStepNavItem.step !== 4 && <IoIosArrowForward />}
            </>
          );
        })}
      </ul>
    </nav>
  );
};

export default MultiStepFormNavBar;
