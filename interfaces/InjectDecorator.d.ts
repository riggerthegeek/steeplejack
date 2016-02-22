/**
 * InjectDecorator
 */

declare interface IInjectDecorator {
    name: string;
    deps?: string[];
    factory?: boolean;
}
