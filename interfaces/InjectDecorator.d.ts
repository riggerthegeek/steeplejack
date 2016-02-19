/**
 * InjectDecorator
 */

declare module Steeplejack {

    export interface IInjectDecorator {
        name: string;
        deps?: string[];
        factory?: boolean;
    }

}
