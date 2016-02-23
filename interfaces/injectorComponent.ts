/**
 * InjectorComponent
 */

import {IInjectorComponentItem} from "./injectorComponentItem";


export interface IInjectorComponent {
    [key: string]: IInjectorComponentItem;
}
