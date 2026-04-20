import type { ErrorMessageMode } from '@/types/expand/axios';
import { createErrorModal, createErrorMsg } from '@/hooks/useMessage';
import i18n from '@/locales';

export function checkStatus(
    status: number,
    errorMessageMode: ErrorMessageMode = 'message',
): void {
    let errMessage = '';

    switch (status) {
        case 400:
            errMessage = i18n.t('1423');
            break;
        case 401:
            errMessage = i18n.t('1424');
            break;
        case 403:
            errMessage = i18n.t('1425');
            break;
        case 404:
            errMessage = i18n.t('1105');
            break;
        case 405:
            errMessage = i18n.t('1426');
            break;
        case 408:
            errMessage = i18n.t('1427');
            break;
        case 500:
            errMessage = i18n.t('1428');
            break;
        case 501:
            errMessage = i18n.t('1429');
            break;
        case 502:
            errMessage = i18n.t('1430');
            break;
        case 503:
            errMessage = i18n.t('1431');
            break;
        case 504:
            errMessage = i18n.t('1432');
            break;
        case 505:
            errMessage = i18n.t('1433');
            break;
        default:
    }
    if (errMessage) {
        if (errorMessageMode === 'modal') {
            createErrorModal(errMessage);
        } else if (errorMessageMode === 'message') {
            createErrorMsg(errMessage);
        }
    }
}
