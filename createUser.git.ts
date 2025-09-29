import { chromium, Browser, Page } from '@playwright/test';
import { gitlabInfo } from './config';
import { Command } from 'commander';

/**
 * 使用 Playwright 打开指定 URL 的方法
 * @param url 要打开的网址
 * @param headless 是否以无头模式运行，默认为 false
 * @returns Promise<{ browser: Browser, page: Page }>
 */
export async function openUrl(url: string, headless: boolean = false): Promise<{ browser: Browser, page: Page }> {
    // 启动浏览器
    const browser = await chromium.launch({ 
        headless,
        slowMo: 50 // 添加延迟以便观察操作
    });
    
    // 创建新页面
    const page = await browser.newPage();
    
    // 设置视口大小
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 导航到指定 URL
    await page.goto(url);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    console.log(`已成功打开 URL: ${url}`);
    
    return { browser, page };
}

/**
 * 关闭浏览器的方法
 * @param browser 要关闭的浏览器实例
 */
export async function closeBrowser(browser: Browser): Promise<void> {
    await browser.close();
    console.log('浏览器已关闭');
}

// 使用 commander 解析命令行参数
const program = new Command();

program
    .name('createUser')
    .description('GitLab 用户创建工具')
    .version('1.0.0')
    .option('-e, --email <email>', '用户邮箱地址')
    .option('-n, --name <name>', '用户姓名')
    .option('-u, --username <username>', '用户名')
    .option('--headless', '无头模式运行浏览器')
    .parse();

const options = program.opts();

// 输出获取到的参数
console.log('命令行参数解析结果:');
console.log('邮箱:', options.email || '未提供');
// console.log('姓名:', options.name || '未提供');
// console.log('用户名:', options.username || '未提供');
// console.log('无头模式:', options.headless ? '是' : '否');

// 验证必需参数
if (!options.email) {
    console.error('错误: 必须提供邮箱参数 -e 或 --email');
    process.exit(1);
}

// 使用示例
async function example(email: string) {
    const { browser, page } = await openUrl(gitlabInfo.url, options.headless);
    
    // 在这里可以执行其他操作
    console.log('页面标题:', await page.title());


    // input username
    await page.fill('#user_login', gitlabInfo.username);
    await page.fill('#user_password', gitlabInfo.password);
    await page.click('body > div.gl-h-full.gl-display-flex.gl-flex-wrap > div.container.gl-align-self-center > div > div.gl-my-5 > div.gl-w-full.gl-sm-w-half.gl-ml-auto.gl-mr-auto.bar > div > form > button');
    await page.waitForLoadState('networkidle');

    // click admin area
    await page.click('#super-sidebar > div.contextual-nav.gl-display-flex.gl-flex-direction-column.gl-flex-grow-1.gl-overflow-hidden > div.gl-p-2 > a');

    // click add user
    await page.click('#content-body > div.admin-dashboard.gl-mt-3 > div:nth-child(2) > div:nth-child(2) > div > div.gl-card-body.gl-display-flex.gl-justify-content-space-between.gl-align-items-flex-start > a');


    const username = email.split('@')[0];

    // input name
    await page.fill('#user_name', username);
    // input username
    await page.fill('#user_username', username);

    // input email
    await page.fill('#user_email', email);

    // click sumit button
    await page.click('#new_user > div.settings-sticky-footer > button');


    // click edit button
    await page.click('#content-body > div.gl-display-flex.gl-flex-wrap.gl-justify-content-space-between.gl-align-items-center.gl-pt-3 > div.gl-my-3.gl-display-flex.gl-flex-wrap.-gl-my-2.-gl-mx-2 > div:nth-child(3) > div > div:nth-child(1) > a');

    const password = 'Aa123456';

    await page.fill('#user_password', password);
    await page.fill('#user_password_confirmation', password);

    // click sumit button
    await page.click('div.settings-sticky-footer > button');


    // console result
    console.log(`创建用户成功！！！！！！！！！！`);
    console.log(`------------------------------`);
    console.log(`------------------------------`);
    console.log(`git 地址：${gitlabInfo.gitUrl}`);
    console.log(`用户名: ${username}`);
    console.log(`邮箱: ${email}`);
    console.log(`密码: ${password}`);
    console.log(`注1：仓库权限找对应项目负责人或者@RD后端-Lucky @PR-EDFE-Vibro`);
    console.log(`注2：git clone 地址替换成${gitlabInfo.gitUrl}`);
    console.log(`------------------------------`);
    console.log(`------------------------------`);

    
    // 记得关闭浏览器
    await closeBrowser(browser);
}

// 如果直接运行此文件，则执行示例
example(options.email).catch(console.error);
