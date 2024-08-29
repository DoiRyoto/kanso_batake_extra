import React from "react";
import { render, screen } from "@testing-library/react";
import PaperData from "./index";
import { Paper } from "@/type";

describe("PaperData", () => {
  const fullPaperData: Paper = {
    authors: "John Doe, Jane Smith",
    journal_name: "Nature",
    year: "2023",
    journal_vol: "Vol. 1",
    journal_pages: "123-456",
    doi: "10.1000/xyz123",
    link: "https://example.com/paper",
  };

  it("正しくすべてのデータを表示する", () => {
    render(<PaperData paperData={fullPaperData} />);

    expect(screen.getByText("John Doe, Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Nature.2023.Vol. 1.123-456.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /doi/i })).toHaveAttribute(
      "href",
      "https://www.doi.org/10.1000/xyz123"
    );
    expect(screen.getByRole("link", { name: /論文リンク/i })).toHaveAttribute(
      "href",
      "https://example.com/paper"
    );
  });

  it("不完全なデータでも正しく表示する", () => {
    const incompletePaperData: Paper = {
      authors: "John Doe",
      year: "2023",
    };

    render(<PaperData paperData={incompletePaperData} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("2023.")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("DOIとリンクがない場合、アイコンを表示しない", () => {
    const nolinkPaperData: Paper = {
      authors: "John Doe",
      year: "2023",
    };

    render(<PaperData paperData={nolinkPaperData} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("paperDataがundefinedの場合、nullを返す", () => {
    const { container } = render(<PaperData />);
    expect(container.firstChild).toBeNull();
  });
});
