import { atom } from 'recoil';
import UserToken from '@/common/token';
import { UserStateType } from './types';

const initialState: UserStateType = {
    token: (UserToken.getToken() as string) || '',
};

export const userState = atom<UserStateType>({
    key: 'userState',
    default: initialState,
});

//储存权限按钮
export const buttonPermissionListState = atom<number[]>({
    key: 'buttonPermissionListState',
    default: [],
});
