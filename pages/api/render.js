import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'HTML content is required.' });
  }

  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const screenshotBuffer = await page.screenshot({ type: 'png', fullPage: true });

    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(screenshotBuffer);
  } catch (error) {
    console.error('Error rendering image:', error);
    res.status(500).json({ error: 'Failed to render image.' });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}
