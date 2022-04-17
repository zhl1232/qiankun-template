export type IP = string

export interface Resource extends Record<string, any> {
  ID: number
}

export type Vm = Resource
