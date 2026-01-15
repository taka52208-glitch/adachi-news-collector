import type { NewsItem, CollectionHistory } from '../types';

// サンプルデータ（開発用・フォールバック用）
const sampleNewsData: NewsItem[] = [
  {
    id: '1',
    title: '足立区で新しい子育て支援施設がオープン 地域住民から期待の声',
    description: '足立区は14日、区内に新しい子育て支援施設をオープンした。施設では一時預かりサービスや子育て相談などを提供し、共働き世帯を中心に利用が見込まれている。',
    link: 'https://example.com/news/1',
    source: 'NHK NEWS WEB',
    pubDate: '2026-01-15T07:00:00Z',
    keyword: '足立区',
    collectedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: '2',
    title: '北千住駅前再開発計画が進展 2027年完成目指す',
    description: '北千住駅西口の再開発事業について、足立区は具体的な計画案を発表。商業施設と住居の複合ビルを建設予定で、地域の利便性向上が期待されている。',
    link: 'https://example.com/news/2',
    source: '東京新聞',
    pubDate: '2026-01-15T05:00:00Z',
    keyword: '北千住',
    collectedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: '3',
    title: '西新井大師で初詣客20万人 例年を上回る賑わい',
    description: '西新井大師では元日から3日間で約20万人の初詣客が訪れ、例年を上回る賑わいを見せた。厄除けの祈願に訪れる人々で境内は終日混雑した。',
    link: 'https://example.com/news/3',
    source: '朝日新聞',
    pubDate: '2026-01-15T04:00:00Z',
    keyword: '西新井',
    collectedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: '4',
    title: '竹ノ塚駅周辺の踏切が立体交差化 渋滞解消へ',
    description: '長年の課題だった竹ノ塚駅周辺の踏切問題が、立体交差化事業の完成により解消される見通しとなった。',
    link: 'https://example.com/news/4',
    source: '読売新聞',
    pubDate: '2026-01-15T03:00:00Z',
    keyword: '竹ノ塚',
    collectedAt: '2026-01-15T09:00:00Z',
  },
];

/**
 * 最新のニュースデータを取得
 */
export const fetchLatestNews = async (): Promise<NewsItem[]> => {
  try {
    // 静的JSONファイルを読み込み
    const response = await fetch('/data/latest.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as NewsItem[];
  } catch {
    // エラー時はサンプルデータを返す（開発環境用）
    return sampleNewsData;
  }
};

/**
 * 特定日のニュースデータを取得
 */
export const fetchNewsByDate = async (date: string): Promise<NewsItem[]> => {
  try {
    const response = await fetch(`/data/${date}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as NewsItem[];
  } catch {
    // エラー時はサンプルデータを返す
    return sampleNewsData;
  }
};

/**
 * 収集履歴の一覧を取得（過去7日分）
 */
export const fetchCollectionHistory = async (): Promise<CollectionHistory[]> => {
  const history: CollectionHistory[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    try {
      const response = await fetch(`/data/${dateStr}.json`);
      if (response.ok) {
        const newsItems: NewsItem[] = await response.json();
        const keywords = [...new Set(newsItems.map(item => item.keyword))];
        history.push({
          date: dateStr,
          totalCount: newsItems.length,
          keywords,
          newsItems,
        });
      }
    } catch {
      // データがない日はスキップ
    }
  }

  // データがない場合はサンプルデータを返す
  if (history.length === 0) {
    return generateSampleHistory();
  }

  return history;
};

/**
 * サンプル履歴データを生成（開発用）
 */
const generateSampleHistory = (): CollectionHistory[] => {
  const history: CollectionHistory[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    history.push({
      date: dateStr,
      totalCount: Math.floor(Math.random() * 15) + 10,
      keywords: ['足立区', '北千住', '西新井', '竹ノ塚'].slice(0, Math.floor(Math.random() * 3) + 2),
      newsItems: sampleNewsData,
    });
  }

  return history;
};
