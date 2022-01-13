"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbiHelper = void 0;
const SolidityStructToJsName = "tuple";
class AbiHelper {
    constructor(web3) {
        this.web3 = web3;
    }
    validAndParseArgs(abiInputs, args) {
        const functionArguments = [];
        abiInputs.forEach((input) => {
            functionArguments.push(this.validAndParseArg(input.type, args[input.name]));
        });
        return functionArguments;
    }
    encodeParameters(abiInputs, args) {
        const fullInputsType = this.getFullTypesArray(abiInputs);
        const functionArguments = this.validAndParseArgs(abiInputs, args);
        return this.web3.eth.abi.encodeParameters(fullInputsType, functionArguments);
    }
    encodeFunctionCall(jsonInterface, args) {
        const functionArguments = this.validAndParseArgs(jsonInterface.inputs || [], args);
        return this.web3.eth.abi.encodeFunctionCall(jsonInterface, functionArguments);
    }
    getFullTypesArray(inputs) {
        const typesArray = inputs.map((input) => {
            if (input.type === SolidityStructToJsName) {
                const internalType = this.getTupleType(input.components);
                return {
                    [input.name]: internalType,
                };
            }
            return input.type;
        });
        return typesArray;
    }
    makeOutputMeaningful(output, _results) {
        const meaningFulOutput = output.map((output, i) => {
            if (output.type === SolidityStructToJsName) {
                const internalType = this.meaningTupleOutput(_results[i], output.components);
                return {
                    [output.name || i]: internalType,
                };
            }
            return _results[i];
        });
        return meaningFulOutput;
    }
    validAndParseArg(argType, arg) {
        let finalArgs = arg;
        const initMes = `Error encoding arguments: Error: invalid ${argType} value`;
        if (!arg) {
            throw initMes;
        }
        switch (true) {
            case argType.includes(SolidityStructToJsName): {
                try {
                    finalArgs = JSON.parse(arg);
                }
                catch (err) {
                    console.log("Error encoding arguments:", err);
                    throw initMes;
                }
                break;
            }
            case argType.includes("[]"): {
                try {
                    finalArgs = JSON.parse(arg);
                    if (!Array.isArray(finalArgs)) {
                        throw initMes;
                    }
                }
                catch (err) {
                    console.log("Error encoding arguments:", err);
                    throw initMes;
                }
                break;
            }
            case argType.includes("bool"): {
                if (!["true", "false", true, false].includes(arg)) {
                    throw initMes;
                }
                finalArgs = arg === "true";
                break;
            }
            case argType.includes("address"): {
                if (!this.web3.utils.isAddress(arg)) {
                    throw initMes;
                }
                break;
            }
            default:
                break;
        }
        return finalArgs;
    }
    getTupleType(inputs) {
        const tupleType = {};
        inputs &&
            inputs.forEach((input) => {
                if (input.type === SolidityStructToJsName) {
                    const internalType = this.getTupleType(input.components);
                    tupleType[input.name] = internalType;
                }
                else {
                    tupleType[input.name] = input.type;
                }
            });
        return tupleType;
    }
    meaningTupleOutput(results, outputs) {
        const tupleType = {};
        outputs &&
            outputs.forEach((output, index) => {
                if (output.type === SolidityStructToJsName) {
                    const internalType = this.meaningTupleOutput(results[index], output.components);
                    tupleType[output.name] = internalType;
                }
                else {
                    tupleType[output.name] = results[index];
                }
            });
        return tupleType;
    }
}
exports.AbiHelper = AbiHelper;
