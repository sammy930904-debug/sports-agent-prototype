export type UpdateUserRtpParams = {
    user_id?: string;
    rtp?: number;
    kind_id: number;
};

export type UserGameListParams = {
    user_id?: string;
};

export type UserGameListItem = {
    id: number;
    merchant_id: number;
    game_id: number;
    state: number;
    tiaokong_type: number;
    rtp: number;
    game_name: string;
};

export type UserGameListResult = {
    state?: boolean;
    data?: UserGameListItem[];
    msg?: string;
};

export type MemberGameRtpUpdateAllParams = {
    user_id?: string;
    rtp?: number;
};

export type MemberGameRtpUpdateAllResult = {
    success: boolean;
};

export type MemberChangeLineParams = {
    user_name: string;
};

export type MemberChangeLineResult = {
    data: string;
    msg: string;
    state: boolean;
};
