import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ storageState: 'auth.json' });
  const page = await context.newPage();

  // 打开页面（已是登录状态）
  await page.goto('https://app.phrase.com/accounts/weex-global/repo_syncs');

  // 找到所有行
  const rows = await page.$$('#content div:nth-child(2) div turbo-frame table tbody tr');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const td = await row.$('td:nth-child(6)');
    if (td) {
      await td.hover();
      console.log('hover 一个 td');
      const moreBtn = await row.$('td:nth-child(6) button');
      moreBtn?.click();
      const editBtn = await row.$('td:nth-child(6) ul > a:nth-child(1)');
      editBtn?.click();
      await page.waitForTimeout(5000 * 60); // 停顿一下方便观察
    }


  }

  // 结束
  await browser.close();
})();
