// /Users/dan/Web/news-app/pages/api/article.js
import { load } from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'missing url' });
  }

  try {
    // 直接抓 RSS 給你的網址，不再經過任何包裹頁
    const decodedUrl = decodeURIComponent(url);
    const response = await fetch(decodedUrl);
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }
    const html = await response.text();
    const $ = load(html);

    // 提取段落
    let paragraphs = [];
    if ($('article').length) {
      $('article p').each((_, el) => paragraphs.push($(el).text()));
    } else if ($('main').length) {
      $('main p').each((_, el) => paragraphs.push($(el).text()));
    } else {
      $('p').each((_, el) => paragraphs.push($(el).text()));
    }

    // 過濾掉「廣告」或「Advertisement」，也去除小於 30 字的段落
    const clean = paragraphs
      .map(p => p.trim())
      .filter(p => p.length >= 30 && !/廣告/.test(p) && !/Advertisement/.test(p));

    const content = clean.join('\n\n').trim();
    return res.status(200).json({ content });
  } catch (err) {
    console.error('Article fetch/parse failed:', err);
    return res.status(500).json({ error: 'failed to fetch article' });
  }
}
