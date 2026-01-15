# プロジェクト設定

## 基本設定
```yaml
プロジェクト名: 足立区ニュース収集ツール
開始日: 2025-01-14
技術スタック:
  frontend: React 18 + TypeScript 5 + MUI v6 + Vite 5
  backend: Python 3.11 (収集スクリプト)
  database: JSONファイル (GitHubリポジトリ内)
  hosting: Vercel (フロントエンド) + GitHub Actions (定期実行)
```

## 開発環境
```yaml
ポート設定:
  frontend: 3247
  backend: なし (GitHub Actionsで実行)

環境変数:
  設定ファイル: .env.local（ルートディレクトリ）
  必須項目:
    - なし (外部APIキー不要)
```

## コーディング規約

### 命名規則
```yaml
ファイル名:
  - コンポーネント: PascalCase.tsx (例: NewsCard.tsx)
  - ユーティリティ: camelCase.ts (例: formatDate.ts)
  - 定数: UPPER_SNAKE_CASE.ts (例: KEYWORDS.ts)

変数・関数:
  - 変数: camelCase
  - 関数: camelCase
  - 定数: UPPER_SNAKE_CASE
  - 型/インターフェース: PascalCase
```

### コード品質
```yaml
必須ルール:
  - TypeScript: strictモード有効
  - 未使用の変数/import禁止
  - console.log本番環境禁止
  - エラーハンドリング必須
  - 関数行数: 100行以下
  - ファイル行数: 700行以下
  - 複雑度: 10以下
  - 行長: 120文字

フォーマット:
  - インデント: スペース2つ
  - セミコロン: あり
  - クォート: シングル
```

## プロジェクト固有ルール

### ディレクトリ構成
```
/
├── frontend/          # Reactアプリ
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── types/
│   │   └── data/      # JSONデータ配置
│   └── package.json
├── scripts/           # Python収集スクリプト
│   └── collect_news.py
├── data/              # 収集データ (JSON)
│   └── news/
│       └── YYYY-MM-DD.json
├── .github/
│   └── workflows/
│       └── daily-collect.yml
├── docs/
│   ├── requirements.md
│   └── SCOPE_PROGRESS.md
└── CLAUDE.md
```

### データファイル形式
```yaml
ニュースデータ (data/news/YYYY-MM-DD.json):
  形式: JSON配列
  構造:
    - id: string (一意識別子)
    - title: string (記事タイトル)
    - description: string (概要)
    - link: string (元記事URL)
    - source: string (ニュースソース)
    - pubDate: string (公開日時 ISO8601)
    - keyword: string (検索キーワード)
    - collectedAt: string (収集日時 ISO8601)
```

### 検索キーワード
```yaml
足立区関連キーワード:
  - 足立区
  - 北千住
  - 竹ノ塚
  - 西新井
  - 綾瀬
  - 梅島
  - 五反野
  - 青井
  - 六町
  - 舎人
  - 花畑
  - 千住
```

## 型定義
```yaml
配置:
  frontend: frontend/src/types/index.ts

主要な型:
  - NewsItem: ニュース記事
  - CollectionHistory: 収集履歴
```

## 外部サービス
```yaml
Google News RSS:
  - URL形式: https://news.google.com/rss/search?hl=ja&gl=JP&ceid=JP:ja&q={keyword}
  - 認証: 不要
  - 制限: なし (非公式API)

GitHub Actions:
  - 実行: 毎日 00:00 UTC (09:00 JST)
  - 制限: 2,000分/月 (無料枠)

Vercel:
  - プラン: Hobby (無料)
  - 制限: 100GB帯域/月
```

## 最新技術情報
```yaml
# Web検索で解決した注意点
Google News RSS:
  - 公式APIではないため仕様変更の可能性あり
  - 日本語キーワードはURLエンコード必須
```
