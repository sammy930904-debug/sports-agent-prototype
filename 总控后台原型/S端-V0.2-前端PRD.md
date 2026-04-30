# 三方游戏总控后台(S 端)V0.2 · 前端 PRD

**版本**:V0.2
**日期**:2026-04-30
**目标读者**:前端 AI 开发(antd v5 + ProComponents 技术栈)
**对应原型**:`总控后台原型/体育总控后台-原型.html`(单文件 React + Tailwind CDN,2276 行)

---

## 0. 文档定位

本 PRD 用于前端 AI 开发,聚焦 **UI 实现 + 交互流程 + 字段展示规则 + 角色权限 + 文案规范**。
后端接口契约 / 数据模型 / 业务规则 见独立文档 `S端-V0.2-后端PRD.md`。

---

## 1. 产品背景

### 1.1 系统定位

「三方游戏总控后台」(简称 S 端)是博彩平台**内部员工**使用的运营 / 风控 / 财务管理系统。

跟另外两端的关系:
- **B 端代理后台**(顶代 / 代理使用):`体育后台原型/`,V1.12
- **C 端 STAR VIP GAME**(玩家使用):`游戏端原型/`,V0.4
- **S 端总控后台**(平台员工使用):本文档,V0.2

### 1.2 V0.2 范围

| 模块 | 二级页 | 状态 |
|---|---|---|
| 数据看板 | 数据看板 | ✅ 简洁版(4 KPI + 最近 10 条系统日志) |
| 账号管理 | 顶代户口 | ✅ Tree Table + 4 类写动作 |
| 报表管理 | 体育注单记录 | ✅ |
| 报表管理 | 体育场次记录 | ✅ 含「游戏明细」弹窗 |
| 报表管理 | 交易流水记录 | ✅ |
| 权限管理 | 员工账号 | ✅ 仅 operator 可见 |
| 系统管理 | 操作日志 | ✅ 系统 / 玩家双 Tab |
| 系统管理 | IP 白名单 | ✅ 仅 operator 可见 |

### 1.3 三角色

| 角色 | 名称 | 颜色 | 写动作 |
|---|---|---|---|
| `operator` | 平台运营 | `#4A9EFF`(蓝) | ✅ 全菜单 + 所有写动作 |
| `risk` | 风控审计 | `#F0B93A`(黄) | ❌ 只读 |
| `finance` | 财务对账 | `#5BC97C`(绿) | ❌ 只读 |

---

## 2. 业务术语

> 跟 B 端 V1.12 共用术语;真实开发命名以本表为准。

| 术语 | 英文字段 | 含义 |
|---|---|---|
| **顶代** | top agent | 平台直辖最高级代理(账号类型「普通(顶代)」),由账房侧创建 |
| **代理** | agent | 顶代下挂的中间层 |
| **玩家** | player | 终端用户,在 C 端投注 |
| **下线** | sub | 任何账号下面挂的账号(相对概念) |
| **占成** | shareRatio | 顶代享受的让利比例(顶代 ↔ 账房);公式:占成 X%、上分 N → 实际扣款 N×(1−X);粒度 = 顶代级 + 币种级 |
| **佣金率** | rate | 上级给下线的提成比例(代理 ↔ 下线) |
| **系统户口号** | sysId | 顶代:`sysId == user`(账房创建时同名);下线:层级派生(`carry01 → qweqwe-1`,`alice88 → qweqwe-1-1`) |
| **用户账号** | user | 登录用账号,自定义(如 `qweqwe`、`carry01`、`bob_hi`) |
| **总线余额** | totalBalance | `自己的账户余额 + Σ 直属下线.总线余额`(递归)|
| **下线余额** | subBalance | `总线余额 − 账户余额`(派生)|
| **下线数** | subCount | 穿透总下线数(自身穿透下所有递归下线合计,不含自己)|
| **账号状态** | status | 枚举只 `active / frozen`(V0.2 砍 pending) |
| **账号类型** | accountType | `普通(顶代) / 代理 / 游戏` 三种 |
| **注单** | bet | 玩家每笔投注单,准实时,三方游戏商每笔回调 |
| **场次** | session | 每日 00:10 跑前一天的"日结快照",**只跑体育已结算注单**,用于代理佣金结算 |
| **流水** | ledger | 资金动作日志,三层合一(账房↔顶代 / 顶代↔下线 / 玩家↔三方平台) |
| **上分 / 下分** | credit / debit | 给账户增加 / 减少余额 |

---

## 3. 技术栈

| 层 | 选型 |
|---|---|
| UI 框架 | React 18 + TypeScript |
| 组件库 | antd v5 |
| **业务组件** | **@ant-design/pro-components**(ProTable / ProForm / ProDescriptions / ProCard) |
| 样式 | Tailwind(可选) + antd ConfigProvider 主题(深色冷蓝 `#4A9EFF`) |
| 路由 | react-router 6 |
| 状态 | useState + Context(需要全局共享的:currentUser / accounts / staff / ipWhitelist / auditSystem / auditPlayer)|
| 国际化 | **不做**(中文单语,跟 B/C 端有 i18n 不同) |
| 响应式 | **不做**(PC 桌面工具,内部员工使用) |

> 原型阶段单文件 HTML + React CDN + Tailwind 用于评审;真实工程化必须切 ProComponents。

---

## 4. 路由 / 菜单结构 + 角色权限矩阵

### 4.1 路由

```
/login                          → LoginPage(未登录态)
/                               → 主框架,默认重定向到 /dashboard
/dashboard                      → DashboardPage
/agents                         → AgentsPage(顶代户口)
/reports/bets                   → BetsPage(体育注单)
/reports/sports                 → SportsSessionsPage(体育场次)
/reports/ledger                 → LedgerPage(交易流水)
/perm/staff                     → StaffPage(员工账号,operator only)
/sys/audit                      → AuditPage(操作日志)
/sys/ipwhite                    → IPWhitelistPage(IP 白名单,operator only)
```

### 4.2 菜单结构

```
🏠 数据看板 (一级,无下挂)

账号管理 (一级)
└── 顶代户口

报表管理 (一级)
├── 体育注单记录
├── 体育场次记录
└── 交易流水记录

权限管理 (一级,仅 operator 可见)
└── 员工账号

系统管理 (一级)
├── 操作日志
└── IP 白名单 (仅 operator 可见)
```

### 4.3 三角色权限矩阵

| 菜单 | operator | risk | finance |
|---|:---:|:---:|:---:|
| 数据看板 | ✓ | ✓ | ✓ |
| 顶代户口 | ✓ 11 列 + 写 | ✓ 7 列 只读 | ✓ 11 列 只读 |
| 体育注单记录 | ✓ | ✓ 隐派彩/输赢 | ✓ |
| 体育场次记录 | ✓ | ✓ | ✓ |
| 交易流水记录 | ✓ | ✗ | ✓ |
| 员工账号 | ✓ | ✗ | ✗ |
| 操作日志 | ✓ | ✓ 只读 | ✓ 只读 |
| IP 白名单 | ✓ | ✗ | ✗ |

### 4.4 顶代户口 11 列字段(operator 视角)

| # | 列 | 字段 | risk 可见 |
|---|---|---|---|
| 1 | 系统户口号 | `sysId` | ✓ |
| 2 | 用户账号 | `user` | ✓ |
| 3 | 下线数 | `subCount` | ✓ |
| 4 | 账号状态 | `status` | ✓ |
| 5 | 币种 | `currency` | ✓ |
| 6 | 占成 | `shareRatio` | ✗ |
| 7 | 账户余额 | `balance` | ✗ |
| 8 | 下线余额 | `subBalance` | ✗ |
| 9 | 总线余额 | `totalBalance` | ✗ |
| 10 | 账号类型 | `accountType` | ✓ |
| 11 | 开户时间 | `createdAt` | ✓ |

operator 多 1 列 **操作**(canWrite=true);risk / finance 不显示操作列。

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
│             │                                  │
└─────────────┴─────────────────────────────────┘
```

- **Sidebar 宽 224px**(`w-56`),背景 `#11161E`(panel)
- **品牌区**(顶部 5×5 padding):`◆ 三方游戏 / 总控后台 V0.2`
- **菜单组**(每组上方有 `menu-group` 灰色小标题):账号管理 / 报表管理 / 权限管理 / 系统管理
- **菜单项 hover / active**:active 蓝色强调(`#4A9EFF`)
- **底部备注**:`内部工具 · 仅限授权员工 / 原型仅评审用 · 实际开发使用 @ant-design/pro-components`

### 5.2 Header 右上角员工信息块

点击展开下拉菜单(用 antd Dropdown 或自实现):

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
**例外**:SessionDetailModal 用 10 条/页(自实现,不用通用组件)

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
4. 强制 logout(`setCurrentUser(null)` → 回到 LoginPage)

### 5.5 操作密码二次校验(高敏感写动作通用)

凡是涉及 **高敏感字段** 的写动作,弹窗内最后一行必填**操作密码**(= 当前登录员工的登录密码,V0.2 mock 统一 `123456`)。

判定"高敏感"的写动作:
- 顶代户口:**修改资料**(改占成 / 佣金率 / 状态 / 类型 / 重置密码,任一)
- 顶代户口:**新增下级 / 上分 / 下分**(全部触发)
- 员工账号:**新增 / 删除 / 修改角色**
- IP 白名单:**新增 / 启停 / 删除**

**例外**:报表「导出 Excel」**不触发**(Q-S26 拍);筛选 / 分页等读动作不触发。

---

## 6. 各页面详细设计

### 6.1 LoginPage(登录页)

**触发**:`currentUser === null`(未登录)

**布局**:全屏 flex 居中,卡片 380px 宽

**字段**:
| 字段 | 类型 | 必填 | 校验 |
|---|---|---|---|
| 员工账号 | text | ✓ | 必须存在于 staff 表 |
| 登录密码 | password | ✓ | mock 统一 `123456`;真实开发后端校验;**眼睛切换显隐** |
| 模拟登录 IP | text(原型用) | ✓ | 默认 `10.4.2.18`;真实开发后端从 request 自动取,**前端不显示此字段** |

**校验顺序**(跟生产一致):
1. **IP 白名单**:`checkIPAllowed(simIP, ipWhitelist)` — 不命中 → 友好提示 `"IP X 不在白名单内,拒绝登录"`
2. **员工账号是否存在**:不存在 → `"员工账号不存在"`
3. **密码正确**:错误 → `"登录密码错误"`

**登录成功**:
1. 把 staff 表里该员工的 `lastLogin` 更新为本次登录时间
2. `setCurrentUser(fresh)`(包含新 lastLogin)
3. `setLoginIP(simIP)`
4. 写审计日志:`登录` / target: `S 端 / 角色: ${role}`
5. 跳转 `/dashboard`

**底部提示文案(原型用)**:
```
V0.2 mock 员工: admin / risk-mei / finance-luo / ops-chen,密码统一 123456
V0.2 mock 白名单: 10.4.2.0/24(办公网段) / 118.139.32.18(运营家用)
试 10.4.2.18(命中)vs 8.8.8.8(拒登)
```

### 6.2 DashboardPage(数据看板)

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

**查看完整日志按钮**:`onClick={()=>setActive("sys.audit")}`

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
| 4 | 占成 | select 150px | `all / lt10(<10%) / 10to20 / 20to30 / gte30(≥30%)` |
| 5 | 开户时间 | RangePicker | `createdAt` 范围,带 `HH:mm:ss` |
| - | [搜索] | btn-primary | `doSearch` |
| - | [重置] | btn-ghost | `resetSearch` |

筛选区下方信息条:`共 N 顶代行 · 当前页渲染 N 行(含展开下线)` + 右侧 `[全部收起]` 按钮(`expanded.size === 0` 时 disabled)。

**搜索语义**:树状穿透 — 任何后代命中,整条祖先链都显示并自动展开。

#### 6.3.3 表格

**表头**:11 列字段(operator 视角)+ 操作列(canWrite 时)

**Tree Table 展开**:
- 顶代行(depth=0)左侧 ▸/▾ 切换,**点一次展一层**(懒加载)
- 下线行(depth>0)`paddingLeft: depth × 16px` + 淡蓝底色 `rgba(74,158,255,0.04)`
- 字段集与顶代行**完全相同**(11 列),语义重载:
  - `占成` 列:下线层 `shareRatio = null` 时显示「—」(参考占成 灰字)
  - `下线数`:该下线穿透下挂的孙辈数

**操作列(operator only)**:按行类型分发
| 行类型 | 操作按钮 |
|---|---|
| 顶代(普通) | `新增下级` + `修改资料` |
| 代理(下线) | `新增下级` + `修改资料` + `上分` + `下分` |
| 游戏(玩家) | `修改资料` + `上分` + `下分` |

#### 6.3.4 写动作 4 类弹窗

**A. 新增下级 NewSubModal**

字段:
- 用户账号 `user`(必填,**6-20 位英文+数字**)
- 登录密码 `pwd`(必填) + 确认密码 `pwdC`(必填,**两次必须一致**)
- 联系电话 `phone` `phone2`(选填)
- 账号类型 `accType`(默认"代理",可选"游戏")
- 账号状态 `accStatus`(默认 active)
- 参考占成 `refShareRatio`(必填,百分数,**≤ 父级 shareRatio**)
- 参考佣金率 `refRate`(必填,百分数)
- 操作密码(`123456`)

业务规则:
- **币种自动继承父级**(同一币种线整条继承,V0.2 不让用户选)
- 提交后:派生 `sysId = parentNode.sysId + "-" + (parentNode.children.length + 1)`
- 沿祖先链 `subCount + 1`
- 自动展开父级让用户看到新行

**B. 修改资料 EditProfileModal**

分 3 个 Section:

**Section 只读信息**:`sysId / user / currency / accountType / createdAt / 余额`

**Section 低敏感字段**(无需操作密码):
- 账户昵称 `nick`(必填)
- 电话 `phone`(选填)
- 备用电话 `phone2`(选填)

**Section 高敏感字段**(任一改动 → 触发操作密码二次校验):
- 顶代行:**ℹ 蓝色提示** "顶代占成由账房侧设置,不在 S 端修改",**不显示占成 / 佣金率字段**
- 下线行:参考占成 `refShareRatio` (≤ 上级) + 参考佣金率 `refRate`
- 重置登录密码 `resetPwd`(选填,留空 = 不重置;填则强制下线下次登录改密)
- 账号状态 `accStatus`(radio:启用 / 禁用)
- 账号类型(radio,**升级规则**:游戏 → 代理 OK,代理 → 游戏 禁止,顶代不可改)

**级联冻结(关键业务规则)**:
- `status: active → frozen` 时 → **递归把所有 children 也置 frozen**(穿透到底)
- `status: frozen → active` 时 → **不级联**(防止误激活独立冻结的下线)

**写日志 target 描述**:多字段 diff,例 `下线 qw-003 (qweqwe-2) 昵称 三号 → 三号哥 / 佣金率 5.0% → 6.0%`(状态用中文 `启用 / 禁用`,不用英文 active/frozen)

**C. 上分 / 下分 CreditDebitModal**

字段:
- 该账号信息(只读)
- 直属上级信息(只读)
- 金额(单位**万**,数字 + ".xxxx" 4 位小数;弹窗内同时显示元单位换算)
- 操作密码(`123456`)

业务规则(资金内部转移):
- **上分 +X 元**:该账号 balance + X,该账号 totalBalance + X;**直属上级** balance − X,subBalance + X;父 totalBalance 不变(子树涨抵消)
- **下分 −X 元**:该账号 balance − X,该账号 totalBalance − X;直属上级 balance + X,subBalance − X
- **整棵树总余额不变**(只是内部转移)
- 校验:上分时上级余额 ≥ X,下分时该账号余额 ≥ X
- 失败友好提示(见 §8.2)

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

**risk 视角隐藏**:派彩金额 / 输赢 2 列(`showFinanceCols = role !== "risk"`)

### 6.5 SportsSessionsPage(体育场次记录)

**说明文案**:`每日 00:10 跑批 1 次,生成前一天的体育已结算场次 · 用于代理佣金结算 · 上缴佣金率 V0.2 暂不可用,字段仅 mock 演示`

**ℹ 信息条**:`电子 / 六合彩 的代理佣金结算暂未实现(Q-S1 待议),本页仅体育数据`

**默认过滤**:`validStake > 0`(空跑批不展示)

**筛选区**(提交触发):
| # | 筛选项 |
|---|---|
| 1 | 场次编号 |
| 2 | 系统户口号 / 用户账号 |
| 3 | 币种 |
| 4 | 占成(distinct from mock) |
| 5 | 业务日期 RangePicker(`format=YYYY-MM-DD`) |
| 6 | 状态(已结算 / 未结算) |

**场次编号规则**:`SP-年月日时分-自然数`(年月日时分 = 跑批生成时间,例 04-28 数据于 04-29 00:10 跑 → `SP-202604290010-001`,自然数按 batch 内重置)

**表头 15 列**:场次编号 / 系统户口号 / 用户账号 / 输赢 / 有效投注 / 币种 / 占成 / 占成金额 / 佣金率 / 佣金 / 上缴佣金率 / 开工时间 / 收工时间 / 状态 / 操作

**上缴佣金率展示**:`{sysId1}:{rate1}% | {sysId2}:{rate2}%`(数组管道分隔)

**操作列**:`[游戏明细]` 按钮 → 打开 SessionDetailModal

#### 6.5.1 SessionDetailModal(游戏明细弹窗)

宽 `1100px`,position relative

**布局**:
```
游戏明细 · SP-...                                  [✕ 右上角]
[date] · 顶代 [user] · 币种 KRW · 共 N 条注单

┌────────────────────────────────────────┐
│ 表 10 列 (注单号/系统户口号/用户账号/   │
│ 币种/投注时间/结算时间/投注金额/派彩/  │
│ 输赢/有效投注)                          │
│ tfoot:本页小计 + 总计                   │
└────────────────────────────────────────┘

[导出 Excel]                共 N 条 · 第 X / Y 页 ← 上一页 下一页 →
```

- 关闭按钮 `✕` 右上角
- 翻页右下角(`pageSize = 10`)
- 表格 tfoot 双行:**本页小计 + 总计**(投注金额 / 派彩金额 / 输赢 / 有效投注 4 列汇总)

**导出**:`doExport("游戏明细_" + session.id, matched.length, appendSystemLog)`

> **PM 简化**:目前按 `topAgent` 过滤匹配注单;真实场景应按 `场次 batchId` 关联

### 6.6 LedgerPage(交易流水记录)

**说明文案**:`三层资金动作合一 · 账房 ↔ 顶代 / 顶代 ↔ 下线 / 玩家 ↔ 三方体育平台`

**筛选区**(提交触发):
| # | 筛选项 | 选项 |
|---|---|---|
| 1 | 流水号 | text |
| 2 | 系统户口号 / 用户账号 | text(双字段联合搜索 mainSysId / mainUser) |
| 3 | 交易类型 | `all / credit(上分) / debit(下分) / transfer_in(三方体育上分) / transfer_out(三方体育下分)` |
| 4 | 转入 / 转出 | `all / in / out` |
| 5 | 币种 | select |
| 6 | 交易时间 RangePicker | |
| 7 | 状态 | `all / 成功 / 超时重试 / 失败` |

**表头 9 列**:流水号 / 系统户口号 / 用户账号 / 交易类型 / 转入/转出 / 币种 / 金额 / 时间 / 状态

**类型枚举(typeLabel)**:
- `house_credit / agent_credit` → **「上分」**(label collapsed)
- `house_debit / agent_debit` → **「下分」**
- `transfer_in` → **「三方体育上分」**
- `transfer_out` → **「三方体育下分」**

**主体账号(mainSysId / mainUser)规则**:每条流水的"被影响账号"(非账房非三方平台)
- `house_credit/debit`(账房 ↔ 顶代):主体 = 顶代,sysId = user
- `agent_credit/debit`(顶代/代理 ↔ 下线):主体 = 下线,sysId 派生 1 层
- `transfer_in/out`(三方 ↔ 玩家或代理):主体 = 玩家或代理

**转入/转出 chip 颜色**:转入 chip-active(绿)/ 转出 chip-warn(橙)

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
- 操作密码(`123456`)

#### 6.7.2 EditStaffRoleModal(修改角色弹窗)

字段:
- 新角色 select(默认值 = 当前角色)
- 操作密码

校验:
- 角色未变 → "⚠ 角色未修改"
- admin 不可改(handleEditRole 拦截 + 按钮 disabled)

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

### 6.8 AuditPage(操作日志)

**说明文案**:`系统 = 平台员工动作 · 玩家 = C 端玩家 + B 端代理动作(在 S 端视角下,代理也是被管对象)`

**双 Tab**:`系统` / `玩家`(切 tab 时 reset 筛选 + pageNum)

**筛选区(3 项)**:
| # | 筛选项 | 备注 |
|---|---|---|
| 1 | 员工账号 / 主体账号 | text;placeholder 跟 tab 联动(系统 → "搜索员工账号" / 玩家 → "搜索玩家 / 代理账号")|
| 2 | 主体类型 | select,选项跟 tab 联动(系统 → 全部/员工 / 玩家 → 全部/玩家/代理)|
| 3 | 操作时间 RangePicker | `format=YYYY-MM-DD HH:mm:ss` |

**表头 6 列**:时间 / 主体类型 / 主体 / 动作 / 目标 / IP

**主体类型 chip 颜色**:员工 蓝(chip-cool) / 代理 黄(chip-warn) / 玩家 绿(chip-info)

> **审计原因 / 备注列已删**(V0.2 砍掉,Q-S35 部分关闭)

### 6.9 IPWhitelistPage(IP 白名单)

**仅 operator 可见**

**说明文案**:`仅 operator 可见 · 限定哪些 IP 段可登录总控后台 · 命中白名单外 IP 直接拒登`

**ℹ 信息条**:
```
当前登录 IP: 10.4.2.18 ✓ 在白名单内 (绿)/ ✗ 不在白名单内 (红)
启用项 N 条(0 条 = 所有 IP 均可登录)
校验范围:LoginPage 提交时
停用 / 删除最后一条启用项有防自锁拦截
```

**右上角**:`[+ 新增白名单]`(btn-primary)

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

**格式校验**:`isValidIPOrCIDR(ip)`(详见 §10.1)

#### 6.9.2 启停 / 删除确认弹窗

字段:操作密码

**防自锁规则**:
- 停用 / 删除时如果当前是**最后一条启用项**,拦截:`"不能停用/删除最后一条启用的白名单(否则所有 IP 都将拒登)"`

---

## 7. 字段规范

### 7.1 金额格式化(中文模式)

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

### 7.2 占成 / 佣金率格式

`fmtPct(n) = (n × 100).toFixed(2) + "%"`,例 `0.1875 → 18.75%`

### 7.3 时间格式

`YYYY-MM-DD HH:mm:ss`(秒级精度)

### 7.4 状态文案

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

> **注意**:账号状态 frozen 显示文案 = "禁用",不是"已冻结"(Sammy 拍板,跟修改资料弹窗 radio 对齐)

---

## 8. 文案规范

### 8.1 整体风格

S 端是**内部员工冷调**:
- ✅ **允许**「冻结 / 暂停 / 拒登 / 风控异常」等冷词
- ✅ **可暴露**字段阈值 / 业务规则细节(例如"操作密码错误"直接说,不像 C 端绕)
- ✅ **不走** xlsx 场景文案总表(B/C 端有,S 端不需要)

### 8.2 友好提示文案(写动作错误)

统一格式:**`⚠ [标题]\n[原因细节]\n[操作建议]`**

样例:
- 上级余额不足:`⚠ 上级账户余额不足 / 上级 X 当前余额 Y KRW,无法上分 Z / 建议先让账房给上级补充余额`
- 账户余额不足:`⚠ 账户余额不足 / 下线 X 当前余额 Y KRW,无法下分 Z`
- 用户名重复:`⚠ 用户账号已存在 / 该用户名在 X 币种线下已被占用,请换一个用户账号`
- 员工名重复:`⚠ 员工账号已存在 / 请换一个员工账号(若该账号已离职,请先在权限管理删除)`
- 自删自己:`⚠ 不能删除当前登录账号 / 请先用其他 operator 账号登录,再删除当前账号`
- 删 admin:`⚠ admin 是系统超级账号 / admin 不可删除,确保始终至少有 1 个 operator 能管理系统`

### 8.3 操作密码错误

`⚠ 操作密码错误`(单行;V0.2 失败次数限制延后,Q-S39)

### 8.4 删除确认弹窗

```
确认删除?
[具体内容]
[取消] [确认删除(红色 btn)]
```

---

## 9. 操作日志的写动作回写

> 详见后端 PRD §6;前端只需在写动作 onSubmit 成功后调用 `appendSystemLog(action, target)`。

### 9.1 9 大类写动作 + 13 个具体动作回写

| 触发位置 | 动作字符串 | target 样例 |
|---|---|---|
| LoginPage onLogin | `登录` | `S 端 / 角色: operator` |
| 退出登录 | `登出` | `S 端 / 角色: operator` |
| ChangePwdModal | `修改密码` + `登出 (改密强制)` | `自身账号 admin (强制重登)` |
| handleEditProfile diff | `修改资料` | `下线 qw-003 (qweqwe-2) 状态: 启用 → 禁用 / 佣金率 5.0% → 6.0%` |
| handleEditProfile resetPwd | `重置下线密码` | `qw-003 (qweqwe-2) 强制下次登录改密` |
| handleNewSub | `新增下级` | `顶代 qweqwe (KRW) 下新增代理 carry01 (qweqwe-3)` |
| handleCreditDebit | `上分` / `下分` | `下线 qw-008 (qweqwe-1) +200,000 KRW` |
| StaffPage handleAdd | `新增员工` | `ops-zhang / 角色 平台运营` |
| StaffPage handleDel | `删除员工` | `ops-chen / 角色 平台运营` |
| StaffPage handleEditRole | `修改员工角色` | `risk-mei  风控审计 → 财务对账 (该员工已登录会话需重登才生效)` |
| IPWhitelistPage doConfirm | `启用 IP 白名单 / 停用 IP 白名单 / 删除 IP 白名单` | `10.4.2.0/24 (办公网段)` |
| IPWhitelistPage handleAdd | `新增 IP 白名单` | `192.168.1.1 (运营 admin 家用, 启用)` |
| doExport(任一报表) | `导出 Excel` | `体育注单记录 / 全量 N 条 → 2026-04-30_体育注单记录.xlsx` |

---

## 10. 工具函数与算法

### 10.1 IP 白名单校验

```js
ipToInt(ip)             // "192.168.1.1" → 整数;非法返回 null
isValidIPv4(ip)         // 校验单 IPv4
isValidCIDR(cidr)       // 校验 CIDR /N(N=0~32)
isValidIPOrCIDR(s)      // 单 IP 或 CIDR 段都接受

ipMatches(ip, entry)    // 单 IP 完全匹配 OR CIDR 段位运算包含
checkIPAllowed(ip, list) // 启用项 0 条 = 放行;否则必须命中至少 1 条启用项
```

### 10.2 导出 Excel helper

```js
doExport(menuName, totalCount, appendSystemLog) {
  // 文件名: YYYY-MM-DD_菜单名.xlsx
  // 范围: 全量数据 (不按当前筛选, Sammy 拍)
  // V0.2 原型 placeholder: alert 显示规则
  // 真实开发对接后端导出接口
  // 同时回写审计日志: 导出 Excel / target=菜单名 + 全量 N 条 + 文件名
}
```

5 处接入:体育注单 / 体育场次 / 交易流水 / 操作日志(待 Q-S43)/ SessionDetailModal

### 10.3 派生 sysId

```js
function deriveSysId(parentSysId, childIndex) {
  return parentSysId + "-" + childIndex;
  // 顶代:sysId = user
  // 1 层:qweqwe-1
  // 2 层:qweqwe-1-1
}
```

### 10.4 总线余额递归

```js
function totalBalance(node) {
  return node.balance + (node.children || []).reduce((s, ck) => s + totalBalance(accounts[ck]), 0);
}
```

---

## 11. 全局状态管理(state lifted)

> **关键 bug 修复后(commit ec1d630)**:所有"会被多页读取或写动作能改 mock"的 state 必须放最外层(用 Context 或 Zustand);仅 UI 临时态可放局部。

### 11.1 全局共享 state

| state | 类型 | 读取页面 | 写动作 |
|---|---|---|---|
| `currentUser` | object | 所有页 + Header | LoginPage / Logout / 改密 |
| `loginIP` | string | Header / IPWhitelistPage | LoginPage |
| `accounts` | object | AgentsPage / DashboardPage | handleEditProfile / handleNewSub / handleCreditDebit |
| `topKeys` | array | AgentsPage | handleNewSub(可能要追加) |
| `staff` | array | StaffPage / LoginPage | handleAdd / handleDel / handleEditRole + onLogin(更新 lastLogin) |
| `ipWhitelist` | array | IPWhitelistPage / LoginPage | doConfirm / handleAdd |
| `auditSystem` | array | AuditPage / DashboardPage | appendSystemLog |
| `auditPlayer` | array | AuditPage | (V0.2 不写,只读)|

### 11.2 局部 state(UI 临时态)

每个页面内的:`expanded(顶代展开 set) / modal(写动作弹窗) / 筛选 in/q 双状态 / pageNum / detailModal / showAdd / delConfirm` 等 — 切菜单 unmount 后自动重置,符合用户预期。

---

## 12. 业务硬规则(影响前端逻辑)

### 12.1 顶代 1 多币种 = N 行
按币种拆,row key = `user::currency`。

### 12.2 单个币种线整条币种一致
新增下线时**币种自动继承父级**,不让用户选。

### 12.3 占成业务公式
- 占成 X%、上分 N → 实际扣款 = N × (1 − X%)
- 下分 N → 实际到账 = N × (1 − X%)
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
- **Q-S44(待)**:停用其他 IP 时也应检查"当前登录 IP 是否还在剩余启用项内",不在则警告

### 12.8 操作密码 = 登录密码
- V0.2 不做独立操作密码;改密后所有写动作的二次校验也用新密码

### 12.9 下线层占成显示参考
- 下线行 `shareRatio = null` 时显示 `—`;否则 `{X.XX%} (参考)` 灰字
- 弹窗调占成对下线层 disabled(V0.2 不支持)

### 12.10 数据刷新机制
- **手动刷新页面**才能看到新数据(Sammy 拍,Q-S34)
- 不做轮询 / WebSocket;V0.2 列表打开 = 当时点 mock / API 快照

---

## 13. Q-S 议题清单

### 13.1 已关闭(Sammy 拍板)

| Q-S | 议题 | 决策 |
|---|---|---|
| Q-S9 | 系统户口号格式 | 顶代 sysId == user;下线层级派生 |
| Q-S16 | 下线数语义 | 穿透总下线数,跟 B 端 V1.12 同口径 |
| Q-S18 | 场次编号生成规则 | `SP-年月日时分-自然数`,每日 00:10 跑前一天 |
| Q-S22 | 登录页 | 要做 |
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
| Q-S2 | 数据看板 | V0.2 简洁版,完整指标后续 |

### 13.2 待议(真实开发对齐)

| Q-S | 议题 |
|---|---|
| Q-S1 | 电子 / 六合彩 代理佣金结算 |
| Q-S3 | 账房对账 |
| Q-S4 | 有效投注口径 |
| Q-S5 | 跨日注单佣金率取哪一天 |
| Q-S7 | B/S 跨端字段命名 账户余额 vs 可用余额 |
| Q-S8 | 顶代户口页范围(代理户口 / 玩家户口二级页?)|
| Q-S10 | 跨币种总额折算 |
| Q-S11 | 下线层独立占成 |
| Q-S12 | B/S 端设计风格(浅色 vs 深色)|
| Q-S13 | B 端 V1.12 → V2.0 切 ProComponents 时机 |
| Q-S14 | 账房 ↔ S 端 数据对接协议 |
| Q-S15 | 跨端字段命名 sysId(S) vs id(B) |
| Q-S17 | 系统改名"三方游戏"后,菜单是否去"体育"前缀 |
| Q-S29 | S 端写动作推 B 端实时同步 |
| Q-S31 | 状态枚举异常态(注单作废 / 流水部分成功)|
| Q-S32 | 上下分单笔 / 日累计限额 |
| Q-S33 | finance / risk 能否点「游戏明细」(玩家级别注单数据敏感性)|
| Q-S36 | 首次登录强制改密 |
| Q-S37 | 会话超时 |
| Q-S38 | 多端登录互斥 |
| Q-S39 | 操作密码 / 登录失败次数限制 |
| Q-S42 | Dashboard 累计场次过滤口径 vs 场次记录页 |
| Q-S43 | 操作日志加导出 Excel 按钮 |
| Q-S44 | IP 白名单深度防自锁(检查当前登录 IP) |

---

## 14. 视觉规范(暗色冷蓝主题)

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

## 15. 附录

### 15.1 mock 员工 4 名

| user | role | phone | mock 密码 |
|---|---|---|---|
| `admin` | operator | +86 138-0000-0001 | `123456` |
| `risk-mei` | risk | +86 138-0000-0002 | `123456` |
| `finance-luo` | finance | +86 138-0000-0003 | `123456` |
| `ops-chen` | operator | +86 138-0000-0004 | `123456` |

### 15.2 mock IP 白名单 3 条

| IP | 备注 | 启用 |
|---|---|---|
| `10.4.2.0/24` | 办公网段 | ✓ |
| `118.139.32.18` | 运营 admin 家用 | ✓ |
| `61.74.110.55` | 风控外勤备用 | ✗ |

### 15.3 mock 顶代 9 行

`qweqwe::KRW / qweqwe::USD / lucky88::PHP / diamond::USD / emerald::USD / sapphire::KRW / goldenstar::KRW / bigwhale::CNY / rookie01::THB`

> 8 个独立顶代(qweqwe 多币种)+ 完整下线树(carry01 → alice88 → bob_hi 等)

---

**文档结束**
