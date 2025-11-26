# Antigravity Account Book

Web上で確認可能な家計簿アプリ。毎月の収入を予算に振り分け、日々の支出を記録し、将来の貯金をシミュレーションできます。

## 特徴

- **ダッシュボード**: 家計の全体像（収入、支出、残高）を一目で確認。
- **予算設定**: 毎月の収入を登録し、各カテゴリー（食費、家賃など）に予算を振り分け。
- **取引履歴**: 日々の支出を記録し、カテゴリーごとの残高をリアルタイムで確認。
- **貯金シミュレーション**: 現在のペースで貯金した場合の1年後、5年後、10年後の資産推移を予測。
- **レスポンシブデザイン**: スマホ、タブレット、PCのいずれでも快適に利用可能。
- **データ保存**: データはブラウザのLocalStorageに保存されるため、会員登録不要ですぐに使えます。

## 技術スタック

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS (CSS Modules)
- **Deployment**: Vercel (Recommended)

## 始め方

開発サーバーを起動して、ローカルでアプリを確認します。

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 無料で公開する方法

このアプリケーションは Next.js で構築されており、以下のプラットフォームで簡単に**無料**で公開できます。

### 1. Vercel (推奨)
Next.jsの開発元であるVercelが提供するプラットフォームです。最も相性が良く、設定不要でデプロイできます。

1. [Vercel](https://vercel.com/signup)のアカウントを作成。
2. GitHubなどのGitリポジトリにこのプロジェクトをプッシュ。
3. Vercelのダッシュボードで「Add New...」→「Project」を選択。
4. リポジトリを選択して「Deploy」をクリック。

### 2. Netlify
Vercelと同様に人気のあるホスティングサービスです。

1. [Netlify](https://www.netlify.com/)のアカウントを作成。
2. Gitリポジトリを連携。
3. ビルド設定（Build command: `npm run build`, Publish directory: `.next` または `out`）を確認してデプロイ。

### 3. Render
Webサービスや静的サイトをホストできるプラットフォームです。

1. [Render](https://render.com/)のアカウントを作成。
2. 「New +」→「Static Site」または「Web Service」を選択。
3. リポジトリを連携してデプロイ。
