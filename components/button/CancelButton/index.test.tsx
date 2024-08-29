import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import CancelCreateReview from "./index";
import "@testing-library/jest-dom";

// Next.jsのuseRouterをモック化
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CancelCreateReview", () => {
  it("コンポーネントが正しくレンダリングされること", () => {
    render(<CancelCreateReview />);
    const button = screen.getByRole("button", { name: "Cancel" });
    expect(button).toBeInTheDocument();
  });

  it("ボタンがクリックされたときにrouter.back()が呼び出されること", () => {
    const mockBack = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
    });

    render(<CancelCreateReview />);
    const button = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(button);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
