import myRequest from './api';

export function userLogin (account: any) {
    return myRequest.post({
        url: '/login',
        data: account
    });
}