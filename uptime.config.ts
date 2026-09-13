// UptimeFlare configuration file
// For full configuration options, please refer to `uptime.config.full.ts`
// Wiki: https://github.com/lyc8503/UptimeFlare/wiki

// Don't edit this line
import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

/**
 * 状态页面配置 - 定义页面标题、头部链接等外观设置
 */
const pageConfig: PageConfig = {
  title: "服务状态",
  links: [
    { link: 'https://wanqiang.wang', label: '首页' },
    { link: 'https://github.com/', label: 'GitHub' },
  ],
}

/**
 * Worker 监控配置 - 定义所有监控项和通知设置
 */
const workerConfig: WorkerConfig = {
  monitors: [
    // 个人网站监控
    {
      id: 'wanqiang_wang',
      name: '个人网站',
      method: 'GET',
      target: 'https://wanqiang.wang',
      tooltip: 'wanqiang.wang 个人网站',
      statusPageLink: 'https://wanqiang.wang',
      expectedCodes: [200, 301, 302],
      timeout: 10000,
      headers: {
        'User-Agent': 'Uptimeflare/1.0',
      },
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
