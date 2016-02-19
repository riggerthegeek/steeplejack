/**
 * InjectDecorator
 */

declare module ISteeplejack {

    export interface IInjectDecorator {
        name: string;
        deps?: string[];
        factory?: boolean;
    }

}
