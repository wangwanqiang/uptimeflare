// UptimeFlare configuration file
// For full configuration options, please refer to `uptime.config.full.ts`
// Wiki: https://github.com/lyc8503/UptimeFlare/wiki

// Don't edit this line
import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

/**
 * 状态页面配置 - 定义页面标题、头部链接等外观设置
 */
const pageConfig: PageConfig = {
  title: "Uptime Status Page",
  links: [
    { link: 'https://github.com/', label: 'GitHub' },
  ],
}

/**
 * Worker 监控配置 - 定义所有监控项和通知设置
 */
const workerConfig: WorkerConfig = {
  monitors: [
    // 示例：监控 Cloudflare 官网（可替换为您自己的监控目标）
    {
      id: 'cloudflare_www',
      name: 'Cloudflare Website',
      method: 'GET',
      target: 'https://www.cloudflare.com',
      tooltip: 'Cloudflare 官方网站',
      expectedCodes: [200],
      timeout: 10000,
      headers: {
        'User-Agent': 'Uptimeflare/1.0',
      },
    },
    // 示例：监控 GitHub 首页
    {
      id: 'github_www',
      name: 'GitHub Website',
      method: 'GET',
      target: 'https://github.com',
      tooltip: 'GitHub 官方网站',
      expectedCodes: [200, 301, 302],
      timeout: 10000,
    },
  ],
  // 通知配置 - 如需配置通知请取消注释并修改 webhook 设置
  // notification: {
  //   webhook: {
  //     url: 'YOUR_WEBHOOK_URL',
  //     payloadType: 'json',
  //     payload: {
  //       text: '$MSG',
  //     },
  //   },
  //   timeZone: 'Asia/Shanghai',
  //   gracePeriod: 5,
  // },
}

/**
 * 计划维护配置 - 默认为空，可根据需要添加
 */
const maintenances: MaintenanceConfig[] = []

// Don't edit this line
export { maintenances, pageConfig, workerConfig }
