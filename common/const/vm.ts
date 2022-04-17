export const VM_STATE_RUN = 4
export const VM_STATE_STOP = 9
export const VM_STATE_ABNORMAL = 11

export const VM_STATE_ID_ARR = [VM_STATE_RUN, VM_STATE_STOP]

export const VM_STATE_MAP = {
  0: "临时",
  1: "创建中",
  2: "创建",
  3: "启动中",
  [VM_STATE_RUN]: "运行",
  5: "暂停中",
  6: "暂停",
  7: "执行中",
  8: "停止中",
  [VM_STATE_STOP]: "停止",
  10: "修改",
  [VM_STATE_ABNORMAL]: "异常",
  12: "删除中",
  13: "销毁",
  14: "迁移中"
}
// 云服务器类型
export const VM_HTYPE_MAP = {
  1: "虚拟机/计算",
  2: "裸金属/计算",
  3: "虚拟机/网络",
  4: "裸金属/网络",
  5: "虚拟机/存储",
  6: "裸金属/存储"
}
