/*
    Application settings interface - these need to be populated in the host application
 */
interface ISettings {
    appName: string;
    moduleId: number;

    nodeHost: string;
    nodePort: number;
    nodeUrl: string;

    apiUrl: string;
    apiVersion: string;
}

