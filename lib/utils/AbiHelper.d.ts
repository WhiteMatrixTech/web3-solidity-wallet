import Web3 from "web3";
import { AbiItem, AbiInput, AbiOutput } from "web3-utils";
export declare class AbiHelper {
    private web3;
    constructor(web3: Web3);
    validAndParseArgs(abiInputs: AbiInput[], args: Record<string, string>): string[];
    encodeParameters(abiInputs: AbiInput[], args: Record<string, string>): string;
    encodeFunctionCall(jsonInterface: AbiItem, args: Record<string, string>): string;
    getParamTypeArray(inputs: AbiInput[]): string[];
    makeOutputMeaningful(outputs: AbiOutput[], execResult: string): {
        readonly [key: string]: any;
        readonly [n: number]: any;
        length: number;
        toString(): string;
        toLocaleString(): string;
        concat(...items: ConcatArray<any>[]): any[];
        concat(...items: any[]): any[];
        join(separator?: string | undefined): string;
        slice(start?: number | undefined, end?: number | undefined): any[];
        indexOf(searchElement: any, fromIndex?: number | undefined): number;
        lastIndexOf(searchElement: any, fromIndex?: number | undefined): number;
        every<S extends any>(predicate: (value: any, index: number, array: readonly any[]) => value is S, thisArg?: any): this is readonly S[];
        every(predicate: (value: any, index: number, array: readonly any[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: any, index: number, array: readonly any[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: any, index: number, array: readonly any[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: any, index: number, array: readonly any[]) => U, thisArg?: any): U[];
        filter<S_1 extends any>(predicate: (value: any, index: number, array: readonly any[]) => value is S_1, thisArg?: any): S_1[];
        filter(predicate: (value: any, index: number, array: readonly any[]) => unknown, thisArg?: any): any[];
        reduce(callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: readonly any[]) => any): any;
        reduce(callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: readonly any[]) => any, initialValue: any): any;
        reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: any, currentIndex: number, array: readonly any[]) => U_1, initialValue: U_1): U_1;
        reduceRight(callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: readonly any[]) => any): any;
        reduceRight(callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: readonly any[]) => any, initialValue: any): any;
        reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: any, currentIndex: number, array: readonly any[]) => U_2, initialValue: U_2): U_2;
        find<S_2 extends any>(predicate: (this: void, value: any, index: number, obj: readonly any[]) => value is S_2, thisArg?: any): S_2 | undefined;
        find(predicate: (value: any, index: number, obj: readonly any[]) => unknown, thisArg?: any): any;
        findIndex(predicate: (value: any, index: number, obj: readonly any[]) => unknown, thisArg?: any): number;
        entries(): IterableIterator<[number, any]>;
        keys(): IterableIterator<number>;
        values(): IterableIterator<any>;
        includes(searchElement: any, fromIndex?: number | undefined): boolean;
        flatMap<U_3, This = undefined>(callback: (this: This, value: any, index: number, array: any[]) => U_3 | readonly U_3[], thisArg?: This | undefined): U_3[];
        flat<A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[];
        [Symbol.iterator](): IterableIterator<any>;
    };
    getFullTypesArray(inputs: AbiInput[]): (string | {
        [x: string]: {
            [key: string]: any;
        };
    })[];
    private validAndParseArg;
    private validBasicSolidityType;
    private getTupleType;
    private getTupleTypeObj;
}
