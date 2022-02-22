import Web3 from "web3";
import { AbiItem, AbiInput, AbiOutput } from "web3-utils";
export declare class AbiHelper {
    private web3;
    constructor(web3: Web3);
    validAndParseArgs(abiInputs: AbiInput[], args: Record<string, string>): string[];
    encodeParameters(abiInputs: AbiInput[], args: Record<string, string>): string;
    encodeFunctionCall(jsonInterface: AbiItem, args: Record<string, string>): string;
    getParamTypeArray(inputs: AbiInput[]): string[];
    makeOutputMeaningful(outputs: AbiOutput[], execResult: string): import("@ethersproject/abi").Result;
    getFullTypesArray(inputs: AbiInput[]): (string | {
        [x: string]: {
            [key: string]: any;
        };
    })[];
    decodeFunctionResult(params: {
        abiOutputs: AbiOutput[];
        originResult: any[];
        isOriginBytes?: boolean;
    }): unknown[] | null;
    private validAndParseArg;
    private validBasicSolidityType;
    private getTupleType;
    private getTupleTypeObj;
    private numericalResult;
}
