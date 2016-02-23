/**
 * InjectDecorator
 */

export interface IInjectDecorator {
    name: string;
    deps?: string[];
    factory?: boolean;
}
