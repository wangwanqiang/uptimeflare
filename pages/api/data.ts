/**
 * UptimeFlare 状态数据 API
 * 返回所有监控的当前状态、延迟和事件记录
 */
import { maintenances, workerConfig } from '@/uptime.config'
import { NextRequest } from 'next/server'
import { CompactedMonitorStateWrapper, getFromStore } from '@/worker/src/store'

export const runtime = 'edge'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

/**
 * 处理状态数据请求
 * @returns 包含监控状态的 JSON 响应
 */
export default async function handler(req: NextRequest): Promise<Response> {
  try {
    const compactedState = new CompactedMonitorStateWrapper(
      await getFromStore(process.env as any, 'state')
    )

    // 首次部署时，等待第一次 Cron 任务运行后才有数据
    if (compactedState.data.lastUpdate === 0) {
      return new Response(
        JSON.stringify({
          up: 0,
          down: 0,
          updatedAt: 0,
          monitors: workerConfig.monitors.reduce((acc: any, m) => {
            acc[m.id] = {
              up: null,
              latency: 0,
              location: 'PENDING',
              message: 'Waiting for first check...',
            }
            return acc
          }, {}),
          maintenances,
          pending: true,
        }),
        {
          status: 200,
          headers,
        }
      )
    }

    let monitors: any = {}

    for (let monitor of workerConfig.monitors) {
      const incidentLen = compactedState.incidentLen(monitor.id)
      let isUp = true
      let message = 'OK'
      let latency = 0
      let location = 'UNKNOWN'

      // 只有当存在事件记录时才获取
      if (incidentLen > 0) {
        try {
          const lastIncident = compactedState.getIncident(monitor.id, incidentLen - 1)
          isUp = lastIncident?.end !== null
          message = isUp ? 'OK' : lastIncident?.error[lastIncident.error.length - 1] || 'Unknown error'
        } catch (e) {
          console.error(`Error getting incident for monitor ${monitor.id}:`, e)
        }
      }

      // 只有当存在延迟记录时才获取
      try {
        if (compactedState.latencyLen(monitor.id) > 0) {
          const lastLatency = compactedState.getLastLatency(monitor.id)
          latency = lastLatency.ping
          location = lastLatency.loc
        }
      } catch (e) {
        console.error(`Error getting latency for monitor ${monitor.id}:`, e)
      }

      monitors[monitor.id] = {
        up: isUp,
        latency: latency,
        location: location,
        message: message,
      }
    }

    let ret = {
      up: compactedState.data.overallUp,
      down: compactedState.data.overallDown,
      updatedAt: compactedState.data.lastUpdate,
      monitors,
      maintenances,
    }

    return new Response(JSON.stringify(ret), {
      headers,
    })
  } catch (err) {
    console.error('Error in data API:', err)
    return new Response(
      JSON.stringify({
        up: 0,
        down: 0,
        updatedAt: 0,
        monitors: {},
        maintenances,
        error: 'Internal error',
      }),
      {
        status: 200,
        headers,
      }
    )
  }
}
