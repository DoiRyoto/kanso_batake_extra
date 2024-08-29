import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageModal } from "./index";

describe("ImageModal", () => {
  const mockImageUrl = "https://example.com/image.jpg";

  it("画像URLが提供されていない場合、何もレンダリングしない", () => {
    const { container } = render(<ImageModal />);
    expect(container).toBeEmptyDOMElement();
  });

  it("画像URLが提供された場合、サムネイル画像をレンダリングする", () => {
    render(<ImageModal imageUrl={mockImageUrl} />);
    const thumbnailImage = screen.getByAltText("etc");
    expect(thumbnailImage).toBeInTheDocument();
    expect(thumbnailImage).toHaveAttribute(
      "src",
      expect.stringContaining(encodeURIComponent(mockImageUrl))
    );
  });

  it("サムネイルをクリックすると、モーダルが開く", async () => {
    render(<ImageModal imageUrl={mockImageUrl} />);
    const thumbnailImage = screen.getByAltText("etc");
    await userEvent.click(thumbnailImage);

    const modalImage = screen.getAllByAltText("etc")[1]; // モーダル内の画像
    expect(modalImage).toBeInTheDocument();
    expect(modalImage).toHaveAttribute(
      "src",
      expect.stringContaining(encodeURIComponent(mockImageUrl))
    );
  });
});
