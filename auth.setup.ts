import { test as setup } from '@playwright/test';

setup('保存登录状态', async ({ page }) => {
  await page.goto('https://app.phrase.com/accounts/weex-global/repo_syncs');

  console.log('👉 请在浏览器里手动完成登录，然后回到终端按 Ctrl+C 停止。');

  // 登录完成后保存 cookies & localStorage
  await page.context().storageState({ path: 'auth.json' });
});
