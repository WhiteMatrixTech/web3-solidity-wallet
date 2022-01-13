import { AbiItem, AbiInput, AbiOutput } from 'web3-utils';
export declare class AbiHelper {
    private web3;
    constructor();
    validAndParseArgs(abiInputs: AbiInput[], args: Record<string, unknown>): string[];
    encodeParameters(abiInputs: AbiInput[], args: Record<string, unknown>): string;
    encodeFunctionCall(abiInputs: AbiInput[], jsonInterface: AbiItem, args: Record<string, unknown>): string;
    getFullTypesArray(inputs: AbiInput[]): (string | {
        [x: string]: {
            [key: string]: any;
        };
    })[];
    makeOutputMeaningful(output: AbiOutput[], _results: Record<string, any>): any[];
    private validAndParseArg;
    private getTupleType;
    private meaningTupleOutput;
}
