import { selector } from 'recoil';
import { userState } from './atoms';

export const selectorToken = selector({
    key: 'tokenState',
    get: ({ get }) => {
        const state = get(userState);
        return state.token;
    },
});
