export interface CommonStateType {
    detailPageInfo: DetailPageInfo;
    showNotice: boolean;
}

export interface DetailPageInfo {
    path: string;
    title: string;
    backPath: string;
}
