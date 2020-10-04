import { ApiResponse, SerializedChart, GetChartResponse, UserInfo, GetUserInfoResponse } from 'flowcharts-common';

const API_ENDPOINT = 'https://planmaps_api.nikitavbv.com/api/v1/';
export const ASSETS_ENDPOINT = 'https://planmaps_assets.nikitavbv.com/';

export type HttpMethod = 'GET' | 'POST' | 'DELETE';

export const api_request = <T extends ApiResponse> (url: string, method: HttpMethod = 'GET', data?: any, stringifyRequest: boolean = true): Promise<T> => {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open(method, `${API_ENDPOINT}${url}`);

        req.setRequestHeader('x-auth-token', localStorage.authToken);
        req.setRequestHeader('Accept', 'application/json;');

        if (stringifyRequest) {
            const dataAsJson = data !== undefined ? JSON.stringify(data) : undefined;
            if (data !== undefined) {
                req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            }
            req.send(dataAsJson);
        } else {
            req.send(data);
        }

        req.onreadystatechange = () => {
            if (req.readyState == 4 && req.status == 0) {
                reject();
            }
        };

        req.onload = () => {
            try {
                resolve({ status: req.status, ...JSON.parse(req.responseText) } as T);
            } catch(e) {
                resolve({ status: req.status } as T);
            }
        };
     
        req.onabort = reject;
    });
};

export const monitorAssetUpload = (asset: string, onDone: () => void) => {
    const intervalID = setInterval(() => {
        const req = new XMLHttpRequest();
        req.open('GET',ASSETS_ENDPOINT + asset);
        req.send();

        req.onload = () => {
            if (req.status == 200) {
                clearInterval(intervalID);
                onDone();
            }
        };
    }, 1000);
};

export const loadChart = (
    chartId: string,
    onChartLoaded: (chart: SerializedChart) => void,
    onUserLoaded: (user: UserInfo) => void,
    onError: (res: GetChartResponse | GetUserInfoResponse) => void,
) => {
    api_request<GetChartResponse>(`chart/${chartId}`).then((res: GetChartResponse) => {
        if (res.status === 200 && res.chart !== undefined) {
            onChartLoaded(res.chart);

            res.chart.users.forEach(user => loadUserById(user.id, onUserLoaded, onError, onError))
        } else {
            onError(res);
        }
    });
};

export const loadUserById = (
    id: number,
    onUserLoaded: (user: UserInfo) => void,
    onUserNotFound: (res: GetUserInfoResponse) => void,
    onError: (res: GetUserInfoResponse) => void
) => {
    api_request<GetUserInfoResponse>(`user/${id}`).then(res => {
        if (res.status === 200 && res.user !== undefined) {
            onUserLoaded(res.user);
        } else if (res.status === 404) {
            onUserNotFound(res);
        } else {
            onError(res);
        }
    })
};

export const loadUserByUsername = (
    username: string,
    onUserLoaded: (user: UserInfo) => void,
    onUserNotFound: (res: GetUserInfoResponse) => void,
    onError: (res: GetUserInfoResponse) => void
) => {
    api_request<GetUserInfoResponse>(`user/username/${username}`).then(res => {
        if (res.status === 200 && res.user !== undefined) {
            onUserLoaded(res.user);
        } else if (res.status === 404) {
            onUserNotFound(res);
        } else {
            onError(res);
        }
    })
};