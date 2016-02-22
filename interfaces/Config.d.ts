/**
 * Config.d
 */


declare interface IConfig {
    name: string;
    config: (config: Object) => any;
}
