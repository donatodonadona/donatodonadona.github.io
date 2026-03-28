#!/usr/bin/env node
/**
 * PostToolUse hook: when an article HTML is written to personal-site/articles/,
 * injects a reminder into Claude's context to run /jp-review before committing.
 */
process.stdin.setEncoding('utf-8');
let raw = '';
process.stdin.on('data', d => raw += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(raw || '{}');
    const filePath = (data.tool_input && data.tool_input.file_path) || '';
    if (filePath.includes('personal-site/articles/') && filePath.endsWith('.html')) {
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: '[jp-review required] 記事HTMLを作成しました。コミット前に必ず /jp-review を実行してください。'
        }
      }));
    }
  } catch (_) {
    // Never block Claude on hook errors
  }
});
