"use server"

export type paperDetailsType = {
  title: string;
  year: string;
  // isOpenAccess: boolean;
  externalIds: {
    DOI: string;
  };
  url: string;
  // openAccessPdf: {
  //   url: string;
  //   status: string;
  // };
  journal: {
    name: string;
    pages: string;
    volume: string;
  };
  authors: Array<{
    name: string;
  }>;
  venue: string;
};

export type paperErrorType = {
  error: string;
}

export const fetchPaperByDOI = async (doi: string) => {
  const params = {
    fields:
      // "title,year,isOpenAccess,externalIds,url,openAccessPdf,journal,authors,venue",
      "title,year,externalIds,url,journal,authors,venue",

  };

  const urlSearchParams = new URLSearchParams(params).toString();
  try {
    const res = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/${doi}?${urlSearchParams}`,
      {
        headers: { "x-api-key": process.env.NEXT_PUBLIC_S2_API_KEY || "" },
      }
    );
    return res.json();
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch Paper");
  }
};
