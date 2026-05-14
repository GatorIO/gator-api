export declare enum AccountStatus {
    active = 0,
    lockedOut = 1
}
export declare class Account {
    id: number;
    name: string;
    createdDate: Date;
    userId: string;
    appId: string;
    status: number;
    ipAddress: string;
}
export declare function get(params: any): Promise<Account>;
export declare function create(params: any): Promise<any>;
export declare function setPartnerId(req: any, partnerId: number): Promise<void>;
