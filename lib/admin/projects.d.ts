export declare class Permission {
    id: number;
    name: string;
    description: string;
    constructor(id: number, name: string, description?: string);
}
export declare class Project {
    id: number;
    accountId: number;
    name: string;
    enabled: boolean;
    data: any;
}
export declare function get(params: any): Promise<Array<Project>>;
export declare function create(params: any): Promise<Project>;
