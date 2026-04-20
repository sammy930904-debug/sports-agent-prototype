import { isString } from 'lodash';
import { createErrorModal, createErrorMsg } from '@/hooks/useMessage';
import { ContentTypeEnum } from '@/enums/httpEnum';
import log from '@/utils/log';
import UserToken from '@/common/token';
import type { AxiosInterceptor, CreateAxiosOptions } from './axiosConfig';
import { iAxios } from './iAxios';
import { checkStatus } from './axiosStatus';

export const generateTraceId = () => {
    const arr = new Uint8Array(16);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
};
// import { errorData } from './errorConfig';

/**
 * @description:一下所有拦截器请根据自身使用场景更改
 */
const interceptor: AxiosInterceptor = {
    /**
     * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
     */
    requestHook: (res, options) => {
        /**
         * 此处方法是对请求回来的数据进行处理，
         * 根据自己的使用场景更改
         */

        if (res.config.responseType === 'blob') {
            return res;
        }

        const { data } = res;
        const { errorMessageMode } = options;
        if (data) {
            if (data.code !== 10000) {
                if (errorMessageMode === 'modal') {
                    createErrorModal(data.msg);
                } else if (errorMessageMode === 'message') {
                    createErrorMsg(data.msg);
                }
                return data;
            } else {
                return data;
            }
        }
        return data;
    },

    /**
     * @description: 请求失败的错误处理
     */
    requestCatchHook: (e, _options) => {
        return Promise.reject(e);
    },

    /**
     * @description: 请求之前处理config
     */
    beforeRequestHook: (config, options) => {
        const { urlPrefix } = options;
        if (urlPrefix && isString(urlPrefix))
            config.url = `${urlPrefix}${config.url}`;
        return config;
    },

    /**
     * @description: 请求拦截器处理
     */
    requestInterceptors: (config) => {
        const token = UserToken.getToken();
        const { requestOptions } = config;
        const traceId = generateTraceId();
        (config as Recordable).headers.qid = traceId;
        if (requestOptions?.withToken) {
            (config as Recordable).headers.Authorization = `Bearer ${token}`;
            // if (requestOptions?.specialToken)
            //     (config as Recordable).headers.t = requestOptions?.specialToken;
        }
        const lang = localStorage.getItem('i18nextLng') || 'en';
        (config as Recordable).headers['Accept-Language'] = lang;
        return config;
    },

    /**
     * @description: 请求拦截器错误处理
     */
    requestInterceptorsCatch: (error) => {
        log.error('请求拦截错误', error);
        return error;
    },

    /**
     * @description: 响应拦截器处理
     */
    responseInterceptors: (res) => {
        return res;
    },

    /**
     * @description: 响应拦截器错误处理
     */
    responseInterceptorsCatch: (error: any) => {
        log.error('响应拦截错误', error);
        const { response, config } = error || {};
        const status = response ? response.status : null;
        // 检查状态码是否为401
        if (status === 401) {
            UserToken.clearToken();
            // 重定向到登录页，并附加一个查询参数
            window.location.href = `/user/login?sessionExpired=true`;
        }
        const errorMessageMode =
            config.requestOptions.errorMessageMode || 'none';
        checkStatus(response ? response.status : 404, errorMessageMode);
        return response;
    },
};

function createAxios(options?: Partial<CreateAxiosOptions>) {
    return new iAxios({
        ...{
            // 请求时间
            timeout: 30 * 1000,
            // (拦截器)数据处理方式
            interceptor,
            headers: { 'Content-Type': ContentTypeEnum.JSON },
            // 配置项（需要在拦截器中做的处理），下面的选项都可以在独立的接口请求中覆盖
            requestOptions: {
                withToken: true,
                errorMessageMode: 'message',
            },
        },
        ...(options || {}),
    });
}
export const deffHttp = createAxios();
