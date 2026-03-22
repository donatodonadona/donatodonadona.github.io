# CLAUDE.md — personal-site

`apps/personal-site/` は独立した git リポジトリ（`donatodonadona.github.io`）。

---

## 記事カードの読了時間はハードコード禁止

`articles/index.html` の読了時間バッジ（`.read-time-badge`）は **JS が動的に上書きする**。
新規記事を追加する際、カードにプレースホルダー値（例: `10 min read`）を書くことは許容されるが、
**それが最終値だと思ってはならない。**

- 実際の値は index.html ロード時に各記事をfetchして `.article-body` の文字数÷500で算出される
- ハードコード値を「正しい」と確認・報告することは禁止
