

declare class Chain {
    constructor(config: object | undefined, training: object | Array<string> | string | undefined);
    order: number;
    type: Function;
    stringType: string;
    train(training: object | Array<string> | string): void;
    doesStateExist(state: string):boolean;
    configOutput(config: object): void;
    getNgrams(): Array<string>;
    generate(config: object): Array<string>;
}

export = Chain;