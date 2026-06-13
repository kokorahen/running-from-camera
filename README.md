# Running from Camera in Japan

Photo portfolio — [runorerun.jugem.jp](https://runorerun.jugem.jp) migration to GitHub Pages.

## Setup

```bash
# 1. データと画像を収集（初回のみ）
node scripts/scrape.js

# 2. ローカルで確認
npx serve .
# → http://localhost:3000 を開く

# 3. GitHub Pages でデプロイ
# リポジトリの Settings → Pages → Source: main branch / root
```

## Structure

```
/
├── index.html       # ポートフォリオ本体
├── css/style.css
├── js/main.js
├── data/posts.json  # 記事データ（scrape.jsが生成）
├── images/          # ダウンロード済み画像
└── scripts/
    └── scrape.js    # JUGEMスクレイパー
```
