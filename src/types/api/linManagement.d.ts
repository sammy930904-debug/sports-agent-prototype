interface ManageLineParams {
    merchant_name?: string;
    state?: number;
    current?: number;
    pageSize?: number;
}

interface ManageLineResult {
    state?: boolean;
    data?: {
        d?: {
            merchant_id?: number; // 商户id，非必须，数字
            merchant_name?: string; // 商户名称，非必须，字符串
            contact?: string; // 对接商务，非必须，字符串
            tel?: string; // 联系方式，非必须，字符串
            remark?: string; // 备注，非必须，字符串
            yj_type?: number; // 平台费率方案，非必须，数字
            line_key?: string; // 商户密钥，非必须，字符串
            code?: string; // 商户编码，非必须，字符串
            domain?: string; // 域名，非必须，字符串
            ip_white?: string; // ip白名单，逗号隔开，非必须，字符串
            create_at?: number; // 创建日期，非必须，数字
            state?: number; // 商户状态，1启用，2禁用，非必须，数字
            update_at?: number; // 修改时间，非必须，数字
        }[];
    };
}

interface LineDetailParams {
    merchant_id?: number;
}

interface LineDetailResult {
    state?: boolean;
    data?: {
        merchant_id?: number;
        merchant_name?: string;
        contact?: string;
        tel?: string;
        remark?: string;
        yj_type?: number;
        line_key?: string;
        code?: string;
        domain?: string;
        ip_white?: string;
        create_at?: number;
        state?: number;
        update_at?: number;
    };
}

interface AddLineParams {
    merchant_name?: string;
    contact?: string;
    tel?: string;
    remark?: string;
    yj_type?: number;
    code?: string;
    domain?: string;
    ip_white?: string;
    state?: number;
}

interface AddLineResult {
    state?: boolean;
    data?: null;
}

interface EditLineParams {
    merchant_id?: number;
    contact?: string;
    tel?: string;
    remark?: string;
    yj_type?: number;
    line_key?: string;
    domain?: string;
    ip_white?: string;
}

interface EditLineResult {
    state?: boolean;
    data?: null;
}

interface UpdateLineStateParams {
    merchant_id?: number;
    state?: number;
}

interface UpdateLineStateResult {
    state?: boolean;
    data?: null;
}

interface LineGameListParams {
    merchant_id?: number;
}

interface GameItem {
    id?: number;
    merchant_id?: number;
    game_id?: number;
    state?: number;
    pageSize?: number;
    current?: number;
}

interface LineGameListResult {
    state?: boolean;
    data?: GameItem[];
}

interface GameStateBatchUpdateParams {
    state?: number;
    merchant_id?: number;
}

interface GameStateBatchUpdateResponse {
    state?: boolean;
    data?: null;
}

// 开启/关闭商户游戏状态的请求参数类型
interface ToggleLineGameStatusParams {
    // 商户ID
    id?: number; // 商户ID，非必须
    state?: number; // 状态，非必须，1表示开启，2表示关闭
}

// 开启/关闭商户游戏状态的返回数据类型
interface ToggleLineGameStatusResponse {
    state?: boolean; // 操作是否成功
    data?: null; // 返回数据，本接口中无具体数据返回
}

// 获取游戏列表参数
interface GameKindListParams {
    current?: number;
    pageSize?: number;
}

// 获取游戏列表响应
interface GameKindListResult {
    state?: boolean;
    data?: {
        d?: {
            kind_id?: number;
            game_name?: string;
            game_code?: string;
            type_id?: number;
            type_name?: string;
            sort_id?: number;
            client?: number;
            state?: number;
            free?: number;
            create_at?: number;
            update_at?: number;
            create_name?: string;
            update_name?: string;
            jackpot?: number;
            reward_rate: number;
        }[];
        t?: number;
    };
}

// 游戏信息管理-修改游戏状态参数
interface GameKindUpdateParams {
    state?: number;
    kind_id?: number;
}

// 游戏信息管理-修改游戏状态响应
interface GameKindUpdateResult {
    state?: boolean;
    data?: string;
}

// 游戏信息管理-一键修改游戏状态参数
interface GameKindUpdateAllParams {
    state?: number;
}

// 游戏信息管理-一键修改游戏状态响应
interface GameKindUpdateAllResult {
    // 暂无数据
}

interface UpdateRewardRateParams {
    kind_id?: number; // 游戏id
    reward_rate?: number; // 反奖率
}

interface UpdateRewardRateResult {
    state?: boolean;
    data?: string;
}

interface UpdateGameBetParams {
    kind_id?: number; // 游戏id
    currency?: number; // 币种
    bet_size_1?: number;
    bet_size_2?: number;
    bet_size_3?: number;
    bet_size_4?: number;
}

interface UpdateGameBetResult {
    state?: boolean;
    data?: string;
}

interface GameBetListParams {
    kind_id: number; // 游戏id
}

interface GameBetListItem {
    id?: number;
    kind_id?: number; // 游戏id
    currency?: number; // 币种
    bet_size_1?: number;
    bet_size_2?: number;
    bet_size_3?: number;
    bet_size_4?: number;
}

interface GameBetListResult {
    state?: boolean;
    data?: GameBetListItem[];
}

interface RateSettingInsertParams {
    name?: string;
    status?: number;
    remark?: string;
    commission_way?: number;
    lowest_fee?: number;
    pool_fee?: number;
    other_fee?: number;
    level_fee?: {
        amount?: number;
        rate?: number;
    }[];
}

interface RateSettingUpdateParams {
    id?: number;
    name?: string;
    status?: number;
    remark?: string;
    commission_way?: number;
    lowest_fee?: number;
    pool_fee?: number;
    other_fee?: number;
    level_fee?: {
        amount?: number;
        rate?: number;
    }[];
}

interface RateSettingSwitchParams {
    id?: number;
    status?: number;
}

interface RateSettingListItem {
    id: number;
    name: string;
    status: number;
    remark: string;
    created_at: number;
    updated_at: number;
    commission_way: number;
    lowest_fee: number;
    pool_fee: number;
    other_fee: number;
    level_fee_arr: {
        amount: number;
        rate: number;
    }[];
}

export type RateSettingInsertResult = CommonList<null>;
export type RateSettingUpdateResult = CommonList<null>;
export type RateSettingListResult = CommonList<RateSettingListItem>;

interface MemberGameRtpParams {
    user_id?: string;
    type_id?: string;
}

interface MemberGameRtpItem {
    kind_id?: number;
    game_name?: string;
    game_code?: string;
    type_id?: number;
    type_name?: string;
    sort_id?: number;
    client?: number;
    state?: number;
    free?: number;
    create_at?: number;
    update_at?: number;
    create_name?: string;
    update_name?: string;
    jackpot?: number;
    reward_rate?: number;
    user_reward_rate?: number;
}

interface MemberGameRtpSaveParams {
    user_id?: string;
    kind_id?: number;
    reward_rate?: number;
}

export type MemberGameRtpResult = CommonList<MemberGameRtpItem>;
export type MemberGameRtpSaveResult = CommonList<null>;

export type GameHistoryDayReportParams = {
    current?: number;
    pageSize?: number;
    merchant_name?: string;
    start_time?: number;
    end_time?: number;
    currency_id?: number;
};

export type GameHistoryDayReportItem = {
    id?: number;
    type_id?: number;
    type_name?: string;
    bet_amount?: number;
    validate_amount?: number;
    bet_num?: number;
    user_id?: number;
    user_name?: string;
    win_amount?: number;
    win_loss_amount?: number;
    win_loss_probability?: number;
    merchant_code?: string;
    merchant_name?: string;
    date?: string;
    created_at?: number;
    currency_id?: number;
    kind_id?: number;
    kind_name?: string;
    user_count?: number;
    win_num?: number;
    t?: number;
};

export type GameHistoryDayReportResult = CommonList<GameHistoryDayReportItem>;

export type GameHistoryDayReportDetailParams = {
    merchant_name?: string;
    kind_id?: number;
    start_time?: number;
    end_time?: number;
    currency_id?: number;
};

export type GameHistoryDayReportDetailItem = {
    id: number;
    type_id: number;
    type_name: string;
    bet_amount: number;
    validate_amount: number;
    bet_num: number;
    user_id: number;
    user_name: string;
    win_amount: number;
    win_loss_amount: number;
    win_loss_probability: number;
    merchant_code: string;
    merchant_name: string;
    date: string;
    created_at: number;
    currency_id: number;
    kind_id: number;
    kind_name: string;
    from_at: number;
    user_count: number;
    win_num: number;
    t?: number;
};
export type GameHistoryDayReportDetailResult =
    CommonList<GameHistoryDayReportDetailItem>;

export type MerchantAreaItem = {
    area_id: number;
    area_name: string;
};
export type MerchantAreaResult = {
    state: boolean;
    data: MerchantAreaItem[];
};
