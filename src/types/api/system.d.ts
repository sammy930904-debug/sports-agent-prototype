interface MenuItem {
    menu_id?: number;
    menu_name?: string;
    parent_id?: number;
    order_num?: number;
    path?: string; //组件路径
    normal?: string;
    menu_type?: string; //组件类型
    menu_location?: string;
    icon?: string; //按钮标识
    created_at?: number; //创建时间
    updated_at?: number;
    created_name?: string;
    updated_name?: string; // 操作人
    children?: null;
}

interface MenuListResult {
    data?: MenuItem[];
}

interface MenuListParams {
    menu_name?: string;
}

interface DepartMenusParams {
    id: number;
}

interface DepartMenuItem {
    menu_id?: string;
    menu_name?: string;
    parent_id?: number;
    order_num?: number;
    path?: string;
    normal?: string;
    menu_type?: string;
    menu_location?: string;
    icon?: string;
    created_at?: number;
    updated_at?: number;
    created_name?: string;
    updated_name?: string;
    children?: DepartMenuItem[] | null;
}

interface DepartMenusResult {
    state?: boolean;
    data?: DepartMenuItem[];
}

interface DepartListParams {
    id?: string;
    department_name?: string;
    updated_name?: string;
    status?: boolean;
}

interface DepartListItem {
    id?: number; // 非必须, 角色ID
    created_at?: number; // 非必须, 创建时间
    updated_at?: number; // 非必须, 更新时间
    department_name?: string; // 非必须, 角色名称
    member_nums?: number; // 非必须, 角色人数
    status?: number; // 非必须, 状态（1: 正常, 2: 禁用）
    created_name?: string; // 非必须, 创建人
    updated_name?: string; // 非必须, 更新人
    parent_id?: number; // 非必须, 父级角色ID
    parent_name?: string; // 非必须, 父级角色名称
}

interface DepartListResult {
    state?: boolean; // 非必须, 请求状态
    data?: DepartListItem[]; // 非必须, 返回数据的数组，每个元素是一个角色对象
}

interface DepartCreateParams {
    department_name?: string;
    is_merchant?: number;
    menu_ids?: string;
    status?: number;
    remark?: string;
    parent_id: number;
    parent_name: string;
}

interface DepartUpdateParams {
    id?: string;
    department_name?: string;
    menu_ids?: string;
    status?: number;
    remark?: string;
}

interface MenuCreateParams {
    parent_id?: number; //上级菜单
    menu_name?: string; //按钮名称
    normal?: string;
    menu_type?: string; //菜单类型  M菜单 B按钮
    menu_location?: string;
    path?: string; //按钮路径
    icon?: string; //按钮标识
    opcode?: number;
}

interface MenuItem {
    menu_id?: number;
    menu_name?: string;
    parent_id?: number;
    order_num?: number;
    path?: string;
    normal?: string;
    menu_type?: string;
    menu_location?: string;
    icon?: string;
    created_at?: number;
    updated_at?: number;
    created_name?: string;
    updated_name?: string;
    children?: MenuItem[] | null;
}

interface CommonResult {
    state?: boolean;
    data?: any | MenuItem[];
}

// 账号管理-新增账号参数
interface AdminCreateParams {
    admin_id?: string;
    user_name?: string;
    state?: number;
    tel?: string;
    login_name?: string;
    department_id?: number;
    department_name?: string;
    password?: string;
    g_code?: string;
}

// 账号管理-账号列表参数
interface AdminListParams {
    admin_id?: string;
    state?: number;
    login_name?: string;
    department_id?: number;
    department_title_id?: string;
    created_at?: number;
    created_name?: string;
    time_type?: number;
    begin_time?: number;
    end_time?: number;
    page?: number;
    size?: number;
}

interface AdminListItem {
    admin_id?: string;
    created_at?: number;
    created_name?: string;
    updated_at?: number;
    user_name?: string;
    login_name?: string;
    department_id?: number;
    department_name?: string;
    tel?: string;
    last_login_at?: number;
    last_login_ip?: string;
    state?: number;
}

interface AdminListResult {
    state?: boolean;
    data?: AdminListItem[];
}

interface UpdateMenuParams {
    menu_id?: number;
    parent_id?: number;
    menu_name?: string;
    normal?: string;
    menu_type?: string;
    menu_location?: string;
    path?: string;
    icon?: string;
    opcode?: number;
}

interface UpdateMenuResponse {
    state?: boolean;
    data?: null;
}

// 删除菜单请求参数接口
interface DeleteMenuParams {
    menu_id: number; // 菜单ID
}
// 删除菜单响应数据接口
interface DeleteMenuResponse {
    state?: boolean;
    data?: null;
}

interface UpdateAdminParams {
    id?: string;
    user_name?: string;
    password?: string;
    department_id?: string;
    department_name?: string;
    tel?: string;
    state?: number;
}

interface UpdateAdminResult {
    state?: boolean;
    data?: string;
}

// 定义返回数据的接口
interface AdminLogListResult {
    state?: boolean;
    data?: {
        list: Array<{
            id?: string;
            ext_id?: string;
            admin_name?: string;
            log_type?: number;
            time?: number;
            ip?: string;
            ip_address?: string;
            context?: string;
        }>;
        total?: number;
    };
}

interface GetGamesListParams {
    id?: string;
    game_type?: string;
    game_code?: string;
    game_name?: string;
    state?: number;
    line_game_state?: number;
    line_game_id?: string;
    current?: number;
    pageSize?: number;
}

interface GameListItem {
    id?: number;
    game_type?: string;
    game_code?: string;
    game_name?: string;
    state?: number;
    return_rate?: number;
    update_name?: string;
    update_at?: number;
    sort_num?: number;
}

interface GetGamesListResponse {
    state?: boolean;
    data?: {
        d?: GameListItem[];
        t?: number;
    };
}

interface UpdateDepartStateParams {
    id?: string;
    status?: number;
}

interface ResetPasswordParams {
    password?: string;
}

interface ResetPasswordResponse {
    state?: boolean;
    data?: null;
}

interface GetIPWhiteListParams {
    ip?: string;
    current?: number;
    pageSize?: number;
}

// Response structure
interface IPWhiteListItem {
    id?: string;
    ip?: string;
    ip_address?: string;
    login_name?: string;
    created_login_name?: string;
    remark?: string;
    created_at?: number;
    updated_at?: number;
    t?: number;
}
interface GetIPWhiteListResponse {
    d: IPWhiteListItem[];
}
interface CreateIpWhiteParams {
    ip?: string;
    remark?: string;
}

interface CreateIpWhiteResponse {
    state: boolean;
    data: null;
}

// 参数类型
interface DeleteIpWhiteParams {
    id?: string;
}

// 返回数据类型
interface DeleteIpWhiteResponse {
    state?: boolean; // 非必须
    data?: null; // 非必须
}

interface UserListParams {
    user_name?: string;
    flag?: number;
    is_test?: number;
    merchant_code?: string;
    online_flag?: number;
    status?: number;
    currency_id?: number;
    current?: number;
    pageSize?: number;
}

interface UserListItem {
    user_id?: number;
    user_name?: string;
    flag?: number;
    lastlogondate?: number;
    lastlogondevice?: string;
    register_ip?: string;
    create_at?: number;
    mode?: number;
    is_test?: number;
    nickname?: string;
    avatar?: number;
    merchant_id?: number;
    merchant_code?: string;
    merchant_name?: string;
    online_flag?: number;
    logontimes?: number;
    status?: number;
    remark?: string;
    zone?: number;
    currency_id?: number;
    total_bet?: number;
    total_win?: number;
    last_bet_time?: number;
    t?: number;
}

interface UserListResponse {
    d?: UserListItem[];
}

interface DeleteAdminParams {
    id?: number;
}

interface DeleteAdminResponse {
    state?: boolean;
    data?: string;
}

interface SwitchAdminOptParams {
    admin_id: string;
    is_open: number;
}

interface SwitchAdminOptResult {
    state: boolean;
    data: string;
}

interface ShowAdminOptUrlParams {
    admin_id: string;
}

interface ShowAdminOptUrlResult {
    state: boolean;
    data: {
        url: string;
        name: string;
        secret: string;
    };
}

// 操作日志列表参数
interface OperatingLogListParams {
    current?: number;
    pageSize?: number;
    operator?: string; // 操作人
    modules?: string; // 操作模块
    start_time?: number;
    end_time?: number;
}

// 操作日志列表项
interface OperatingLogListItem {
    id: number;
    operator: string;
    role: string;
    modules: string;
    business: string;
    ip: string;
    data: string;
    created_at: number;
}

// 操作日志列表结果
interface OperatingLogListResult {
    d: OperatingLogListItem[];
    t: number;
}
