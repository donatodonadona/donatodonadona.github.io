# CLAUDE.md — personal-site

`apps/personal-site/` は独立した git リポジトリ（`donatodonadona.github.io`）。

---

## Hero テキストのフォーマット禁止事項

**EN・JP 両方の hero（h1）で以下を禁止する。過去の既存コードにこのパターンがあっても踏襲しないこと。**

- `<br>` による改行禁止 — 折り返しはブラウザに任せる
- 読点（`。`）禁止 — キャッチコピーに句点は不要

**違反例（禁止）:**
```html
<span data-ja>本質を読む<br><span class="gradient">専門分析</span><span class="hero-italic-ja">。</span></span>
```

**正しい書き方:**
```html
<span data-ja>本質を読む<span class="gradient">専門分析</span></span>
```

---

## 記事カードの読了時間はハードコード禁止

`articles/index.html` の読了時間バッジ（`.read-time-badge`）は **JS が動的に上書きする**。
新規記事を追加する際、カードにプレースホルダー値（例: `10 min read`）を書くことは許容されるが、
**それが最終値だと思ってはならない。**

- 実際の値は index.html ロード時に各記事をfetchして `.article-body` の文字数÷500で算出される
- ハードコード値を「正しい」と確認・報告することは禁止

---

## 新規記事作成のテンプレート参照ルール

**新規記事は必ず `articles/template.html` を唯一の参照元として作成すること。**

- 既存記事をコピーして作成することを禁止する — 既存記事はバグや仕様ズレを含む場合がある
- 「〇〇記事をテンプレートに」という指示があっても、`template.html` を基準として使い、既存記事は内容の参考にとどめる

### exec-summary の正規構造（厳守）

```html
<section class="exec-summary">
  <!-- 概要 -->
  <div class="exec-block">
    <div class="section-label"><span class="lang-ja">概要</span><span class="lang-en">Summary</span></div>
    <p class="exec-tldr">...</p>
  </div>
  <!-- 論点 -->
  <div class="exec-block">
    <div class="section-label"><span class="lang-ja">本稿の論点</span><span class="lang-en">Key Questions</span></div>
    <ul class="issues-list">...</ul>
  </div>
  <!-- 実務家への含意 -->
  <div class="exec-block">
    <div class="section-label"><span class="lang-ja">[シリーズ]実務家への含意</span><span class="lang-en">Implications for Practitioners</span></div>
    ...
  </div>
</section>
```

- ブロック1ラベル: 常に `概要 / Summary`
- ブロック2ラベル: 常に `本稿の論点 / Key Questions`（「今週の論点」「論点」「Finance Proが持つべき問い」等は禁止）
- ブロック3ラベル: シリーズ名を前置してよい（例: `Valuation実務家への含意`）
- `section-label` は必ず `<div>` を使う（`<span>` 禁止）
