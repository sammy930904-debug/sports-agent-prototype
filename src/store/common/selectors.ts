import { selector } from 'recoil';
import { commonState } from './atoms';

export const selectorDetailPageInfo = selector({
    key: 'detailPageInfoState',
    get: ({ get }) => {
        const state = get(commonState);
        return state.detailPageInfo;
    },
});

export const selectorShowNotice = selector({
    key: 'showNoticeState',
    get: ({ get }) => {
        const state = get(commonState);
        return state.showNotice;
    },
});
