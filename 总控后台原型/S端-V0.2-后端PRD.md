# 三方游戏总控后台(S 端)V0.2 · 后端 PRD

**版本**:V0.2
**日期**:2026-04-30
**目标读者**:后端 AI 开发
**搭配文档**:`S端-V0.2-前端PRD.md`(UI / 交互 / 字段展示)

---

## 0. 文档定位

本 PRD 用于后端 AI 开发,聚焦 **数据模型 + 接口契约 + 业务规则 + 权限矩阵 + 审计 + 跨端对接 + 安全要求**。

---

## 1. 系统定位与三端关系

```
┌──────────┐       ┌────────────────────────┐
│  账房侧   │ ◄───► │       S 端(本系统)    │ ◄──┐
│ (外部独立) │       │   三方游戏总控后台      │    │ S↔B 写动作同步 (Q-S29 待)
└──────────┘       └─────────────┬──────────┘    │
                                 │                │
                          ┌──────┴──────┐         │
                          ▼             ▼         │
                   ┌─────────┐   ┌──────────┐    │
                   │  B 端   │   │  C 端    │    │
                   │ 代理后台 │   │STAR VIP  │    │
                   │  V1.12  │   │ V0.4     │    │
                   └────┬────┘   └────┬─────┘    │
                        │             │           │
                        └─────────────┘           │
                              ▲                    │
                              │ 注单回调           │
                        ┌─────┴─────┐              │
                        │ 三方游戏商 │              │
                        │ BBIN 体育等│              │
                        └───────────┘              │
                                                    │
                        操作日志、流水回写 ────────┘
```

### 1.1 各端定位

| 端 | 定位 | 主要使用方 |
|---|---|---|
| 账房侧 | 平台资金管理 | 财务团队(独立系统) |
| S 端 | 平台员工管理 | operator / risk / finance |
| B 端 | 代理后台 | 顶代 / 代理 |
| C 端 | 玩家投注 | 玩家(终端用户) |

### 1.2 数据流向

| 数据 | 流向 | 频率 |
|---|---|---|
| 顶代账号创建 / 状态变更 | 账房侧 → S 端 | Q-S14 待(推/拉/实时/批量?) |
| S 端写动作(改资料 / 上下分 / 新增下级 / 状态变更)| S 端 → B 端 | Q-S29 待(实时同步?) |
| B 端写动作(代理给下线上下分 / 改资料)| B 端 → S 端审计 | 实时(玩家 Tab) |
| C 端玩家动作(登录 / 选交收方案 / 进入游戏 / 返回大厅)| C 端 → S 端审计 | 实时(玩家 Tab) |
| 注单 | 三方游戏商 → S 端 / B 端 | 准实时(回调) |
| 场次(日结快照) | 系统跑批 | **每日 00:10 跑前一天体育已结算注单** |
| 流水 | 三层资金动作 | 实时 |

---

## 2. 技术栈建议

| 层 | 选型建议 | 理由 |
|---|---|---|
| 后端语言 | Java 17+ / Go / Node.js | 看团队 |
| 框架 | Spring Boot 3 / Gin / NestJS | 同上 |
| 数据库 | MySQL 8 | 强一致 + 关系型 |
| 缓存 | Redis 7 | 会话 / 频繁读字段 |
| 鉴权 | JWT + 后端 session 双持 | 短期 token + 服务端可吊销 |
| 审计写库 | 异步写(MQ)| 不阻塞主写动作 |
| 配置管理 | Apollo / Nacos / 环境变量 | 看团队 |

> 真实选型由团队决定,本 PRD 不强制。

---

## 3. 数据模型

### 3.1 顶代户口表 `agents`

| 字段 | 类型 | 索引 | 含义 | 默认 | 备注 |
|---|---|---|---|---|---|
| `id` | bigint PK | | 自增主键 | | |
| `sys_id` | varchar(50) | UK(sys_id, currency) | 系统户口号 | | 顶代:`sys_id == user`;下线层级派生 |
| `user` | varchar(50) | IDX | 用户账号 | | 自定义,登录用 |
| `nick` | varchar(100) | | 账户昵称 | `user` | 选填 |
| `phone` | varchar(30) | | 主电话 | | |
| `phone2` | varchar(30) | | 备用电话 | | |
| `password_hash` | varchar(255) | | 登录密码 hash | | bcrypt 推荐 |
| `currency` | varchar(10) | | 币种 | | KRW / USD / PHP / CNY / THB |
| `account_type` | varchar(20) | IDX | 账号类型 | | `普通(顶代) / 代理 / 游戏` |
| `status` | varchar(20) | IDX | 账号状态 | `active` | `active / frozen` |
| `share_ratio` | decimal(6,4) | | 占成 | NULL | 顶代有值,下线层 V0.2 = NULL(参考占成另存)|
| `ref_share_ratio` | decimal(6,4) | | 参考占成 | NULL | 下线层用,≤ 父级 share_ratio |
| `ref_rate` | decimal(6,4) | | 参考佣金率 | NULL | 上级给下线的提成 |
| `balance` | decimal(20,4) | | 账户余额 | 0 | |
| `parent_id` | bigint | IDX | 直属上级 ID | NULL | 顶代 NULL,下线指向父 |
| `parent_sys_id` | varchar(50) | IDX | 直属上级 sysId | NULL | 冗余字段方便查 |
| `created_at` | datetime | | 开户时间 | | 账房侧创建时间(顶代)/ S 端 / B 端 创建时间(下线)|
| `updated_at` | datetime | | 最后修改时间 | | |
| `last_login_at` | datetime | | 最近登录 C 端 / B 端时间 | NULL | |
| `created_by` | varchar(50) | | 创建人(账号) | | 账房侧 / 顶代 / 代理 / operator |
| `created_source` | varchar(20) | | 创建来源 | | `house(账房) / B / S` |

**派生字段**(不存,通过 SQL 计算或缓存):
- `sub_count`:**穿透总下线数**,`SELECT COUNT(*) FROM agents WHERE sys_id LIKE '{parent_sys_id}-%'`
- `sub_balance`:`Σ 直属下线.total_balance` 递归(后端递归算或冗余存)
- `total_balance`:`balance + sub_balance`(派生)

**唯一约束**:`(user, currency)` 作为业务唯一(1 顶代多币种 = 多行,sys_id 同 + currency 不同 = 不同行)

> **跨端字段命名分歧**(Q-S7 / Q-S15 待)
> - 字段 `balance`(账户余额)在 B 端叫 `col_balance`(可用余额)— 真实开发统一
> - 字段 `sys_id`(S 端)在 B 端叫 `id` — 真实开发统一

### 3.2 员工账号表 `staff`

| 字段 | 类型 | 索引 | 含义 | 备注 |
|---|---|---|---|---|
| `id` | bigint PK | | | |
| `user` | varchar(50) | UK | 员工账号 | 4-20 位英文+数字+中划线 |
| `password_hash` | varchar(255) | | 登录密码 hash | bcrypt;V0.2 mock 明文 `123456` |
| `role` | varchar(20) | | 角色 | `operator / risk / finance` |
| `phone` | varchar(30) | | 联系电话 | 选填,异常登录通知 |
| `is_super` | tinyint(1) | | 是否超级账号 | admin = 1,其他 0;super 不可删 / 不可改角色 |
| `status` | varchar(20) | | 状态 | V0.2 简化(全 active),后续可扩 frozen / locked |
| `failed_login_count` | int | | 累计登录失败次数 | Q-S39 待;触发锁定阈值后 disabled |
| `must_change_pwd` | tinyint(1) | | 下次登录强制改密 | Q-S36 待 |
| `last_login_at` | datetime | | 最近登录时间 | 登录时更新 |
| `last_login_ip` | varchar(50) | | 最近登录 IP | 登录时记录 |
| `created_at` | datetime | | | |
| `created_by` | varchar(50) | | 创建员工账号 | operator 或 SYSTEM |

### 3.3 操作日志表 `audit_log`

| 字段 | 类型 | 索引 | 含义 |
|---|---|---|---|
| `id` | bigint PK | | |
| `time` | datetime | IDX | 动作时间(秒级) |
| `actor_type` | varchar(20) | IDX | `员工 / 玩家 / 代理` |
| `actor` | varchar(100) | IDX | 主体描述串(例 `admin (operator)` / `qweqwe (顶代)` / `P-qw-008`) |
| `actor_user` | varchar(50) | | 主体用户账号(便于精确查询) |
| `actor_role` | varchar(20) | | 主体角色(员工 actor_type 时填 operator/risk/finance) |
| `action` | varchar(50) | IDX | 动作字符串(见 §6 写动作枚举) |
| `target` | varchar(500) | | 动作对象描述,含 diff 内容 |
| `ip` | varchar(50) | | 主体 IP |
| `reason` | varchar(500) | | 备注(V0.2 系统 / 玩家 Tab 默认 `-`)|
| `extra` | json | | 扩展字段(可选,存详细 diff JSON 等)|

**索引建议**:`(time DESC)` 主查询;`(actor_type, time DESC)` Tab 切换;`(actor_user, time DESC)` 个人轨迹;`(action, time DESC)` 类型聚合。

### 3.4 IP 白名单表 `ip_whitelist`

| 字段 | 类型 | 索引 | 含义 |
|---|---|---|---|
| `id` | bigint PK | | |
| `ip` | varchar(50) | UK | IP 或 CIDR 段(`192.168.1.1` / `10.4.2.0/24`) |
| `label` | varchar(100) | | 备注(必填) |
| `enabled` | tinyint(1) | IDX | 启用 / 已停用 |
| `created_at` | datetime | | |
| `created_by` | varchar(50) | | 操作员工 user |
| `updated_at` | datetime | | |

### 3.5 注单表 `bets`

| 字段 | 类型 | 索引 | 含义 | 备注 |
|---|---|---|---|---|
| `id` | varchar(50) PK | | 注单号 | 18 位数字串(三方回调带,例 `519346028101500970`)|
| `player_sys_id` | varchar(50) | IDX | 玩家系统户口号 | |
| `player_user` | varchar(50) | | 玩家用户账号 | |
| `top_agent` | varchar(50) | IDX | 关联顶代 user | |
| `provider` | varchar(50) | | 三方平台 | BBIN 体育 / PG SOFT / VR 六合彩 |
| `provider_code` | varchar(50) | | 三方平台代码 | |
| `game_type` | varchar(30) | IDX | 游戏类型 | 体育 / 电子 / 六合彩 |
| `league` | varchar(100) | | 联赛 | 体育独有 |
| `team_home` | varchar(100) | | 主队 | |
| `team_away` | varchar(100) | | 客队 | |
| `score` | varchar(50) | | 比分 | |
| `play_method` | varchar(50) | | 玩法 | |
| `selection` | varchar(100) | | 选项 | |
| `odds` | decimal(8,3) | | 赔率 | |
| `bundle_type` | varchar(20) | | 串关类型 | |
| `bet_time` | datetime | IDX | 投注时间 | |
| `settle_time` | datetime | IDX | 结算时间 | |
| `stake` | decimal(20,4) | | 投注金额 | |
| `payout` | decimal(20,4) | | 派彩金额 | |
| `win_loss` | decimal(20,4) | | 输赢 | `payout - stake`(可负) |
| `valid_stake` | decimal(20,4) | | 有效投注 | NULL 时取 `stake`(向后兼容)|
| `currency` | varchar(10) | IDX | 币种 | |
| `status` | varchar(20) | IDX | 状态 | `已结算 / 未结算`(Q-S31 待:作废 / 取消等异常)|

**S 端只存体育已结算**(`game_type='体育' && status='已结算'`),其他游戏 V0.2 不进 S 端展示。

### 3.6 场次表 `sports_sessions`

> **每日 00:10 跑批 1 次,生成前一天的"日结快照"**(只跑体育已结算注单)

| 字段 | 类型 | 索引 | 含义 |
|---|---|---|---|
| `id` | varchar(30) PK | | 场次编号 `SP-YYYYMMDDHHMM-NNN` |
| `date` | date | IDX | 业务日期(前一天)|
| `top_agent` | varchar(50) | IDX | 顶代 user |
| `sys_id` | varchar(50) | | 顶代 sysId(== user) |
| `user` | varchar(50) | | 同上 |
| `currency` | varchar(10) | | 币种 |
| `share_ratio` | decimal(6,4) | | 顶代占成 |
| `valid_stake` | decimal(20,4) | | 总有效投注 |
| `share_amount` | decimal(20,4) | | 占成金额 = valid_stake × share_ratio |
| `total_win_loss` | decimal(20,4) | | 总输赢 |
| `rate` | decimal(6,4) | | 顶代佣金率 |
| `commission` | decimal(20,4) | | 佣金金额 = valid_stake × rate |
| `submit_rate` | json | | 上缴佣金率(V0.2 不可用,字段保留)`[{sys_id, rate}, ...]` |
| `work_start_at` | datetime | | 开工时间(业务日 00:00:00)|
| `work_end_at` | datetime | | 收工时间(业务日 23:59:59)|
| `status` | varchar(20) | IDX | `已结算 / 未结算` |
| `batch_id` | varchar(30) | IDX | 跑批批次号 |
| `created_at` | datetime | | |

### 3.7 流水表 `ledger`

| 字段 | 类型 | 索引 | 含义 |
|---|---|---|---|
| `id` | varchar(30) PK | | 流水号(例 `TX-20260429-3201`)|
| `time` | datetime | IDX | 资金动作时间 |
| `type` | varchar(30) | IDX | 6 种 type ID(`house_credit / house_debit / agent_credit / agent_debit / transfer_in / transfer_out`)|
| `type_label` | varchar(30) | | 4 种 typeLabel(collapsed):`上分 / 下分 / 三方体育上分 / 三方体育下分` |
| `main_sys_id` | varchar(50) | IDX | 主体 sysId(被影响账号)|
| `main_user` | varchar(50) | | 主体 user |
| `from_account` | varchar(100) | | 来源(例 `qweqwe (顶代)` / `BBIN 体育 (三方平台)` / `AH-001 (账房)`)|
| `to_account` | varchar(100) | | 去向 |
| `amount` | decimal(20,4) | | 金额 |
| `currency` | varchar(10) | | 币种 |
| `status` | varchar(20) | IDX | `成功 / 超时重试 / 失败`(Q-S31 待补:部分成功)|
| `related_bet` | varchar(50) | | 关联注单(三方转入转出时)|
| `created_at` | datetime | | |

### 3.8 type 与 type_label 映射

| type ID | typeLabel | 主体 | 资金流向 |
|---|---|---|---|
| `house_credit` | 上分 | 顶代 | 账房 → 顶代 |
| `house_debit` | 下分 | 顶代 | 顶代 → 账房 |
| `agent_credit` | 上分 | 下线 | 顶代/代理 → 下线 |
| `agent_debit` | 下分 | 下线 | 顶代/代理 ← 下线 |
| `transfer_in` | 三方体育上分 | 玩家或代理 | 玩家 → 三方体育平台 |
| `transfer_out` | 三方体育下分 | 玩家或代理 | 三方体育平台 → 玩家 |

> 前端 typeLabel collapsed 到 4 类(`credit / debit / transfer_in / transfer_out`),后端 type 保留 6 个细类。

---

## 4. 接口契约

> 所有接口前缀 `/api/s/v1/`,鉴权用 `Authorization: Bearer <jwt>`(LoginPage 提交时下发)。

### 4.1 鉴权 / 会话

#### 4.1.1 POST `/api/s/v1/auth/login`

```json
// 请求
{
  "user": "admin",
  "password": "123456"
  // IP 后端从 request 自动取
}

// 响应 200 (成功)
{
  "token": "<jwt>",
  "user": {
    "user": "admin",
    "role": "operator",
    "phone": "+86 ...",
    "lastLoginAt": "2026-04-30 16:42:18"
  },
  "ip": "10.4.2.18"
}

// 响应 403 (IP 拒登)
{ "code": "IP_DENIED", "message": "IP 10.4.2.18 不在白名单内" }

// 响应 404 (员工不存在)
{ "code": "STAFF_NOT_FOUND", "message": "员工账号不存在" }

// 响应 401 (密码错误)
{ "code": "PWD_WRONG", "message": "登录密码错误" }
// + 累计 failed_login_count + 1
```

校验顺序:**IP 白名单 → 员工存在 → 密码正确**(跟前端一致)
副作用:成功时更新 `staff.last_login_at` + `staff.last_login_ip` + 写审计 `登录`

#### 4.1.2 POST `/api/s/v1/auth/logout`

```json
{}  // 仅 token 鉴权
```

副作用:写审计 `登出`

#### 4.1.3 POST `/api/s/v1/auth/change-password`

```json
{
  "oldPassword": "123456",
  "newPassword": "newpass123"
}

// 响应 200
{ "success": true }
// 副作用: 更新 password_hash, 写审计 修改密码 + 登出 (改密强制), 吊销旧 token
```

校验:
- 新密码 ≥ 6 位
- 新密码 ≠ 旧密码
- 旧密码必须正确

### 4.2 顶代户口

#### 4.2.1 GET `/api/s/v1/agents`

筛选参数(query):
- `keyword` (string):匹配 sys_id / user
- `status` (`active|frozen|all`)
- `currency` (string|`all`)
- `shareRatio` (`lt10|10to20|20to30|gte30|all`)
- `dateFrom`, `dateTo` (datetime)
- `pageNum` (int, 0-based), `pageSize` (int, default 20)

响应:
```json
{
  "rows": [
    {
      "sysId": "qweqwe",
      "user": "qweqwe",
      "nick": "qweqwe",
      "currency": "KRW",
      "accountType": "普通(顶代)",
      "status": "active",
      "shareRatio": 0.1875,
      "balance": 50000000,
      "subBalance": 120000000,
      "totalBalance": 170000000,
      "subCount": 6,
      "createdAt": "2026-01-15 10:00:00",
      "children": ["carry01::KRW", "eva_ph::KRW"]  // 直属下线 keys, 给前端 lazy-load 用
    }
  ],
  "total": N,
  "page": 0,
  "pageSize": 20
}
```

> **角色字段过滤**:`role=risk` 时不返回 `shareRatio / balance / subBalance / totalBalance` 字段(后端按 token 内 role 过滤)。

#### 4.2.2 GET `/api/s/v1/agents/:sysId/:currency/children`

返回直属下线列表(Tree Table 懒加载)。响应同 4.2.1。

#### 4.2.3 PUT `/api/s/v1/agents/:sysId/:currency/profile`(修改资料)

请求:
```json
{
  "nick": "...",
  "phone": "...",
  "phone2": "...",
  "accountType": "代理",       // 升级规则:游戏 → 代理 OK,代理 → 游戏 禁止,顶代不可改
  "shareRatio": 0.20,           // 顶代不传(账房管);下线层传则 ≤ 父级 share_ratio
  "refRate": 0.06,
  "status": "active|frozen",
  "resetPwd": "newpass" | null, // null = 不重置;非 null = 重置,强制下次登录改密
  "operationPassword": "123456" // 若任一高敏感字段有改,必填
}

// 响应 200
{ "success": true, "diff": { "status": "active → frozen", "shareRatio": "..." } }
```

业务规则:
- **高敏感字段判定**:status / accountType / shareRatio / refRate / resetPwd 任一变化 → 必填操作密码;只改 nick / phone / phone2 → 不需操作密码
- **级联冻结**:`status: active → frozen` 时递归把所有 children 也置 frozen(穿透到底);`frozen → active` 不级联
- **写审计**:`修改资料` + diff 内容(status 用中文 启用/禁用),resetPwd 时另写一条 `重置下线密码`
- **B 端同步**:Q-S29 待

#### 4.2.4 POST `/api/s/v1/agents/:parentSysId/:parentCurrency/sub`(新增下级)

请求:
```json
{
  "user": "carry01",            // 6-20 位英文+数字
  "password": "...",
  "nick": "carry03",
  "phone": "...",
  "accountType": "代理|游戏",
  "status": "active",
  "refShareRatio": 0.20,        // ≤ 父级 share_ratio
  "refRate": 0.05,
  "operationPassword": "123456"
}

// 响应 200
{
  "sysId": "qweqwe-3",          // 后端派生 = parent.sys_id + "-" + (parent.children.length + 1)
  "user": "carry01",
  "currency": "KRW"             // 自动继承父级
}
```

业务规则:
- **币种自动继承父级**(单个币种线整条币种一致)
- **派生 sysId**:`parent_sys_id + "-" + childSeq`
- **校验** `(user, currency)` 在 agents 表唯一
- 沿祖先链 cache invalidation(更新 sub_count)
- 写审计 `新增下级`
- B 端同步 Q-S29

#### 4.2.5 POST `/api/s/v1/agents/:sysId/:currency/credit`(上分)

```json
{
  "amountWan": 100,             // 单位"万"
  "operationPassword": "123456"
}

// 响应 200
{ "newBalance": ..., "parentNewBalance": ... }

// 响应 400
{ "code": "PARENT_INSUFFICIENT", "message": "上级账户余额不足 / 上级 X 当前余额 Y KRW,无法上分 Z / 建议先让账房给上级补充余额" }
```

业务规则:
- 校验直属上级余额 ≥ 实际扣款(占成公式:实际扣款 = N × (1 − X%),X 为占成,但 V0.2 资金内部转移不应用占成,只在账房 ↔ 顶代结算时应用)
- **资金内部转移**(整树总余额不变):
  - 该账号 `balance + X`,`total_balance + X`
  - 直属上级 `balance - X`,`sub_balance + X`
  - 直属上级 `total_balance` 不变
- 写审计 `上分`
- 写流水(type=`agent_credit`,from=parent,to=自己,amount=X,currency=自己 currency)

#### 4.2.6 POST `/api/s/v1/agents/:sysId/:currency/debit`(下分)

类似 4.2.5,反向。校验该账号余额 ≥ X。

### 4.3 报表

#### 4.3.1 GET `/api/s/v1/reports/bets`(体育注单)

筛选参数:`betId` / `keyword`(matchPlayerSysId/User) / `currency` / `dateFrom` / `dateTo` / `pageNum` / `pageSize`

**硬过滤(后端必加)**:`game_type='体育' && status='已结算'`

响应:`{ rows, total, page, pageSize }`,字段集见 §3.5

> **risk 隐藏**:`payout / win_loss` 字段后端按 token role 过滤。

#### 4.3.2 GET `/api/s/v1/reports/sports`(体育场次)

筛选参数:`sessionId` / `keyword`(matchSysId/User) / `currency` / `shareRatio` / `dateFrom` / `dateTo` / `status`

**默认过滤**:`valid_stake > 0`(空跑批不展示)

响应:rows + total,字段见 §3.6。

#### 4.3.3 GET `/api/s/v1/reports/sports/:sessionId/details`(场次游戏明细)

返回该场次关联的注单列表(参考 PM 简化按 `top_agent` 过滤;真实按 `batch_id`)。

响应:含 page/pageSize(10 条/页)/ subtotal / total。

#### 4.3.4 GET `/api/s/v1/reports/ledger`(交易流水)

筛选参数:`txId` / `keyword`(matchMainSysId/User) / `txType`(`credit/debit/transfer_in/transfer_out/all`)/ `flow`(`in/out/all`) / `currency` / `dateFrom` / `dateTo` / `status`

> `txType=credit` 后端 OR 匹配 `house_credit + agent_credit`;`txType=debit` 同理。
> `flow=in` 匹配 credit + transfer_in;`flow=out` 匹配 debit + transfer_out。

#### 4.3.5 POST `/api/s/v1/reports/:type/export`(导出 Excel)

```json
// 请求
{ "type": "bets|sports|ledger|audit_system" }
// 不带筛选, 全量导出 (Sammy 拍 Q-S26)

// 响应 200
{ "downloadUrl": "https://...xxx.xlsx?token=...", "filename": "2026-04-30_体育注单记录.xlsx" }
```

副作用:写审计 `导出 Excel`,target 含菜单名 + 全量条数 + 文件名。

> **大数据量异步策略**(Q-S26 延伸):后端可选择直接返回 url(小数据)或异步任务(大数据,通过邮件 / 站内信通知下载链接)。

### 4.4 员工账号(operator only)

#### 4.4.1 GET `/api/s/v1/perm/staff`

返回员工列表 + 当前登录员工标记。

#### 4.4.2 POST `/api/s/v1/perm/staff`(新增)

```json
{
  "user": "ops-zhang",          // 4-20 位英文+数字+中划线
  "password": "...",            // ≥ 6 位
  "role": "operator|risk|finance",
  "phone": "...",
  "operationPassword": "123456"
}
```

校验:
- user 唯一
- 友好提示:`⚠ 员工账号已存在 / 请换一个员工账号(若该账号已离职,请先在权限管理删除)`

#### 4.4.3 PUT `/api/s/v1/perm/staff/:user/role`(修改角色)

```json
{
  "newRole": "operator|risk|finance",
  "operationPassword": "123456"
}
```

业务规则:
- **admin 不可改**(后端 hard check `is_super`);返回 403
- 不能改自己(`user === currentUser.user`);返回 403
- 该员工已登录会话**保持原角色**直到重登(V0.2 不实时 invalidate session;Q-S40 真实开发可选 force logout 该用户)

#### 4.4.4 DELETE `/api/s/v1/perm/staff/:user`

业务规则:
- **admin 不可删**(`is_super=1`)
- 不能删自己
- 友好提示见 §8.2

### 4.5 操作日志

#### 4.5.1 GET `/api/s/v1/sys/audit`

筛选参数:
- `tab` (`system|player`) → 后端按 `actor_type` 过滤(系统 = `员工`,玩家 = `玩家|代理`)
- `actor` (string,模糊匹配 actor 字段)
- `actorType` (`员工|玩家|代理|all`)
- `dateFrom` / `dateTo`

响应:rows + total。

> 写动作 audit 由后端各 API 内部 `service.appendAudit(...)` 触发;前端不主动调用 audit 写接口。

### 4.6 IP 白名单(operator only)

#### 4.6.1 GET `/api/s/v1/sys/ipwhite`

筛选:`keyword`(模糊 ip + label)/ `enabled`(`true|false|all`)。

#### 4.6.2 POST `/api/s/v1/sys/ipwhite`(新增)

```json
{
  "ip": "192.168.1.1|10.4.2.0/24",
  "label": "...",
  "enabled": true,
  "operationPassword": "123456"
}
```

校验:格式合法 + ip 不重复。

#### 4.6.3 PUT `/api/s/v1/sys/ipwhite/:id/toggle`

```json
{ "operationPassword": "123456" }
```

业务规则:
- **防自锁**:停用此条后剩余启用项 < 1 → 拦截 403
- **Q-S44 待**:停用此条后,**当前登录员工 IP 是否还在剩余启用项内**?不在则拦截或警告

#### 4.6.4 DELETE `/api/s/v1/sys/ipwhite/:id`

同 toggle 的防自锁规则。

---

## 5. 业务规则(关键算法)

### 5.1 占成业务公式

```
顶代占成 X% (粒度 = 顶代 + 币种)

账房 ↔ 顶代:
  上分 N → 实际扣款 = N × (1 − X%)
  下分 N → 实际到账 = N × (1 − X%)

例: 占成 20%,上分 100 万 → 平台跟账房只结 80 万,顶代账面 +100 万
    顶代实际相当于让利 20% 给账房 (商务谈定的核心字段)
```

下线层 V0.2 不支持独立占成(Q-S11)。

### 5.2 上下分资金内部转移

```python
def credit(target, amount):
    parent = target.parent
    assert parent.balance >= amount, "上级余额不足"
    
    target.balance += amount
    target.total_balance += amount
    
    parent.balance -= amount
    parent.sub_balance += amount
    # parent.total_balance 不变 (balance -X + sub_balance +X 抵消)
    
    # 整棵树总余额不变 (只是内部转移)
```

### 5.3 级联冻结(只下行)

```python
def update_status(node, new_status, op_pwd):
    if old_status == 'active' and new_status == 'frozen':
        # 递归级联
        cascade_freeze(node)
    
    node.status = new_status
    # frozen → active 不级联

def cascade_freeze(node):
    for child in node.children:
        child.status = 'frozen'
        cascade_freeze(child)  # 穿透到底
```

### 5.4 总线余额递归

```python
def total_balance(node):
    return node.balance + sum(total_balance(c) for c in node.children)
```

### 5.5 下线数(穿透)

```python
def sub_count(node):
    return sum(1 + sub_count(c) for c in node.children)
# 不含自己
```

### 5.6 IP 白名单校验

```python
def check_ip_allowed(ip, whitelist):
    enabled = [w for w in whitelist if w.enabled]
    if len(enabled) == 0:
        return True  # 启用项 0 条 = 不限制
    return any(ip_matches(ip, w.ip) for w in enabled)

def ip_matches(ip, entry):
    if '/' not in entry:
        return ip == entry  # 单 IP 完全匹配
    base, prefix = entry.split('/')
    prefix = int(prefix)
    if prefix == 0:
        return True  # 0.0.0.0/0 匹配所有
    mask = ~((1 << (32 - prefix)) - 1) & 0xFFFFFFFF
    return (ip_to_int(ip) & mask) == (ip_to_int(base) & mask)
```

### 5.7 派生 sys_id

```python
def derive_sys_id(parent_sys_id, child_seq):
    return f"{parent_sys_id}-{child_seq}"

# 顶代:sys_id = user (账房创建)
# 1 层:qweqwe → carry01 → carry01.sys_id = qweqwe-1
# 2 层:qweqwe-1 → alice88 → alice88.sys_id = qweqwe-1-1
# 3 层:qweqwe-1-1 → bob_hi → bob_hi.sys_id = qweqwe-1-1-1
```

### 5.8 场次跑批(每日 00:10)

```python
@scheduled(cron="10 0 * * *")  # 每天 00:10
def run_session_batch():
    yesterday = today() - 1
    bets = db.query(
        "SELECT * FROM bets WHERE game_type='体育' AND status='已结算' "
        "AND DATE(settle_time)=:date", date=yesterday
    )
    
    # 按 (顶代, 币种) 聚合
    grouped = group_by(bets, lambda b: (b.top_agent, b.currency))
    
    batch_id = f"BATCH-{format(now(), 'YYYYMMDDHHMM')}"
    seq = 1
    for (agent, currency), agent_bets in grouped.items():
        if sum(b.valid_stake for b in agent_bets) == 0:
            continue  # 空跑批不存
        session = SportsSession(
            id=f"SP-{format(now(), 'YYYYMMDDHHMM')}-{seq:03d}",
            date=yesterday,
            top_agent=agent.user,
            sys_id=agent.sys_id,
            user=agent.user,
            currency=currency,
            share_ratio=agent.share_ratio,
            valid_stake=sum(b.valid_stake for b in agent_bets),
            share_amount=sum(b.valid_stake * agent.share_ratio for b in agent_bets),
            total_win_loss=sum(b.win_loss for b in agent_bets),
            rate=agent.rate,  # 顶代佣金率
            commission=sum(b.valid_stake * agent.rate for b in agent_bets),
            submit_rate=[],  # V0.2 不算
            work_start_at=f"{yesterday} 00:00:00",
            work_end_at=f"{yesterday} 23:59:59",
            status="已结算",
            batch_id=batch_id,
        )
        db.insert(session)
        seq += 1
```

> **跨日注单佣金率取哪一天?** Q-S5 待。

---

## 6. 写动作回写审计(关键)

> **后端硬规则**:每个写动作 API 内部必须 `service.appendAudit(...)`,跟数据库写动作在同一事务(或异步 MQ 但保证落库)。

### 6.1 13 类系统审计

| 接口 | action 字符串 | actor | target 模板 |
|---|---|---|---|
| `POST /auth/login` | `登录` | 员工 | `S 端 / 角色: ${role}` |
| `POST /auth/logout` | `登出` | 员工 | `S 端 / 角色: ${role}` |
| `POST /auth/change-password` | `修改密码` + `登出 (改密强制)` | 员工 | `自身账号 ${user} (强制重登)` |
| `PUT /agents/:.../profile` | `修改资料` | 员工 | `${type} ${user} (${sysId}) ${diffs.join(' / ')}` |
| 同上 + resetPwd 非空 | `重置下线密码` | 员工 | `${user} (${sysId}) 强制下次登录改密` |
| `POST /agents/:.../sub` | `新增下级` | 员工 | `顶代 ${parent.user} (${currency}) 下新增${type} ${user} (${newSysId})` |
| `POST /agents/:.../credit` | `上分` | 员工 | `下线 ${user} (${sysId}) +${amount} ${currency}` |
| `POST /agents/:.../debit` | `下分` | 员工 | `下线 ${user} (${sysId}) -${amount} ${currency}` |
| `POST /perm/staff` | `新增员工` | 员工 | `${user} / 角色 ${roleName}` |
| `DELETE /perm/staff/:user` | `删除员工` | 员工 | `${user} / 角色 ${roleName}` |
| `PUT /perm/staff/:user/role` | `修改员工角色` | 员工 | `${user}  ${oldRoleName} → ${newRoleName} (该员工已登录会话需重登才生效)` |
| `POST /sys/ipwhite` | `新增 IP 白名单` | 员工 | `${ip} (${label}, ${enabled?'启用':'已停用'})` |
| `PUT /sys/ipwhite/:id/toggle` | `启用 IP 白名单` / `停用 IP 白名单` | 员工 | `${ip} (${label})` |
| `DELETE /sys/ipwhite/:id` | `删除 IP 白名单` | 员工 | `${ip} (${label})` |
| `POST /reports/:type/export` | `导出 Excel` | 员工 | `${menuName} / 全量 ${count} 条 → ${filename}` |

### 6.2 玩家 Tab(代理 / 玩家)

后端在 B 端 / C 端写动作时回灌审计到 S 端 `audit_log` 表:

**B 端代理动作**(actor_type=`代理`):
- 登录 / 登出(B 端代理后台)
- 新增下线
- 修改资料(含修改下线 / 改密 / 改状态)
- 上分 / 下分(给下线)
- 禁用账号 / 启用账号
- 修改交收方案(顶代独有,FN-ACC-12 三步向导)
- 修改密码(自身)
- 切换语言

**C 端玩家动作**(actor_type=`玩家`):
- 登录 / 登出(C 端 STAR VIP GAME)
- 选交收方案
- 选游戏分类
- 进入游戏
- 返回大厅(回收)
- 切换语言

> **不进 S 端审计**:三方注单(走注单表 + 流水表,不属于用户主动写动作);UI 偏好(隐藏列等)

---

## 7. 权限矩阵(API 级别)

| 接口 | operator | risk | finance | 说明 |
|---|:---:|:---:|:---:|---|
| `/auth/*` | ✓ | ✓ | ✓ | |
| `/agents` GET | ✓ | ✓ 7 字段 | ✓ 11 字段 | risk 隐占成/余额/下线余额/总线余额 |
| `/agents/.../profile` PUT | ✓ | ✗ | ✗ | |
| `/agents/.../sub` POST | ✓ | ✗ | ✗ | |
| `/agents/.../credit` POST | ✓ | ✗ | ✗ | |
| `/agents/.../debit` POST | ✓ | ✗ | ✗ | |
| `/reports/bets` GET | ✓ | ✓ 隐派彩/输赢 | ✓ | |
| `/reports/sports` GET | ✓ | ✓ | ✓ | |
| `/reports/sports/.../details` GET | ✓ | ?(Q-S33)| ?(Q-S33)| 玩家级别注单的数据敏感性 |
| `/reports/ledger` GET | ✓ | ✗ | ✓ | |
| `/reports/.../export` POST | ✓ | ✓ | ✓ | 跟视图字段一致(Q-S26 延伸)|
| `/perm/staff/*` | ✓ | ✗ | ✗ | |
| `/sys/audit` GET | ✓ | ✓ 只读 | ✓ 只读 | |
| `/sys/ipwhite/*` | ✓ | ✗ | ✗ | |

> **后端 hard check**:每个接口入口先校验 token 内 role 是否有权限,无权限返回 403。

---

## 8. 安全要求

### 8.1 密码

- bcrypt(cost ≥ 12)hash 存储
- 至少 6 位(V0.2 弱要求,真实开发建议 8 位 + 复杂度,Q-S39)
- 改密时校验新 ≠ 旧
- 失败次数限制(Q-S39 待)

### 8.2 操作密码二次校验

V0.2 操作密码 = 登录密码,后端校验逻辑:
```python
def verify_op_password(user, op_pwd):
    return verify_password(op_pwd, user.password_hash)
```

高敏感写动作必须传 `operationPassword` 字段并校验通过。

### 8.3 IP 白名单

- LoginPage 提交时强制校验(同 §5.6)
- 无启用项 = 放行
- 防自锁:停用 / 删除最后启用项拦截
- Q-S44 待:深度防自锁(检查当前登录 IP 是否在剩余启用项内)

### 8.4 JWT

- expiresIn: 8 小时(Q-S37 会话超时待)
- refresh token: V0.2 不做(用户重登)
- 服务端可吊销(改密 / 退登触发)

### 8.5 admin 超级账号

- `is_super=1` hard check
- 不可删 / 不可改角色
- 改密走通用流程

### 8.6 API 频率限制

V0.2 不强制;Q-S39 真实开发可加。

---

## 9. 跨端对接

### 9.1 账房侧 ↔ S 端(Q-S14 待)

待定:
- 推 / 拉?
- 实时 / 批量?
- 顶代账号创建后推 S 端的方式?
- 账房侧账户被冻结后 S 端如何同步?

### 9.2 S 端 ↔ B 端(Q-S29 待)

S 端写动作(顶代户口 4 类)需推 B 端实时同步:
- 修改资料 / 新增下级 / 上分 / 下分 / 级联冻结

### 9.3 三方游戏商 ↔ 后端

注单:三方平台每笔投注回调 → 入 `bets` 表(准实时)。已结算后跑批进 `sports_sessions`。

### 9.4 跑批任务

| 任务 | cron | 内容 |
|---|---|---|
| 场次日结快照 | `10 0 * * *`(每日 00:10) | 跑前一天体育已结算注单聚合 |

> 命中"跑批批次号"`BATCH-YYYYMMDDHHMM` 一致,场次 id 用同 prefix `SP-YYYYMMDDHHMM-NNN`。

---

## 10. Mock 数据初始化

### 10.1 员工 4 名

| user | role | phone | password(明文)| is_super |
|---|---|---|---|---|
| `admin` | operator | +86 138-0000-0001 | `123456` | 1 |
| `risk-mei` | risk | +86 138-0000-0002 | `123456` | 0 |
| `finance-luo` | finance | +86 138-0000-0003 | `123456` | 0 |
| `ops-chen` | operator | +86 138-0000-0004 | `123456` | 0 |

### 10.2 IP 白名单 3 条

详见前端 PRD §15.2

### 10.3 顶代 9 行 + 完整下线树

8 顶代(qweqwe / lucky88 / diamond / emerald / sapphire / goldenstar / bigwhale / rookie01),qweqwe 多币种(KRW + USD)= 9 行

详见原型 `ACCOUNTS / TOP_AGENT_KEYS`(原型 line 99-176 附近)。

### 10.4 注单 / 场次 / 流水 / 操作日志

参考原型 `MOCK_BETS`(30+ 条)/ `MOCK_SPORTS_SESSIONS`(7 条)/ `MOCK_LEDGER`(14 条)/ `INITIAL_AUDIT_SYSTEM`(12 条)/ `INITIAL_AUDIT_PLAYER`(17 条)。

---

## 11. Q-S 议题清单(后端关注的)

详见前端 PRD §13。后端开发**必须收口的**:

🔴 **关键(上线前):**
- Q-S7:跨端字段命名(账户余额 vs 可用余额)
- Q-S15:sysId vs id
- Q-S14:账房 ↔ S 端协议
- Q-S29:S 端写动作推 B 端实时同步

🟡 **真实业务对齐:**
- Q-S1:电子 / 六合彩佣金结算
- Q-S4:有效投注口径
- Q-S5:跨日注单佣金率取哪一天
- Q-S10:跨币种总额折算
- Q-S11:下线层独立占成
- Q-S31:状态枚举异常态
- Q-S32:上下分单笔 / 日累计限额

🟢 **延后:**
- Q-S2 数据看板完整指标
- Q-S3 账房对账
- Q-S26 大数据导出异步策略
- Q-S33 finance/risk 看游戏明细权限
- Q-S35 loading / 5xx 兜底
- Q-S36 首次登录强制改密
- Q-S37 会话超时
- Q-S38 多端登录互斥
- Q-S39 失败次数锁定
- Q-S40 修改员工角色后强制踢现有 session
- Q-S43 操作日志加导出按钮
- Q-S44 IP 白名单深度防自锁

---

**文档结束**
