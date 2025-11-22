# サッカー試合シミュレーター (Soccer Match Simulator)

実在するヨーロッパトップリーグ（プレミアリーグ、ラ・リーガ、セリエA、ブンデスリーガ）の選手を使用して、AIによるサッカー試合のシミュレーションを行うWebアプリケーション。

## 特徴

- **リアルな選手データ**: 実在する選手の能力や特徴をAIが判断
- **監督の戦術反映**: 監督の戦術スタイルや特徴を試合に反映
- **リーグトレンド考慮**: 2024-25シーズンの各リーグトレンドを考慮
- **ランダム要素**: 天候、気温、ピッチ状態などが試合ごとに変化
- **詳細な試合結果**: スコア、得点シーン、ハイライト、統計データを提供

## 技術スタック

### フロントエンド
- React + TypeScript
- AWS CloudFront + S3（ホスティング）

### バックエンド
- TypeScript (Node.js)
- AWS Lambda + API Gateway
- Gemini API

## プロジェクト構成

```
soccer-match-simulator/
├── frontend/               # フロントエンドアプリケーション
│   ├── src/
│   │   ├── components/    # Reactコンポーネント
│   │   │   ├── TeamInput.tsx
│   │   │   ├── MatchResult.tsx
│   │   │   └── Statistics.tsx
│   │   ├── types/         # 型定義
│   │   │   ├── player.ts
│   │   │   ├── team.ts
│   │   │   └── match.ts
│   │   ├── services/      # APIサービス
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.tsx
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── tsconfig.json
│
├── backend/               # バックエンド Lambda関数
│   ├── src/
│   │   ├── index.ts       # Lambdaハンドラー
│   │   ├── geminiService.ts
│   │   ├── matchSimulator.ts
│   │   └── types.ts
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## セットアップ

### 前提条件

- Node.js (v18以上)
- npm または yarn
- AWS アカウント
- Gemini API キー

### フロントエンドのセットアップ

```bash
cd frontend
npm install
```

### バックエンドのセットアップ

```bash
cd backend
npm install
```

## 開発環境での実行

### フロントエンド

```bash
cd frontend
npm start
```

ブラウザで `http://localhost:3000` を開きます。

### バックエンド（ローカルテスト）

1. Gemini API キーを環境変数に設定:

```bash
export GEMINI_API_KEY="your-api-key-here"
```

2. TypeScriptをビルド:

```bash
cd backend
npm run build
```

## デプロイ

### バックエンドのデプロイ

1. Lambda関数のパッケージ作成:

```bash
cd backend
npm run package
```

2. AWS Lambda関数を作成:

```bash
aws lambda create-function \
  --function-name soccer-match-simulator \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --environment Variables={GEMINI_API_KEY=your-api-key}
```

3. API Gatewayの設定:
   - REST APIを作成
   - `/simulate-match` エンドポイントを作成
   - POSTメソッドを追加してLambda関数と統合
   - CORSを有効化

### フロントエンドのデプロイ

1. 環境変数を設定（`.env.production`ファイルを作成）:

```
REACT_APP_API_ENDPOINT=https://your-api-gateway-url
```

2. ビルド:

```bash
cd frontend
npm run build
```

3. S3バケットにアップロード:

```bash
aws s3 sync build/ s3://your-bucket-name/
```

4. CloudFrontディストリビューションを設定

## 使い方

1. ホームチームとアウェイチームの情報を入力:
   - チーム名
   - 監督名
   - フォーメーション（4-3-3, 4-4-2など）
   - 選手リスト（各11名、ポジション付き）

2. 「試合をシミュレート」ボタンをクリック

3. AIが試合をシミュレートし、以下の情報を表示:
   - 最終スコア
   - 試合環境（天候、気温、ピッチ状態）
   - 試合の流れ（前半・後半）
   - 得点シーン
   - ハイライト
   - 統計データ（ポゼッション率、シュート数など）

## 対象リーグ

- プレミアリーグ（イングランド）
- ラ・リーガ（スペイン）
- セリエA（イタリア）
- ブンデスリーガ（ドイツ）

## API仕様

### POST /simulate-match

**リクエスト:**

```json
{
  "homeTeam": {
    "name": "マンチェスター・シティ",
    "manager": "ペップ・グアルディオラ",
    "formation": "4-3-3",
    "players": [
      { "name": "エデルソン", "position": "GK" },
      ...
    ]
  },
  "awayTeam": {
    "name": "リバプール",
    "manager": "ユルゲン・クロップ",
    "formation": "4-3-3",
    "players": [
      { "name": "アリソン", "position": "GK" },
      ...
    ]
  }
}
```

**レスポンス:**

```json
{
  "score": {
    "home": 3,
    "away": 2,
    "halfTime": { "home": 1, "away": 1 }
  },
  "matchFlow": {
    "firstHalf": "...",
    "secondHalf": "..."
  },
  "goals": [...],
  "highlights": [...],
  "statistics": {...},
  "weather": {...}
}
```

## 今後の拡張予定

- [ ] フォーメーション図の視覚化
- [ ] 対戦履歴の保存
- [ ] 選手の試合中パフォーマンス評価
- [ ] リーグ戦シミュレーション
- [ ] トーナメント形式の大会シミュレーション

## ライセンス

MIT

## 作成日

2025年11月15日

## バージョン

1.0.0
