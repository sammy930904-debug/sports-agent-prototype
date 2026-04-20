import { atom } from 'recoil';
import { getStorage } from '@/utils/storage';
import { CommonStateType, DetailPageInfo } from './types';

const initialState: CommonStateType = {
    detailPageInfo: (getStorage('detailPageInfo') ?? {}) as DetailPageInfo,
    showNotice:
        getStorage('showNotice') === null
            ? true
            : getStorage('showNotice') === '1',
};

export const commonState = atom<CommonStateType>({
    key: 'commonState',
    default: initialState,
});
