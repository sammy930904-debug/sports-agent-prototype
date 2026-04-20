export type GameCountResult = {
    win_amount: number; // 总盈利
    total_user: number; // 会员总数
    bet_amount: number; // 投注总额
    last_month_add: number; // 上月新增会员
};

export type ActiveCountResult = {
    last_month_bet: number; // 月活用户
    day_retention: number; // 日留存率
    seven_day_retention: number; // 七日留存率
    month_day_retention: number; // 月留存率
};

export type GameWinResult = {
    kind_name: string; // 游戏名称
    win_amount: number; // 盈利金额
};

export type HourActiveCountResult = {
    hour_time: string; // 时间
    active_user: number; // 活跃用户数
};

export type DayActiveCountResult = {
    day_time: string; // 日期
    active_user: number; // 活跃用户数
};
