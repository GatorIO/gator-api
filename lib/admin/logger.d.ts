export declare enum Levels {
    fatal = 0,
    error = 1,
    warn = 2,
    info = 3,
    trace = 4
}
export declare function createEntry(level: Levels, items: any): Promise<void>;
export declare function fatal(...items: any[]): void;
export declare function error(...items: any[]): void;
export declare function warn(...items: any[]): void;
export declare function info(...items: any[]): void;
export declare function trace(...items: any[]): void;
