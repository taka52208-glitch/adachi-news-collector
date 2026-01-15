#!/usr/bin/env python3
"""
足立区ニュース収集スクリプト
Google News RSSから足立区関連のニュースを収集してJSONファイルに保存
"""

import json
import hashlib
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from html import unescape
import re
import time

# 検索キーワード（足立区および区内の主要地名）
KEYWORDS = [
    '足立区',
    '北千住',
    '竹ノ塚',
    '西新井',
    '綾瀬',
    '梅島',
    '五反野',
    '青井',
    '六町',
    '舎人',
    '花畑',
    '千住',
]

# Google News RSS URL テンプレート
GOOGLE_NEWS_RSS_URL = 'https://news.google.com/rss/search?hl=ja&gl=JP&ceid=JP:ja&q={keyword}'

# プロジェクトルートディレクトリ
PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / 'data' / 'news'


def generate_id(title: str, link: str) -> str:
    """記事のユニークIDを生成"""
    content = f"{title}{link}"
    return hashlib.md5(content.encode('utf-8')).hexdigest()[:12]


def clean_html(text: str) -> str:
    """HTMLタグを除去してテキストをクリーンアップ"""
    if not text:
        return ''
    # HTMLエンティティをデコード
    text = unescape(text)
    # HTMLタグを除去
    text = re.sub(r'<[^>]+>', '', text)
    # 余分な空白を整理
    text = ' '.join(text.split())
    return text.strip()


def parse_pub_date(pub_date_str: str) -> str:
    """公開日時をISO8601形式に変換"""
    try:
        # RFC 2822形式をパース（例: "Wed, 15 Jan 2026 07:00:00 GMT"）
        from email.utils import parsedate_to_datetime
        dt = parsedate_to_datetime(pub_date_str)
        return dt.isoformat()
    except Exception:
        # パースできない場合は現在時刻を返す
        return datetime.now(timezone.utc).isoformat()


def extract_source(title: str) -> tuple[str, str]:
    """タイトルからソース名を抽出（Google Newsの形式: "タイトル - ソース名"）"""
    if ' - ' in title:
        parts = title.rsplit(' - ', 1)
        return parts[0].strip(), parts[1].strip()
    return title, 'Unknown'


def fetch_news_for_keyword(keyword: str) -> list[dict]:
    """指定キーワードでGoogle News RSSからニュースを取得"""
    encoded_keyword = urllib.parse.quote(keyword)
    url = GOOGLE_NEWS_RSS_URL.format(keyword=encoded_keyword)

    news_items = []

    try:
        # リクエストヘッダーを設定
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        req = urllib.request.Request(url, headers=headers)

        with urllib.request.urlopen(req, timeout=30) as response:
            xml_content = response.read()

        # XMLをパース
        root = ET.fromstring(xml_content)

        # RSSのitem要素を取得
        for item in root.findall('.//item'):
            title_elem = item.find('title')
            link_elem = item.find('link')
            description_elem = item.find('description')
            pub_date_elem = item.find('pubDate')

            if title_elem is None or link_elem is None:
                continue

            raw_title = title_elem.text or ''
            title, source = extract_source(raw_title)
            link = link_elem.text or ''
            description = clean_html(description_elem.text) if description_elem is not None else ''
            pub_date = parse_pub_date(pub_date_elem.text) if pub_date_elem is not None else datetime.now(timezone.utc).isoformat()

            news_item = {
                'id': generate_id(title, link),
                'title': title,
                'description': description[:500] if description else '',  # 500文字以内に制限
                'link': link,
                'source': source,
                'pubDate': pub_date,
                'keyword': keyword,
                'collectedAt': datetime.now(timezone.utc).isoformat(),
            }

            news_items.append(news_item)

    except urllib.error.URLError as e:
        print(f"[ERROR] キーワード '{keyword}' の取得に失敗: {e}")
    except ET.ParseError as e:
        print(f"[ERROR] キーワード '{keyword}' のXMLパースに失敗: {e}")
    except Exception as e:
        print(f"[ERROR] キーワード '{keyword}' で予期せぬエラー: {e}")

    return news_items


def remove_duplicates(news_items: list[dict]) -> list[dict]:
    """重複記事を除去（IDベース）"""
    seen_ids = set()
    unique_items = []

    for item in news_items:
        if item['id'] not in seen_ids:
            seen_ids.add(item['id'])
            unique_items.append(item)

    return unique_items


def collect_all_news() -> list[dict]:
    """全キーワードでニュースを収集"""
    all_news = []

    for keyword in KEYWORDS:
        print(f"[INFO] キーワード '{keyword}' で検索中...")
        news_items = fetch_news_for_keyword(keyword)
        print(f"[INFO] {len(news_items)} 件取得")
        all_news.extend(news_items)
        # レート制限を避けるため少し待機
        time.sleep(1)

    # 重複を除去
    unique_news = remove_duplicates(all_news)
    print(f"[INFO] 重複除去後: {len(unique_news)} 件")

    # 公開日時でソート（新しい順）
    unique_news.sort(key=lambda x: x['pubDate'], reverse=True)

    return unique_news


def save_news(news_items: list[dict], date_str: str = None) -> Path:
    """ニュースデータをJSONファイルに保存"""
    if date_str is None:
        date_str = datetime.now().strftime('%Y-%m-%d')

    # データディレクトリが存在しない場合は作成
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    file_path = DATA_DIR / f'{date_str}.json'

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(news_items, f, ensure_ascii=False, indent=2)

    print(f"[INFO] 保存完了: {file_path}")
    return file_path


def copy_to_frontend(news_items: list[dict], date_str: str = None) -> None:
    """フロントエンドのpublic/dataディレクトリにコピー（静的ファイルとして配信）"""
    if date_str is None:
        date_str = datetime.now().strftime('%Y-%m-%d')

    frontend_public_data_dir = PROJECT_ROOT / 'frontend' / 'public' / 'data'
    frontend_public_data_dir.mkdir(parents=True, exist_ok=True)

    # 日付別データを保存
    date_file = frontend_public_data_dir / f'{date_str}.json'
    with open(date_file, 'w', encoding='utf-8') as f:
        json.dump(news_items, f, ensure_ascii=False, indent=2)

    # 最新データとしてもコピー
    latest_file = frontend_public_data_dir / 'latest.json'
    with open(latest_file, 'w', encoding='utf-8') as f:
        json.dump(news_items, f, ensure_ascii=False, indent=2)

    print(f"[INFO] フロントエンド用データ保存完了: {latest_file}")


def main():
    """メイン処理"""
    print("=" * 50)
    print("足立区ニュース収集開始")
    print(f"実行日時: {datetime.now().isoformat()}")
    print("=" * 50)

    # ニュース収集
    news_items = collect_all_news()

    if not news_items:
        print("[WARN] 収集されたニュースがありません")
        return

    # 保存
    today = datetime.now().strftime('%Y-%m-%d')
    save_news(news_items, today)
    copy_to_frontend(news_items, today)

    print("=" * 50)
    print(f"収集完了: {len(news_items)} 件")
    print("=" * 50)


if __name__ == '__main__':
    main()
