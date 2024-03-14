import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "感想畑",
  description:
    "「感想畑」は、「論文を理解するのが難しい」という課題を解決する「筑波大で研究に取り組んでいる人向け」の、「論文感想共有システム」です。これは「他人のレビューを参考にできる」ことで「通常のGoogle ScholarやNotion」とは異なり、「論文を理解しやすく」なります。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // https://github.com/shadcn-ui/ui/issues/977
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex flex-col">
          <Header />
          <div className="container max-w-5xl mt-20 pt-5 pb-5">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
