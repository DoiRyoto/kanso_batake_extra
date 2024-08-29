import React from "react";
import { render, screen } from "@testing-library/react";
import ReviewUserInfo from "./index";
import { User } from "@/type";

// モックユーザー情報
const mockUser: User = {
  id: "1",
  name: "テストユーザー",
  role: "学生",
  created_at: "2023-01-01T00:00:00Z",
  works: [],
  fields: [],
  affiliations: [],
};

describe("ReviewUserInfo", () => {
  it("ユーザー情報が提供されている場合、正しく表示される", () => {
    render(<ReviewUserInfo userInfo={mockUser} />);

    const linkElement = screen.getByRole("link", { name: /テストユーザー/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/user/1");

    const imageElement = screen.getByAltText("Icon Image");
    expect(imageElement).toBeInTheDocument();
  });

  it("ユーザー情報が提供されていない場合、何も表示されない", () => {
    const { container } = render(<ReviewUserInfo />);
    expect(container).toBeEmptyDOMElement();
  });
});
