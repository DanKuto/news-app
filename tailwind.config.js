/** @type {import('tailwindcss').Config} */
module.exports = {
    // 1. 跟隨使用者系統的深／淺色偏好
    darkMode: 'media',
  
    // 2. 所有會用到 Tailwind 類別的檔案路徑
    content: [
      './pages/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
      './styles/**/*.{css}',
    ],
  
    // 3. 自定義主題延展（目前保留預設）
    theme: {
      extend: {},
    },
  
    // 4. 任何 Tailwind plugin（這裡暫時不需要額外 plugin）
    plugins: [],
  };
  