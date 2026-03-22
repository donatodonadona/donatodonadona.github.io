# Donato Brand System

このプロジェクトの全HTMLアウトプット（Web UI、レポート、ツール）に適用するブランドスタイル。

---

## カラー

```css
:root {
  --bg:      #0A0B10;  /* Deep Navy — メイン背景 */
  --bg2:     #12141C;  /* Ink — カード・サーフェス */
  --bg3:     #1A1D28;  /* ホバー・強調サーフェス */
  --border:  #21253A;  /* ボーダー・区切り線 */
  --accent:  #6B9FC4;  /* Slate Blue — Primary */
  --accent2: #C9A84C;  /* Warm Gold — Secondary */
  --text:    #E4E2DC;  /* Warm White — メインテキスト */
  --text2:   #7A8099;  /* サブテキスト */
  --text3:   #3D4260;  /* 薄いテキスト・ラベル */
}
```

| 役割 | 色名 | HEX |
|------|------|-----|
| Primary | Slate Blue | `#6B9FC4` |
| Secondary | Warm Gold | `#C9A84C` |
| Background | Deep Navy | `#0A0B10` |
| Surface | Ink | `#12141C` |
| Text | Warm White | `#E4E2DC` |

**Big 4との差別化確認済み：** Deloitte(緑)・PwC(赤)・EY(電気黄)・KPMG(ダークネイビー)と非重複。

---

## フォント

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+JP:wght@300;400;600&family=Noto+Sans+JP:wght@300;400;500&display=swap" rel="stylesheet">
```

| 役割 | フォント | 用途 |
|------|----------|------|
| Display / 見出し | Cormorant Garamond 600 | h1, h2, セクションタイトル |
| Display italic | Cormorant Garamond 600 italic | グラデーションテキスト、強調 |
| Body EN | Inter 400 | 本文（英語） |
| Body JP | Noto Serif JP 300 | 本文（日本語） |
| Label / Mono | JetBrains Mono | セクションラベル、コード、数値 |

```css
h1, h2, .section-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
}

body {
  font-family: 'Inter', sans-serif;
}

[data-ja], :lang(ja) {
  font-family: 'Noto Serif JP', serif;
  font-weight: 300;
}

.label, .mono {
  font-family: 'JetBrains Mono', monospace;
}
```

---

## グラデーション

```css
/* テキストグラデーション（見出し強調） */
.gradient-text {
  font-style: italic;
  background: linear-gradient(135deg, #6B9FC4 0%, #C9A84C 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ラインアクセント */
.gradient-line {
  background: linear-gradient(90deg, #6B9FC4, #C9A84C);
}

/* CTAボタン */
.cta-btn {
  background: linear-gradient(135deg, #6B9FC4, #7BAED4);
  color: #0A0B10;
}
```

---

## ワードマーク

```html
<!-- "dona" はテキストカラー、"to" はWarm Gold -->
<a class="wordmark">dona<span style="color: #C9A84C">to</span></a>
```

```css
.wordmark {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: lowercase;
}
```

---

## 禁止事項（ブランド違反）

| 禁止 | 理由 | 代替 |
|------|------|------|
| `text-transform: uppercase` | 全大文字表記はブランド指針違反。JSテンプレート内のインラインstyleでも禁止 | テキスト自体を正しいケースで記述する |
| `text-transform: lowercase` | ワードマーク（donato）専用。他への流用禁止 | — |

> **特に注意:** 記事カードのジャンルバッジ・ラベル類は `text-transform:uppercase` を使わず、`articles.json` の `genre_en` / `genre_ja` に正しいケースで値を書く。

---

## 適用範囲

- `apps/personal-site/` — 個人HP（基準実装）
- `apps/html-formatter/` — HTMLレポート出力
- `apps/deep-research/` — リサーチレポート出力
- 以降追加されるすべてのHTML出力

新たにHTML UIを作る際はこのファイルを参照し、カラー・フォントを統一すること。
