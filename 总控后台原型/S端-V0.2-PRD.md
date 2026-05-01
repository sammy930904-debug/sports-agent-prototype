# 三方游戏总控后台(S 端)V0.2 · PRD

**版本**:V0.2
**日期**:2026-04-30
**目标读者**:AI 开发(前端 + 后端,合并文档)
**对应原型**:`总控后台原型/体育总控后台-原型.html`(单文件 React + Tailwind CDN,2276 行)

---

## 0. 文档定位

本 PRD 用于 AI 全栈开发,覆盖:UI 实现 + 交互流程 + 字段展示 + 数据模型 + API 契约 + 业务规则 + 角色权限 + 审计 + 跨端对接 + 安全 + 文案规范。

**不规定后端技术栈**:语言 / 框架 / 数据库选型由团队自决。本文档只定义业务逻辑、数据契约、行为规则。

---

## 1. 产品背景

### 1.1 系统定位

「三方游戏总控后台」(S 端)是博彩平台**内部员工**使用的运营 / 风控 / 财务管理系统。

跟另外两端的关系:
- **B 端代理后台**(顶代 / 代理使用):`体育后台原型/`,V1.12
- **C 端 STAR VIP GAME**(玩家使用):`游戏端原型/`,V0.4
- **S 端总控后台**(平台员工使用):本文档,V0.2

```
┌──────────┐       ┌────────────────────────┐
│  账房侧   │ ◄───► │       S 端(本系统)    │ ◄──┐
│ (外部独立) │       │   三方游戏总控后台      │    │ S↔B 写动作同步 (Q-S29)
└──────────┘       └─────────────┬──────────┘    │
                                 │                │
                          ┌──────┴──────┐         │
                          ▼             ▼         │
                   ┌─────────┐   ┌──────────┐    │
                   │  B 端   │   │  C 端    │    │
                   │ 代理后台 │   │STAR VIP  │    │
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
                        操作日志 / 流水回写 ───────┘
```

### 1.2 V0.2 范围

| 模块 | 二级页 | 状态 |
|---|---|---|
| 数据看板 | 数据看板 | ⏸ **V0.2 暂隐藏**(原型代码保留,菜单不显示;真实开发不做) |
| 账号管理 | 顶代户口 | ✅ Tree Table + 4 类写动作 |
| 报表管理 | 体育注单记录 | ✅ |
| 报表管理 | 体育场次记录 | ✅ 含「游戏明细」弹窗 |
| 报表管理 | 交易流水记录 | ✅ |
| 权限管理 | 员工账号 | ✅ 仅 operator 可见 |
| 系统管理 | 操作日志 | ✅ 系统 / 玩家双 Tab |
| 系统管理 | IP 白名单 | ⏸ **V0.2 暂隐藏**(原型代码保留,菜单不显示;LoginPage 不做 IP 拒登;真实开发不做) |

> **默认进系统跳「顶代户口」**(数据看板隐藏后,跟 V0.1 一致)

### 1.3 三角色

| 角色 | 名称 | 颜色 | 写动作 |
|---|---|---|---|
| `operator` | 平台运营 | `#4A9EFF`(蓝) | ✅ 全菜单 + 所有写动作 |
| `risk` | 风控审计 | `#F0B93A`(黄) | ❌ 只读 |
| `finance` | 财务对账 | `#5BC97C`(绿) | ❌ 只读 |

### 1.4 数据流向

| 数据 | 流向 | 频率 |
|---|---|---|
| 顶代账号创建 / 状态变更 | 账房侧 → S 端 | Q-S14 待 |
| S 端写动作 | S 端 → B 端 | Q-S29 待 |
| B 端写动作 | B 端 → S 端审计 | 实时(玩家 Tab) |
| C 端玩家动作 | C 端 → S 端审计 | 实时(玩家 Tab) |
| 注单 | 三方游戏商 → S 端 / B 端 | 准实时(回调) |
| 场次(日结快照) | 系统跑批 | **每日 00:10 跑前一天体育已结算注单** |
| 流水 | 三层资金动作 | 实时 |

---

## 2. 业务术语

| 术语 | 字段名 | 含义 |
|---|---|---|
| **顶代** | top agent | 平台直辖最高级代理(账号类型「普通(顶代)」),由账房侧创建 |
| **代理** | agent | 顶代下挂的中间层 |
| **玩家** | player | 终端用户,在 C 端投注 |
| **下线** | sub | 任何账号下面挂的账号(相对概念) |
| **占成** | shareRatio | 顶代享受的让利比例(顶代 ↔ 账房);公式:占成 X%、上分 N → 实际扣款 N×(1−X);粒度 = 顶代级 + 币种级 |
| **佣金率** | rate | 上级给下线的提成比例(代理 ↔ 下线) |
| **系统户口号** | sysId | 顶代:`sysId == user`(账房创建时同名);下线:层级派生(`carry01 → qweqwe-1`,`alice88 → qweqwe-1-1`) |
| **用户账号** | user | 登录用账号,自定义(如 `qweqwe`、`carry01`、`bob_hi`) |
| **总线余额** | totalBalance | `自己的账户余额 + Σ 直属下线.总线余额`(递归) |
| **下线余额** | subBalance | `总线余额 − 账户余额`(派生) |
| **下线数** | subCount | 穿透总下线数(自身穿透下所有递归下线合计,不含自己) |
| **账号状态** | status | 枚举只 `active / frozen`(V0.2 砍 pending) |
| **账号类型** | accountType | `普通(顶代) / 代理 / 游戏` 三种 |
| **注单** | bet | 玩家每笔投注单,准实时,三方游戏商每笔回调 |
| **场次** | session | 每日 00:10 跑前一天的"日结快照",**只跑体育已结算注单**,用于代理佣金结算 |
| **流水** | ledger | 资金动作日志,三层合一 |
| **上分 / 下分** | credit / debit | 给账户增加 / 减少余额 |

---

## 3. 路由 / 菜单结构 + 角色权限矩阵

### 3.1 路由

```
/login                          → LoginPage(未登录态)
/                               → 主框架,默认重定向到 /agents
/agents                         → AgentsPage(顶代户口) ← V0.2 默认页
/reports/bets                   → BetsPage(体育注单)
/reports/sports                 → SportsSessionsPage(体育场次)
/reports/ledger                 → LedgerPage(交易流水)
/perm/staff                     → StaffPage(员工账号,operator only)
/sys/audit                      → AuditPage(操作日志)

# V0.2 暂隐藏(代码保留, 真实开发不做):
/dashboard                      → DashboardPage
/sys/ipwhite                    → IPWhitelistPage
```

### 3.2 菜单结构

```
账号管理 (一级)
└── 顶代户口

报表管理 (一级)
├── 体育注单记录
├── 体育场次记录
└── 交易流水记录

权限管理 (一级,仅 operator 可见)
└── 员工账号

系统管理 (一级)
└── 操作日志

# V0.2 暂隐藏:
# ─ 🏠 数据看板 (一级)
# ─ 系统管理 / IP 白名单 (operator only)
```

### 3.3 三角色权限矩阵(UI 菜单 + 字段过滤)

| 菜单 | operator | risk | finance |
|---|:---:|:---:|:---:|
| 顶代户口 | ✓ 11 列 + 写 | ✓ 7 列 只读 | ✓ 11 列 只读 |
| 体育注单记录 | ✓ | ✓ 隐派彩/输赢 | ✓ |
| 体育场次记录 | ✓ | ✓ | ✓ |
| 交易流水记录 | ✓ | ✗ | ✓ |
| 员工账号 | ✓ | ✗ | ✗ |
| 操作日志 | ✓ | ✓ 只读 | ✓ 只读 |
| ~~数据看板~~ | ⏸ V0.2 隐藏 | ⏸ | ⏸ |
| ~~IP 白名单~~ | ⏸ V0.2 隐藏 | ✗ | ✗ |

### 3.4 三角色权限矩阵(API 级别)

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
| `/reports/.../export` POST | ✓ | ✓ | ✓ | 跟视图字段一致 |
| `/perm/staff/*` | ✓ | ✗ | ✗ | |
| `/sys/audit` GET | ✓ | ✓ 只读 | ✓ 只读 | |
| `/sys/ipwhite/*` | ✓ | ✗ | ✗ | |

> **后端 hard check**:每个接口入口先校验 token 内 role 是否有权限,无权限返回 403。

### 3.5 顶代户口 11 列字段(operator 视角)

| # | 列 | 字段 | risk 可见 | V0.2 显示 |
|---|---|---|---|---|
| 1 | 系统户口号 | `sysId` | ✓ | ✓ |
| 2 | 用户账号 | `user` | ✓ | ✓ |
| 3 | 下线数 | `subCount` | ✓ | ✓ |
| 4 | 账号状态 | `status` | ✓ | ✓ |
| 5 | 币种 | `currency` | ✓ | ✓ |
| 6 | 占成 | `shareRatio` | ✗ | ⏸ **V0.2 隐藏** |
| 7 | 账户余额 | `balance` | ✗ | ✓ |
| 8 | 下线余额 | `subBalance` | ✗ | ✓ |
| 9 | 总线余额 | `totalBalance` | ✗ | ✓ |
| 10 | 账号类型 | `accountType` | ✓ | ✓ |
| 11 | 开户时间 | `createdAt` | ✓ | ✓ |

operator 多 1 列 **操作**(canWrite=true);risk / finance 不显示操作列。

**V0.2 隐藏列**(代码保留 in `colDefs`,后期重启把 6 加回 `ROLES.agentCols` 即可):
- 占成 — Sammy 2026-04-30 拍,一期不展示

---

## 4. 数据模型

### 4.1 顶代户口表 `agents`

| 字段 | 类型 | 索引 | 含义 | 默认 | 备注 |
|---|---|---|---|---|---|
| `id` | bigint PK | | 自增主键 | | |
| `sys_id` | varchar(50) | UK(sys_id, currency) | 系统户口号 | | 顶代:`sys_id == user`;下线层级派生 |
| `user` | varchar(50) | IDX | 用户账号 | | 自定义,登录用 |
| `nick` | varchar(100) | | 账户昵称 | `user` | 选填 |
| `phone` | varchar(30) | | 主电话 | | |
| `phone2` | varchar(30) | | 备用电话 | | |
| `password_hash` | varchar(255) | | 登录密码 hash | | |
| `currency` | varchar(10) | | 币种 | | KRW / USD / PHP / CNY / THB |
| `account_type` | varchar(20) | IDX | 账号类型 | | `普通(顶代) / 代理 / 游戏` |
| `status` | varchar(20) | IDX | 账号状态 | `active` | `active / frozen` |
| `share_ratio` | decimal(6,4) | | 占成 | NULL | 顶代有值,下线层 V0.2 = NULL |
| `ref_share_ratio` | decimal(6,4) | | 参考占成 | NULL | 下线层用,≤ 父级 share_ratio |
| `ref_rate` | decimal(6,4) | | 参考佣金率 | NULL | 上级给下线的提成 |
| `balance` | decimal(20,4) | | 账户余额 | 0 | |
| `parent_id` | bigint | IDX | 直属上级 ID | NULL | 顶代 NULL |
| `parent_sys_id` | varchar(50) | IDX | 直属上级 sysId | NULL | 冗余字段方便查 |
| `created_at` | datetime | | 开户时间 | | |
| `updated_at` | datetime | | 最后修改时间 | | |
| `last_login_at` | datetime | | 最近登录 C 端 / B 端时间 | NULL | |
| `created_by` | varchar(50) | | 创建人 | | 账房侧 / 顶代 / 代理 / operator |
| `created_source` | varchar(20) | | 创建来源 | | `house / B / S` |

**派生字段**(不存,通过 SQL 计算或缓存):
- `sub_count`:**穿透总下线数**,`SELECT COUNT(*) FROM agents WHERE sys_id LIKE '{parent_sys_id}-%'`
- `sub_balance`:`Σ 直属下线.total_balance` 递归
- `total_balance`:`balance + sub_balance`(派生)

**唯一约束**:`(user, currency)` 业务唯一(1 顶代多币种 = 多行,sys_id 同 + currency 不同 = 不同行)

> **跨端字段命名分歧**(Q-S7 / Q-S15 待):`balance`(S 端)在 B 端叫 `col_balance`(可用余额);`sys_id`(S 端)在 B 端叫 `id`,真实开发统一。

### 4.2 员工账号表 `staff`

| 字段 | 类型 | 索引 | 含义 | 备注 |
|---|---|---|---|---|
| `id` | bigint PK | | | |
| `user` | varchar(50) | UK | 员工账号 | 4-20 位英文+数字+中划线 |
| `password_hash` | varchar(255) | | 登录密码 hash | V0.2 mock 明文 `123456` |
| `role` | varchar(20) | | 角色 | `operator / risk / finance` |
| `phone` | varchar(30) | | 联系电话 | 选填,异常登录通知 |
| `is_super` | tinyint(1) | | 是否超级账号 | admin = 1,其他 0 |
| `status` | varchar(20) | | 状态 | V0.2 简化(全 active) |
| `failed_login_count` | int | | 累计登录失败次数 | Q-S39 待 |
| `must_change_pwd` | tinyint(1) | | 下次登录强制改密 | Q-S36 待 |
| `last_login_at` | datetime | | 最近登录时间 | 登录时更新 |
| `last_login_ip` | varchar(50) | | 最近登录 IP | 登录时记录 |
| `created_at` | datetime | | | |
| `created_by` | varchar(50) | | 创建员工账号 | operator 或 SYSTEM |

### 4.3 操作日志表 `audit_log`

| 字段 | 类型 | 索引 | 含义 |
|---|---|---|---|
| `id` | bigint PK | | |
| `time` | datetime | IDX | 动作时间(秒级) |
| `actor_type` | varchar(20) | IDX | `员工 / 玩家 / 代理` |
| `actor` | varchar(100) | IDX | 主体描述串 |
| `actor_user` | varchar(50) | | 主体用户账号 |
| `actor_role` | varchar(20) | | 主体角色 |
| `action` | varchar(50) | IDX | 动作字符串(见 §8) |
| `target` | varchar(500) | | 动作对象描述,含 diff 内容 |
| `ip` | varchar(50) | | 主体 IP |
| `reason` | varchar(500) | | 备注(默认 `-`) |
| `extra` | json | | 扩展字段 |

**索引建议**:`(time DESC)` / `(actor_type, time DESC)` / `(actor_user, time DESC)` / `(action, time DESC)`。

### 4.4 IP 白名单表 `ip_whitelist`

| 字段 | 类型 | 索引 | 含义 |
|---|---|---|---|
| `id` | bigint PK | | |
| `ip` | varchar(50) | UK | IP 或 CIDR(`192.168.1.1` / `10.4.2.0/24`) |
| `label` | varchar(100) | | 备注(必填) |
| `enabled` | tinyint(1) | IDX | 启用 / 已停用 |
| `created_at` | datetime | | |
| `created_by` | varchar(50) | | |
| `updated_at` | datetime | | |

### 4.5 注单表 `bets`

| 字段 | 类型 | 索引 | 含义 | 备注 |
|---|---|---|---|---|
| `id` | varchar(50) PK | | 注单号 | 18 位数字串(三方回调带) |
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
| `valid_stake` | decimal(20,4) | | 有效投注 | NULL 时取 `stake` |
| `currency` | varchar(10) | IDX | 币种 | |
| `status` | varchar(20) | IDX | 状态 | `已结算 / 未结算`(Q-S31:作废 / 取消) |

**S 端只展示体育已结算**(`game_type='体育' && status='已结算'`)。

### 4.6 场次表 `sports_sessions`

> **每日 00:10 跑批 1 次,生成前一天的"日结快照"**

| 字段 | 类型 | 索引 | 含义 |
|---|---|---|---|
| `id` | varchar(30) PK | | 场次编号 `SP-YYYYMMDDHHMM-NNN` |
| `date` | date | IDX | 业务日期(前一天) |
| `top_agent` | varchar(50) | IDX | 顶代 user |
| `sys_id` | varchar(50) | | 顶代 sysId |
| `user` | varchar(50) | | 同上 |
| `currency` | varchar(10) | | 币种 |
| `share_ratio` | decimal(6,4) | | 顶代占成 |
| `valid_stake` | decimal(20,4) | | 总有效投注 |
| `share_amount` | decimal(20,4) | | 占成金额 = valid_stake × share_ratio |
| `total_win_loss` | decimal(20,4) | | 总输赢 |
| `rate` | decimal(6,4) | | 顶代佣金率 |
| `commission` | decimal(20,4) | | 佣金金额 = valid_stake × rate |
| `submit_rate` | json | | 上缴佣金率(V0.2 不可用)`[{sys_id, rate}, ...]` |
| `work_start_at` | datetime | | 开工时间(业务日 00:00:00)|
| `work_end_at` | datetime | | 收工时间(业务日 23:59:59)|
| `status` | varchar(20) | IDX | `已结算 / 未结算` |
| `batch_id` | varchar(30) | IDX | 跑批批次号 |
| `created_at` | datetime | | |

### 4.7 流水表 `ledger`

| 字段 | 类型 | 索引 | 含义 |
|---|---|---|---|
| `id` | varchar(30) PK | | 流水号(例 `TX-20260429-3201`) |
| `time` | datetime | IDX | 资金动作时间 |
| `type` | varchar(30) | IDX | 6 种 type ID |
| `type_label` | varchar(30) | | 4 种 typeLabel(collapsed) |
| `main_sys_id` | varchar(50) | IDX | 主体 sysId(被影响账号) |
| `main_user` | varchar(50) | | 主体 user |
| `from_account` | varchar(100) | | 来源描述 |
| `to_account` | varchar(100) | | 去向描述 |
| `amount` | decimal(20,4) | | 金额 |
| `currency` | varchar(10) | | 币种 |
| `status` | varchar(20) | IDX | `成功 / 超时重试 / 失败` |
| `related_bet` | varchar(50) | | 关联注单(三方转入转出时) |
| `created_at` | datetime | | |

### 4.8 流水 type 与 type_label 映射

| type ID | typeLabel(前端展示) | 主体 | 资金流向 |
|---|---|---|---|
| `house_credit` | 上分 | 顶代 | 账房 → 顶代 |
| `house_debit` | 下分 | 顶代 | 顶代 → 账房 |
| `agent_credit` | 上分 | 下线 | 顶代/代理 → 下线 |
| `agent_debit` | 下分 | 下线 | 顶代/代理 ← 下线 |
| `transfer_in` | 三方体育上分 | 玩家或代理 | 玩家 → 三方平台 |
| `transfer_out` | 三方体育下分 | 玩家或代理 | 三方平台 → 玩家 |

> 前端 typeLabel collapsed 到 4 类(`credit / debit / transfer_in / transfer_out`),后端 type 保留 6 个细类。

---

## 5. 公共组件

### 5.1 主框架 Layout

```
┌─────────────┬─────────────────────────────────┐
│             │  breadcrumb               员工块 │  Header
│   Sidebar   ├─────────────────────────────────┤
│             │                                  │
│   菜单列表  │         Content (主体)          │
│             │                                  │
└─────────────┴─────────────────────────────────┘
```

- **Sidebar 宽 224px**,背景 `#11161E`(panel)
- **品牌区**:`◆ 三方游戏 / 总控后台 V0.2`
- **菜单组**(每组上方有灰色小标题):账号管理 / 报表管理 / 权限管理 / 系统管理
- **菜单项**:active 蓝色强调(`#4A9EFF`)
- **底部备注**:`内部工具 · 仅限授权员工`

### 5.2 Header 右上角员工信息块

下拉菜单展示:

```
┌────────────────────────────┐
│ 📞 +86 138-0000-0001        │
├────────────────────────────┤
│ 最近登录: 2026-04-30 16:42:18│
├────────────────────────────┤
│ 修改密码                    │
│ 退出登录(红色)             │
└────────────────────────────┘
```

字段:
- 圆形头像(角色色背景 + 用户名首字母大写)
- 用户账号
- 角色 chip(角色色 22% 透明度)
- ▾

### 5.3 通用分页组件 Pagination

```
共 N 条 · 每页 N 条    ← 上一页  第 X / Y 页  下一页 →    跳至 [□] 页 [确定]
```

- `PAGE_SIZE = 20`(常量)
- 右下角对齐
- 顶部 1px 分隔线
- 跳页输入只接受 `1 ~ totalPages`,Enter 也触发
- 上下页边界 disabled

**接入页面(7 处)**:顶代户口 / 体育注单 / 体育场次 / 交易流水 / 员工账号 / 操作日志 / IP 白名单
**例外**:SessionDetailModal 用 10 条/页(自实现)

### 5.4 修改密码弹窗 ChangePwdModal

字段:
- 原密码(`type=password`)
- 新密码(`type=password`,**至少 6 位**,**不能跟原密同**)
- 确认新密码(`type=password`,**两次必须一致**)

提示文案:
> ℹ V0.2: 操作密码 = 登录密码,改后所有写动作的二次校验也用新密码

提交流程:
1. 校验全部字段
2. 写 2 条审计日志:**修改密码** + **登出 (改密强制)**
3. `alert("密码修改成功,请用新密码重新登录")`
4. 强制 logout(回到 LoginPage)

### 5.5 操作密码二次校验(高敏感写动作通用)

凡是涉及 **高敏感字段** 的写动作,弹窗内最后一行必填**操作密码**(= 当前登录员工的登录密码,V0.2 mock 统一 `123456`)。

判定"高敏感"的写动作:
- 顶代户口:**修改资料**(改占成 / 佣金率 / 状态 / 类型 / 重置密码,任一)
- 顶代户口:**新增下级 / 上分 / 下分**(全部触发)
- 员工账号:**新增 / 删除 / 修改角色**
- IP 白名单:**新增 / 启停 / 删除**

**例外**:报表「导出 Excel」**不触发**;筛选 / 分页等读动作不触发。

---

## 6. 各页面详细设计

### 6.1 LoginPage(登录页)

**触发**:`currentUser === null`(未登录)

**布局**:全屏 flex 居中,卡片 380px 宽

**字段**:
| 字段 | 类型 | 必填 | 校验 |
|---|---|---|---|
| 员工账号 | text | ✓ | 必须存在于 staff 表 |
| 登录密码 | password | ✓ | mock 统一 `123456`;**眼睛切换显隐** |

> V0.2 砍掉 IP 白名单,LoginPage 不再做 IP 拒登;真实 IP 仍由后端从 request 取(给审计日志记录)

**校验顺序**:
1. **员工账号是否存在**:不存在 → `"员工账号不存在"`
2. **密码正确**:错误 → `"登录密码错误"`(`failed_login_count + 1`)

**登录成功**:
1. 把 staff 表里该员工的 `last_login_at` 更新为本次登录时间
2. 写审计日志:`登录` / target: `S 端 / 角色: ${role}`
3. 跳转 `/dashboard`

#### 6.1.1 后端 API

**POST `/api/s/v1/auth/login`**

```json
// 请求
{ "user": "admin", "password": "123456" }

// 响应 200
{
  "token": "<jwt>",
  "user": { "user": "admin", "role": "operator", "phone": "...", "lastLoginAt": "..." },
  "ip": "10.4.2.18"
}

// 错误 (V0.2 砍 IP_DENIED)
{ "code": "STAFF_NOT_FOUND" | "PWD_WRONG", "message": "..." }
```

**POST `/api/s/v1/auth/logout`**:仅 token 鉴权;副作用写审计 `登出`

**POST `/api/s/v1/auth/change-password`**

```json
{ "oldPassword": "123456", "newPassword": "newpass123" }
// 副作用: 改密 + 写 2 条审计 (修改密码 + 登出 改密强制) + 吊销旧 token
```

校验:新密码 ≥ 6 位 / 新密码 ≠ 旧密码 / 旧密码必须正确。

### 6.2 DashboardPage(数据看板) ⏸ V0.2 暂隐藏

> V0.2 收尾(Sammy 2026-04-30 拍):菜单不显示,**默认进入「顶代户口」**。组件代码保留 in `App.jsx`,后期重启时把 `dashboard` 加回 `ROLES.menus` + 把 sidebar 的 `<Menu id="dashboard"/>` 加回即可。


**布局**:
```
[标题] 数据看板
[说明] V0.2 简洁版概览 · 欢迎 [角色名] · 完整指标版本待 Q-S2 议

┌────────┬────────┬────────┬────────┐
│  KPI 1 │  KPI 2 │  KPI 3 │  KPI 4 │
└────────┴────────┴────────┴────────┘

[最近系统动作 · 最新 N 条]               [查看完整日志 →]
─────────────────────────────────────
表:时间 / 员工 / 动作 / 目标 (10 行)
```

**4 KPI Card**:
| KPI | 数值 | 副标题 |
|---|---|---|
| 顶代户口数 | `topAgentPeople 人` | `启用 N / 冻结 N · 共 X 行(多币种拆分)` |
| 累计体育场次 | `totalSessions 条` | `跨日已结算` |
| 累计已结算注单 | `todayBets 条` | `体育游戏` |
| 最近系统动作 | `auditSystem.length 条` | `点下方查看明细` |

> **顶代户口数按"人"算**(distinct user):1 顶代多币种 = 多行但只算 1 人;启用人 = 任一币种行 active(宽松)

### 6.3 AgentsPage(顶代户口)

#### 6.3.1 页面顶部

```
[标题] 顶代户口
[说明] 账号管理 · 平台直辖顶代 · 1 顶代多币种 = N 行(按币种拆) · {角色名} 视角可见 N 列

[ℹ 蓝色信息条]
账号来源:顶代账号由账房侧创建并下发户口(系统户口号 + 初始币种 + 初始占成),
本页仅查看与管理(冻结 / 调占成 / 调币种),不负责创建。
下线数 / 下线余额 / 总线余额 主信源在 B 端代理后台。Q-S7 / Q-S14 议题待。
```

#### 6.3.2 筛选区(提交触发模式)

| # | 筛选项 | 形式 | 字段 |
|---|---|---|---|
| 1 | 系统户口号 / 用户账号 | text 240px | `sysId.includes` 或 `user.includes` |
| 2 | 状态 | select 130px | `all / active / frozen` |
| 3 | 币种 | select 120px | `all / KRW / USD / PHP / CNY / THB` |
| 4 | 占成 | select 150px | `all / lt10 / 10to20 / 20to30 / gte30` |
| 5 | 开户时间 | RangePicker | `createdAt` 范围 |
| - | [搜索] / [重置] | btn | |

筛选区下方信息条:`共 N 顶代行 · 当前页渲染 N 行(含展开下线)` + 右侧 `[全部收起]` 按钮。

**搜索语义**:树状穿透 — 任何后代命中,整条祖先链都显示并自动展开。

#### 6.3.3 表格 Tree Table

**表头**:11 列字段(operator 视角)+ 操作列(canWrite 时)

**展开**:
- 顶代行(depth=0)左侧 ▸/▾ 切换,**点一次展一层**(懒加载)
- 下线行(depth>0)`paddingLeft: depth × 16px` + 淡蓝底色 `rgba(74,158,255,0.04)`
- 字段集与顶代行**完全相同**(11 列),语义重载:
  - `占成` 列:下线层 `shareRatio = null` 时显示「—」;否则灰字「{X.XX%} (参考)」
  - `下线数`:该下线穿透下挂的孙辈数

**操作列(operator only)**:按行类型分发
| 行类型 | 操作按钮 |
|---|---|
| 顶代(普通) | `新增下级` + `修改资料` |
| 代理(下线) | `新增下级` + `修改资料` + `上分` + `下分` |
| 游戏(玩家) | `修改资料` + `上分` + `下分` |

#### 6.3.4 写动作 4 类弹窗 + API

##### A. 新增下级 NewSubModal

字段:
- 用户账号 `user`(必填,**6-20 位英文+数字**)
- 登录密码 + 确认密码(必填,**两次一致**)
- 联系电话 / 备用电话(选填)
- 账号类型(默认"代理",可选"游戏")
- 账号状态(默认 active)
- 参考占成(必填,百分数,**≤ 父级 share_ratio**)
- 参考佣金率(必填,百分数)
- 操作密码

业务规则:
- **币种自动继承父级**(单个币种线整条币种一致)
- 派生 `sysId = parentNode.sysId + "-" + (parentNode.children.length + 1)`
- 沿祖先链 `subCount + 1`
- 自动展开父级让用户看到新行

**POST `/api/s/v1/agents/:parentSysId/:parentCurrency/sub`**

```json
{
  "user": "carry01",
  "password": "...",
  "nick": "...",
  "phone": "...",
  "accountType": "代理|游戏",
  "status": "active",
  "refShareRatio": 0.20,
  "refRate": 0.05,
  "operationPassword": "123456"
}

// 响应
{ "sysId": "qweqwe-3", "user": "carry01", "currency": "KRW" }
```

##### B. 修改资料 EditProfileModal

分 3 个 Section:

**只读信息**:`sysId / user / currency / accountType / createdAt / 余额`

**低敏感字段**(无需操作密码):
- 账户昵称(必填)
- 电话(选填)
- 备用电话(选填)

**高敏感字段**(任一改动 → 触发操作密码二次校验):
- 顶代行:**ℹ 蓝色提示** "顶代占成由账房侧设置,不在 S 端修改",**不显示占成 / 佣金率字段**
- 下线行:参考占成(≤ 上级)+ 参考佣金率
- 重置登录密码(选填,留空 = 不重置;填则强制下线下次登录改密)
- 账号状态(radio:启用 / 禁用)
- 账号类型(radio,**升级规则**:游戏 → 代理 OK,代理 → 游戏 禁止,顶代不可改)

**级联冻结(关键业务规则)**:
- `status: active → frozen` 时 → **递归把所有 children 也置 frozen**(穿透到底)
- `status: frozen → active` 时 → **不级联**(防止误激活独立冻结的下线)

**写日志 target 描述**:多字段 diff,例 `下线 qw-003 (qweqwe-2) 昵称 三号 → 三号哥 / 佣金率 5.0% → 6.0%`(状态用中文 `启用 / 禁用`,不用英文 active/frozen)

**PUT `/api/s/v1/agents/:sysId/:currency/profile`**

```json
{
  "nick": "...",
  "phone": "...",
  "phone2": "...",
  "accountType": "代理",
  "shareRatio": 0.20,
  "refRate": 0.06,
  "status": "active|frozen",
  "resetPwd": "newpass" | null,
  "operationPassword": "123456"
}

// 响应
{ "success": true, "diff": { "status": "active → frozen", "shareRatio": "..." } }
```

##### C. 上分 / 下分 CreditDebitModal

字段:
- 该账号信息(只读)
- 直属上级信息(只读)
- 金额(单位**万**,数字 + ".xxxx" 4 位小数;弹窗内同时显示元单位换算)
- 操作密码

业务规则(资金内部转移):
- **上分 +X 元**:该账号 balance + X,该账号 totalBalance + X;**直属上级** balance − X,subBalance + X;父 totalBalance 不变(子树涨抵消)
- **下分 −X 元**:该账号 balance − X,该账号 totalBalance − X;直属上级 balance + X,subBalance − X
- **整棵树总余额不变**(只是内部转移)
- 校验:上分时上级余额 ≥ X,下分时该账号余额 ≥ X

**POST `/api/s/v1/agents/:sysId/:currency/credit`** / **`/debit`**

```json
{ "amountWan": 100, "operationPassword": "123456" }

// 响应 200
{ "newBalance": ..., "parentNewBalance": ... }

// 响应 400 (友好提示)
{ "code": "PARENT_INSUFFICIENT" | "ACCOUNT_INSUFFICIENT", "message": "..." }
```

副作用:写流水(type=`agent_credit/debit`,from=parent,to=自己,amount=X)+ 写审计。

#### 6.3.5 后端 API:列表 / 子节点

**GET `/api/s/v1/agents`** — 筛选 + 分页

筛选参数(query):`keyword / status / currency / shareRatio / dateFrom / dateTo / pageNum / pageSize(default 20)`

响应:`{ rows, total, page, pageSize }`

> **角色字段过滤**:`role=risk` 时不返回 `shareRatio / balance / subBalance / totalBalance` 字段(后端按 token 内 role 过滤)。

**GET `/api/s/v1/agents/:sysId/:currency/children`** — Tree Table 懒加载

### 6.4 BetsPage(体育注单记录)

**只显示**:`gameType.includes("体育") && status === "已结算"`(硬过滤)

**说明文案**:`只保存已结算的体育注单(跟体育场次记录数据源一致) · 电子 / 六合彩 暂不在 S 端展示`

**筛选区**(提交触发):
| # | 筛选项 |
|---|---|
| 1 | 注单号 |
| 2 | 系统户口号 / 用户账号 |
| 3 | 币种 |
| 4 | 投注时间 RangePicker |

**导出按钮**:右上角 `[导出 Excel]` → `doExport("体育注单记录", N)`

**表头 9 列**:注单号 / 系统户口号 / 用户账号 / 币种 / 投注时间 / 结算时间 / 投注金额 / 派彩金额 / 输赢 / 状态

**risk 视角隐藏**:派彩金额 / 输赢 2 列

#### 6.4.1 后端 API

**GET `/api/s/v1/reports/bets`** — 筛选参数:`betId / keyword / currency / dateFrom / dateTo / pageNum / pageSize`

**硬过滤(后端必加)**:`game_type='体育' && status='已结算'`

> **risk 隐藏**:`payout / win_loss` 字段后端按 token role 过滤。

### 6.5 SportsSessionsPage(体育场次记录)

**说明文案**:`每日 00:10 跑批 1 次,生成前一天的体育已结算场次 · 用于代理佣金结算 · 上缴佣金率 V0.2 暂不可用,字段仅 mock 演示`

**ℹ 信息条**:`电子 / 六合彩 的代理佣金结算暂未实现(Q-S1 待议),本页仅体育数据`

**默认过滤**:`validStake > 0`(空跑批不展示)

**筛选区**(V0.2 5 项,提交触发):
| # | 筛选项 |
|---|---|
| 1 | 场次编号 |
| 2 | 系统户口号 / 用户账号 |
| 3 | 币种 |
| 4 | 业务日期 RangePicker(`format=YYYY-MM-DD`) |
| 5 | 状态(已结算 / 未结算) |
| ~~⏸~~ | ~~占成(distinct from mock)~~ V0.2 隐藏 |

**场次编号规则**:`SP-年月日时分-自然数`(年月日时分 = 跑批生成时间,例 04-28 数据于 04-29 00:10 跑 → `SP-202604290010-001`,自然数按 batch 内重置)

**表头 12 列(V0.2)**:场次编号 / 系统户口号 / 用户账号 / 输赢 / 有效投注 / 币种 / 佣金率 / 佣金 / 开工时间 / 收工时间 / 状态 / 操作

**V0.2 隐藏 3 列**(代码保留,后期重启把 th + td 加回):
- 占成 / 占成金额 / 上缴佣金率 — Sammy 2026-04-30 拍

**操作列**:`[游戏明细]` 按钮 → 打开 SessionDetailModal

> 上缴佣金率展示规则保留(`{sysId1}:{rate1}% | {sysId2}:{rate2}%` 数组管道分隔),后端 `submit_rate` 字段保留 mock,V0.2 不展示

#### 6.5.1 SessionDetailModal(游戏明细弹窗)

宽 `1100px`,position relative

**布局**:
```
游戏明细 · SP-...                                  [✕ 右上角]
[date] · 顶代 [user] · 币种 KRW · 共 N 条注单

表 10 列 + tfoot:本页小计 + 总计

[导出 Excel]                共 N 条 · 第 X / Y 页 ← 上一页 下一页 →
```

- 关闭按钮 `✕` 右上角
- 翻页右下角(`pageSize = 10`)
- 表格 tfoot 双行:**本页小计 + 总计**(投注金额 / 派彩金额 / 输赢 / 有效投注 4 列汇总)

**导出**:`doExport("游戏明细_" + session.id, matched.length, appendSystemLog)`

> **PM 简化**:目前按 `topAgent` 过滤匹配注单;真实场景应按 `场次 batchId` 关联

#### 6.5.2 后端 API

**GET `/api/s/v1/reports/sports`** — 筛选参数同前端,默认 `valid_stake > 0`

**GET `/api/s/v1/reports/sports/:sessionId/details`** — 场次游戏明细,响应含 page/pageSize(10/页)/ subtotal / total

### 6.6 LedgerPage(交易流水记录)

**说明文案**:`三层资金动作合一 · 账房 ↔ 顶代 / 顶代 ↔ 下线 / 玩家 ↔ 三方体育平台`

**筛选区**(V0.2 6 项,提交触发):
| # | 筛选项 | 选项 |
|---|---|---|
| 1 | 流水号 | text |
| 2 | 系统户口号 / 用户账号 | text(双字段联合搜索 mainSysId / mainUser) |
| 3 | 交易类型 | `all / credit(上分) / debit(下分) / transfer_in(三方体育上分) / transfer_out(三方体育下分)` |
| 4 | 转入 / 转出 | `all / in / out` |
| 5 | 币种 | select |
| 6 | 交易时间 RangePicker | |
| ~~⏸~~ | ~~状态 `all / 成功 / 超时重试 / 失败`~~ V0.2 隐藏 |

**表头 8 列(V0.2)**:流水号 / 系统户口号 / 用户账号 / 交易类型 / 转入/转出 / 币种 / 金额 / 时间

**V0.2 隐藏「状态」列**(代码保留,后期重启把 th 状态 + td 状态 chip 加回)

**主体账号(mainSysId / mainUser)规则**:每条流水的"被影响账号"(非账房非三方平台)
- `house_credit/debit`:主体 = 顶代,sysId = user
- `agent_credit/debit`:主体 = 下线,sysId 派生 1 层
- `transfer_in/out`:主体 = 玩家或代理

**转入/转出 chip 颜色**:转入 chip-active(绿)/ 转出 chip-warn(橙)

#### 6.6.1 后端 API

**GET `/api/s/v1/reports/ledger`** — 筛选参数:`txId / keyword / txType / flow / currency / dateFrom / dateTo / status`

> `txType=credit` 后端 OR 匹配 `house_credit + agent_credit`;`txType=debit` 同理。
> `flow=in` 匹配 credit + transfer_in;`flow=out` 匹配 debit + transfer_out。

### 6.7 StaffPage(员工账号)

**仅 operator 可见**

**说明文案**:`仅 operator 可见 · 新增 / 删除登录总控后台的员工 · 角色决定可见菜单与可写动作`

**右上角**:`[+ 新增员工]` 按钮(btn-primary)

**表头 6 列**:员工账号 / 角色 / 电话 / 创建时间 / 最近登录 / 操作

**员工账号列特殊标识**:
- 当前登录账号 → `(当前登录)` 灰字
- admin 账号 → `★ 超级账号` 黄字

**操作列**:`[修改角色]` + `[删除]`
- 修改自己 / 删除自己 → disabled
- admin 行 → 两个按钮都 disabled + title 提示

#### 6.7.1 AddStaffModal(新增员工弹窗)

字段:
- 员工账号(必填,**4-20 位英文+数字+中划线**)
- 初始密码(必填,**至少 6 位**)+ 确认密码(必填,**两次一致**)
- 角色(必填,3 选 1)
- 联系电话(选填)
- 操作密码

#### 6.7.2 EditStaffRoleModal(修改角色弹窗)

字段:新角色 select / 操作密码

校验:
- 角色未变 → `⚠ 角色未修改`
- admin 不可改

提示文案:
> ⚠ 该员工如已登录,需重新登录后新角色才生效

#### 6.7.3 删除确认弹窗

```
确认删除员工?
确认删除 [user] (角色)?该员工将无法登录系统,历史操作日志保留。
[取消] [确认删除(红)]
```

**拦截**:
- admin → `⚠ admin 是系统超级账号 / admin 不可删除...`
- 自删自己 → `⚠ 不能删除当前登录账号 / 请先用其他 operator 账号登录...`

#### 6.7.4 后端 API

**GET `/api/s/v1/perm/staff`** — 列表 + 当前登录员工标记

**POST `/api/s/v1/perm/staff`** — 新增

```json
{ "user": "ops-zhang", "password": "...", "role": "operator|risk|finance", "phone": "...", "operationPassword": "123456" }
```

**PUT `/api/s/v1/perm/staff/:user/role`** — 修改角色

```json
{ "newRole": "operator|risk|finance", "operationPassword": "123456" }
```

业务规则:
- **admin 不可改**(`is_super=1` hard check)
- 不能改自己
- 该员工已登录会话**保持原角色**直到重登(V0.2 不实时 invalidate session;Q-S40 待)

**DELETE `/api/s/v1/perm/staff/:user`** — admin 不可删 / 不能删自己

### 6.8 AuditPage(操作日志)

**说明文案**:`系统 = 平台员工动作 · 玩家 = C 端玩家 + B 端代理动作(在 S 端视角下,代理也是被管对象)`

**双 Tab**:`系统` / `玩家`(切 tab 时 reset 筛选 + pageNum)

**筛选区(3 项)**:
| # | 筛选项 | 备注 |
|---|---|---|
| 1 | 员工账号 / 主体账号 | text;placeholder 跟 tab 联动 |
| 2 | 主体类型 | select,选项跟 tab 联动 |
| 3 | 操作时间 RangePicker | `format=YYYY-MM-DD HH:mm:ss` |

**表头 5 列(V0.2)**:时间 / 主体类型 / 主体 / 动作 / IP

**主体类型 chip 颜色**:员工 蓝 / 代理 黄 / 玩家 绿

> **V0.2 隐藏「目标」列**(Sammy 2026-04-30 拍 一期不加):后端 `target` 字段仍写入 `audit_log`,前端不展示。后期重启把 th 目标 + td 目标 加回。
>
> **审计原因 / 备注列已删**(V0.2 砍掉)

#### 6.8.1 后端 API

**GET `/api/s/v1/sys/audit`** — 筛选参数:`tab(system|player) / actor / actorType / dateFrom / dateTo`

> 写动作 audit 由后端各 API 内部触发;前端不主动调用 audit 写接口。

### 6.9 IPWhitelistPage(IP 白名单) ⏸ V0.2 暂隐藏

> V0.2 收尾(Sammy 2026-04-30 拍):菜单不显示;LoginPage 不再做 IP 拒登(也不显示「模拟登录 IP」输入框)。组件代码 + `ipMatches` / `checkIPAllowed` 工具函数保留 in `App.jsx`,后期重启时把 `sys.ipwhite` 加回 `ROLES.menus` + sidebar `<Menu>` 加回 + LoginPage 接 `ipWhitelist` prop 恢复校验即可。


**仅 operator 可见**

**说明文案**:`仅 operator 可见 · 限定哪些 IP 段可登录总控后台 · 命中白名单外 IP 直接拒登`

**ℹ 信息条**:
```
当前登录 IP: 10.4.2.18 ✓ 在白名单内 (绿)/ ✗ 不在白名单内 (红)
启用项 N 条(0 条 = 所有 IP 均可登录)
校验范围:LoginPage 提交时
停用 / 删除最后一条启用项有防自锁拦截
```

**右上角**:`[+ 新增白名单]`

**筛选区(2 项)**:
| # | 筛选项 |
|---|---|
| 1 | IP / IP 段(text,同时搜 ip + label)|
| 2 | 状态(全部 / 启用 / 已停用)|

**表头 5 列**:IP / IP 段 / 备注 / 状态 / 创建时间 / 操作

**操作列**:`[启用 | 停用]` + `[删除]`(都需操作密码二次校验)

#### 6.9.1 AddIPModal(新增 IP 弹窗)

字段:
- IP / IP 段(必填,**支持单 IP `192.168.1.1` 或 CIDR `10.4.2.0/24`**)
- 备注(必填)
- 初始状态(radio:启用 / 已停用)
- 操作密码

#### 6.9.2 启停 / 删除确认弹窗

字段:操作密码

**防自锁规则**:
- 停用 / 删除时如果当前是**最后一条启用项**,拦截:`"不能停用/删除最后一条启用的白名单(否则所有 IP 都将拒登)"`

#### 6.9.3 后端 API

**GET `/api/s/v1/sys/ipwhite`** — 筛选 + 分页

**POST `/api/s/v1/sys/ipwhite`** — 新增,格式校验 + ip 不重复

**PUT `/api/s/v1/sys/ipwhite/:id/toggle`** — 防自锁拦截;Q-S44(深度防自锁)待

**DELETE `/api/s/v1/sys/ipwhite/:id`** — 同 toggle 防自锁

### 6.10 报表导出 Excel

**POST `/api/s/v1/reports/:type/export`**

```json
{ "type": "bets|sports|ledger|audit_system" }
// 不带筛选, 全量导出 (Sammy 拍 Q-S26)

// 响应
{ "downloadUrl": "https://...xxx.xlsx?token=...", "filename": "2026-04-30_体育注单记录.xlsx" }
```

副作用:写审计 `导出 Excel`,target 含菜单名 + 全量条数 + 文件名。

> **大数据量异步策略**(Q-S26 延伸):后端可选择直接返回 url(小数据)或异步任务(大数据,通过邮件 / 站内信通知下载链接)。

---

## 7. 业务规则与算法

### 7.1 占成业务公式

```
顶代占成 X% (粒度 = 顶代 + 币种)

账房 ↔ 顶代:
  上分 N → 实际扣款 = N × (1 − X%)
  下分 N → 实际到账 = N × (1 − X%)

例: 占成 20%,上分 100 万 → 平台跟账房只结 80 万,顶代账面 +100 万
    顶代实际相当于让利 20% 给账房(商务谈定的核心字段)
```

下线层 V0.2 不支持独立占成(Q-S11)。

### 7.2 上下分资金内部转移

```
credit(target, amount):
    parent = target.parent
    assert parent.balance >= amount, "上级余额不足"

    target.balance += amount
    target.total_balance += amount

    parent.balance -= amount
    parent.sub_balance += amount
    # parent.total_balance 不变 (balance −X + sub_balance +X 抵消)

    # 整棵树总余额不变 (只是内部转移)
```

### 7.3 级联冻结(只下行)

```
update_status(node, new_status, op_pwd):
    if old_status == 'active' and new_status == 'frozen':
        cascade_freeze(node)  # 递归级联

    node.status = new_status
    # frozen → active 不级联

cascade_freeze(node):
    for child in node.children:
        child.status = 'frozen'
        cascade_freeze(child)  # 穿透到底
```

### 7.4 总线余额递归

```
total_balance(node):
    return node.balance + sum(total_balance(c) for c in node.children)
```

### 7.5 下线数(穿透)

```
sub_count(node):
    return sum(1 + sub_count(c) for c in node.children)
# 不含自己
```

### 7.6 IP 白名单校验

```
check_ip_allowed(ip, whitelist):
    enabled = [w for w in whitelist if w.enabled]
    if len(enabled) == 0:
        return True  # 启用项 0 条 = 不限制
    return any(ip_matches(ip, w.ip) for w in enabled)

ip_matches(ip, entry):
    if '/' not in entry:
        return ip == entry  # 单 IP 完全匹配
    base, prefix = entry.split('/')
    prefix = int(prefix)
    if prefix == 0:
        return True  # 0.0.0.0/0 匹配所有
    mask = ~((1 << (32 - prefix)) - 1) & 0xFFFFFFFF
    return (ip_to_int(ip) & mask) == (ip_to_int(base) & mask)
```

### 7.7 派生 sysId

```
derive_sys_id(parent_sys_id, child_seq):
    return f"{parent_sys_id}-{child_seq}"

# 顶代:sys_id = user (账房创建)
# 1 层:qweqwe → carry01 → carry01.sys_id = qweqwe-1
# 2 层:qweqwe-1 → alice88 → alice88.sys_id = qweqwe-1-1
# 3 层:qweqwe-1-1 → bob_hi → bob_hi.sys_id = qweqwe-1-1-1
```

### 7.8 场次跑批(每日 00:10)

```
@scheduled("10 0 * * *")  # 每天 00:10
def run_session_batch():
    yesterday = today() - 1
    bets = bets_where("game_type='体育' AND status='已结算' AND DATE(settle_time)=yesterday")

    # 按 (顶代, 币种) 聚合
    grouped = group_by(bets, key=lambda b: (b.top_agent, b.currency))

    batch_id = "BATCH-" + format(now(), "YYYYMMDDHHMM")
    seq = 1
    for (agent, currency), agent_bets in grouped:
        if sum(b.valid_stake for b in agent_bets) == 0:
            continue  # 空跑批不存

        save_session(
            id="SP-" + format(now(), "YYYYMMDDHHMM") + "-" + pad(seq, 3),
            date=yesterday,
            top_agent=agent.user,
            sys_id=agent.sys_id,
            currency=currency,
            share_ratio=agent.share_ratio,
            valid_stake=sum(b.valid_stake for b in agent_bets),
            share_amount=sum(b.valid_stake * agent.share_ratio for b in agent_bets),
            total_win_loss=sum(b.win_loss for b in agent_bets),
            rate=agent.rate,
            commission=sum(b.valid_stake * agent.rate for b in agent_bets),
            submit_rate=[],  # V0.2 不算
            work_start_at=yesterday + " 00:00:00",
            work_end_at=yesterday + " 23:59:59",
            status="已结算",
            batch_id=batch_id,
        )
        seq += 1
```

> **跨日注单佣金率取哪一天?** Q-S5 待。

---

## 8. 写动作回写审计

> **后端硬规则**:每个写动作 API 内部必须 `service.appendAudit(...)`,跟数据库写动作在同一事务(或异步 MQ 但保证落库)。

### 8.1 13 类系统审计(actor_type=`员工`)

| 接口 | action 字符串 | target 模板 |
|---|---|---|
| `POST /auth/login` | `登录` | `S 端 / 角色: ${role}` |
| `POST /auth/logout` | `登出` | `S 端 / 角色: ${role}` |
| `POST /auth/change-password` | `修改密码` + `登出 (改密强制)` | `自身账号 ${user} (强制重登)` |
| `PUT /agents/:.../profile` | `修改资料` | `${type} ${user} (${sysId}) ${diffs.join(' / ')}` |
| 同上 + resetPwd 非空 | `重置下线密码` | `${user} (${sysId}) 强制下次登录改密` |
| `POST /agents/:.../sub` | `新增下级` | `顶代 ${parent.user} (${currency}) 下新增${type} ${user} (${newSysId})` |
| `POST /agents/:.../credit` | `上分` | `下线 ${user} (${sysId}) +${amount} ${currency}` |
| `POST /agents/:.../debit` | `下分` | `下线 ${user} (${sysId}) -${amount} ${currency}` |
| `POST /perm/staff` | `新增员工` | `${user} / 角色 ${roleName}` |
| `DELETE /perm/staff/:user` | `删除员工` | `${user} / 角色 ${roleName}` |
| `PUT /perm/staff/:user/role` | `修改员工角色` | `${user}  ${oldRoleName} → ${newRoleName} (该员工已登录会话需重登才生效)` |
| `POST /sys/ipwhite` | `新增 IP 白名单` | `${ip} (${label}, ${enabled?'启用':'已停用'})` |
| `PUT /sys/ipwhite/:id/toggle` | `启用 IP 白名单` / `停用 IP 白名单` | `${ip} (${label})` |
| `DELETE /sys/ipwhite/:id` | `删除 IP 白名单` | `${ip} (${label})` |
| `POST /reports/:type/export` | `导出 Excel` | `${menuName} / 全量 ${count} 条 → ${filename}` |

### 8.2 玩家 Tab(代理 / 玩家)

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

## 9. 字段规范

### 9.1 金额格式化(中文模式)

**全量「万」单位,无下限阈值,最多 4 位小数**:

| 输入 | 显示 |
|---|---|
| 8,000 | 0.8 万 |
| 300 | 0.03 万 |
| 0 | 0 万 |
| -1,200 | -0.12 万 |
| 12,580,000 | 1,258 万 |

**适用字段**:账户余额 / 下线余额 / 总线余额 / 注单投注金额 / 派彩 / 输赢 / 场次总投注 / 有效投注 / 佣金 / 流水金额(全部金额类)

**不适用**:数量类(下线数 / 注单数 / 玩家数)用千分位(`fmtNum`)

### 9.2 占成 / 佣金率格式

`fmtPct(n) = (n × 100).toFixed(2) + "%"`,例 `0.1875 → 18.75%`

### 9.3 时间格式

`YYYY-MM-DD HH:mm:ss`(秒级精度)

### 9.4 状态文案

| 字段 | 枚举值 | 文案 |
|---|---|---|
| 账号 status | `active` | 启用 |
| 账号 status | `frozen` | 禁用 |
| 注单 status | `已结算` | 已结算 |
| 注单 status | `未结算` | 未结算 |
| 流水 status | `成功` | 成功 |
| 流水 status | `超时重试` | 超时重试 |
| 流水 status | `失败` | 失败 |
| 场次 status | `已结算 / 未结算` | 同名展示 |
| IP 白 enabled | `true / false` | 启用 / 已停用 |

> **注意**:账号状态 frozen 显示文案 = "禁用",不是"已冻结"(跟修改资料弹窗 radio 对齐)

---

## 10. 文案规范

### 10.1 整体风格

S 端是**内部员工冷调**:
- ✅ **允许**「冻结 / 暂停 / 拒登 / 风控异常」等冷词
- ✅ **可暴露**字段阈值 / 业务规则细节
- ✅ **不走** xlsx 场景文案总表(B/C 端有,S 端不需要)

### 10.2 友好提示文案(写动作错误)

统一格式:**`⚠ [标题]\n[原因细节]\n[操作建议]`**

样例:
- 上级余额不足:`⚠ 上级账户余额不足 / 上级 X 当前余额 Y KRW,无法上分 Z / 建议先让账房给上级补充余额`
- 账户余额不足:`⚠ 账户余额不足 / 下线 X 当前余额 Y KRW,无法下分 Z`
- 用户名重复:`⚠ 用户账号已存在 / 该用户名在 X 币种线下已被占用,请换一个用户账号`
- 员工名重复:`⚠ 员工账号已存在 / 请换一个员工账号(若该账号已离职,请先在权限管理删除)`
- 自删自己:`⚠ 不能删除当前登录账号 / 请先用其他 operator 账号登录,再删除当前账号`
- 删 admin:`⚠ admin 是系统超级账号 / admin 不可删除,确保始终至少有 1 个 operator 能管理系统`

### 10.3 操作密码错误

`⚠ 操作密码错误`(单行;V0.2 失败次数限制延后,Q-S39)

### 10.4 删除确认弹窗

```
确认删除?
[具体内容]
[取消] [确认删除(红色 btn)]
```

---

## 11. 全局状态管理(state lifted)

> **关键 bug 修复**:所有"会被多页读取或写动作能改 mock"的 state 必须放最外层(用 Context / Store 或类似方案);仅 UI 临时态可放局部。

### 11.1 全局共享 state

| state | 类型 | 读取页面 | 写动作 |
|---|---|---|---|
| `currentUser` | object | 所有页 + Header | LoginPage / Logout / 改密 |
| `loginIP` | string | Header / IPWhitelistPage | LoginPage |
| `accounts` | object | AgentsPage / DashboardPage | handleEditProfile / handleNewSub / handleCreditDebit |
| `topKeys` | array | AgentsPage | handleNewSub |
| `staff` | array | StaffPage / LoginPage | handleAdd / handleDel / handleEditRole + onLogin(更新 lastLogin) |
| `ipWhitelist` | array | IPWhitelistPage / LoginPage | doConfirm / handleAdd |
| `auditSystem` | array | AuditPage / DashboardPage | appendSystemLog |
| `auditPlayer` | array | AuditPage | (V0.2 不写,只读) |

### 11.2 局部 state(UI 临时态)

每个页面内的:`expanded(顶代展开 set) / modal / 筛选 in/q 双状态 / pageNum / detailModal / showAdd / delConfirm` 等 — 切菜单 unmount 后自动重置,符合用户预期。

---

## 12. 业务硬规则

### 12.1 顶代 1 多币种 = N 行
按币种拆,row key = `user::currency`。

### 12.2 单个币种线整条币种一致
新增下线时**币种自动继承父级**,不让用户选。

### 12.3 占成业务公式
- 占成 X%、上分 N → 实际扣款 = N × (1 − X%)
- **粒度 = 顶代级 + 币种级**(下线层 V0.2 不支持独立占成,Q-S11)

### 12.4 上下分资金内部转移
- 整棵树总余额不变
- 上分:子 +X,父 −X;父 subBalance +X(子树涨)
- 下分:子 −X,父 +X;父 subBalance −X

### 12.5 级联冻结(只下行)
- `active → frozen` 递归把所有 children 也置 frozen
- `frozen → active` 不级联(防误激活)

### 12.6 admin 超级账号
- admin 不可删 / 不可改角色(双拦截 + UI disabled + 列表 ★ 标识)
- 防自锁(确保至少有 1 个 operator)

### 12.7 IP 白名单防自锁
- 不能停用 / 删除最后一条启用项
- **Q-S44(待)**:停用其他 IP 时也应检查"当前登录 IP 是否还在剩余启用项内"

### 12.8 操作密码 = 登录密码
- V0.2 不做独立操作密码;改密后所有写动作的二次校验也用新密码

### 12.9 下线层占成显示参考
- 下线行 `shareRatio = null` 时显示 `—`;否则 `{X.XX%} (参考)` 灰字
- 弹窗调占成对下线层 disabled(V0.2 不支持)

### 12.10 数据刷新机制
- **手动刷新页面**才能看到新数据(Q-S34)
- 不做轮询 / WebSocket;V0.2 列表打开 = 当时点 mock / API 快照

---

## 13. 安全要求

### 13.1 密码

- 密码哈希存储(算法由团队选)
- 至少 6 位(V0.2 弱要求,真实开发建议加复杂度,Q-S39)
- 改密时校验新 ≠ 旧
- 失败次数限制(Q-S39 待)

### 13.2 操作密码二次校验

V0.2 操作密码 = 登录密码,后端校验逻辑:

```
verify_op_password(user, op_pwd):
    return verify_password(op_pwd, user.password_hash)
```

高敏感写动作必须传 `operationPassword` 字段并校验通过。

### 13.3 IP 白名单

- LoginPage 提交时强制校验(同 §7.6)
- 无启用项 = 放行
- 防自锁:停用 / 删除最后启用项拦截
- Q-S44 待:深度防自锁(检查当前登录 IP 是否在剩余启用项内)

### 13.4 会话 token

- expiresIn 由团队选(建议 8 小时,Q-S37 待)
- 服务端可吊销(改密 / 退登触发)
- refresh token: V0.2 不做(用户重登)

### 13.5 admin 超级账号

- `is_super=1` hard check
- 不可删 / 不可改角色
- 改密走通用流程

### 13.6 API 频率限制

V0.2 不强制;Q-S39 真实开发可加。

---

## 14. 跨端对接

### 14.1 账房侧 ↔ S 端(Q-S14 待)

待定:
- 推 / 拉?
- 实时 / 批量?
- 顶代账号创建后推 S 端的方式?
- 账房侧账户被冻结后 S 端如何同步?

### 14.2 S 端 ↔ B 端(Q-S29 待)

S 端写动作(顶代户口 4 类)需推 B 端实时同步:
- 修改资料 / 新增下级 / 上分 / 下分 / 级联冻结

### 14.3 三方游戏商 ↔ 后端

注单:三方平台每笔投注回调 → 入 `bets` 表(准实时)。已结算后跑批进 `sports_sessions`。

### 14.4 跑批任务

| 任务 | cron | 内容 |
|---|---|---|
| 场次日结快照 | `10 0 * * *`(每日 00:10) | 跑前一天体育已结算注单聚合 |

> 命中"跑批批次号"`BATCH-YYYYMMDDHHMM` 一致,场次 id 用同 prefix `SP-YYYYMMDDHHMM-NNN`。

---

## 15. Q-S 议题清单

### 15.1 已关闭(Sammy 拍板)

| Q-S | 议题 | 决策 |
|---|---|---|
| Q-S2 | 数据看板 | V0.2 简洁版,完整指标后续 |
| Q-S9 | 系统户口号格式 | 顶代 sysId == user;下线层级派生 |
| Q-S16 | 下线数语义 | 穿透总下线数,跟 B 端 V1.12 同口径 |
| Q-S18 | 场次编号生成规则 | `SP-年月日时分-自然数`,每日 00:10 跑前一天 |
| Q-S22 | 登录页 | 要做 |
| Q-S23 | IP 白名单 | 完整实现(管理 + LoginPage 真校验);2FA / 失败锁定 / 密码强度仍延后 |
| Q-S24 | S 端给顶代上下分 | 不做(顶代行只「修改资料 / 新增下级」)|
| Q-S25 | 级联冻结 | 要做,解冻不级联 |
| Q-S26 | 报表导出 | 全量 + `YYYY-MM-DD_菜单名.xlsx` |
| Q-S27 | 操作密码 vs 登录密码 | 操作密码 = 登录密码 |
| Q-S28 | 上缴佣金率 | V0.2 不做,字段保留 mock |
| Q-S30 | S 端运营帮下线重置密码 | EditProfileModal 已支持 |
| Q-S34 | 数据刷新 | 手动刷新页面 |
| Q-S35 | 错误处理友好文案 | 部分关闭,主要 alert 已重写 |
| Q-S35-2 | 状态文案统一 | frozen → "禁用" |
| Q-S35-3 | 改密回写登出日志 | 写 2 条审计 |
| Q-S40 | 修改员工角色 | 要做,弹窗 + 操作密码 + 已登录会话需重登 |
| Q-S41 | 删 operator 防自锁 | admin 不可删 / 不可改 |

### 15.2 待议(真实开发对齐)

| Q-S | 议题 |
|---|---|
| Q-S1 | 电子 / 六合彩 代理佣金结算 |
| Q-S3 | 账房对账 |
| Q-S4 | 有效投注口径 |
| Q-S5 | 跨日注单佣金率取哪一天 |
| Q-S7 | B/S 跨端字段命名 账户余额 vs 可用余额 |
| Q-S8 | 顶代户口页范围(代理户口 / 玩家户口二级页?) |
| Q-S10 | 跨币种总额折算 |
| Q-S11 | 下线层独立占成 |
| Q-S12 | B/S 端设计风格 |
| Q-S13 | B 端 V1.12 → V2.0 切 ProComponents 时机 |
| Q-S14 | 账房 ↔ S 端 数据对接协议 |
| Q-S15 | 跨端字段命名 sysId(S) vs id(B) |
| Q-S17 | 系统改名"三方游戏"后,菜单是否去"体育"前缀 |
| Q-S29 | S 端写动作推 B 端实时同步 |
| Q-S31 | 状态枚举异常态(注单作废 / 流水部分成功) |
| Q-S32 | 上下分单笔 / 日累计限额 |
| Q-S33 | finance / risk 能否点「游戏明细」 |
| Q-S36 | 首次登录强制改密 |
| Q-S37 | 会话超时 |
| Q-S38 | 多端登录互斥 |
| Q-S39 | 操作密码 / 登录失败次数限制 |
| Q-S42 | Dashboard 累计场次过滤口径 vs 场次记录页 |
| Q-S43 | 操作日志加导出 Excel 按钮 |
| Q-S44 | IP 白名单深度防自锁(检查当前登录 IP) |

---

## 16. 视觉规范(暗色冷蓝主题)

| 用途 | 色值 |
|---|---|
| 主色(operator) | `#4A9EFF` |
| 警示(risk) | `#F0B93A` |
| 成功(finance) | `#5BC97C` |
| 错误 | `#FF6B6B` |
| 暖红(下分) | `#FF8B6B` |
| 紫(中性强调) | `#9B7FE8` |
| 背景 | `#0B0F15` |
| 面板 | `#11161E` |
| 卡片 | `#1A2434` |
| 边框 | `#2A3648` |
| 主文字 | `#E4ECF7` |
| 次文字 | `#9AA4B5` |
| 弱文字 | `#6B7280` / `#5C6878` |

---

## 17. 附录

### 17.1 mock 员工 4 名

| user | role | phone | mock 密码 | is_super |
|---|---|---|---|---|
| `admin` | operator | +86 138-0000-0001 | `123456` | 1 |
| `risk-mei` | risk | +86 138-0000-0002 | `123456` | 0 |
| `finance-luo` | finance | +86 138-0000-0003 | `123456` | 0 |
| `ops-chen` | operator | +86 138-0000-0004 | `123456` | 0 |

### 17.2 mock IP 白名单 3 条

| IP | 备注 | 启用 |
|---|---|---|
| `10.4.2.0/24` | 办公网段 | ✓ |
| `118.139.32.18` | 运营 admin 家用 | ✓ |
| `61.74.110.55` | 风控外勤备用 | ✗ |

### 17.3 mock 顶代 9 行

`qweqwe::KRW / qweqwe::USD / lucky88::PHP / diamond::USD / emerald::USD / sapphire::KRW / goldenstar::KRW / bigwhale::CNY / rookie01::THB`

> 8 个独立顶代(qweqwe 多币种)+ 完整下线树(carry01 → alice88 → bob_hi 等)

### 17.4 mock 数据规模

参考原型 `MOCK_BETS`(30+ 条)/ `MOCK_SPORTS_SESSIONS`(7 条)/ `MOCK_LEDGER`(14 条)/ `INITIAL_AUDIT_SYSTEM`(12 条)/ `INITIAL_AUDIT_PLAYER`(17 条)

---

**文档结束**
