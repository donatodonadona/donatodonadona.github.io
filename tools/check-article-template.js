#!/usr/bin/env node
/**
 * PreToolUse hook — Write ツール実行前に articles/*.html の構造を検証する。
 * テンプレート必須要素が揃っていない場合は exit(2) でブロックする。
 *
 * 登録: settings.json の PreToolUse → matcher: "Write"
 */

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  let data;
  try { data = JSON.parse(input); } catch { process.exit(0); }

  const toolName = data?.tool_name || data?.tool || '';
  if (toolName !== 'Write') process.exit(0);

  const filePath = (data?.tool_input?.file_path || data?.file_path || '').replace(/\\/g, '/');

  // articles/*.html のみ対象（index.html と template.html は除外）
  if (!filePath.includes('articles/')) process.exit(0);
  if (!filePath.endsWith('.html')) process.exit(0);
  if (filePath.endsWith('index.html')) process.exit(0);
  if (filePath.endsWith('template.html')) process.exit(0);

  const content = data?.tool_input?.content || data?.content || '';

  const checks = [
    {
      pattern: /class="exec-summary"/,
      label: '<section class="exec-summary"> がない',
    },
    {
      pattern: /<div class="section-label"[^>]*>[^<]*<span class="lang-ja">概要<\/span>/,
      label: '概要/Summary ラベル（ブロック1）がない',
    },
    {
      pattern: /本稿の論点/,
      label: '本稿の論点 ラベル（ブロック2）がない',
    },
    {
      pattern: /Key Questions/,
      label: 'Key Questions ラベル（ブロック2 EN）がない',
    },
    {
      pattern: /class="exec-tldr"/,
      label: '<p class="exec-tldr"> がない',
    },
    {
      pattern: /id="reading-time-badge"/,
      label: 'id="reading-time-badge" がない（sbar-badge にIDが必要。template.html を参照）',
    },
    {
      pattern: /id="reading-time-badge2"/,
      label: 'id="reading-time-badge2" がない（sbar-badge にIDが必要。template.html を参照）',
    },
    {
      pattern: /getElementById\(.*reading-time-badge/,
      label: '読了時間JS（getElementById("reading-time-badge")）がない（CLAUDE.md を参照）',
    },
  ];

  const forbidden = [
    {
      pattern: /<div class="section-label">TL;DR<\/div>/,
      label: 'TL;DR ラベルが残っている（概要/Summary に変更してください）',
    },
  ];

  const failures = checks.filter(c => !c.pattern.test(content)).map(c => `  ✗ ${c.label}`);
  const violations = forbidden.filter(c => c.pattern.test(content)).map(c => `  ✗ ${c.label}`);
  const all = [...failures, ...violations];

  if (all.length > 0) {
    process.stderr.write(
      `[article-template-check] テンプレート構造エラー — ${filePath}\n` +
      all.join('\n') + '\n' +
      '\ntemplate.html から記事を作成し、TODO箇所のみ編集してください。\n'
    );
    process.exit(2); // 2 = block tool call
  }

  process.exit(0);
});
