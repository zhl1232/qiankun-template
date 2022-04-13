import send from './index.js'

export function uploadRequest(...args: any[]): any
export function srequest(...args: any[]): Promise<any>
export function genSingleApi(message: any): (...args: any[]) => any
export default send

export interface ApiResponse extends Record<string, any> {
  OPT_STATUS: string
  DATA?: any[]
  DESCRIPTION?: string
}

declare const send: any
