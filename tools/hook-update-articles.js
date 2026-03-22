#!/usr/bin/env node
/**
 * PostToolUse hook: re-generates articles.json when an article HTML is written.
 * Claude Code passes hook input as JSON via stdin.
 */
process.stdin.setEncoding('utf-8');
let raw = '';
process.stdin.on('data', d => raw += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(raw || '{}');
    const filePath = (data.tool_input && data.tool_input.file_path) || '';
    if (filePath.includes('personal-site/articles/') && filePath.endsWith('.html')) {
      require('child_process').execSync(
        'node "c:/Users/mrmrs/ai-dev-project/apps/personal-site/tools/update-articles-json.js"',
        { stdio: 'inherit' }
      );
    }
  } catch (_) {
    // Never block Claude on hook errors
  }
});
