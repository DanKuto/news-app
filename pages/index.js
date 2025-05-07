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
  const [loading, setLoading] = useState(false);

  const fetchNews = async code => {
    setLoading(true);
    const res = await fetch(`/api/news/${code}`);
    const data = await res.json();
    setNews(data);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">各國最新重點新聞</h1>
      <div className="flex space-x-2 mb-4">
        {countries.map(c => (
          <button
            key={c.code}
            onClick={() => fetchNews(c.code)}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            {c.label}
          </button>
        ))}
      </div>
      {loading && <p>載入中……</p>}
      {!loading && news.length > 0 && (
        <ul className="space-y-2">
          {news.map((item, i) => (
            <li key={i} className="border-b pb-2">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-lg">
                {item.title}
              </a>
              <p className="text-sm text-gray-500">{item.pubDate}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
