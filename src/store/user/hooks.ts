import { useRecoilState, useSetRecoilState } from 'recoil';
import UserToken from '@/common/token';
import { buttonPermissionListState, userState } from './atoms';

export const useSetToken = () => {
    const setToken = useSetRecoilState(userState);
    return (value: string | null) => {
        UserToken.setToken(value ?? '');
        setToken((prev) => ({
            ...prev,
            token: value,
        }));
    };
};

export const useDelToken = () => {
    const setToken = useSetRecoilState(userState);
    return () => {
        UserToken.clearToken();
        setToken((prev) => ({
            ...prev,
            token: '',
        }));
    };
};

export const useButtonPermissionList = () => {
    const [buttonPermissionList, setButtonPermissionList] = useRecoilState(
        buttonPermissionListState,
    );
    return {
        buttonPermissionList,
        setButtonPermissionList,
    };
};
