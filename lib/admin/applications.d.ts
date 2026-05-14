export declare class Permission {
    id: string;
    description: string;
    constructor(id: string, description?: string);
}
export declare class Application {
    id: number;
    name: string;
    description: string;
    host: string;
    commissions: boolean;
    permissions: Array<Permission>;
    reporting: {
        apiEndpoint: string;
    };
}
export declare let items: Array<Application>;
export declare function getAll(): Promise<Array<Application>>;
