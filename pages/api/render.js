// pages/api/render.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const data = req.body;

  // 템플릿 HTML 파일 읽기
  const templatePath = path.join(process.cwd(), 'templates', 'jerry.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  // 사용자 입력값으로 {{변수}} 치환
  Object.keys(data).forEach((key) => {
    const value = String(data[key] || '');
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });

  // Puppeteer로 이미지 렌더링
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const imageBuffer = await page.screenshot({ type: 'png', fullPage: true });
  await browser.close();

  res.setHeader('Content-Type', 'image/png');
  res.status(200).send(imageBuffer);
}
