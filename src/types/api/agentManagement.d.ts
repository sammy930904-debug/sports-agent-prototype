export type MerchantListParams = {
    merchant_name?: string; // 商户名称
    wallet_type?: number; // 1单一钱包 2转账钱包
    current?: number;
    pageSize?: number;
};

export type MerchantListResult = {
    merchant_id: number;
    merchant_name: string; // 商户名称
    contact: string; // 对接商务
    tel: string; // 联系方式
    remark: string; // 商户备注
    yj_type: number; // 佣金方式
    md5_key: string; // md5密钥
    aes_key: string; // 商户aes私钥
    code: string; // 线路编码
    domain: string; // 域名配置
    ip_white: string; // 商户白名单
    create_at: number; // 创建时间
    state: number; // 1 正常 2关闭
    update_at: number;
    parent_id: number; // 上级商户id
    parent_name: string; // 上级商户名称
    wallet_type: number; // 1单一钱包 2转账钱包
    wallet_key: string; // 单一钱包密钥
    yj_name: string; // 单一钱包密钥
    pwd: string; // 密码
    area_id: number; // 站点区域id
    allow_change_rtp: number; // '是否支持商户自定义修改rtp 1不支持 2支持'
    tiaokong_type: number; // '调控类型1 自然 2游戏水池 3代理水池'
    weight_type: number;
    is_test: number; // 商户属性
    channel_ids: number[]; // 开通的渠道
};

// 查询活动状态
export type TaskStateResult = {
    open: boolean; // 状态
};

// 开启/关闭活动
export type TaskStateUpdateParams = {
    open: boolean; // 状态
};

export type GameHistoryDayChildReportParams = {
    current?: number;
    pageSize?: number;
    merchant_name?: string;
    start_time?: number;
    end_time?: number;
    currency_id?: number;
};

export type GameHistoryDayChildReportItem = {
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

export type GameHistoryDayChildReportResult =
    CommonList<GameHistoryDayChildReportItem>;
