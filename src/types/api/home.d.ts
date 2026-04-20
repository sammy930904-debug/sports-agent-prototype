// import { CommonList } from '../common/global';
// export interface HallParams {}
// export interface HallResult {}

export type LoginParams = {
    identity: string;
    member_code: string;
    password: string;
};
export type LoginResult = {
    code: number;
    data: string;
};

export type UserInfoResult = {
    code: number;
    data: {
        identity: number;
        last_login_at: number;
        level: number;
        member_code: string;
        member_id: string;
        member_name: string;
        need_edit_pwd: boolean;
        status: boolean;
    };
};

export type StatisticsParams = {
    start_time: number;
    end_time: number;
};
export type StatisticsResult = {
    data: any[];
};

export type LoginOutResult = {
    code: number;
    data: string;
};

export type CurrencyResult = {};

export type ChangePasswordParams = {
    member_name: string;
    old_pwd: string;
    new_pwd: string;
};

export type ChangePasswordResult = {
    code: number;
    data: string;
};

export type MemberParams = {
    member_code: string;
};

export type MemberResult = {
    code: number;
    data: string;
};

export type MemberAddParams = {
    back_up_phone_number: string;
    commission_currency_id: number;
    commission_rate: number;
    identity: number;
    member_code: string;
    member_name: string;
    password: string;
    confirmPassword?: string;
    phone_number: string;
    pwd: string;
    status: boolean;
    system_code: string;
    target_agent_code?: string;
};

export type MemberEditParams = {
    back_up_phone_number: string;
    commission_currency_id: number;
    commission_rate: number;
    identity: number;
    member_code: string;
    member_name: string;
    password: string;
    phone_number: string;
    pwd: string;
    status: boolean;
};

export type SubAddParams = {
    back_up_phone_number: string;
    commission_currency_id: number;
    commission_rate: number;
    identity: number;
    member_code: string;
    member_name: string;
    password: string;
    phone_number: string;
    pwd: string;
    status: boolean;
    system_code: string;
    target_agent_code?: string;
};

export type MemberAddResult = {};

export type CommissionItem = {
    balance: number;
    commissionRate: number;
    currency: number;
};

export type CommissionResult = {
    code: number;
    data: CommissionItem[];
};

export type MemberDetailResult = {};

export type AddScoreParams = {
    amount: number;
    currency_id: number;
    member_code: string;
    pwd: string;
    to_member_code: string;
};

export type LowerScoreParams = {
    amount: number;
    currency_id: number;
    member_code: string;
    pwd: string;
    to_member_code: string;
};
