// /Users/dan/Web/news-app/pages/api/news/[country].js

// ← 一定要放最上面
import Parser from 'rss-parser';

const parser = new Parser();
const feedMap = {
  us: 'http://rss.cnn.com/rss/edition.rss',
  gb: 'http://feeds.bbci.co.uk/news/world/rss.xml',
  jp: 'https://www3.nhk.or.jp/rss/news/cat0.xml',
  cn: 'http://www.chinadaily.com.cn/rss/china_rss.xml',
  tw: ['https://news.ltn.com.tw/rss/all.xml',
};

export default async function handler(req, res) {
  const { country, offset } = req.query;
  const url = feedMap[country];
  if (!url) return res.status(400).json({ error: 'unknown country code' });

  const start = parseInt(offset, 10) || 0;
  const limit = 5;

  try {
    const feed = await parser.parseURL(url);
    const slice = feed.items.slice(start, start + limit);
    const items = slice.map(item => {
      const realLink = item.link;
      const text = (
        item.contentSnippet ||
        item.content?.replace(/<[^>]+>/g, '') ||
        item.description?.replace(/<[^>]+>/g, '') ||
        ''
      ).substring(0, 100);
      return {
        title: item.title,
        link: realLink,
        pubDate: item.pubDate,
        snippet: text + (text.length >= 100 ? '…' : '')
      };
    });
    return res.status(200).json({ items, count: items.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'failed to fetch RSS' });
  }
}
