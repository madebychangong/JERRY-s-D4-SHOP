const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const htmlPath = path.resolve('index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // 크기 설정: 모바일 보기 기준 (예: 720px 너비)
  await page.setViewport({ width: 720, height: 1280 });

  // 스크린샷 저장
  await page.screenshot({
    path: 'output/jerry-promo.png',
    fullPage: true,
  });

  await browser.close();
})();
