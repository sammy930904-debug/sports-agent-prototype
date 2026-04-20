export type RecordItem = {
    created_at?: number;
    game_id?: number;
    game_name?: string;
    merchant_name?: string;
    props_name?: string;
    props_type?: string;
    props_value?: number;
    receive_count?: number;
    user_id?: string;
    user_name?: string;
    delete_at?: number;
};

export type UserRecordItem = {
    update_at?: number;
    game_id?: number;
    game_name?: string;
    merchant_name?: string;
    props_name?: string;
    props_type?: string;
    props_value?: number;
    receive_count?: number;
    user_id?: string;
    user_name?: string;
    payout_amount?: number;
    receive_total_amount?: number;
    use_total_amount?: number;
    payout_total_amount?: number;
};

export type PropsReceiveRecordParams = {
    game_id?: number; // 游戏ID
    merchant_name?: string; // 商户名称
    props_type?: number; // 道具类型
    user_id?: string; // 用户ID
    props_id?: number; // 道具ID
    start_time?: string; // 开始时间
    end_time?: string; // 结束时间
    game_name?: string; // 游戏名称
    user_name?: string; // 用户名称
    props_name?: string; // 道具名称
    current?: number;
    pageSize?: number;
};

export type PropsReceiveRecordResult = {
    state: boolean;
    d?: RecordItem[];
    t?: number;
    total_receive_value?: number;
    total_users?: number;
    total_delete_value?: number;
};

export type PropsUseRecordParams = {
    game_id?: number; // 游戏ID
    merchant_name?: string; // 商户名称
    props_type?: number; // 道具类型
    user_id?: string; // 用户ID
    props_id?: number; // 道具ID
    start_time?: string; // 开始时间
    end_time?: string; // 结束时间
    game_name?: string; // 游戏名称
    user_name?: string; // 用户名称
    props_name?: string; // 道具名称
    current?: number;
    pageSize?: number;
};

export type PropsUseRecordResult = {
    state: boolean;
    d?: UserRecordItem[];
    t?: number;
    total_payout?: number;
    total_value?: number;
    total_users?: number;
};
export type PropsLineDataParams = {
    current?: number;
    pageSize?: number;
};

export type PropsLineDataResult = {
    state: boolean;
    d?: UserRecordItem[];
    t?: number;
};

export type PropsDataDetailParams = {
    merchant_name: string;
    current?: number;
    pageSize?: number;
    start_time?: number | undefined;
    end_time?: number | undefined;
};
export type DetailItem = {
    date: string;
    receive_total_amount?: number;
    use_total_amount?: number;
    payout_total_amount?: number;
};
export type PropsDataDetailResult = {
    state: boolean;
    d?: DetailItem[];
    t?: number;
};
