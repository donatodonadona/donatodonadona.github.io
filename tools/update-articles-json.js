#!/usr/bin/env node
/**
 * update-articles-json.js
 * Scans all article HTML files and regenerates articles/articles.json
 * Run manually: node tools/update-articles-json.js
 */

const fs   = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../articles');
const JSON_OUT     = path.join(ARTICLES_DIR, 'articles.json');

function toCategory(genreEn) {
  const g = (genreEn || '').toLowerCase();
  if (g.includes('tax'))                       return 'tax';
  if (g.includes('valuation'))                 return 'valuation';
  if (g.includes('career'))                    return 'career';
  if (g.includes('accounting'))                return 'accounting';
  if (g.includes('ai') || g.includes('model')) return 'ai';
  if (g.includes('m&a') || g.includes('m & a')) return 'ma';
  if (g.includes('damodaran'))                 return 'damodaran';
  if (g.includes('law') || g.includes('securities') || g.includes('legal')) return 'legal';
  if (g.includes('macro') || g.includes('cyclical')) return 'macro';
  if (g.includes('dloc') || g.includes('dlom') || g.includes('discount')) return 'valuation';
  if (g.includes('multiples') || g.includes('comparab')) return 'valuation';
  if (g.includes('wacc') || g.includes('beta') || g.includes('capm')) return 'valuation';
  return g.split(/\s+/)[0].replace(/[^a-z]/g, '') || 'article';
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
}

function parseArticle(filePath, filename) {
  const html = fs.readFileSync(filePath, 'utf-8');

  // Date: use filename prefix (YYYY-MM-DD)
  const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : '2026-01-01';

  // Title: from <h1 class="article-headline">
  const title = { ja: '', en: '' };
  const h1Match = html.match(/<h1[^>]*class="article-headline"[^>]*>([\s\S]*?)<\/h1>/);
  if (h1Match) {
    const inner = h1Match[1];
    const jaM = inner.match(/<span[^>]*class="lang-ja"[^>]*>([\s\S]*?)<\/span>/);
    const enM = inner.match(/<span[^>]*class="lang-en"[^>]*>([\s\S]*?)<\/span>/);
    if (jaM) title.ja = stripTags(jaM[1]);
    if (enM) title.en = stripTags(enM[1]);
  }

  // Summary: from <p class="article-standfirst">
  const summary = { ja: '', en: '' };
  const sfMatch = html.match(/<p[^>]*class="article-standfirst"[^>]*>([\s\S]*?)<\/p>/);
  if (sfMatch) {
    const inner = sfMatch[1];
    const jaM = inner.match(/<span[^>]*class="lang-ja"[^>]*>([\s\S]*?)<\/span>/);
    const enM = inner.match(/<span[^>]*class="lang-en"[^>]*>([\s\S]*?)<\/span>/);
    if (jaM) summary.ja = stripTags(jaM[1]);
    if (enM) summary.en = stripTags(enM[1]);
  }

  // Genre: first section-label with lang spans inside article-body header
  const genre = { ja: '', en: '' };
  const bodyIdx = html.indexOf('<article class="article-body">');
  if (bodyIdx !== -1) {
    // Look at a 3000-char window from the article element start
    const chunk = html.slice(bodyIdx, bodyIdx + 3000);
    // Match div.section-label (may contain inner spans) and span.section-label (plain text)
    const slDivs  = [...chunk.matchAll(/<div[^>]*class="section-label"[^>]*>([\s\S]*?)<\/div>/g)];
    const slSpans = [...chunk.matchAll(/<span[^>]*class="section-label"[^>]*>([^<]*)<\/span>/g)];
    const slMatches = [...slDivs, ...slSpans].sort((a, b) => a.index - b.index);
    const skip = ['概要', 'summary', 'tl;dr', 'key point', 'key number', 'reference', 'キーポイント'];
    for (const m of slMatches) {
      const inner = m[1];
      const jaM = inner.match(/<span[^>]*class="lang-ja"[^>]*>([\s\S]*?)<\/span>/);
      const enM = inner.match(/<span[^>]*class="lang-en"[^>]*>([\s\S]*?)<\/span>/);
      if (jaM && enM) {
        const jaText = stripTags(jaM[1]);
        const enText = stripTags(enM[1]);
        if (!skip.some(s => enText.toLowerCase().includes(s) || jaText.includes(s))) {
          genre.ja = jaText;
          genre.en = enText;
          break;
        }
      } else if (!jaM && !enM) {
        // Plain-text section-label (no lang spans)
        const text = stripTags(inner);
        if (text && !skip.some(s => text.toLowerCase().includes(s))) {
          genre.ja = text;
          genre.en = text;
          break;
        }
      }
    }
    // Fallback: badge pattern (e.g. badge-damodaran)
    if (!genre.en) {
      const badgeMatch = chunk.match(/<span[^>]*class="badge-[^"]*"[^>]*>([\s\S]*?)<\/span>/);
      if (badgeMatch) {
        const t = stripTags(badgeMatch[1]);
        genre.ja = t;
        genre.en = t;
      }
    }
  }

  // Final fallback: infer genre from title
  if (!genre.en) {
    genre.en = 'Finance & AI';
    genre.ja = 'Finance & AI';
  }

  return {
    date,
    category: toCategory(genre.en),
    genre_en:  genre.en,
    genre_ja:  genre.ja,
    href:      `./articles/${filename}`,
    title_en:  title.en,
    title_ja:  title.ja,
    summary_en: summary.en,
    summary_ja: summary.ja,
  };
}

// --- Main ---
const files = fs.readdirSync(ARTICLES_DIR)
  .filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'template.html')
  .sort();

const articles = files
  .map(f => {
    try {
      const a = parseArticle(path.join(ARTICLES_DIR, f), f);
      if (!a.title_en || !a.title_ja) {
        console.warn(`Skipping ${f}: missing title`);
        return null;
      }
      return a;
    } catch (e) {
      console.error(`Error parsing ${f}: ${e.message}`);
      return null;
    }
  })
  .filter(Boolean)
  .sort((a, b) => b.date.localeCompare(a.date));

fs.writeFileSync(JSON_OUT, JSON.stringify(articles, null, 2) + '\n');
console.log(`articles.json updated — ${articles.length} articles`);
