import { paperDetailsType } from "@/actions/paper.action";

type paperInterface = {
  id: string;
  title: string;
  tldr: string;
};

export type labType ={
    value: string;
    users: string[];
    label: string;
}


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

export type commentType = {
  id: string;
  contents: string;
  userId: string;
  parentId: string;
};

// 現在使用してい以内
// export type postType = {
//     id: string;
//     contents: string;
//     paperTitle: string;
// }

export type userType = {
  id: string;
  name: string;
  affiliation: string[];
  field: string[];
  role: string;
  // いったん　Student or Teacher
  works: string[];
};

export const emptyReview: reviewType = {
  id: "",
  contents: "",
  paperTitle: "",
  reviewerName: "",
  createdBy: "",
  venue: "",
  year: "",
  journal_name: "",
  journal_pages: "",
  journal_vol: "",
  authors: "",
  doi: "",
  link: "",
  tags: []
}

export const role = [
    "学生",
    "教員",
]

export const affiliations = [
  {
    value: "小野研究室",
    label: "小野研究室",
  },
  {
    value: "カオス研究室",
    label: "カオス研究室",
  },
  {
    value: "計算ビジュアルサイエンス研究室",
    label: "計算ビジュアルサイエンス研究室",
  },
  {
    value: "物理情報システム研究室",
    label: "物理情報システム研究室",
  },
  {
    value: "インタラクティブプログラミング研究室",
    label: "インタラクティブプログラミング研究室",
  },
  {
    value: "ビジュアリゼーションとインタラクティブシステム研究室",
    label: "ビジュアリゼーションとインタラクティブシステム研究室",
  },
  {
    value: "知能ロボット研究室",
    label: "知能ロボット研究室",
  },
  {
    value: "インフラウェア研究室",
    label: "インフラウェア研究室",
  },
  {
    value: "インタラクティブ・アーキテクチャ研究室",
    label: "インタラクティブ・アーキテクチャ研究室",
  },
  {
    value: "データシステムエンジニアリング研究室",
    label: "データシステムエンジニアリング研究室",
  },
  {
    value: "OS分散処理研究室",
    label: "OS分散処理研究室",
  },
  {
    value: "コンピュータネットワーク研究室",
    label: "コンピュータネットワーク研究室",
  },
  {
    value: "システムセキュリティ研究室",
    label: "システムセキュリティ研究室",
  },
  {
    value: "マルチエージェントシステム研究室",
    label: "マルチエージェントシステム研究室",
  },
  {
    value: "システムディペンダビリティ研究室",
    label: "システムディペンダビリティ研究室",
  },
  {
    value: "行動モデリング研究室",
    label: "行動モデリング研究室",
  },
  {
    value: "多知覚メディア処理研究室",
    label: "多知覚メディア処理研究室",
  },
  {
    value: "知能情報研究室",
    label: "知能情報研究室",
  },
  {
    value: "人間支援工学研究室",
    label: "人間支援工学研究室",
  },
  {
    value: "ヒューマンコンピュテーション研究室",
    label: "ヒューマンコンピュテーション研究室",
  },
  {
    value: "ヒューマンセンタードビジョン研究室",
    label: "ヒューマンセンタードビジョン研究室",
  },
  {
    value: "インタラクション研究室",
    label: "インタラクション研究室",
  },
  {
    value: "デジタルネイチャー開発研究センター",
    label: "デジタルネイチャー開発研究センター",
  },
  {
    value: "吉川研究室",
    label: "吉川研究室",
  },
  {
    value: "グラフィックデザイン研究室",
    label: "グラフィックデザイン研究室",
  },
  {
    value: "イメージサイエンス研究室",
    label: "イメージサイエンス研究室",
  },
  {
    value: "データシステム工学研究室",
    label: "データシステム工学研究室",
  },
  {
    value: "ソーシャルネットワーク研究室",
    label: "ソーシャルネットワーク研究室",
  },
  {
    value: "人と音の情報学研究室",
    label: "人と音の情報学研究室",
  },
  {
    value: "カオス＆コンピュータアミューズメントシステム研究室",
    label: "カオス＆コンピュータアミューズメントシステム研究室",
  },
  {
    value: "プログラミング言語研究室",
    label: "プログラミング言語研究室",
  },
  {
    value: "メタデータ研究室（知の共有基盤研究グループ）",
    label: "メタデータ研究室（知の共有基盤研究グループ）",
  },
  {
    value: "フィジカルメディア研究室",
    label: "フィジカルメディア研究室",
  },
  {
    value: "物理ベースコンピュータグラフィックス研究室",
    label: "物理ベースコンピュータグラフィックス研究室",
  },
  {
    value: "ソーシャルロボット研究室",
    label: "ソーシャルロボット研究室",
  },
  {
    value: "融合知能デザイン研究室（知の共有基盤研究グループ）",
    label: "融合知能デザイン研究室（知の共有基盤研究グループ）",
  },
  {
    value: "数式処理研究室",
    label: "数式処理研究室",
  },
  {
    value: "知覚・認知心理学研究室",
    label: "知覚・認知心理学研究室",
  },
  {
    value: "自然言語処理研究室",
    label: "自然言語処理研究室",
  },
  {
    value: "機械学習・言語理解研究室",
    label: "機械学習・言語理解研究室",
  },
  {
    value: "プログラム論理研究室",
    label: "プログラム論理研究室",
  },
  {
    value: "機械学習・データマイニング研究室",
    label: "機械学習・データマイニング研究室",
  },
  {
    value: "人工知能研究室",
    label: "人工知能研究室",
  },
  {
    value: "知識・データ工学研究室",
    label: "知識・データ工学研究室",
  },
  {
    value: "ブラックボックス最適化研究室",
    label: "ブラックボックス最適化研究室",
  },
  {
    value: "電子回路研究室",
    label: "電子回路研究室",
  },
  {
    value: "データ駆動ネットワーキングアーキテクチャ研究室",
    label: "データ駆動ネットワーキングアーキテクチャ研究室",
  },
  {
    value: "オペレーティングシステムとシステムソフトウェア研究室",
    label: "オペレーティングシステムとシステムソフトウェア研究室",
  },
  {
    value: "人工生命・ウェブサイエンス研究室",
    label: "人工生命・ウェブサイエンス研究室",
  },
  {
    value: "ハイパフォーマンスコンピューティングシステム研究室",
    label: "ハイパフォーマンスコンピューティングシステム研究室",
  },
  {
    value: "集積システム研究室",
    label: "集積システム研究室",
  },
  {
    value: "エッジ・コンピューティング研究室",
    label: "エッジ・コンピューティング研究室",
  },
  {
    value: "認知システムデザイン研究室",
    label: "認知システムデザイン研究室",
  },
  {
    value: "暗号・情報セキュリティ研究室",
    label: "暗号・情報セキュリティ研究室",
  },
  {
    value: "マルチメディア研究室",
    label: "マルチメディア研究室",
  },
  {
    value: "コンピュータビジョン研究室",
    label: "コンピュータビジョン研究室",
  },
  {
    value: "LaCSIS研究室",
    label: "LaCSIS研究室",
  },
  {
    value: "計算視覚科学研究室",
    label: "計算視覚科学研究室",
  },
  {
    value: "サービスコンピューティング研究室",
    label: "サービスコンピューティング研究室",
  },
  {
    value: "適応情報処理研究室",
    label: "適応情報処理研究室",
  },
  {
    value: "知的画像処理研究室",
    label: "知的画像処理研究室",
  },
  {
    value: "計算幾何学とグラフィックス研究室",
    label: "計算幾何学とグラフィックス研究室",
  },
  {
    value: "自然言語処理on the Web研究室",
    label: "自然言語処理on the Web研究室",
  },
  {
    value: "暗号理論研究室",
    label: "暗号理論研究室",
  },
  {
    value: "制御システム研究室",
    label: "制御システム研究室",
  },
  {
    value: "システム数理研究室",
    label: "システム数理研究室",
  },
  {
    value: "情報数理研究室",
    label: "情報数理研究室",
  },
  {
    value: "高性能計算ビジュアルサイエンス研究室",
    label: "高性能計算ビジュアルサイエンス研究室",
  },
  {
    value: "ii-research",
    label: "ii-research",
  },
  {
    value: "上保研究室",
    label: "上保研究室",
  },
  {
    value: "照山研究室",
    label: "照山研究室",
  },
  {
    value: "辻慶太研究室",
    label: "辻慶太研究室",
  },
  {
    value: "松原研究室",
    label: "松原研究室",
  },
  {
    value: "メディア心理学研究室",
    label: "メディア心理学研究室",
  },
  {
    value: "横山研究室",
    label: "横山研究室",
  },
  {
    value: "松林麻実子研究室",
    label: "松林麻実子研究室",
  },
  {
    value: "太田美奈子研究室",
    label: "太田美奈子研究室",
  },
  {
    value: "鈴木伸崇研究室",
    label: "鈴木伸崇研究室",
  },
  {
    value: "宇陀則彦研究室",
    label: "宇陀則彦研究室",
  },
  {
    value: "知識獲得システム研究室",
    label: "知識獲得システム研究室",
  },
  {
    value: "阪口研究室",
    label: "阪口研究室",
  },
  {
    value: "コミュニケーション理解研究室",
    label: "コミュニケーション理解研究室",
  },
  {
    value: "高久研究室",
    label: "高久研究室",
  },
  {
    value: "時井研究室",
    label: "時井研究室",
  },
  {
    value: "人間・情報・技術研究室 ",
    label: "人間・情報・技術研究室 ",
  },
  {
    value: "筑波大デジタルネイチャーグループ",
    label: "筑波大デジタルネイチャーグループ",
  },
  {
    value: "メディア・インタラクション研究室",
    label: "メディア・インタラクション研究室",
  },
  {
    value: "呑海研究室",
    label: "呑海研究室",
  },
  {
    value: "吉田右子研究室",
    label: "吉田右子研究室",
  },
  {
    value: "村田研究室",
    label: "村田研究室",
  },
  {
    value: "アーカイブス学研究室",
    label: "アーカイブス学研究室",
  },
  {
    value: "原研究室",
    label: "原研究室",
  },
  {
    value: "武田将季研究室",
    label: "武田将季研究室",
  },
  {
    value: "高良研究室",
    label: "高良研究室",
  },
  {
    value: "学習メディア基盤研究室",
    label: "学習メディア基盤研究室",
  },
  {
    value: "著作権法の研究室（村井麻衣子）",
    label: "著作権法の研究室（村井麻衣子）",
  },
  {
    value: "小泉公乃研究室",
    label: "小泉公乃研究室",
  },
  {
    value: "綿抜豊昭研究室",
    label: "綿抜豊昭研究室",
  },
]
  .sort((a, b) => a.label.localeCompare(b.label, "ja"))
  .concat({ value: "その他", label: "その他" });

export const fields = [
  {
    value: "機械力学、メカトロニクス",
    label: "機械力学、メカトロニクス",
  },
  {
    value: "ロボティクス、知能機械システム",
    label: "ロボティクス、知能機械システム",
  },
  {
    value: "情報学基礎論",
    label: "情報学基礎論",
  },
  {
    value: "数理情報学",
    label: "数理情報学",
  },
  {
    value: "統計科学",
    label: "統計科学",
  },
  {
    value: "計算機システム",
    label: "計算機システム",
  },
  {
    value: "ソフトウェア",
    label: "ソフトウェア",
  },
  {
    value: "情報ネットワーク",
    label: "情報ネットワーク",
  },
  {
    value: "情報セキュリティ",
    label: "情報セキュリティ",
  },
  {
    value: "データベース",
    label: "データベース",
  },
  {
    value: "高性能計算",
    label: "高性能計算",
  },
  {
    value: "計算科学",
    label: "計算科学",
  },
  {
    value: "知覚情報処理",
    label: "知覚情報処理",
  },
  {
    value: "ヒューマンインタフェース、インタラクション",
    label: "ヒューマンインタフェース、インタラクション",
  },
  {
    value: "知能情報学",
    label: "知能情報学",
  },
  {
    value: "ソフトコンピューティング",
    label: "ソフトコンピューティング",
  },
  {
    value: "知能ロボティクス",
    label: "知能ロボティクス",
  },
  {
    value: "感性情報学",
    label: "感性情報学",
  },
  {
    value: "生命、健康、医療情報学",
    label: "生命、健康、医療情報学",
  },
  {
    value: "ウェブ情報学、サービス情報学",
    label: "ウェブ情報学、サービス情報学",
  },
  {
    value: "学習支援システム",
    label: "学習支援システム",
  },
  {
    value: "エンタテインメント、ゲーム情報学",
    label: "エンタテインメント、ゲーム情報学",
  },
]
  .sort((a, b) => a.label.localeCompare(b.label, "ja"))
  .concat({ value: "その他", label: "その他" });

export const paperData: paperInterface[] = [
  {
    id: "1",
    title: "Python",
    tldr: "Programming langauge",
  },
  {
    id: "2",
    title: "情報工学先生",
    tldr: "論文検索システム",
  },
];
