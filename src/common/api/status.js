/* eslint-disable max-len */
/*
 * 后端OPT_STATUS字段对应解释，一般只用于页面的错误提示
 * CH：中文解释
 * EN: 英文解释
 * OTHER： 其他语言解释
 * SELF：必填，此字段值是OPT_STATUS.KEY的值，用于索引
 *
 * 编码要求：
 * 1. key 字段全大写，下划线连接，不使用任何引号
 * 2. value 字段优先使用单引号，value含单引号时，则使用双引号
 * 3. 每行字符控制在80内，超过长度可行尾使用 '\' 换行编辑
 *
 */
const STATUS = {
  DEFAULT: {
    CH: '网络请求发生错误',
    EN: 'Request error',
    SELF: 'DEFAULT'
  },
  NONE_ANSWER: {
    CH: '无应答数据',
    EN: 'Empty response',
    SELF: 'NONE_ANSWER'
  },
  SUCCESS: {
    CH: '',
    EN: '',
    SELF: 'SUCCESS'
  },
  FAIL: {
    CH: '失败',
    EN: 'Failed.',
    SELF: 'FAIL'
  },
  FAILED: {
    CH: '失败',
    EN: 'Failed.',
    SELF: 'FAILED'
  },
  REQUEST_TIMEOUT: {
    CH: 'API请求超时',
    EN: 'Request timeout',
    SELF: 'REQUEST_TIMEOUT'
  },
  REQUEST_FAILED: {
    CH: '网络请求失败',
    EN: 'Request failed.',
    SELF: 'REQUEST_FAILED'
  },
  REQUEST_CANCELED: {
    CH: '网络请求取消',
    EN: 'Request canceled.',
    SELF: 'REQUEST_CANCELED'
  },
  INVALID_TOKEN: {
    CH: '无效令牌',
    EN: 'Token invalid',
    SELF: 'INVALID_TOKEN'
  },
  ILLEGAL_REQUEST: {
    CH: '非法请求',
    EN: 'Illegal request',
    SELF: 'ILLEGAL_REQUEST'
  },
  REQUEST_AUTHORIZATION_FAILED: {
    CH: '请求授权失败',
    EN: 'Request authorization failed',
    SELF: 'REQUEST_AUTHORIZATION_FAILED'
  },
  TRIDENT_DISABLED: {
    CH: '采集器被禁用',
    EN: 'Trident disabled',
    SELF: 'TRIDENT_DISABLED'
  },
  TRIDENT_TIMEOUT: {
    CH: '采集器没有响应',
    EN: 'Trident timeout',
    SELF: 'TRIDENT_TIMEOUT'
  },
  EXPIRED_TOKEN: {
    CH: '令牌过期',
    EN: 'Token expiration',
    SELF: 'EXPIRED_TOKEN'
  },
  INVALID_TOKEN_FORMAT: {
    CH: 'Token格式错误',
    EN: 'Token Format is wrong according to JWT',
    SELF: 'INVALID_TOKEN_FORMAT'
  },
  INVALID_ISSUER: {
    CH: '错误Token类型',
    EN: 'The issuer of the token is invalid',
    SELF: 'INVALID_ISSUER'
  },
  TOKEN_REFRESHED: {
    CH: 'Token已被刷新',
    EN: 'The token has been refreshed',
    SELF: 'TOKEN_REFRESHED'
  },
  USER_NOT_FOUND: {
    CH: '找不到用户信息',
    EN: 'User is not found',
    SELF: 'USER_NOT_FOUND'
  },
  SSO_ERROR: {
    CH: '已重新登录或已刷新Token',
    EN: 'Your account has been logged elsewhere or refreshed',
    SELF: 'SSO_ERROR'
  },
  LOG_OFF_TOKEN: {
    CH: 'Token已经注销',
    EN: 'Token has been destroyed',
    SELF: 'LOG_OFF_TOKEN'
  },
  EXPIRED_REFRESH_TOKEN: {
    CH: 'Refresh Token 已经过期，请重新登陆',
    EN: 'Refresh token expired, you need to login again',
    SELF: 'EXPIRED_REFRESH_TOKEN'
  },
  INVALID_REFRESH_TOKEN: {
    CH: '无效Rrefresh Token',
    EN: 'Refresh token is invalid',
    SELF: 'INVALID_REFRESH_TOKEN'
  },
  INVALID_REFRESH_ISSUER: {
    CH: '错误Rrefresh Token类型',
    EN: 'The issuer of the refresh token is invalid',
    SELF: 'INVALID_REFRESH_ISSUER'
  },
  INVALID_GRANT: {
    CH: 'grant类型错误',
    EN: 'grant type is invalid',
    SELF: 'INVALID_GRANT'
  },
  LOGIN_PARAMS_MISSING: {
    CH: '用户邮箱和密码不能为空',
    EN: 'Email or password is missing',
    SELF: 'LOGIN_PARAMS_MISSING'
  },
  EMAIL_NOT_EXISTS: {
    CH: '邮箱不存在',
    EN: 'Email does not exists',
    SELF: 'EMAIL_NOT_EXISTS'
  },
  AUTH_HEADER_ERROR: {
    CH: '请传递正确的验证头信息',
    EN: 'Invalid authentication header',
    SELF: 'AUTH_HEADER_ERROR'
  },
  MISSING_REFRESH_TOKEN: {
    CH: 'refresh_token不能为空',
    EN: 'Refresh_token is missing',
    SELF: 'MISSING_REFRESH_TOKEN'
  },
  TOKEN_MISMATCH_UID: {
    CH: 'access_token和userid不匹配',
    EN: 'Access token mismatches userid',
    SELF: 'TOKEN_MISMATCH_UID'
  },
  LOGIN_FAILED: {
    CH: '邮箱或密码错误',
    EN: 'Email or password is invalid',
    SELF: 'LOGIN_FAILED'
  },
  INVALID_POST_DATA: {
    CH: '请求数据不合法',
    EN: 'Invalid post data.',
    SELF: 'INVALID_POST_DATA'
  },
  MISSING_ARGS: {
    CH: '缺少参数',
    EN: 'Missing arguments',
    SELF: 'MISSING_ARGS'
  },
  SERVER_ERROR: {
    CH: '系统内部错误',
    EN: 'Server error.',
    SELF: 'SERVER_ERROR'
  },
  DATABASE_ERROR: {
    CH: '数据库表项错误',
    EN: 'Database table ENtry error.',
    SELF: 'DATABASE_ERROR'
  },
  RESOURCE_NOT_FOUND: {
    CH: '资源不存在',
    EN: 'Resource not found.',
    SELF: 'RESOURCE_NOT_FOUND'
  },
  TENANT_NETWORK_PATH_NOT_EXIST: {
    CH: '租户网络路径不存在',
    EN: 'Tenant network path not exist.',
    SELF: 'TENANT_NETWORK_PATH_NOT_EXIST'
  },
  ONLY_LAN_OR_WAN_IP: {
    CH: '只能支持同是内网ip或同是浮动ip来查询',
    EN: 'Can only support the same internal network ip or the same floating ip to query.',
    SELF: 'ONLY_LAN_OR_WAN_IP'
  },
  VIRTUAL_NETWORK_PATH_ABNORMAL: {
    CH: '虚拟网络路径获取存在内部异常，请联系售后人员查询具体原因',
    EN: 'There is an internal exception in the virtual network path. Please contact the after-sales personnel for specific reasons.',
    SELF: 'VIRTUAL_NETWORK_PATH_ABNORMAL'
  },
  CURRENT_NETWORK_SCENE_NOT_SUPPORT: {
    CH: '当前网络类型的通信场景不支持获取虚拟网络路径',
    EN: 'The current network type communication scenario does not support obtaining the virtual network path.',
    SELF: 'CURRENT_NETWORK_SCENE_NOT_SUPPORT'
  },
  NOT_SUPPORT_CROSS_PLATFORM_QUERY: {
    CH: '不支持跨云平台获取虚拟网络路径',
    EN: 'Does not support cross-platform to obtain virtual network path.',
    SELF: 'NOT_SUPPORT_CROSS_PLATFORM_QUERY'
  },
  NOT_SUPPORT_CROSS_VPC_QUERY: {
    CH: '不支持跨VPC获取虚拟网络路径',
    EN: 'Does not support cross-vpc to obtain virtual network path.',
    SELF: 'NOT_SUPPORT_CROSS_VPC_QUERY'
  },
  VSPHERE_NOT_SUPPORT_CROSS_SUBNET_QUERY: {
    CH: 'VMware不支持同VPC不同子网获取虚拟网络路径',
    EN: 'VMware does not support obtaining virtual network paths from different subnets of VPC.',
    SELF: 'VSPHERE_NOT_SUPPORT_CROSS_SUBNET_QUERY'
  },
  VM_IS_NOT_RUNNING: {
    CH: '云服务器非运行状态时，无法获取虚拟网络路径',
    EN: 'Unable to get virtual network path when virtual machine is not running',
    SELF: 'VM_IS_NOT_RUNNING'
  },
  NO_DATA: {
    CH: '暂无数据',
    EN: 'No data.',
    SELF: 'NO_DATA'
  },
  RESOURCE_ALREADY_EXIST: {
    CH: '资源已存在',
    EN: 'Resource already exist.',
    SELF: 'RESOURCE_ALREADY_EXIST'
  },
  RESOURCE_STATE_ERROR: {
    CH: '资源状态错误',
    EN: 'Resource state error.',
    SELF: 'RESOURCE_STATE_ERROR'
  },
  RESOURCE_UPDATE_ERROR: {
    CH: '资源更新失败',
    EN: 'Resource update failed.',
    SELF: 'RESOURCE_UPDATE_ERROR'
  },
  PARAMETER_ILLEGAL: {
    CH: '参数不合法',
    EN: 'Parameter illegal.',
    SELF: 'PARAMETER_ILLEGAL'
  },
  INVALID_NAT_DATA: {
    CH: '检查目的地址转换和源地址转换的配置后发现，\
同一个私有网络地址映射到了多个ISP的地址。',
    EN: 'After CHecking the configuration of SNAT and DNAT, \
it is found that one private IP address is mapped to IP addresses of multiple ISPs.',
    SELF: 'INVALID_NAT_DATA'
  },
  RESOURCE_OPERATE_NONE: {
    CH: '资源操作不识别',
    EN: 'Unknown resource operation.',
    SELF: 'RESOURCE_OPERATE_NONE'
  },
  OPERATION_TIMEOUT: {
    CH: '操作超时',
    EN: 'Operation timeout.',
    SELF: 'OPERATION_TIMEOUT'
  },
  NOT_SUPPORT: {
    CH: '当前配置不支持',
    EN: 'Not support.',
    SELF: 'NOT_SUPPORT'
  },
  SERVER_ERROR_TRY_AGAIN: {
    CH: '系统繁忙,请稍后重试',
    EN: 'Server error.please try again.',
    SELF: 'SERVER_ERROR_TRY_AGAIN'
  },
  PREREQUISITES_NOT_SATISFIED: {
    CH: '预置条件不满足',
    EN: 'Prerequisites not satisfied.',
    SELF: 'PREREQUISITES_NOT_SATISFIED'
  },
  VLANTAG_CONFLICT: {
    CH: 'VLAN冲突',
    EN: 'Vlantag conflict.',
    SELF: 'VLANTAG_CONFLICT'
  },
  QUOTA_EXCEEDED: {
    CH: '配额超限',
    EN: 'Quota exceeded.',
    SELF: 'QUOTA_EXCEEDED'
  },
  IP_RESOURCE_INUSE: {
    CH: '该IP正在使用中，无法删除',
    EN: 'IP resource in use, can not delete.',
    SELF: 'IP_RESOURCE_INUSE'
  },
  INVALID_IP_RESOURCE: {
    CH: '同一个接口上的公网IP必须拥有相同的VLAN，\
且IP所在资源池必须和设备所在资源池相同。',
    EN: 'Invalid IP, please make sure IPs for the same port have the same VLAN, \
and belong to the same resource pool.',
    SELF: 'INVALID_IP_RESOURCE'
  },
  IP_RESOURCE_INPACKAGE: {
    CH: '该IP为套餐内容，无法单独删除',
    EN: 'IP is in a package, can not delete alone',
    SELF: 'IP_RESOURCE_INPACKAGE'
  },
  INVALID_SNAT_TARGET: {
    CH: 'SNAT出口IP没有在虚拟网关上配置，请检查出口IP是否正确',
    EN: 'Invalid SNAT target IP, please make sure the target IP is \
configured in vgateway.',
    SELF: 'INVALID_SNAT_TARGET'
  },
  EXCESSIVE_IP_RESOURCE: {
    CH: '配置到所有ISP接口的公网IP数目超过规格限定',
    EN: 'The number of configured IPs exceeds the production specified.',
    SELF: 'EXCESSIVE_IP_RESOURCE'
  },
  INVALID_VGATEWAY_ROUTE: {
    CH: '路由的下一跳必须和虚拟网关某个接口的IP在同一网段内',
    EN: 'The next-hop must in the same VNET with one of the interfaces.',
    SELF: 'INVALID_VGATEWAY_ROUTE'
  },
  NOT_ENOUGH_BANDWIDTH: {
    CH: 'ISP带宽不足，已使用的带宽超过了购买的带宽',
    EN: 'No ENough bandwidth.',
    SELF: 'NOT_ENOUGH_BANDWIDTH'
  },
  NOT_ENOUGH_FREE_PACKAGE_BANDWIDTH: {
    CH: '空余的带宽不足100M，请释放带宽后再删除套餐',
    EN: '空余的带宽不足100M，请释放带宽后再删除套餐',
    SELF: 'NOT_ENOUGH_FREE_PACKAGE_BANDWIDTH'
  },
  LAN_STILL_ATTACHED: {
    CH: '请先清除私有网络连接配置',
    EN: 'Please clear LAN network config.',
    SELF: 'LAN_STILL_ATTACHED'
  },
  RESOURCE_DELETE_PROHIBITED: {
    CH: '当前状态禁止删除操作，仅当停止状态下才能删除',
    EN: 'Resource delete prohibited in currENt state, \
cannot delete whEN state is not stopped.',
    SELF: 'RESOURCE_DELETE_PROHIBITED'
  },
  VL2_DELETE_PROHIBITED: {
    CH: '请先清除该私有网络中的所有连接和安全域',
    EN: 'Please clear all network connections and Micro-segemENts \
in this VNET at first.',
    SELF: 'VL2_DELETE_PROHIBITED'
  },
  EPC_NOT_EMPTY: {
    CH: '请先移出当前私有云中资源',
    EN: 'Please remove the resources in the EPC.',
    SELF: 'EPC_NOT_EMPTY'
  },
  INSTANCE_STATE_NOT_RUNNING: {
    CH: '',
    EN: 'Instance configure prohibited in currENt state, \
cannot operate whEN state is not running.',
    SELF: 'INSTANCE_STATE_NOT_RUNNING'
  },
  LISTENER_ALREADY_EXIST: {
    CH: '与已有监听器名称冲突，请检查配置',
    EN: 'ListENer name conflict, please CHeck configure.',
    SELF: 'LISTENER_ALREADY_EXIST'
  },
  LAN_IP_CONFLICT: {
    CH: '您配置的私有网络IP/网段和EPC中其它IP/网段冲突',
    EN: 'VNET ip or prefix is conflict.',
    SELF: 'LAN_IP_CONFLICT'
  },
  LAN_IP_INVALID: {
    CH: '您配置的私有网络IP/网段或IP数目不合法，IP/网段应为0.0.0.0/0且数目仅为1',
    EN: 'VNET ip or prefix is invalid, or more than one ip is added into VNET.',
    SELF: 'LAN_IP_INVALID'
  },
  LAN_IP_CONFLICT_WITH_SYS: {
    CH: '您配置的私有网络IP/网段和系统控制、服务平面网段冲突',
    EN: 'VNET ip or prefix is conflict.',
    SELF: 'LAN_IP_CONFLICT_WITH_SYS'
  },
  PRODUCT_NOT_EXIST: {
    CH: '您选择的产品不存在',
    EN: 'Product not found.',
    SELF: 'PRODUCT_NOT_EXIST'
  },
  NOT_ENOUGH_USER_BALANCE: {
    CH: '您的账户余额不足开通资源',
    EN: 'No ENough user balance.',
    SELF: 'NOT_ENOUGH_USER_BALANCE'
  },
  SNAPSHOT_ALREADY_EXIST: {
    CH: '当前虚拟服务器已存在快照信息, 请先删除当前快照',
    EN: 'Snapshot already exist, please delete currENt snapshot.',
    SELF: 'SNAPSHOT_ALREADY_EXIST'
  },
  SNAPSHOT_NOT_EXIST: {
    CH: '您选择的快照不存在',
    EN: 'Snapshot not found.',
    SELF: 'SNAPSHOT_NOT_EXIST'
  },
  SNAPSHOT_DELETE_PROHIBITED: {
    CH: '您选择的快照正在恢复，不能进行删除操作',
    EN: 'Snapshot is reverting, cannot be deleted.',
    SELF: 'SNAPSHOT_DELETE_PROHIBITED'
  },
  OP_PROHIBITED_WHEN_REVERTING: {
    CH: '当前虚拟服务器正在进行快照恢复, 不能执行其他操作',
    EN: 'VM operation prohibited in reverting state.',
    SELF: 'OP_PROHIBITED_WHEN_REVERTING'
  },
  EPC_ALREADY_EXIST: {
    CH: '已存在同名私有云',
    EN: 'EPC with the same name already exists, please CHange into another name.',
    SELF: 'EPC_ALREADY_EXIST'
  },
  FORWARD_RULE_IN_USE: {
    CH: '当前转发规则还在使用中，请先在负载均衡器配置页面解除规则绑定',
    EN: 'Forwarding rule is still in use, \
please unbind it in loadbalancer configure page.',
    SELF: 'FORWARD_RULE_IN_USE'
  },
  REGULAR_EXPRESSION_ILLEGAL: {
    CH: '正则表达式不合法',
    EN: 'Regular expression illegal.',
    SELF: 'REGULAR_EXPRESSION_ILLEGAL'
  },
  LISTENER_NUM_EXCEEDED: {
    CH: '当前负载均衡器上监听器数目超出限制，最多允许配置32个监听器',
    EN: 'ListENer num exceeded in currENt loadbalancer, maximum is 32.',
    SELF: 'LISTENER_NUM_EXCEEDED'
  },
  EPC_DOMAIN_DIFFERENT: {
    CH: '移入EPC失败，数据中心不一致',
    EN: 'Set EPC error, domain is differENt.',
    SELF: 'EPC_DOMAIN_DIFFERENT'
  },
  IP_MAX_NUM_EXCEEDED: {
    CH: '创建IP资源超过最大1000数量限制',
    EN: 'Create IP error, max num is 1000.',
    SELF: 'IP_MAX_NUM_EXCEEDED'
  },
  BW_MAX_NUM_EXCEEDED: {
    CH: '创建带宽资源超过最大1000数量限制',
    EN: 'Create bandwidth error, max num is 1000.',
    SELF: 'BW_MAX_NUM_EXCEEDED'
  },
  VGW_MAX_NUM_EXCEEDED: {
    CH: '创建虚拟网关资源超过最1000大数量限制',
    EN: 'Create vgateway error, max num is 1000.',
    SELF: 'VGW_MAX_NUM_EXCEEDED'
  },
  VM_MAX_NUM_EXCEEDED: {
    CH: '创建虚拟服务器资源超过最大1000数量限制',
    EN: 'Create VM error, max num is 1000.',
    SELF: 'VM_MAX_NUM_EXCEEDED'
  },
  LB_MAX_NUM_EXCEEDED: {
    CH: '创建负载均衡器资源超过最大1000数量限制',
    EN: 'Create loadbalancer error, max num is 1000.',
    SELF: 'LB_MAX_NUM_EXCEEDED'
  },
  VFW_MAX_NUM_EXCEEDED: {
    CH: '创建虚拟防火墙资源超过最大1000数量限制',
    EN: 'Create vFW error, max num is 1000.',
    SELF: 'VFW_MAX_NUM_EXCEEDED'
  },
  BASELINE_POLICY_NUM_EXCEEDED: {
    CH: '创建基线告警策略资源超过最大数量限制',
    EN: 'Failed to create alarm policy of baseline type, because of max limit.',
    SELF: 'BASELINE_POLICY_NUM_EXCEEDED'
  },
  ORDER_NOT_PAY: {
    CH: '订单没有交付，请交付后使用',
    EN: 'Order not paid, please use after paid.',
    SELF: 'ORDER_NOT_PAY'
  },
  RESOURCE_OPTION_PROHIBITED: {
    CH: '当前状态禁止对云服务器操作',
    EN: 'VM operation prohibited in currENt state.',
    SELF: 'RESOURCE_OPTION_PROHIBITED'
  },
  BACKUP_LB_EXIST_AS_BK_VM: {
    CH: '您选择的高可用备机当前作为后端主机使用中, \
请先从其他负载均衡器的后端主机中将其移除',
    EN: 'Backup loadbalancer exists as backENd VM, \
please remove it in other loadbalancers configure page.',
    SELF: 'BACKUP_LB_EXIST_AS_BK_VM'
  },
  VM_EXIST_AS_LB_BK_VM: {
    CH: '当前虚拟服务器作为后端主机使用中, 请先在负载均衡器配置页面将其移除',
    EN: 'VM exists as a backENd VM, please remove it in loadbalancers configure page.',
    SELF: 'VM_EXIST_AS_LB_BK_VM'
  },
  CURRENT_SNAPSHOT_IS_CREATING: {
    CH: '当前虚拟服务器正在创建其他快照，请稍后再试',
    EN: 'CurrENt VM is creating another snapshot, please try later.',
    SELF: 'CURRENT_SNAPSHOT_IS_CREATING'
  },
  VM_IS_STARTING: {
    CH: '虚拟服务器正在启动，请稍后再试',
    EN: 'VM is starting, please try later.',
    SELF: 'VM_IS_STARTING'
  },
  VM_IS_STOPPING: {
    CH: '虚拟服务器正在停止，请稍后再试',
    EN: 'VM is stopping, please try later.',
    SELF: 'VM_IS_STOPPING'
  },
  VM_IS_PLUGGING_BLOCK: {
    CH: '虚拟服务器正在挂载/卸载磁盘，请稍后再试',
    EN: 'VM is plugging/unplugging another block device, please try later.',
    SELF: 'VM_IS_PLUGGING_BLOCK'
  },
  VM_IS_MODIFYING: {
    CH: '虚拟服务器正在修改配置，请稍后再试',
    EN: 'VM is modifying',
    SELF: 'VM_IS_MODIFYING'
  },
  VM_IS_REVERTTING: {
    CH: '虚拟服务器正在回滚快照，请稍后再试',
    EN: 'VM is revertting from snapshot, please try later.',
    SELF: 'VM_IS_REVERTTING'
  },
  VM_IS_SNAPSHOTTING: {
    CH: '虚拟服务器正在创建快照，请稍后再试',
    EN: 'VM is snapshotting, please try later.',
    SELF: 'VM_IS_SNAPSHOTTING'
  },
  VM_IS_DELETING: {
    CH: '虚拟服务器正在删除，请稍后再试',
    EN: 'VM is deleting, please try later.',
    SELF: 'VM_IS_DELETING'
  },
  VM_IS_DELETING_SNAPSHOT: {
    CH: '虚拟服务器正在删除快照，请稍后再试',
    EN: 'VM is deleting snapshot, please try later.',
    SELF: 'VM_IS_DELETING_SNAPSHOT'
  },
  BLOCK_IS_CREATING: {
    CH: '云硬盘正在创建',
    EN: 'Block is creating, please try later',
    SELF: 'BLOCK_IS_CREATING'
  },
  BLOCK_IS_SNAPSHOTTING: {
    CH: '云硬盘正在进行快照，请稍后再试',
    EN: 'Block is snapshotting, please try later.',
    SELF: 'BLOCK_IS_SNAPSHOTTING'
  },
  BLOCK_IS_REVERTTING: {
    CH: '云硬盘正在进行回滚，请稍后再试',
    EN: 'Block is revertting, please try later.',
    SELF: 'BLOCK_IS_REVERTTING'
  },
  BLOCK_IS_PLUGGING: {
    CH: '云硬盘正在挂载，请稍后再试',
    EN: 'Block is plugging, please try later',
    SELF: 'BLOCK_IS_PLUGGING'
  },
  BLOCK_IS_UNPLUGGING: {
    CH: '云硬盘正在卸载，请稍后再试',
    EN: 'Block is unplugging, please try later',
    SELF: 'BLOCK_IS_UNPLUGGING'
  },
  BLOCK_IS_DELETING: {
    CH: '云硬盘正在删除，请稍后再试',
    EN: 'Block is deleting, please try later',
    SELF: 'BLOCK_IS_DELETING'
  },
  BLOCK_IS_DELETING_SNAPSHOT: {
    CH: '云硬盘正在删除快照，请稍后再试',
    EN: 'Block is deleting snapshot, please try later',
    SELF: 'BLOCK_IS_DELETING_SNAPSHOT'
  },
  VM_EXPORTING_TEMPLATE: {
    CH: '虚拟服务器正在导出模板，请稍后再试',
    EN: 'VM is exporting template, please try later',
    SELF: 'VM_EXPORTING_TEMPLATE'
  },
  BLOCK_EXPORTING_TEMPLATE: {
    CH: '云硬盘正在导出模板，请稍后再试',
    EN: 'Block is exporting template, please try later',
    SELF: 'BLOCK_EXPORTING_TEMPLATE'
  },
  PLUGGED_BLOCK_REVERTTING: {
    CH: '虚拟服务器上挂载的云硬盘正在回滚快照，请稍后再试',
    EN: "VM's plugged block is reverting from snapshot, please try later.",
    SELF: 'PLUGGED_BLOCK_REVERTTING'
  },
  OTHER_SNAPSHOT_OP_IN_PROGRESS: {
    CH: '正在执行其他快照任务，请稍后再试',
    EN: 'Other snapshot task is running, please try later.',
    SELF: 'OTHER_SNAPSHOT_OP_IN_PROGRESS'
  },
  BLOCK_NOT_EXIST: {
    CH: '云硬盘不存在',
    EN: 'Cloud disk not found.',
    SELF: 'BLOCK_NOT_EXIST'
  },
  STORAGE_NOT_EXIST: {
    CH: '内部错误，请联系管理员',
    EN: 'Internal error, please contact administrator.',
    SELF: 'STORAGE_NOT_EXIST'
  },
  INVALID_VOLUME_SIZE: {
    CH: '云硬盘大小错误',
    EN: 'Invalid cloud disk size.',
    SELF: 'INVALID_VOLUME_SIZE'
  },
  POOL_NOT_EXIST: {
    CH: '内部错误，请联系管理员',
    EN: 'Internal error, please contact administrator.',
    SELF: 'POOL_NOT_EXIST'
  },
  VOL_NOT_EXIST: {
    CH: '内部错误，请联系管理员',
    EN: 'Internal error, please contact administrator.',
    SELF: 'VOL_NOT_EXIST'
  },
  VOL_IS_ATTACHED: {
    CH: '云硬盘已被挂载到虚拟服务器上',
    EN: 'Cloud disk is already attaCHed to a VM.',
    SELF: 'VOL_IS_ATTACHED'
  },
  SNAPSHOT_NUM_EXCEEDED: {
    CH: '快照数目超出限制',
    EN: 'Max snapshot num exceeded.',
    SELF: 'SNAPSHOT_NUM_EXCEEDED'
  },
  REVERT_PROHIBITED_WHEN_VM_IS_STOPPED: {
    CH: '快照只能在虚拟服务器启动状态下恢复',
    EN: 'Snapshot revert prohibited whEN vm is stopped.',
    SELF: 'REVERT_PROHIBITED_WHEN_VM_IS_STOPPED'
  },
  RESIZE_PROHIBITED_WHEN_VOL_IS_ATTACHED: {
    CH: '当前云硬盘已经被挂载, 禁止扩容操作',
    EN: 'Cloud disk resize prohibited whEN it is attaCHed.',
    SELF: 'RESIZE_PROHIBITED_WHEN_VOL_IS_ATTACHED'
  },
  DELETE_VM_PROHIBITED_WHEN_VOL_IS_ATTACHED: {
    CH: '当前虚拟服务器上挂载着云硬盘, 禁止删除操作',
    EN: 'VM delete prohibited whEN cloud disk is attaCHed.',
    SELF: 'DELETE_VM_PROHIBITED_WHEN_VOL_IS_ATTACHED'
  },
  BACKUP_JOB_RUNNING: {
    CH: '备份任务运行时，禁止删除备份空间',
    EN: 'Can not delete backup space whEN backup job is running.',
    SELF: 'BACKUP_JOB_RUNNING'
  },
  PG_NOT_SUPPORTED: {
    CH: '您所添加的端口组属于ISP网络类型，不允许接入私有网络',
    EN: 'Port group cannot be connected to the target VNET due to its ISP type.',
    SELF: 'PG_NOT_SUPPORTED'
  },
  PG_IN_CONFLICT_VL2: {
    CH: '您所添加的端口组已经被接入到其他私有网络中',
    EN: 'Port group has already beEN connected to some other VNET.',
    SELF: 'PG_IN_CONFLICT_VL2'
  },
  PG_IN_CONFLICT_VL2VLAN: {
    CH: '您所添加的端口组与目标私有网络中已有的其他接口或端口组的VLAN有冲突，\
或者与之VLAN相同的其他接口或端口组已经被接入到其他私有网络中',
    EN: 'Port group conflicts with existing vinterfaces or port groups of the \
target VNET in terms of VLAN, or some other vinterface or port group with the \
same VLAN has already beEN connected to a differENt VNET.',
    SELF: 'PG_IN_CONFLICT_VL2VLAN'
  },
  PG_IN_JOIN_UP: {
    CH: '端口组已经接入到私有网络中',
    EN: 'Port group has already beEN connected to a VNET.',
    SELF: 'PG_IN_JOIN_UP'
  },
  REDUCE_CAPACITY_PROHIBITED: {
    CH: '扩容操作只允许增大容量',
    EN: 'Reduce capacity prohibited.',
    SELF: 'REDUCE_CAPACITY_PROHIBITED'
  },
  RELATED_MS_FLOW_EXIST: {
    CH: '当前虚拟安全域中仍存在未删除的服务链配置策略，删除之前请先删除相关服务链配置',
    EN: 'Micro segmENt cannot be deleted whEN the policy configuration of \
related service CHains still exists.',
    SELF: 'RELATED_MS_FLOW_EXIST'
  },
  OVERSUBSCRIBED_BANDWIDTH: {
    CH: '您所配置的带宽值已超过该产品规格的带宽限制',
    EN: 'The configured bandwidth exceeds the upper limit of corresponding \
product specification.',
    SELF: 'OVERSUBSCRIBED_BANDWIDTH'
  },
  RESOURCE_ALLOCATION_FAILED: {
    CH: '底层资源分配失败',
    EN: 'The related resources cannot be allocated.',
    SELF: 'RESOURCE_ALLOCATION_FAILED'
  },
  BLOCK_DETACH_FAIL_VM_ISOLATED: {
    CH: '请重连云服务器之后再卸载云硬盘',
    EN: 'Block cannot be detaCHed whEN vm is isolated',
    SELF: 'BLOCK_DETACH_FAIL_VM_ISOLATED'
  },
  BLOCK_DETACH_FAIL_VM_HALTED: {
    CH: '请启动云服务器之后再卸载云硬盘',
    EN: 'Block cannot be detaCHed whEN vm is stopped',
    SELF: 'BLOCK_DETACH_FAIL_VM_HALTED'
  },
  BLOCK_IS_BUSY: {
    CH: '请在云服务器内解挂(umount)云硬盘之后再卸载云硬盘',
    EN: 'Please umount block in vm',
    SELF: 'BLOCK_IS_BUSY'
  },
  BLOCK_HAS_SNAPSHOTS: {
    CH: '请先删除云硬盘的快照',
    EN: 'Please delete snapshots of this block',
    SELF: 'BLOCK_HAS_SNAPSHOTS'
  },
  SN_ISOLATE_NOT_SUPPORT: {
    CH: '目前暂不支持对安全设备执行隔离操作',
    EN: 'Service node cannot be isolated',
    SELF: 'SN_ISOLATE_NOT_SUPPORT'
  },
  VAGENT_NOT_MATCH: {
    CH: '虚拟服务器vAgENt请求失败，请确认vAgENt为最新版本且正在运行，\
或者检查虚拟服务器的TCP 12345端口是否开放',
    EN: 'The vAgENt has no response, please update/restart it, \
or CHeck if port 12345 is opEN',
    SELF: 'VAGENT_NOT_MATCH'
  },
  VM_ROLE_NOT_GENERAL_PURPOSE: {
    CH: '请指定通用型虚拟机服务器',
    EN: 'Please use gENeral purpose vm',
    SELF: 'VM_ROLE_NOT_GENERAL_PURPOSE'
  },
  VM_NOT_CREATE_FROM_TEMPLATE: {
    CH: '请指定由模板创建的虚拟服务器',
    EN: 'VM is imported',
    SELF: 'VM_NOT_CREATE_FROM_TEMPLATE'
  },
  VM_HAS_SNAPSHOTS: {
    CH: '请先删除虚拟服务器的快照',
    EN: 'Please delete snapshots of this vm',
    SELF: 'VM_HAS_SNAPSHOTS'
  },
  STORAGE_POOL_NOT_EXIST: {
    CH: '存储池不存在',
    EN: 'Storage pool not exist',
    SELF: 'STORAGE_POOL_NOT_EXIST'
  },
  STORAGE_POOL_NOT_AVAILABEL: {
    CH: '存储池当前不可用',
    EN: 'Storage pool not availabel',
    SELF: 'STORAGE_POOL_NOT_AVAILABEL'
  },
  TEMPLATE_OS_BUSY: {
    CH: '模板正在使用中',
    EN: 'Template is busy',
    SELF: 'TEMPLATE_OS_BUSY'
  },
  TEMPLATE_IS_DELETING: {
    CH: '模板正在删除中，请稍后再试',
    EN: 'Template is deleting, please try later',
    SELF: 'TEMPLATE_IS_DELETING'
  },
  NO_HOST_AVAILABEL: {
    CH: '没有可用的主机',
    EN: 'No host availabel',
    SELF: 'NO_HOST_AVAILABEL'
  },
  NAME_IN_USE: {
    CH: '名称已使用',
    EN: 'Name already in use',
    SELF: 'NAME_IN_USE'
  },
  VLAN_IN_USE: {
    CH: 'VLAN已使用',
    EN: 'VLAN already in use',
    SELF: 'VLAN_IN_USE'
  },
  HARDWARE_DEVICE_ATTACHING: {
    CH: '硬件设备正在配置网络中，请稍后再试',
    EN: 'Hardware device is configuring network, please try later',
    SELF: 'HARDWARE_DEVICE_ATTACHING'
  },
  GENERATE_TEMPLATE_PROHIBITED_WHEN_VOL_SNAPSHOT_EXIST: {
    CH: '云硬盘存在快照, 禁止生成模板',
    EN: 'GENerate template prohibited whEN vol snapshot exist.',
    SELF: 'GENERATE_TEMPLATE_PROHIBITED_WHEN_VOL_SNAPSHOT_EXIST'
  },
  VM_TRAFFIC_POLICY_NOT_FOUND: {
    CH: '云服务器流量策略不存在，请在数据控制－引流策略中设置',
    EN: 'VM traffic policy not found',
    SELF: 'VM_TRAFFIC_POLICY_NOT_FOUND'
  },
  MIRROR_VM_TO_DIFF_EXPORTER_PROHIBITED: {
    CH: '云服务器流量只能导出到一个采集器上',
    EN: 'VM traffic must export to only one exporter',
    SELF: 'MIRROR_VM_TO_DIFF_EXPORTER_PROHIBITED'
  },
  INVALID_UPLOADED_FILE: {
    CH: '上传的文件无效',
    EN: 'Invalid uploaded file',
    SELF: 'INVALID_UPLOADED_FILE'
  },
  INCONSISTENT_HOSTNAME: {
    CH: '拒绝配置导入，控制器hostname与配置文件不一致',
    EN: 'Import rejected due to inconsistENt hostname',
    SELF: 'INCONSISTENT_HOSTNAME'
  },
  ANOTHER_OPERATION_PROGRESSING: {
    CH: '当前有另一个操作正在进行中，请稍后再试',
    EN: 'Another operation is progressing, please try again later',
    SELF: 'ANOTHER_OPERATION_PROGRESSING'
  },
  HOST_UNREACHABLE: {
    CH: '无法连接到主机',
    EN: 'Host unreaCHable',
    SELF: 'HOST_UNREACHABLE'
  },
  RULE_NUM_EXCEEDED: {
    CH: '策略数目超出限制',
    EN: 'Max rule num exceeded',
    SELF: 'RULE_NUM_EXCEEDED'
  },
  RESOURCE_GROUP_NUM_EXCEEDED: {
    CH: '资源组数目超出限制',
    EN: 'Max resource-group num exceeded',
    SELF: 'RESOURCE_GROUP_NUM_EXCEEDED',
    LIMIT_CH: '，最多<limit>',
    LIMIT_EN: ', max<limit>',
  },
  PORT_NOT_SPECIFIED: {
    CH: '没有指明端口',
    EN: 'No port specified',
    SELF: 'PORT_NOT_SPECIFIED'
  },
  TRIGGER_THRESHOLD_NOT_SPECIFIED: {
    CH: '没有指明触发条件的具体数值',
    EN: 'No trigger_threshold specified',
    SELF: 'TRIGGER_THRESHOLD_NOT_SPECIFIED'
  },
  RESOURCE_SON_ALREADY_EXIST: {
    CH: '您要添加的网段，有子IP/网段存在',
    EN: 'Son IP or network segmENt exists',
    SELF: 'RESOURCE_SON_ALREADY_EXIST'
  },
  RESOURCE_FATHER_ALREADY_EXIST: {
    CH: '您要添加的IP/网段，有父网段存在',
    EN: 'Father network segmENt exists',
    SELF: 'RESOURCE_FATHER_ALREADY_EXIST'
  },
  RESOURCE_EXCLUDE_FATHER_ERROR: {
    CH: '您要添加的IP/网段，不能排除父网段',
    EN: 'Can not exclude father network segmENt',
    SELF: 'RESOURCE_EXCLUDE_FATHER_ERROR'
  },
  RESOURCE_EXCLUDE_IRRELEVANT_ERROR: {
    CH: '您要添加的IP/网段，不能排除无关的IP/网段',
    EN: 'Can not exclude irrelevant IP or network segmENt',
    SELF: 'RESOURCE_EXCLUDE_IRRELEVANT_ERROR'
  },
  PCAP_MERGES_EMPTY: {
    CH: '请求合并的条目为空',
    EN: 'The field <MERGES> is empty',
    SELF: 'PCAP_MERGES_EMPTY'
  },
  PCAP_DOWNLOAD_WITHOUT_MARK: {
    CH: 'PCAP下载时，请求的数据缺少MARK字段',
    EN: 'The post data miss field <MARK>',
    SELF: 'PCAP_DOWNLOAD_WITHOUT_MARK'
  },
  PCAP_DOWNLOAD_TASK_NOT_EXISTS: {
    CH: '请求下载的任务不存在，可能网络延迟过大或者PAINTER重启，请重试',
    EN: 'The download task not exists. please try again',
    SELF: 'PCAP_DOWNLOAD_TASK_NOT_EXISTS'
  },
  NAME_DUPLICATED: {
    CH: '规则中请不要包含相同名称',
    EN: 'Please do not name acls with same names',
    SELF: 'NAME_DUPLICATED'
  },
  RESOURCE_REFERENCED: {
    CH: '请不要删除正在被引用的资源',
    EN: 'Resuource group can be associated once in the same business',
    SELF: 'RESOURCE_REFERENCED',
    REFERENCE_CH: ', 正在引用的资源：<reference>',
    REFERENCE_DICT_CH: {
      1: '服务依赖',
      2: '安全策略',
      3: '物理拓扑链路',
      4: 'PCAP下载策略',
      5: '可用区',
      6: '采集点',
      7: '宿主机',
      8: '云服务器',
      9: '子网',
      10: 'VPC',
      11: '网卡',
    },
    NAME_CH: '<name>',
    EXTRA_CH: '<extra>',
    EXTRA_DICT_CH: {
      1: '的网卡'
    }
  },
  NOT_ENOUGH_IP_RESOURCE: {
    CH: '公网IP不足，管理员将会尽快添加公网IP资源',
    EN: "Not ENough ip resource, Admin must add more ip using 'mt ip.add'.",
    SELF: 'NOT_ENOUGH_IP_RESOURCE'
  },
  DB_QUERY_ERROR: {
    CH: '数据库查询失败',
    EN: 'DB error.',
    SELF: 'DB_QUERY_ERROR'
  },
  CALL_API_FAIL: {
    CH: '底层API调用失败',
    EN: 'Kernel API failed.',
    SELF: 'CALL_API_FAIL'
  },
  INSUFFICIENT_BALANCE: {
    CH: '您的账户余额不足，请确认余额足够所有资源使用',
    EN: 'Your balance is not ENough.',
    SELF: 'INSUFFICIENT_BALANCE'
  },
  BALANCE_NOT_ENOUGH: {
    CH: '您的账户余额不足，请确认余额足够所有资源使用',
    EN: 'Your balance is not ENough.',
    SELF: 'BALANCE_NOT_ENOUGH'
  },
  ORDER_PROCESS_ERROR: {
    CH: '您的订单提交失败，管理员将会尽快修复',
    EN: 'Order submit failed.',
    SELF: 'ORDER_PROCESS_ERROR'
  },
  VIF_IS_IN_FLOW: {
    CH: '设备该接口已配置在公网防护或微安全域策略中，请先删除策略再修改接口',
    EN: 'vif is in service flow',
    SELF: 'VIF_IS_IN_FLOW'
  },
  SELECTED_RESOURCES_NUM_EXCEEDED: {
    CH: '多选资源数目超出限制',
    EN: 'Selected resources count exceeds limit',
    SELF: 'SELECTED_RESOURCES_NUM_EXCEEDED',
    LIMIT_CH: '，最多<limit>',
    LIMIT_EN: ', max<limit>',
  },
  APPLICATION_REFERENCED: {
    CH: '请不要删除已引用该监控规则的应用',
    EN: 'Can not delete application which this acl is referenced',
    SELF: 'APPLICATION_REFERENCED'
  },
  TOP_NUM_EXCEEDED: {
    CH: '置顶标签数目超出限制',
    EN: 'Top labels count exceeds limit',
    SELF: 'TOP_NUM_EXCEEDED'
  },
  ACL_INAPPLICABLE: {
    CH: '监控规则不可用，适用应用不包含本应用',
    EN: 'Acl is inapplicable in this application',
    SELF: 'ACL_INAPPLICABLE'
  },
  RESOURCE_NUM_EXCEEDED: {
    CH: '资源数目超出限制',
    EN: 'Resources count exceeds limit',
    SELF: 'RESOURCE_NUM_EXCEEDED',
    LIMIT_CH: '，最多<limit>',
    LIMIT_EN: ', max<limit>',
  },
  REPORT_CREATE_ERROR: {
    CH: '根据策略创建报表失败',
    EN: 'Create report by this policy failed',
    SELF: 'REPORT_CREATE_ERROR'
  },
  DATA_EMPTY: {
    CH: '数据为空',
    EN: 'data empty',
    SELF: 'DATA_EMPTY'
  },
  NO_PERMISSION: {
    CH: '没有权限',
    EN: 'no permission',
    SELF: 'NO_PERMISSION'
  },
  MUST_LOGIN: {
    CH: '必须登录系统',
    EN: 'must login system',
    SELF: 'MUST_LOGIN'
  },
  APP_TYPE_ERROR: {
    CH: 'app 类型错误',
    EN: 'app type error',
    SELF: 'APP_TYPE_ERROR'
  },
  APP_ERROR: {
    CH: 'app 返回错误',
    EN: 'app return error',
    SELF: 'APP_ERROR'
  },
  SQL_ERROR: {
    CH: 'sql语句错误',
    EN: 'sql error',
    SELF: 'SQL_ERROR'
  },
  RUN_ERROR: {
    CH: '程序运行有误',
    EN: 'run error',
    SELF: 'RUN_ERROR'
  },
  HEADER_NO_USER_INFO: {
    CH: 'header缺少用户信息',
    EN: 'header no user info',
    SELF: 'HEADER_NO_USER_INFO'
  },
  NO_FOUND_METHOD: {
    CH: '请求方法不存在',
    EN: 'no found method',
    SELF: 'NO_FOUND_METHOD'
  },
  NOT_ALLOW_METHOD: {
    CH: '请求方法不允许',
    EN: 'not allow method',
    SELF: 'NOT_ALLOW_METHOD'
  },
  PARAMETER_EMPTY: {
    CH: '参数为空',
    EN: 'parameter empty',
    SELF: 'PARAMETER_EMPTY'
  },
  ILLEGAL_DATA: {
    CH: '非法数据',
    EN: 'illegal data',
    SELF: 'ILLEGAL_DATA'
  },
  DELETE_ERROR: {
    CH: '删除失败',
    EN: 'delete error',
    SELF: 'DELETE_ERROR'
  },
  CREATE_ERROR: {
    CH: '创建失败',
    EN: 'create error',
    SELF: 'CREATE_ERROR'
  },
  UPDATE_ERROR: {
    CH: '更新失败',
    EN: 'update error',
    SELF: 'UPDATE_ERROR'
  },
  NOT_ALLOW_CREATE: {
    CH: '不允许创建',
    EN: 'not allow create',
    SELF: 'NOT_ALLOW_CREATE'
  },
  NOT_ALLOW_DELETE: {
    CH: '不允许删除',
    EN: 'not allow delete',
    SELF: 'NOT_ALLOW_DELETE'
  },
  NOT_ALLOW_UPDATE: {
    CH: '不允许修改',
    EN: 'not allow update',
    SELF: 'NOT_ALLOW_UPDATE'
  },
  CREATE_NUMBER_MAX: {
    CH: '创建总数已达最大值',
    EN: 'create total already max',
    SELF: 'CREATE_NUMBER_MAX'
  },
  PUSH_EMAIL_NOT_ALLOW_SAME: {
    CH: '通告邮箱不能重复',
    EN: 'push email not allow same',
    SELF: 'PUSH_EMAIL_NOT_ALLOW_SAME'
  },
  SEND_EMAIL_EMPTY: {
    CH: '发送邮箱地址为空',
    EN: 'send email is empty',
    SELF: 'SEND_EMAIL_EMPTY'
  },
  REPORT_POLICY_CLOSE: {
    CH: '策略已经关闭',
    EN: 'report policy already close',
    SELF: 'REPORT_POLICY_CLOSE'
  },
  REPORT_POLICY_NOT_USERDEFINED: {
    CH: '不是自定义策略',
    EN: 'report policy type is not userdefined',
    SELF: 'REPORT_POLICY_NOT_USERDEFINED'
  },
  REPORT_ALREADY_EXIST: {
    CH: '报表已经存在',
    EN: 'report already exist',
    SELF: 'REPORT_ALREADY_EXIST'
  },
  REPORT_POLICY_TIME_ERROR: {
    CH: '策略时间定义错误',
    EN: 'policy time type error',
    SELF: 'REPORT_POLICY_TIME_ERROR'
  },
  REPORT_PUSH_USER_INFO_ERROR: {
    CH: '报表推送人信息有误',
    EN: 'report push user info error',
    SELF: 'REPORT_PUSH_USER_INFO_ERROR'
  },
  USER_KEY_UNIQUE: {
    CH: '用户key唯一',
    EN: 'user key unique',
    SELF: 'USER_KEY_UNIQUE'
  },
  USER_PASSWORD_VERIFY_ERROR: {
    CH: '密码校验不一致',
    EN: 'user password verify error',
    SELF: 'USER_PASSWORD_VERIFY_ERROR'
  },
  INVALID_METHOD: {
    CH: '无效的请求方式',
    EN: 'invalid method',
    SELF: 'INVALID_METHOD'
  },
  USER_NAME_EMAIL_ERROR: {
    CH: '用户名或邮箱已经存在',
    EN: 'user email or name already exist',
    SELF: 'USER_NAME_EMAIL_ERROR'
  },
  USER_LIMIT_ERROR: {
    CH: '创建管理员数量达到限制个数',
    EN: 'Maximum number of administrators',
    SELF: 'USER_LIMIT_ERROR'
  },
  USER_MUST_BE_SUPERADMIN: {
    CH: '用户必须是超级管理员',
    EN: 'user must be superadmin',
    SELF: 'USER_MUST_BE_SUPERADMIN'
  },
  USER_CAN_NOT_BE_SUPERADMIN: {
    CH: '用户不能是超级管理员',
    EN: 'user can not is superadmin',
    SELF: 'USER_CAN_NOT_BE_SUPERADMIN'
  },
  USER_MUST_BE_YOUSELF: {
    CH: '用户必须是自己',
    EN: 'user must is youself',
    SELF: 'USER_MUST_BE_YOUSELF'
  },
  USER_CAN_NOT_BE_YOUSELF: {
    CH: '用户不能是自己',
    EN: 'user can not is youself',
    SELF: 'USER_CAN_NOT_BE_YOUSELF'
  },
  NOT_FOUND: {
    CH: '资源未找到',
    EN: 'resource not found',
    SELF: 'NOT_FOUND'
  },
  ROLE_EXISTED: {
    CH: '角色已经存在',
    EN: 'role already exist',
    SELF: 'ROLE_EXISTED'
  },
  PERMISSION_EXISTED: {
    CH: '权限已经存在',
    EN: 'Authorization permission already exist',
    SELF: 'PERMISSION_EXISTED'
  },
  AUZ_FAIL: {
    CH: '权限不允许',
    EN: 'Authorization denied',
    SELF: 'AUZ_FAIL'
  },
  AUZ_USER_NOT_FOUND: {
    CH: '授权用户未找到',
    EN: 'Authorization user not found',
    SELF: 'AUZ_USER_NOT_FOUND'
  },
  AUZ_ROLE_NOT_FOUND: {
    CH: '授权角色未找到',
    EN: 'Authorization role not found',
    SELF: 'AUZ_ROLE_NOT_FOUND'
  },
  AUZ_NOT_FOUND: {
    CH: '权限未找到',
    EN: 'Authorization not found',
    SELF: 'AUZ_NOT_FOUND'
  },
  TUNNEL_IP_NUM_EXCEEDED: {
    CH: '隧道端点不能超过8个',
    EN: 'Number of tunnel_ip has reached the limit 8',
    SELF: 'TUNNEL_IP_NUM_EXCEEDED',
  },
  NPB_ACL_ALREADY_EXIST: {
    CH: '已经存在指定 <网络、IP、协议、端口> 的分发策略',
    EN: 'Policy with <network, IP, protocol, port> already exist',
    SELF: 'NPB_ACL_ALREADY_EXIST',
  },
  NPB_TUNNEL_NUM_EXCEEDED: {
    CH: '创建分发点资源超过最大8数量限制',
    EN: 'Create npb tunnel error, max num is 8.',
    SELF: 'NPB_TUNNEL_NUM_EXCEEDED'
  },
  NPB_TUNNEL_REFERENCED: {
    CH: '已关联的分发策略数为非零，请先解关联对应分发策略再删除',
    EN: 'Can not delete tunnel which is referenced by acl',
    SELF: 'NPB_TUNNEL_REFERENCED'
  },
  SERVICE_NOT_FOUND: {
    CH: '路径不存在',
    EN: 'Service not found',
    SELF: 'SERVICE_NOT_FOUND'
  },
  SCOPE_NOT_MATCH: {
    CH: '业务与资源组范围不匹配',
    EN: 'Resource group and business scope not match',
    SELF: 'SCOPE_NOT_MATCH',
  },
  TAP_TYPE_PATH_ALREADY_EXIST: {
    CH: '该采集点已有对应服务依赖。每个采集点只允许对应一个服务依赖',
    EN: 'Path with same tap type already exist',
    SELF: 'TAP_TYPE_PATH_ALREADY_EXIST',
  },
  LDAP_SYNC_USER_EXIST: {
    CH: 'LDAP同步用户存在',
    EN: 'ldap sync user exist',
    SELF: 'LDAP_SYNC_USER_EXIST',
  },
  LDAP_SYNC_USER_ALREADY_EXIST: {
    CH: 'LDAP同步用户已经存在',
    EN: 'ldap sync user already exist',
    SELF: 'LDAP_SYNC_USER_ALREADY_EXIST',
  },
  ACCOUNT_TYPE_ERROR: {
    CH: 'ldap类型用户不允许使用deepflow类型登录',
    EN: 'account type error',
    SELF: 'ACCOUNT_TYPE_ERROR',
  },
  LDAP_FILTER_NO_UID: {
    CH: 'ldap查询没有uid参数',
    EN: 'ldap no uid filter',
    SELF: 'LDAP_FILTER_NO_UID',
  },
  NO_LDAP_CONF: {
    CH: '没有ldap服务配置',
    EN: 'no ldap conf',
    SELF: 'NO_LDAP_CONF',
  },
  LDAP_BASE_CONNECT_ERROR: {
    CH: 'LDAP服务器无响应，配置失败',
    EN: 'ldap base connect error',
    SELF: 'LDAP_BASE_CONNECT_ERROR',
  },
  LDAP_SEARCH_CONNECT_ERROR: {
    CH: 'ldap通过密码查询服务查询失败',
    EN: 'ldap search connect error by pwd',
    SELF: 'LDAP_SEARCH_CONNECT_ERROR',
  },
  LDAP_SEARCH_FAIL_BY_ACCOUNT: {
    CH: 'ldap通过帐号查询失败',
    EN: 'ldap search by account error',
    SELF: 'LDAP_SEARCH_FAIL_BY_ACCOUNT',
  },
  LDAP_SEARCH_FAIL_BY_PWD: {
    CH: 'ldap通过密码校验失败',
    EN: 'ldap search by pwd error',
    SELF: 'LDAP_SEARCH_FAIL_BY_PWD',
  },
  SYNC_USER_ALREADY_EXISTED: {
    CH: '同步用户已经存在不能创建',
    EN: 'sync user already existed',
    SELF: 'SYNC_USER_ALREADY_EXISTED',
  },
  NETWORK_OVERLAP: {
    CH: '网段范围存在重叠',
    EN: 'Networks overlap',
    SELF: 'NETWORK_OVERLAP',
  },
  VERIFYCODE_VERIFY_ERROR: {
    CH: '验证码校验不一致',
    EN: ' verifycode verify error',
    SELF: 'VERIFYCODE_VERIFY_ERROR'
  },
  TAP_TYPE_PATH_REFERENCED: {
    CH: '相关采集点被接入网络使用，请不要删除该采集点服务依赖',
    EN: ' tap type path is referenced',
    SELF: 'TAP_TYPE_PATH_REFERENCED'
  },
  RESOURCE_SCOPE_NOT_MATCH: {
    CH: '有资源组不在变更的业务范围内，请先调整相关资源组',
    EN: ' Resource group not in scope exists',
    SELF: 'RESOURCE_SCOPE_NOT_MATCH'
  },
  LOGIN_FAILED_LOCK: {
    CH: '用户被锁定，请联系管理员',
    EN: ' User is locked,please contact the administrator',
    SELF: 'LOGIN_FAILED_LOCK'
  },
  USER_ALREADY_EXIST: {
    CH: '用户已经存在',
    EN: ' user already existed',
    SELF: 'USER_ALREADY_EXIST'
  },
  USER_FAILED: {
    CH: '获取用户信息失败',
    EN: ' get user error',
    SELF: 'USER_FAILED'
  },
  USER_NOT_EXIST: {
    CH: '用户不存',
    EN: ' user is not exist',
    SELF: 'USER_NOT_EXIST'
  },
  USER_TYPE_ERROR: {
    CH: '用户类型错误',
    EN: ' user typer error',
    SELF: 'USER_TYPE_ERROR'
  },
  INVALID_PARAMETERS: {
    CH: '参数格式错误',
    EN: ' invalid parmas',
    SELF: 'INVALID_PARAMETERS'
  },
  ROLE_RESOURCE_NOT_FOUND: {
    CH: '角色资源没有对应关系',
    EN: ' role resource is not found',
    SELF: 'ROLE_RESOURCE_NOT_FOUND'
  },
  ROLE_RESOURCE_AUZ_FAIL: {
    CH: '角色资源没有权限',
    EN: ' role resource authorization faild',
    SELF: 'ROLE_RESOURCE_AUZ_FAIL'
  },
  AUZ_SUPER_USER_ONLY: {
    CH: '只有管理员有权限',
    EN: ' super user only',
    SELF: 'AUZ_SUPER_USER_ONLY'
  },
  USER_FAILED_LOCK: {
    CH: '用户被锁定',
    EN: 'user is locked',
    SELF: 'USER_FAILED_LOCK'
  },
  USER_FAILED_DISABLE: {
    CH: '用户被禁用',
    EN: 'user is disable',
    SELF: 'USER_FAILED_DISABLE'
  },
  USER_FAILED_DELETED: {
    CH: '用户被删除',
    EN: 'user is deleted',
    SELF: 'USER_FAILED_DELETED'
  },
  HEADER_NO_AUTHORIZATION: {
    CH: 'header缺少授权信息',
    EN: 'header no authorization',
    SELF: 'HEADER_NO_AUTHORIZATION'
  },
  USER_NOT_ALLOW_YOUSELF: {
    CH: '用户不允许是自己',
    EN: 'user not allow youself',
    SELF: 'USER_NOT_ALLOW_YOUSELF'
  },
  REPORT_PUSH_USER_EMAIL_EMPTY: {
    CH: '报表推送用户邮箱为空',
    EN: 'report push user email empty',
    SELF: 'REPORT_PUSH_USER_EMAIL_EMPTY'
  },
  REPORT_NO_PUSH_USER: {
    CH: '报表推送用户不存在',
    EN: 'report push user is not exist',
    SELF: 'REPORT_NO_PUSH_USER'
  },
  USER_NAME_ALREADY_EXIST: {
    CH: '用户已经存在',
    EN: 'username already exist',
    SELF: 'USER_NAME_ALREADY_EXIST'
  },
  EMAIL_ALREADY_EXIST: {
    CH: '邮箱已经存在',
    EN: 'email already exist',
    SELF: 'EMAIL_ALREADY_EXIST'
  },
  PASSWORD_NOT_ALLOW_EMPTY: {
    CH: '密码不能为空',
    EN: 'password not allow empty',
    SELF: 'PASSWORD_NOT_ALLOW_EMPTY'
  },
  CACHE_LINK_FAIL: {
    CH: '缓存服务器连接失败',
    EN: 'cache link error',
    SELF: 'CACHE_LINK_FAIL'
  },
  LOCK_USER_FAIL: {
    CH: '锁定用户失败',
    EN: 'lock user fail',
    SELF: 'LOCK_USER_FAIL'
  },
  OPEN_USER_FAIL: {
    CH: '解锁用户失败',
    EN: 'open user fail',
    SELF: 'OPEN_USER_FAIL'
  },
  VPC_NOT_ALLOW_EMPTY: {
    CH: 'vpc 不能为空',
    EN: 'vpc can not empty',
    SELF: 'VPC_NOT_ALLOW_EMPTY'
  },
  ADD_USER_VPC_PERMISSION_FAIL: {
    CH: '用户绑定vpc失败',
    EN: 'user bind vpc permission fail',
    SELF: 'ADD_USER_VPC_PERMISSION_FAIL'
  },
  DEL_USER_VPC_PERMISSION_FAIL: {
    CH: '用户解绑vpc失败',
    EN: 'user del vpc permission fail',
    SELF: 'DEL_USER_VPC_PERMISSION_FAIL'
  },
  USER_VPC_PERMISSION_FAIL: {
    CH: '用户没有vpc绑定',
    EN: 'user no vpc bind',
    SELF: 'USER_VPC_PERMISSION_FAIL'
  },
  USER_VPC_LIMIT_MAX: {
    CH: '用户绑定vpc数量达到最大值',
    EN: 'user allowed vpcs number has been reached to the maximum',
    SELF: 'USER_VPC_LIMIT_MAX'
  },
  USER_CACHE_DEL_FAIL: {
    CH: '删除用户缓存失败',
    EN: 'del user cache failed',
    SELF: 'USER_CACHE_DEL_FAIL'
  },
  USER_VPC_CACHE_DEL_FAIL: {
    CH: '删除用户vpc缓存失败',
    EN: 'del user vpc cache failed',
    SELF: 'USER_VPC_CACHE_DEL_FAIL'
  },
  USER_BUSINESS_CACHE_DEL_FAIL: {
    CH: '删除用户业务缓存失败',
    EN: 'del user business cache failed',
    SELF: 'USER_BUSINESS_CACHE_DEL_FAIL'
  },
  USER_ALARM_CACHE_DEL_FAIL: {
    CH: '删除用户告警缓存失败',
    EN: 'del user alarm cache failed',
    SELF: 'USER_ALARM_CACHE_DEL_FAIL'
  },
  VPC_EXISTS_BIND_BUSINESS: {
    CH: 'vpc存在业务绑定关系，请先解除关系',
    EN: 'vpc exist with bind business',
    SELF: 'VPC_EXISTS_BIND_BUSINESS'
  },
  VTAP_UNABLE_TO_SWITCH: {
    CH: '无法将超出的采集器切换到其它分析器',
    EN: 'Unable to switch excess collector to another analyzer',
    SELF: 'VTAP_UNABLE_TO_SWITCH'
  },
  VTAP_UNABLE_TO_REGISTER: {
    CH: '分析器上的采集器数量已达最大值',
    EN: 'Unable to switch excess collector to another analyzer',
    SELF: 'VTAP_UNABLE_TO_SWITCH'
  },
  MANUAL_SWITCH_NOT_SUPPORTED: {
    CH: '存在集群管理节点，不支持控制器手动切换',
    EN: 'Manual switch controller is not supported',
    SELF: 'MANUAL_SWITCH_NOT_SUPPORTED'
  },
  NO_ANALYZER_IN_OTHER_DC: {
    CH: '当前数据中心的配置使得其他数据中心没有关联的分析器，操作失败',
    EN: 'Configuration will result no analyzer in other data centers',
    SELF: 'NO_ANALYZER_IN_OTHER_DC'
  },
  IP_RANGE_ERROR: {
    CH: 'IP段顺序需要从小到大',
    EN: 'Ip Range_End >= Range_Start',
    SELF: 'IP_RANGE_ERROR'
  },
  SERVICE_NUM_EXCEEDED: {
    CH: '服务依赖数目超出限制',
    EN: 'Max service num exceeded',
    SELF: 'SERVICE_NUM_EXCEEDED',
    LIMIT_CH: '，最多<limit>',
    LIMIT_EN: ', max<limit>',
  },
  SERVICE_DUPLICATE_NAME: {
    CH: '服务依赖名称重复',
    EN: 'Service name duplicate',
    SELF: 'SERVICE_DUPLICATE_NAME'
  },
  RESOURCE_GROUP_DUPLICATE_NAME: {
    CH: '资源组名称重复',
    EN: 'Resource group name duplicate',
    SELF: 'RESOURCE_GROUP_DUPLICATE_NAME'
  },
  LICENSE_VTAP_NUM_EXCEEDED: {
    CH: '授权采集器数量已达到授权限制，注册失败',
    EN: ' The number of vtap reached the authorization limit, registration failed',
    SELF: 'LICENSE_VTAP_NUM_EXCEEDED'
  },
  BACKUP_CONTROLLER_STATE_EXCEPTION: {
    CH: '备机状态异常，禁止切换',
    EN: ' Backup controller not in normal state, no switching',
    SELF: 'BACKUP_CONTROLLER_STATE_EXCEPTION'
  },
  ANALYZER_CONN_AZ_NUM_EXCEEDED: {
    CH: '分析关联的可用区数目超出限制',
    EN: ' Analyzer connected az num exceed',
    SELF: 'ANALYZER_CONN_AZ_NUM_EXCEEDED'
  },
  NO_FOUND_ALLOW_LOGIN_TYPE: {
    CH: '没有可以登录的帐户类型',
    EN: ' no found allow login type',
    SELF: 'NO_FOUND_ALLOW_LOGIN_TYPE'
  },
  HAVE_MANY_CONFIG: {
    CH: '一种类型的帐户不能有多个帐号',
    EN: ' One type has multiple accounts',
    SELF: 'HAVE_MANY_CONFIG'
  },
  LOGIN_CONFIG_FORMAT_ERROR: {
    CH: '登录类型配置参数格式错误',
    EN: ' login config wrong format',
    SELF: 'LOGIN_CONFIG_FORMAT_ERROR'
  },
  NO_LDAP_CONFIG: {
    CH: '没有ldap相关配置',
    EN: ' not found ldap config',
    SELF: 'NO_LDAP_CONFIG'
  },
  RETURN_ERROR_KEY: {
    CH: '返回数据key错误',
    EN: ' return error key',
    SELF: 'RETURN_ERROR_KEY'
  },
  RETURN_ERROR_FORMAT: {
    CH: '返回数据格式错误',
    EN: ' return error format',
    SELF: 'RETURN_ERROR_FORMAT'
  },
  SYSTEM_MAINTAIN: {
    CH: '系统维护中',
    EN: ' system maintain',
    SELF: 'SYSTEM_MAINTAIN'
  },
  HEADER_AUTHORIZATION_TYPE_ERROR: {
    CH: 'header授权信息格式错误',
    EN: ' header authorization type error',
    SELF: 'HEADER_AUTHORIZATION_TYPE_ERROR'
  },
  EMAIL_FORMAT_ERROR: {
    CH: '邮箱格式错误',
    EN: ' email format error',
    SELF: 'EMAIL_FORMAT_ERROR'
  },
  USER_OLD_PASSWORD_VERIFY_ERROR: {
    CH: '用户旧密码校验错误',
    EN: ' user old password verify error',
    SELF: 'USER_OLD_PASSWORD_VERIFY_ERROR'
  },
  USER_NOT_ALLOW_HIMSELF: {
    CH: '用户不能是自己',
    EN: ' user not allow himself',
    SELF: 'USER_NOT_ALLOW_HIMSELF'
  },
  USER_MUST_BE_HIMSELF: {
    CH: '用户必须是自己',
    EN: ' user must be himself',
    SELF: 'USER_MUST_BE_HIMSELF'
  },
  USER_OLD_PASSWORD_EMPTY: {
    CH: '旧密码不能为空',
    EN: ' user old password empty',
    SELF: 'USER_OLD_PASSWORD_EMPTY'
  },
  USER_OLD_PASSWORD_ERROR: {
    CH: '旧密码错误',
    EN: ' user old password error',
    SELF: 'USER_OLD_PASSWORD_ERROR'
  },
  EMAIL_NAME_ALREADY_EXIST: {
    CH: '用户已经存在',
    EN: ' email or name already exist',
    SELF: 'EMAIL_NAME_ALREADY_EXIST'
  },
  USER_DATA_NOT_FOUND: {
    CH: '用户数据不存在',
    EN: ' User data is not found',
    SELF: 'USER_DATA_NOT_FOUND'
  },
  USER_DATA_INDEX_MUST_BE_UNIQUE: {
    CH: '用户索引必须唯一',
    EN: ' user data index must be unique',
    SELF: 'USER_DATA_INDEX_MUST_BE_UNIQUE'
  },
  LDAP_ACCOUNT_AS_DF_NOT_ALLOWED: {
    CH: 'ldap类型用户不允许使用deepflow类型登录',
    EN: ' ldap account login with deepflow type is not allowed',
    SELF: 'LDAP_ACCOUNT_AS_DF_NOT_ALLOWED'
  },
  REGISTERED_ANALYZER_FAILED: {
    CH: '可用区中没有可关联的分析器',
    EN: 'No correlation analyzer available in the data center',
    SELF: 'REGISTERED_ANALYZER_FAILED'
  },
  USER_AUTH_TYPE_ERROR: {
    CH: '用户来源类型错误',
    EN: 'user auth type error',
    SELF: 'USER_AUTH_TYPE_ERROR'
  },
  USER_USER_TYPE_ERROR: {
    CH: '用户类型错误',
    EN: 'user type error',
    SELF: 'USER_USER_TYPE_ERROR'
  },
  BUSINESS_BLOCKING: {
    CH: '正在导入业务资源，请稍后再试',
    EN: 'Importing business resources, please try again later',
    SELF: 'BUSINESS_BLOCKING',
  },
  ROLLBACK_ERROR: {
    CH: '回滚失败，请手动删除相关资源',
    EN: 'Rollback failed, please delete related resources manually',
    SELF: 'ROLLBACK_ERROR',
  },
  FILE_ERROR: {
    CH: '文件上传错误',
    EN: 'File error',
    SELF: 'FILE_ERROR',
  },
  FILE_SIZE_EXCEED_LIMIT: {
    CH: '文件大小超出限制：10M',
    EN: 'File size exceed limit',
    SELF: 'FILE_SIZE_EXCEED_LIMIT',
  },
  BUSINESS_RESOURCE_NUM_EXCEEDED: {
    CH: '业务内资源数目超出限制',
    EN: 'Max resource num exceeded in one business',
    SELF: 'BUSINESS_RESOURCE_NUM_EXCEEDED',
    LIMIT_CH: '，最多<limit>',
    LIMIT_EN: ', max<limit>',
  },
  SECURITY_CSV_IS_EMPTY: {
    CH: '导入的文件为空',
    EN: 'import csv file is empty ',
    SELF: 'SECURITY_CSV_IS_EMPTY',
  },
  USER_IS_LOCKED_BY_NOT_LOGIN_LONG_TIME: {
    CH: '用户长时间未登录，被锁定，请联系管理员',
    EN: 'User is locked due to long absence of login',
    SELF: 'USER_LOCKED_BY_NOT_LOGIN_LONG_TIME',
  },
  USER_IS_LOCKED_BY_LOGIN_FAILED: {
    CH: '允许用户登录的失败次数已经最大，账户被锁定，请稍后再试',
    EN: 'Login failed user is locked,please try again later',
    SELF: 'USER_LOCKED_BY_NOT_LOGIN_LONG_TIME',
  },
  USER_IP_IS_NOT_IN_WHITE_LIST: {
    CH: '登录用户ip不在允许的白名单中',
    EN: 'User IP is not in the whitelist',
    SELF: 'USER_IP_IS_NOT_IN_WHITE_LIST',
  },
  USER_PWD_DOES_NOT_MATCH_RULES: {
    CH: '密码长度不符合规则',
    EN: 'Password length does not match rules',
    SELF: 'USER_PWD_DOES_NOT_MATCH_RULES',
  },
  USER_PWD_MUST_CONTAIN_NUMBERS: {
    CH: '密码必须包含数字',
    EN: 'Password must contain numbers',
    SELF: 'USER_PWD_MUST_CONTAIN_NUMBERS',
  },
  USER_PWD_MUST_CONTAIN_LETTERS: {
    CH: '密码必须包含字母',
    EN: 'Password must contain letters',
    SELF: 'USER_PWD_MUST_CONTAIN_LETTERS',
  },
  INTERNET_IP_NOT_SUPPORTED: {
    CH: 'IP暂不支持0.0.0.0',
    EN: '0.0.0.0 not supported in single ip resource group',
    SELF: 'INTERNET_IP_NOT_SUPPORTED',
  },
  INTERNET_TO_INTERNET_NOT_SUPPORTED: {
    CH: '不支持源资源组和目的资源组同时为Internet',
    EN: 'Internet to Internet service is not supported',
    SELF: 'INTERNET_TO_INTERNET_NOT_SUPPORTED',
  },
  INTERNET_IP_INCLUDED: {
    CH: '请调整网段范围，不可包括0.0.0.0',
    EN: 'Can not include Internet ip: 0.0.0.0',
    SELF: 'INTERNET_IP_INCLUDED',
  },
  ICON_IS_USED: {
    CH: '图标被使用',
    EN: 'icon is used',
    SELF: 'ICON_IS_USED',
  },
  ICON_NAME_IS_USED: {
    CH: '图标名被使用',
    EN: 'icon name is used',
    SELF: 'ICON_NAME_IS_USED',
  },
  VL2_NET_NUM_EXCEEDED: {
    CH: '网段数目超出限制',
    EN: 'Max network num exceeded',
    SELF: 'VL2_NET_NUM_EXCEEDED',
  },
  DEFAULT_ICON_NOT_ALLOWED_TO_DEL: {
    CH: '默认图标不允许被删除',
    EN: 'default icon not allowed to del',
    SELF: 'DEFAULT_ICON_NOT_ALLOWED_TO_DEL',
  },
  SRC_AND_DST_TAP_TYPE_EQUAL_ERROR: {
    CH: '客户端采集点和服务端采集点不能相等',
    EN: 'Src tap type and dst tap type should not be equal.',
    SELF: 'SRC_AND_DST_TAP_TYPE_EQUAL_ERROR',
  },
  LINK_ALREADY_EXISTS: {
    CH: '不支持录入两条相同的物理链路',
    EN: 'Link between these two network elements already exists.',
    SELF: 'LINK_ALREADY_EXISTS',
    SRC_NET_ELE_CH: '网元<src_net_ele>',
    DST_NET_ELE_CH: '和<dst_net_ele>之间',
    LINK_CH: '已存在物理链路<link>'
  },
  VALUE_IN_USE: {
    CH: '',
    EN: 'Value already in use',
    SELF: 'VALUE_IN_USE',
    KEY_CH: '<key>已使用',
    KEY_DICT_CH: {
      1: 'VLAN标签',
      2: '数据标记',
      3: '源IP+接口索引',
    },
  },
  EMAIL_NUM_EXCEEDED: {
    CH: '邮箱数目超出限制',
    EN: 'Number of email out of limit',
    SELF: 'EMAIL_NUM_EXCEEDED',
  },
  LOWER_GT_UPPER: {
    CH: '下限应小于上限',
    EN: 'Lower limit is greater than upper limit',
    SELF: 'LOWER_GT_UPPER',
  },
  NPB_TUNNEL_IP_VERSION_NOT_MATCH: {
    CH: '分发点的IP类型（IPv4/IPv6）必须和控制器控制IP类型一致',
    EN: 'The npb tunnel IP version must be same as the controller host ip version.',
    SELF: 'NPB_TUNNEL_IP_VERSION_NOT_MATCH',
  },
  INVALID_OPERATOR_FOR_OTHERS: {
    CH: '饼图第一个指标量仅支持Sum算子',
    EN: 'Can not specify include_others when operator of aggs.0 is not sum.',
    SELF: 'INVALID_OPERATOR_FOR_OTHERS'
  },
  NEED_THRESHOLD: {
    CH: '主指标量有告警策略，至少需要一个阈值',
    EN: 'threshold is need at least 1',
    SELF: 'NEED_THRESHOLD'
  },
  TARGET_FIELD_NOT_MATCH: {
    CH: '告警目标与子视图的指标量不匹配',
    EN: 'alarm target not match with measure index of sub view',
    SELF: 'TARGET_FIELD_NOT_MATCH'
  },
  USER_OLD_AND_NEW_PASSWORD_NOT_ALLOWED_SAME: {
    CH: '不允许和旧密码一致',
    EN: 'Not allowed to match the old password',
    SELF: 'USER_OLD_AND_NEW_PASSWORD_NOT_ALLOWED_SAME'
  },
  SESSION_MAX_ONLINE_ERR: {
    CH: '已经达到系统允许最大在线人数',
    EN: 'The maximum number of people allowed online has been reached',
    SELF: 'USER_OLD_AND_NEW_PASSWORD_NOT_ALLOWED_SAME'
  },
  ACCOUNT_ALLOWED_LOGIN_TIME_PERIOD_START_AND_END_ERROR: {
    CH: '允许登录系统的开始和结束时间错误',
    EN: 'Error in the start and end times allowed to log in to the system',
    SELF: 'USER_OLD_AND_NEW_PASSWORD_NOT_ALLOWED_SAME'
  },
  DISTRIBUTION_SINGLE_TRAFFIC_NOT_FOUND: {
    CH: '柱图/饼图/TOP N折线图/表格没有可用的资源指标量',
    EN: 'Distribution not get available single metrics',
    SELF: 'DISTRIBUTION_SINGLE_TRAFFIC_NOT_FOUND'
  },
  HISTORY_SINGLE_TRAFFIC_NOT_FOUND: {
    CH: '趋势分析/折线图没有可用的资源指标量',
    EN: 'History not get available single metrics',
    SELF: 'HISTORY_SINGLE_TRAFFIC_NOT_FOUND'
  },
  DISTRIBUTION_PEER_TRAFFIC_NOT_FOUND: {
    CH: '柱图/饼图/TOP N折线图/表格没有可用的路径指标量',
    EN: 'Distribution not get available peer metrics',
    SELF: 'DISTRIBUTION_PEER_TRAFFIC_NOT_FOUND'
  },
  HISTORY_PEER_TRAFFIC_NOT_FOUND: {
    CH: '趋势分析/折线图没有可用的路径指标量',
    EN: 'History not get available peer metrics',
    SELF: 'HISTORY_PEER_TRAFFIC_NOT_FOUND'
  },
  TOPO_SINGLE_TRAFFIC_NOT_FOUND: {
    CH: '拓扑图没有可用的资源指标量',
    EN: 'PeerTop not get available single metrics',
    SELF: 'TOPO_SINGLE_TRAFFIC_NOT_FOUND'
  },
  TOPO_PEER_TRAFFIC_NOT_FOUND: {
    CH: '拓扑图没有可用的路径指标量',
    EN: 'PeerTop not get available peer metrics',
    SELF: 'TOPO_PEER_TRAFFIC_NOT_FOUND'
  },
  CONTROLLER_CONN_FAILED: {
    CH: '资源同步控制器连接失败',
    EN: 'The resource synchronization controller connection failed',
    SELF: 'CONTROLLER_CONN_FAILED'
  },
  CLOUD_PLUGIN_NOT_INSTALL: {
    CH: '云平台插件没有安装',
    EN: 'The cloud platform plug-in is not installed',
    SELF: 'CLOUD_PLUGIN_NOT_INSTALL'
  },
  MAC_IN_USE: {
    CH: '同区域内，MAC地址不可重复',
    EN: 'Can not use samce mac in one region.',
    SELF: 'MAC_IN_USE'
  },
  NETWORK_SCOPE_NOT_MATCH: {
    CH: 'IP不属于所选子网',
    EN: 'IP not in selected network.',
    SELF: 'NETWORK_SCOPE_NOT_MATCH'
  },
  IP_IN_USE: {
    CH: '同子网IP冲突',
    EN: 'IP is used in selected network.',
    SELF: 'IP_IN_USE'
  },
  GROUP_BY_TAP_TYPE_DIFFERENT: {
    CH: '查询条件中不同资源集合的采集点分组属性不一致',
    EN: 'Different collection point grouping properties',
    SELF: 'GROUP_BY_TAP_TYPE_DIFFERENT'
  },
  INSERT_DB_ERROR: {
    CH: '数据库插入失败，请稍后再试',
    EN: 'Insert database failed，please try again later',
    SELF: 'INSERT_DB_ERROR'
  }
}

export default STATUS
/* eslint-enable max-len */
