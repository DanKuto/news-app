import { useState } from 'react';

const countries = [
  { code: 'us', label: '美國' },
  { code: 'gb', label: '英國' },
  { code: 'jp', label: '日本' },
  { code: 'cn', label: '中國' },
  { code: 'tw', label: '台灣' },
];

export default function Home() {
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [fullArticles, setFullArticles] = useState({});
  const [loadingArticleId, setLoadingArticleId] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(null);

  // 抓列表 （reset=true 換國家，reset=false 載更多）
  const fetchNews = async (code, reset = false) => {
    setLoadingNews(true);
    setCurrentCountry(code);
    if (reset) {
      setNews([]); setPage(0); setHasMore(false); setFullArticles({});
    }
    try {
      const offset = reset ? 0 : page * 5;
      const res = await fetch(`/api/news/${code}?offset=${offset}`);
      const { items, count } = await res.json();
      setNews(prev => (reset ? items : [...prev, ...items]));
      setHasMore(count === 5);
      setPage(prev => (reset ? 1 : prev + 1));
    } catch {
      if (reset) setNews([]);
      setHasMore(false);
    } finally {
      setLoadingNews(false);
    }
  };

  // 切換摘要／全文
  const toggleArticle = async (link, idx) => {
    if (fullArticles[idx]) {
      // 收回全文
      setFullArticles(prev => {
        const { [idx]: _, ...rest } = prev;
        return rest;
      });
      return;
    }
    // 讀全文
    setLoadingArticleId(idx);
    try {
      const res = await fetch(`/api/article?url=${encodeURIComponent(link)}`);
      const { content } = await res.json();
      setFullArticles(prev => ({ ...prev, [idx]: content }));
    } catch {
      setFullArticles(prev => ({ ...prev, [idx]: '全文載入失敗。' }));
    } finally {
      setLoadingArticleId(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">各國最新重點新聞</h1>

      {/* 國家按鈕（reset=true） */}
      <div className="flex space-x-2 mb-4">
        {countries.map(c => (
          <button
            key={c.code}
            onClick={() => fetchNews(c.code, true)}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            {c.label}
          </button>
        ))}
      </div>

      {loadingNews && <p>載入中……</p>}

      {/* 新聞列表 */}
      <ul className="space-y-4">
        {news.map((item, i) => (
          <li key={i} className="border-b pb-2">
            <div className="flex items-center justify-between">
              <a
                href="#!"
                onClick={() => toggleArticle(item.link, i)}
                className="text-lg font-medium hover:underline"
              >
                {item.title}
              </a>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
              >
                查看原文
              </a>
            </div>

            {/* 摘要（沒展開全文才顯示） */}
            {!fullArticles[i] && item.snippet && (
              <p className="text-sm text-gray-700 my-1">{item.snippet}</p>
            )}

            {/* 全文載入中 */}
            {loadingArticleId === i && <p>載入全文中……</p>}

            {/* 全文 */}
            {fullArticles[i] && (
              <div className="mt-2 p-2 bg-gray-50 text-sm whitespace-pre-wrap">
                {fullArticles[i]}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-1">{item.pubDate}</p>
          </li>
        ))}
      </ul>

      {/* 載入更多 */}
      {hasMore && !loadingNews && (
        <div className="text-center mt-4">
          <button
            onClick={() => fetchNews(currentCountry, false)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            載入更多
          </button>
        </div>
      )}
    </div>
  );
}
