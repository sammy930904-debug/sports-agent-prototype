import type { AxiosResponse } from 'axios';
import { ResponseData } from '@/types/common/global';

export const errorData = (res: AxiosResponse<ResponseData<any>>) => {
    return {
        data: null,
        msg: res.data.msg,
        code: res.data.code,
    };
};
