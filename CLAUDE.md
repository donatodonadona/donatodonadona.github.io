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

## 読了時間の実装ルール（必須）

### 記事ページ（必須JS）

**全記事ページは以下の読了時間 JS ブロックを必ず含むこと。**
`articles/template.html` を使えば自動的に含まれる。

```js
// Reading time (500字/分)
(function() {
  var text = document.querySelector('.article-body') ? document.querySelector('.article-body').textContent : '';
  var chars = text.length;
  var minutes = Math.ceil(chars / 500);
  var el1 = document.getElementById('reading-time-badge');
  var el2 = document.getElementById('reading-time-badge2');
  if (el1) el1.querySelector('.lang-ja').textContent = '約' + minutes + '分';
  if (el2) el2.querySelector('.lang-ja').textContent = '約' + minutes + '分';
  if (el1) el1.querySelector('.lang-en').textContent = '~' + minutes + ' min read';
  if (el2) el2.querySelector('.lang-en').textContent = '~' + minutes + ' min read';
})();
```

- **JA のみ更新は禁止** — EN も必ず同時に更新する
- `.lang-ja` だけ更新するパターン（旧バグ）は使わない
- 挿入位置: Lang toggle セクションの直前

### 記事一覧（index.html）

`articles/index.html` の読了時間バッジ（`.read-time-badge`）は **JS が動的に上書きする**。
新規カードにプレースホルダー値（例: `10 min read`）を書くことは許容されるが、
**それが最終値だと思ってはならない。**

- 実際の値は index.html ロード時に各記事をfetchして `.article-body` の文字数÷500で算出される
- ハードコード値を「正しい」と確認・報告することは禁止
- index.html と記事ページは同一の計算式を使うため、両者は常に一致する

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

---

## 新規記事公開前の日本語品質チェック（必須）

**記事 HTML を作成・更新したら、commit の前に必ず `/jp-review` を実行すること。**

- 実行タイミング: 記事本文の執筆完了直後、`git commit` の前
- `/jp-review <ファイルパス>` でEN/JP対照レビューを行い、承認された修正を反映してから commit する
- この手順を完了するまで「記事完成」「公開完了」と報告してはならない
