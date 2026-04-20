export type GameHistoryDayGameSumParams = {
    current?: number;
    pageSize?: number;
    kind_names?: string;
    type_id?: number;
    start_time?: number;
    end_time?: number;
    type_name?: string;
    kind_name?: string;
};

export type GameHistoryDayGameSumItem = {
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
    from_at?: number;
    user_count?: number;
    win_num?: number;
    t?: number;
};

export type GameHistoryDayGameSumResult = CommonList<GameHistoryDayGameSumItem>;

export type CurrencyRateItem = {
    id: number; // 必须
    currency_name: string; // 必须，名称
    currency_code: string; // 必须，code
    rate: string; // 必须，汇率
};

export type CurrencyRateResult = CommonList<CurrencyRateItem>;

export type UpdateCurrencyRateParams = {
    id?: number; // 非必须，id
    rate?: number; // 非必须，汇率
};

export type UpdateCurrencyRateResult = {
    state: boolean; // 非必须
    data: string; // 非必须
};

export type GameListParams = {};
export type GameListItem = {
    id: number;
    merchant_id: number;
    game_id: number;
    state: number;
    tiaokong_type: number;
    trp_setting: number;
    game_name: string;
    allow_change_rtp: number;
};
export type GameListResult = {
    state: boolean;
    data: GameListItem[];
    msg: string;
};
export type UpdateAllGameRtpParams = {
    trp_setting: number;
};
export type UpdateAllGameRtpResult = {};
export type UpdateGameRtpParams = {
    trp_setting: number;
    game_id: number;
};
export type UpdateGameRtpResult = {
    state: boolean;
    data: number;
    msg: string;
};
