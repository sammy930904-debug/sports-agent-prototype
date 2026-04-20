import { useSetRecoilState } from 'recoil';
import { setStorage } from '@/utils/storage';
import { commonState } from './atoms';
import { DetailPageInfo } from './types';

export const useSetDetailPageInfo = () => {
    const setPageInfo = useSetRecoilState(commonState);

    return (info: DetailPageInfo) => {
        setStorage('detailPageInfo', info);
        setPageInfo((prev) => ({
            ...prev,
            detailPageInfo: info,
        }));
    };
};

export const useSetShowNotice = () => {
    const setPageInfo = useSetRecoilState(commonState);

    return (show: boolean) => {
        setStorage('showNotice', show ? '1' : '0');
        setPageInfo((prev) => ({
            ...prev,
            showNotice: show,
        }));
    };
};
