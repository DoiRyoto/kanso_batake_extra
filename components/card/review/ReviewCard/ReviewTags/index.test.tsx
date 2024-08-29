import { render, screen } from "@testing-library/react";
import ReviewTags from "./index";
import { Tag } from "@/type";

describe("ReviewTags", () => {
  it("タグがない場合、何も表示されない", () => {
    render(<ReviewTags />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("タグが正しく表示される", () => {
    const mockTags: Tag[] = [
      { id: 1, name: "テスト", created_at: "" },
      { id: 2, name: "React", created_at: "" },
    ];
    render(<ReviewTags tagsData={mockTags} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent("#テスト");
    expect(links[1]).toHaveTextContent("#React");
  });

  it("タグのリンクが正しいURLを持つ", () => {
    const mockTags: Tag[] = [{ id: 1, name: "テスト", created_at: "" }];
    render(<ReviewTags tagsData={mockTags} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "?tag=テスト");
  });
});
