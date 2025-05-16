/// <reference types="vite/client" />

declare module '*.ts'
declare module '*.js'
declare module '*.vert'
declare module '*.frag'
declare module '*?base64' {
    const value: string;
    export = value;
}
