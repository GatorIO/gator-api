export declare enum UserStatus {
    active = 0,
    lockedOut = 1
}
export declare class User {
    id: number;
    name: string;
    password: string;
    firstName: string;
    lastName: string;
    status: UserStatus;
    createdDate: Date;
    lastUpdated: Date;
    ipAddress: string;
}
export declare function create(params: any): Promise<any>;
export declare function authorize(accessToken: string): Promise<any>;
