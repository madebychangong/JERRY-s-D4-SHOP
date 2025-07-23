import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const { html } = req.body;

  if (!html) {
    return res.status(400).send('Missing HTML');
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const screenshot = await page.screenshot({ type: 'png' });
  await browser.close();

  res.setHeader('Content-Type', 'image/png');
  res.send(screenshot);
}
