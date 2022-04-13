/**
 * 没有二级目录的需要加一个和path同名的key
 */
export const DEFAULT_MENUS = [
  {
    path: "/Home",
    name: "总览",
    icon: "home",
    key: "/Home"
  },
  {
    path: "/resource",
    name: "资源",
    icon: "home",
    key: "/resource",
    auth: ["superAdmin", "admin", "readOnlyAdmin"]
  },
  {
    path: "/test",
    name: "test",
    icon: "home",
    key: "/test",
    auth: ["superAdmin", "admin", "readOnlyAdmin"]
  },
  {
    path: "/monitor",
    name: "视图",
    icon: "monitor",
    ysIcon: true,
    SaaS: true,
    children: [
      {
        path: "list",
        name: "视图列表",
        SaaS: true
      }
    ]
  },

  {
    path: "/appPerformance",
    name: "应用",
    icon: "app",
    ysIcon: true,
    SaaS: true,
    dashed: true,
    children: [
      {
        path: "instance",
        name: "服务",
        SaaS: true // SaaS版本显示目录
      },
      {
        path: "peer",
        name: "路径",
        SaaS: true // SaaS版本显示目录
      },
      {
        path: "http",
        name: "HTTP",
        SaaS: true // SaaS版本显示目录
      },
      {
        path: "sql",
        name: "SQL",
        SaaS: true // SaaS版本显示目录
      },
      {
        path: "noSql",
        name: "NoSQL",
        saas: true // saas版本显示目录
      },
      {
        path: "dns",
        name: "DNS",
        saas: true // saas版本显示目录
      }
    ],
    needDivider: true
  },

  {
    path: "/platformOverview",
    name: "网络",
    icon: "internet",
    ysIcon: true,
    SaaS: true,
    children: [
      {
        path: "instance",
        name: "服务",
        SaaS: true // SaaS版本显示目录
      },
      {
        path: "peer",
        name: "路径",
        SaaS: true // SaaS版本显示目录
      },
      {
        path: "flowlog",
        name: "流日志",
        SaaS: true // SaaS版本显示目录
      },
      {
        path: "rscheck",
        name: "资源盘点",
        SaaS: true // SaaS版本显示目录
      },
      {
        path: "pcap",
        name: "流量下载",
        dashed: true
      },
      {
        path: "npb",
        name: "流量分发",
        auth: ["superAdmin", "admin", "readOnlyAdmin"]
      },
      {
        path: "networkTopo",
        name: "网络拓扑",
        dashed: true,
        auth: ["superAdmin", "admin", "readOnlyAdmin"]
      }
    ],
    needDivider: true
  },

  {
    path: "/alarm",
    name: "告警",
    icon: "alarm",
    ysIcon: true,
    SaaS: true,
    dashed: true,
    children: [
      {
        path: "strategy",
        name: "告警策略",
        SaaS: true
      },
      {
        path: "events",
        name: "告警事件",
        SaaS: true
      },
      {
        path: "endPoints",
        name: "推送端点",
        SaaS: true
      }
    ]
  },

  {
    path: "/report",
    name: "报表",
    icon: "report",
    ysIcon: true,
    SaaS: true,
    children: [
      {
        path: "strategy",
        name: "报表策略",
        SaaS: true
      },
      {
        path: "list",
        name: "报表下载",
        SaaS: true
      }
    ],
    needDivider: true
  },

  {
    path: "/platform",
    name: "资源",
    icon: "platform",
    ysIcon: true,
    SaaS: true,
    dashed: true,
    children: [
      {
        path: "summary",
        name: "摘要"
      },
      {
        path: "pool",
        name: "资源池"
      },
      {
        path: "calculateResource",
        name: "计算资源",
        SaaS: true
      },
      {
        path: "netResource",
        name: "网络资源",
        SaaS: true
      },
      {
        path: "netService",
        name: "网络服务"
      },
      {
        path: "storageService",
        name: "存储服务"
      },
      {
        path: "pod",
        name: "容器资源",
        SaaS: true
      },
      {
        path: "business",
        name: "业务画像"
      },
      {
        path: "physicalResource",
        name: "其他资源"
      }
    ]
  },
  {
    path: "/system",
    name: "系统",
    icon: "system",
    ysIcon: true,
    children: [
      {
        path: "controlnode",
        name: "控制器",
        auth: ["superAdmin", "admin", "readOnlyAdmin"]
      },
      {
        path: "vtap",
        name: "采集器",
        auth: ["superAdmin", "admin", "readOnlyAdmin"]
      },
      {
        path: "datanode",
        name: "数据节点",
        auth: ["superAdmin", "admin", "readOnlyAdmin"]
      },
      {
        path: "users",
        name: "帐号管理"
      },
      {
        path: "log",
        name: "操作日志"
      },
      {
        path: "license",
        name: "授权管理",
        auth: ["superAdmin", "admin", "readOnlyAdmin"],
        method: ["license"]
      },
      {
        path: "expenses",
        name: "费用中心",
        auth: ["superAdmin", "admin", "readOnlyAdmin"],
        method: ["voucher"]
      },
      {
        path: "config",
        name: "配置管理",
        auth: ["superAdmin"]
      },
      {
        path: "technicalSupport",
        name: "技术支持",
        mode: ["k8s"],
        auth: ["superAdmin", "admin", "readOnlyAdmin"]
      }
    ]
  }
]
