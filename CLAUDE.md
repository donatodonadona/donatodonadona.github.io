# CLAUDE.md — personal-site

`apps/personal-site/` は独立した git リポジトリ（`donatodonadona.github.io`）。

---

## Hero テキストのフォーマット禁止事項

**JP hero（h1）では以下を禁止する。過去の既存コードにこのパターンがあっても踏襲しないこと。**

- `<br>` による改行禁止 — JPテキストは折り返しをブラウザに任せる
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
