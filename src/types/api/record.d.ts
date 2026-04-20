import { CommonList } from '@/types/common/global';

export interface BettingRecordsParams {
    current?: number;
    pageSize?: number;
    merchant_name?: string;
    parent_id?: string;
    user_id?: string;
    user_name?: string;
    state?: number;
    currency_id?: number;
    bet_amount?: number;
    create_at?: number;
    start_time?: number;
    end_time?: number;
    search_after: number[] | null;
}

// 下注记录响应结果
export type BettingRecordsResult = {
    d: BettingRecordsItem[];
    t: number;
    search_after: number[] | null;
    has_next_page: boolean;
};

export interface BettingRecordsItem {
    history_id: number;
    round: number;
    parent_id: number;
    game_mode: number;
    user_id: number;
    user_name: string;
    kind_id: number;
    kind_name: string;
    zone: number;
    currency_id: number;
    bet_size: string;
    bet_level: number;
    symbol_payout: number;
    multiplier: number;
    validate_amount: string;
    bet_amount: string;
    win_loss_amount: number;
    win_amount: string;
    before_amount: string;
    after_amount: string;
    state: number;
    game_data: string;
    bomb: string;
    first_bet_at: number;
    payout_at: number;
    nick_name: string;
    merchant_id: number;
    merchant_code: string;
    merchant_name: string;
    create_at: number;
}

export type MerchantRateBillListParams = {
    current?: number;
    pageSize?: number;
    merchant_name?: string;
    start_time?: number;
    end_time?: number;
};
export type MerchantRateBillListItem = {
    id: number;
    name: string;
    remark: string;
    created_at: number;
    commission_way: number;
    lowest_fee: number;
    pool_fee: number;
    other_fee: number;
    level_fee_arr: Array<{
        amount: number;
        rate: number;
    }>;
    merchant_name: string;
    merchant_code: string;
    date: string;
    negative_profit: string;
    turnover_amount: string;
    level_info_arr: {
        amount: number;
        rate: number;
    };
    total_amount: string;
    win_loss_amount: string;
    currency_id: number;
    from_at: number;
    currency_rate_info_arr: Array<{
        turnover_amount: string;
        negative_profit: string;
        rate: number;
        currency_code: string;
        main_currency_code: string;
        conversion_turnover_amount: string;
        conversion_negative_profit: string;
    }>;
    status: number;
    t: number;
    jackpot_amount: number;
};
export type MerchantRateBillListResult = {
    state: boolean;
    data: {
        d: MerchantRateBillListItem[];
    };
};
export type MerchantRateBillUpdateBillParams = {
    id?: number;
    remark?: string;
    main_network?: string;
    wallet_addr?: string;
    exchange_rate?: number;
    change_amount?: number;
};
export type MerchantRateBillUpdateBillResult = {
    state: boolean;
    data: string;
};
export type MerchantRateBillDetailParams = {
    id?: number;
};
export type MerchantRateBillDetailResult = {
    state: boolean;
    data: {
        d: MerchantRateBillListItem[];
    };
};
export type MerchantRateBillUpdateStatusParams = {
    id?: number;
    status?: number;
};
export type MerchantRateBillUpdateStatusResult = {
    state: boolean;
    data: string;
};

export type UpdateOtherFeeParams = {
    id?: number; // 账单id
    other_fee?: number; // 其他金额
};

export type UpdateOtherFeeResult = {
    state?: boolean;
    data?: {
        total_amount?: string; // 总金额
    };
};

export type TransferHistoryListParams = {
    user_name?: string; // 用户名
    mode?: number; // 模式 1单一钱包 2转账钱包
    tf_type?: number; // 帐变类型 1转入 2转出 3投注 4派奖
    merchant_name?: string; // 商户名称
    start_time?: number; // 开始时间
    end_time?: number; // 结束时间
    current?: number; // 当前页
    pageSize?: number; // 每页大小
};
export type TransferHistoryListItem = {
    id: string; // 账变编号
    user_id: string; // 用户id
    user_name: string; // 用户名
    tf_type: number; // 帐变类型 1转入 2转出 3投注 4派奖
    amount: number; // 金额
    currency_id: number; // 币种
    create_at: number; // 创建时间
    status: number; // 状态 1成功 2失败
    mode: number; // 模式 1单一钱包 2转账钱包
    merchant_id: number; // 商户id
    merchant_name: string; // 商户名
    before: number; // 原金额
    history_id: string; // 对应游戏记录
    after: number; // 之后金额
    merchant_transfer_id: string; // 商户账变id
    pay_out_amount: number; // 转入转出
    bet_amount: number; // 投注金额
};
export type TransferHistoryListResult = CommonList<TransferHistoryListItem>;

export interface GameHistoryDetailParams {
    parent_id: string; // 交易id
    start_time: number; // 开始时间
    end_time: number; // 结束时间
}

export interface GameHistoryDetailResult {
    round: number; // 回合
    parent_id: string; // 交易id
    history_id: string; // 历史id
    game_mode: number; // 游戏类型,1:普通模式,2:免费游戏
    bet_size: number; // 投注大小
    bet_level: number; // 投注倍数
    multiplier: number; // 倍数
    after_amount: number; // 余额
    game_data: ImageListItem[]; // 奖品数据
    bet_amount: number; // 投注金额
    win_loss_amount: number; // 输赢金额
    payout_at: string; // 时间
    bomb: BombItem[];
    create_at: number;
    kind_id: number;
    data?: {
        betRecord: { totalBetGold: number };
        commonRecord: {
            dispatchRewardGold: number;
            porderId: string;
            recordId: string;
            settlementTimestamp: number;
        };
        connectionRecord: {
            betGold: number;
            winLoseGold: number;
            icons: string;
            betSingle: number;
            betTimes: number;
        };
        roomLevel: number;
    };
}

export interface BombItem {
    c: number; // 图案
    bs: number; // 投注大小
    ml: number; // 投注倍数
    sp: number; // 符号赔付值
    ways: number; // 中奖路
    multiplier: number; // 中奖倍数
    zhu: number; // 星连珠
}

export type JackpotRecordListParams = {
    id?: string;
    merchant?: string;
    start?: number;
    end?: number;
} & PageParams;

export type JackpotRecordListResult = {
    d: {
        id: string; // 编号
        total_bet: number; // 全站总投注
        jackpot_amount: number; // 累计金额
        round_id: string;
        state: number; // 1:进行中 | 2:已发放
        merchant: string; // 商户
        currency_id: number; // 币种
        created_at: number; // 时间
        merchant_id: number;
    }[];
    t: number;
};

export type MerchantRateBillAgentBillParams = {
    current?: number;
    pageSize?: number;
    merchant_name?: string;
    start_time?: number;
    end_time?: number;
};

export type MerchantRateBillAgentBillItem = {
    id: number;
    name: string;
    remark: string;
    created_at: number;
    commission_way: number; // 1.流水抽成 2.负盈利抽成
    lowest_fee: number; // 保底费用
    pool_fee: number; // 奖池费率
    other_fee: number; // 其他费用
    level_fee_arr: Array<{
        amount: number; // 金额
        rate: number; // 费率
        agent_rate: number; // 代理抽成
    }>;
    merchant_name: string; // 商户名
    merchant_code: string; // 商户号
    date: string; // 账单日期
    negative_profit: string; // 负盈利额
    turnover_amount: string; // 流水
    level_info: string; // 符合的阶梯费率
    level_info_arr: {
        amount: number; // 金额
        rate: number; // 费率
        agent_rate: number; // 代理抽成
    };
    agent_amount: number; // 代理佣金
    agent_amount_state: number; // 1:初始化账单|2:未结算|3:待结算|4:已结算
    total_amount: number; // 账单总金额
    win_loss_amount: number; // 平台盈利额
    currency_id: number; // 币种
    currency_rate_info: string; // 币种账单和汇率
    from_at: number;
    // 游戏信息
    currency_rate_info_arr: Array<{
        turnover_amount: string; // 流水
        negative_profit: string; // 负盈利额
        rate: number; // 汇率
        currency_code: string; // 币种
        main_currency_code: string; // 需要转换成的主货币
        conversion_turnover_amount: string; // 转换后的流水
        conversion_negative_profit: string; // 转换后的负盈利额
    }>;
    status: number; // 1:可见|2:不可见
    merchant_id: number;
    main_network: string; // trc20, erc20...
    wallet_addr: string; // 地址
    exchange_rate: number; // 收款汇率
    change_amount: number; // usdt收款金额
    level_amount: number; // 阶梯费用
    AddAmount: number; // 新增其他费用
};

export type MerchantRateBillAgentBillResult = {
    state: boolean;
    data: {
        d: MerchantRateBillAgentBillItem[];
        t: number;
    };
};

export type MerchantRateBillUpdateAgentStatusParams = {
    id: number;
    agent_amount_state: number; // 1:初始化账单|2:未结算|3:待结算|4:已结算
    agent_main_network: string; // USDT类型
    agent_wallet_addr: string; // USDT收款地址
};
export type MerchantRateBillUpdateAgentStatusResult = {
    state: boolean;
    data: string;
};
