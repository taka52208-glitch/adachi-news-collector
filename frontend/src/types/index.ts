// ニュース記事の型定義
export interface NewsItem {
  id: string;
  title: string;
  description?: string;
  link: string;
  source: string;
  pubDate: string;
  keyword: string;
  collectedAt: string;
}

// 収集履歴の型定義
export interface CollectionHistory {
  date: string;
  totalCount: number;
  keywords: string[];
  newsItems: NewsItem[];
}

// キーワードフィルターの型定義
export interface KeywordFilter {
  keyword: string;
  count: number;
}
