import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import TagSearchBar from "./index";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// モックの設定
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

describe("TagSearchBar", () => {
  const mockReplace = jest.fn();
  const mockPathname = "/test";

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    (usePathname as jest.Mock).mockReturnValue(mockPathname);
  });

  it("正しくレンダリングされること", () => {
    const { getByPlaceholderText } = render(
      <TagSearchBar placeholder="タグを検索" />
    );
    expect(getByPlaceholderText("タグを検索")).toBeInTheDocument();
  });

  it("入力時にURLが更新されること", async () => {
    const { getByPlaceholderText } = render(
      <TagSearchBar placeholder="タグを検索" />
    );
    const input = getByPlaceholderText("タグを検索");

    fireEvent.change(input, { target: { value: "テストタグ" } });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        `${mockPathname}?tag=${encodeURIComponent("テストタグ")}`
      );
    });
  });

  it("入力がクリアされた時にtagパラメータが削除されること", async () => {
    const { getByPlaceholderText } = render(
      <TagSearchBar placeholder="タグを検索" />
    );
    const input = getByPlaceholderText("タグを検索");

    fireEvent.change(input, { target: { value: "テストタグ" } });
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        `${mockPathname}?tag=${encodeURIComponent("テストタグ")}`
      );
    });

    fireEvent.change(input, { target: { value: "" } });
    await waitFor(() => {
      // 最後の呼び出しのみをチェック
      expect(mockReplace).toHaveBeenLastCalledWith(mockPathname + "?");
    });
  });
});
