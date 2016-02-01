// Compiled using typings@0.6.3
// Source: https://raw.githubusercontent.com/typings/typed-proxyquire/e94c99bbac8d350e28edd70471d9460a5534927b/lib/proxyquire.d.ts
declare module 'proxyquire/lib/proxyquire' {
function Proxyquire (): Proxyquire.Request;

module Proxyquire {
  interface Request {
    (module: string, stubs: any): any;
    <T> (module: string, stubs: any): T;

    load (module: string, stubs: any): any;
    load <T> (module: string, stubs: any): T;

    noCallThru(): Request;
    callThru(): Request;

    noPreserveCache(): void;
    preserveCache(): void;
  }
}

export = Proxyquire;
}

// Compiled using typings@0.6.3
// Source: https://raw.githubusercontent.com/typings/typed-proxyquire/e94c99bbac8d350e28edd70471d9460a5534927b/index.d.ts
declare module 'proxyquire/index' {
import Proxyquire = require('proxyquire/lib/proxyquire');

 var proxyquire: Proxyquire.Request;

export = proxyquire;
}
declare module 'proxyquire' {
import main = require('proxyquire/index');
export = main;
}