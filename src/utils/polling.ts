interface _Polling {
    interval?: number; // 轮询间隔
    isPolling: boolean; // 是否正在轮询
    start(callback: Function): void; // 开始轮询
    stop(): void; // 停止轮询
    poll(callback: Function): void; // 执行单次轮询
    timerId: NodeJS.Timeout | null;
}
class Polling implements _Polling {
    constructor(interval = 5000) {
        this.interval = interval;
        this.isPolling = false;
        this.timerId = null;
    }
    timerId: NodeJS.Timeout | null;
    interval: number;
    isPolling: boolean;

    // 开始轮询
    start = (callback: Function) => {
        if (this.isPolling) {
            console.warn('已经在轮询中了');
            return;
        }
        this.isPolling = true;
        this.poll(callback);
    };

    // 停止轮询
    stop = () => {
        this.isPolling = false;
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    };

    // 执行单次轮询
    poll = (callback: Function) => {
        if (!this.isPolling) return;

        try {
            callback();
        } catch (error) {
            console.log(error);
        }

        this.timerId = setTimeout(() => this.poll(callback), this.interval);
    };
}

export default Polling;
