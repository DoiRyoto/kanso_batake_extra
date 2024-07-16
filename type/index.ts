export type Paper = {
  id?: string;
  venue?: string;
  year?: string;
  journal_name?: string;
  journal_pages?: string;
  journal_vol?: string;
  authors?: string;
  doi?: string;
  link?: string;
};

// Affiliations Table: id, name, created_at
export type Affiliation = {
  id: number;
  name: string;
  created_at: string | Date;
};

// Comments Table: id, content, review_id, user_id, created_at
export type Comment = {
  id: number;
  content: string;
  user_id: string;
  review_id: number;
  created_at: string | Date;
};

// Fields Table: id, name, created_at
export type Field = {
  id: number;
  name: string;
  created_at: string | Date;
};

// Topics Table: id, name, created_at
export type Topic = {
  id: number;
  name: string;
  created_at: string | Date;
};

// Reviews Table: id, content, paper_data, paper_title, user_id, created_at, thumbnail_url
export type Review = {
  id: number;
  content: string | null;
  paper_title: string;
  paper_data: Paper;
  user_info: User;
  comments: Comment[];
  tags: Tag[];
  created_at: string | Date;
  thumbnail_url: string | null;
};

// Tags Table: id, name, user_id, created_at
export type Tag = {
  id: number;
  name: string;
  created_at: string | Date;
};

// Users Table: id, user_id, name, role, created_at
export type User = {
  id: string;
  name: string;
  role: string | null; // いったん　Student or Teacher
  created_at: string | Date;
};

// Works Table: id, url, user_id, created_at
export type Work = {
  id: number;
  url: string | null;
  user_id: string;
  created_at: string | Date;
};

type paperInterface = {
  id: string;
  title: string;
  tldr: string;
};

export type labType = {
  value: string;
  users: string[];
  label: string;
};

export type reviewType = {
  id: string;
  contents: string;
  paperTitle: string;
  reviewerName: string;
  createdBy: string;
  venue: string;
  year: string;
  journal_name: string;
  journal_pages: string;
  journal_vol: string;
  authors: string;
  doi: string;
  link: string;
  tags: string[];
  imageUrl: string;
};

export type userType = {
  id: string;
  name: string;
  affiliation: string[];
  field: string[];
  role: string;
  // いったん　Student or Teacher
  works: string[];
};

export type commentType = {
  id: string;
  contents: string;
  userId: string;
  parentId: string;
};
