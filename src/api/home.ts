import { deffHttp } from '@/utils/axios';
import {
    LoginParams,
    LoginResult,
    UserInfoResult,
    StatisticsParams,
    StatisticsResult,
    LoginOutResult,
    // CurrencyResult,
    ChangePasswordParams,
    ChangePasswordResult,
    MemberParams,
    MemberResult,
    MemberAddParams,
    SubAddParams,
    MemberEditParams,
    MemberAddResult,
    CommissionResult,
    MemberDetailResult,
    AddScoreParams,
    LowerScoreParams,
} from '@/types/api/home';

enum Api {
    LOGIN = '/api/backend/v1/login', // 登录
    USER_INFO = '/api/backend/v1/user/info',
    STATISTICS = '/api/backend/v1/user/statistics', //纵览
    LOGIN_OUT = '/api/backend/v1/user/logout', //退出登陆
    // CURRENCY_LIST = '/api/cms/currency/list', // 查询币种
    CHANGE_PASSWORD = '/api/backend/v1/user/edit',
    MEMBER_LIST = '/api/backend/v1/user/member/list',
    MEMBER_ADD = '/api/backend/v1/user/member/add',
    MEMBER_EDIT = '/api/backend/v1/user/member/edit',
    COMMISSION = '/api/backend/v1/user/member/commission', //方案
    MEMBER_DETAIL = '/api/backend/v1/user/member/detail', //查询下线详情
    NEXT_CODE = '/api/backend/v1/user/member/nextcode', //下一个系统户口号
    SUB_ADD = '/api/backend/v1/user/member/sub/add', //给下级代理新增
    ADD_SCORE = '/api/backend/v1/user/member/addscore', //上分
    LOWER_SCORE = '/api/backend/v1/user/member/lowerscore', //下分
    GET_PARENTS = '/api/backend/v1/user/member/parents',
}

// 登录
export const login = (data: LoginParams) =>
    deffHttp.post<LoginResult>(
        {
            url: Api.LOGIN,
            data,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );
export const userInfo = () =>
    deffHttp.get<UserInfoResult>(
        {
            url: Api.USER_INFO,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );
//
export const changePassword = (data: ChangePasswordParams) =>
    deffHttp.post<ChangePasswordResult>(
        {
            url: Api.CHANGE_PASSWORD,
            data,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );
//
export const loginOut = () =>
    deffHttp.get<LoginOutResult>(
        {
            url: Api.LOGIN_OUT,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );
// 纵览
export const statistics = (data: StatisticsParams) =>
    deffHttp.post<StatisticsResult>(
        {
            url: Api.STATISTICS,
            data,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );
export const memberList = (data: MemberParams) =>
    deffHttp.post<MemberResult>(
        {
            url: Api.MEMBER_LIST,
            data,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );

export const memberAdd = (data: MemberAddParams) =>
    deffHttp.post<MemberAddResult>(
        {
            url: Api.MEMBER_ADD,
            data,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );
export const commission = (data: { member_code: string }) =>
    deffHttp.post<CommissionResult>(
        {
            url: Api.COMMISSION,
            data,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );
// 查询下线详情
export const memberDetail = (data: { member_code: string }) =>
    deffHttp.post<MemberDetailResult>(
        {
            url: Api.MEMBER_DETAIL,
            data,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );
// NEXT_CODE
export const nextCode = (data: { member_code: string }) =>
    deffHttp.post<{ code: number; data: string }>(
        {
            url: Api.NEXT_CODE,
            data,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );
// MEMBER_EDIT
export const memberEdit = (data: MemberEditParams) =>
    deffHttp.post<{ code: number; data: string }>(
        {
            url: Api.MEMBER_EDIT,
            data,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );

// SUB_ADD
export const subAdd = (data: SubAddParams) =>
    deffHttp.post<{ code: number; data: string }>(
        {
            url: Api.SUB_ADD,
            data,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );

// ADD_SCORE
export const addScore = (data: AddScoreParams) =>
    deffHttp.post<{ code: number; data: string }>(
        {
            url: Api.ADD_SCORE,
            data,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );

//
export const lowerScore = (data: LowerScoreParams) =>
    deffHttp.post<{ code: number; data: string }>(
        {
            url: Api.LOWER_SCORE,
            data,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );

//
export const getParents = (data: { member_code: string }) =>
    deffHttp.post<{ code: number; data: string }>(
        {
            url: Api.GET_PARENTS,
            data,
        },
        {
            errorMessageMode: 'message',
            withToken: true,
        },
    );

// export const currencyList = () =>
//     deffHttp.post<CurrencyResult>(
//         {
//             url: Api.CURRENCY_LIST,
//             data: {},
//         },
//         {
//             errorMessageMode: 'message',
//             withToken: true,
//         },
//     );
