declare type RefType<T> = T | null;

declare type Recordable<T = any> = Record<string, T>;

export interface ResponseData<T = any> {
    /**
     * 状态
     */
    code: number;

    /**
     * 数据
     */
    data: T;

    /**
     * 消息
     */
    msg: string;
}

export interface CommonList<T = any> {
    /**
     * 实际数据
     */
    d: T[];

    /**
     * 时间戳
     */
    t: number;
}

export interface PageParams {
    page?: number;
    size?: number;
    status?: number;
}

global {
    type Optional<T> = {
        [K in keyof T]?: T[K];
    };
}
