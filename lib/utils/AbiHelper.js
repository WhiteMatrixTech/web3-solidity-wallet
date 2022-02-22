"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbiHelper = void 0;
const isArray_1 = __importDefault(require("lodash/isArray"));
const abi_1 = require("@ethersproject/abi");
const SolidityStructToJsName = "tuple";
class AbiHelper {
    constructor(web3) {
        this.web3 = web3;
    }
    validAndParseArgs(abiInputs, args) {
        const functionArguments = [];
        if (abiInputs.length === 0) {
            return functionArguments;
        }
        abiInputs.forEach((input) => {
            functionArguments.push(this.validAndParseArg(input.type, args[input.name]));
        });
        return functionArguments;
    }
    encodeParameters(abiInputs, args) {
        const paramsTypes = this.getParamTypeArray(abiInputs);
        const functionArguments = this.validAndParseArgs(abiInputs, args);
        return abi_1.defaultAbiCoder.encode(paramsTypes, functionArguments);
    }
    encodeFunctionCall(jsonInterface, args) {
        const sigHash = this.web3.eth.abi.encodeFunctionSignature(jsonInterface);
        const params = this.encodeParameters((jsonInterface === null || jsonInterface === void 0 ? void 0 : jsonInterface.inputs) || [], args);
        return sigHash + params.slice(2);
    }
    getParamTypeArray(inputs) {
        const typesArray = inputs.map((input) => this.getTupleType(input.type, input === null || input === void 0 ? void 0 : input.components));
        return typesArray;
    }
    makeOutputMeaningful(outputs, execResult) {
        const fullOutputType = this.getParamTypeArray(outputs);
        const meaningFulOutput = abi_1.defaultAbiCoder.decode(fullOutputType, execResult);
        return meaningFulOutput;
    }
    getFullTypesArray(inputs) {
        const typesArray = inputs.map((input) => {
            if (input.type === SolidityStructToJsName) {
                const internalType = this.getTupleTypeObj(input.components);
                return {
                    [input.name]: internalType,
                };
            }
            return input.type;
        });
        return typesArray;
    }
    decodeFunctionResult(params) {
        const { abiOutputs, originResult, isOriginBytes = false } = params;
        if (originResult === undefined) {
            return null;
        }
        const Result = [];
        abiOutputs.forEach((abiOutput, index) => {
            let tempVar;
            const tempResult = abiOutputs.length > 1 ? originResult[index] : originResult;
            switch (true) {
                case abiOutput.type.includes("tuple"): {
                    try {
                        if ((0, isArray_1.default)(tempResult)) {
                            tempVar = tempResult.map((resultItem) => this.decodeFunctionResult({
                                abiOutputs: abiOutput.components || [],
                                originResult: resultItem,
                                isOriginBytes,
                            }));
                        }
                    }
                    catch (_a) {
                        tempVar = this.decodeFunctionResult({
                            abiOutputs: abiOutput.components || [],
                            originResult: tempResult,
                            isOriginBytes,
                        });
                    }
                    break;
                }
                case isOriginBytes && abiOutput.type.includes("bytes"): {
                    const hexResult = abi_1.defaultAbiCoder.encode([abiOutput.type], [originResult[index]]);
                    tempVar = this.web3.eth.abi.decodeParameter(abiOutput.type, hexResult);
                    break;
                }
                case abiOutput.type.includes("int"): {
                    tempVar = this.numericalResult(tempResult);
                    break;
                }
                default: {
                    tempVar = abiOutputs.length > 1 ? originResult[index] : originResult;
                    break;
                }
            }
            Result.push(tempVar);
        });
        return Result;
    }
    validAndParseArg(argType, arg) {
        const isBoolType = argType === "bool";
        const isBasicArray = argType.split("[").length - 1 === 1;
        const otherArray = argType.split("[").length - 1 > 1;
        const isArrayType = isBasicArray || otherArray;
        const isStructType = argType.includes(SolidityStructToJsName);
        const argValidFailedError = new Error(`Error: invalid ${argType} parameter. Expect ${argType} but got ${arg}`);
        let parsedArgs;
        try {
            parsedArgs =
                isStructType || isArrayType || isBoolType ? JSON.parse(arg) : arg;
        }
        catch (err) {
            throw argValidFailedError;
        }
        let effective = true;
        switch (true) {
            // 结构体嵌套及复杂数组，不便验证，跳过
            case otherArray:
            case isStructType: {
                effective = true;
                break;
            }
            // 简单类型数组
            case isBasicArray: {
                const arrElementType = argType.substring(0, argType.length - 2);
                parsedArgs.forEach((parsedArg) => {
                    effective = this.validBasicSolidityType(arrElementType, parsedArg);
                    if (!effective) {
                        throw argValidFailedError;
                    }
                });
                break;
            }
            default:
                effective = this.validBasicSolidityType(argType.toString(), parsedArgs);
                if (!effective) {
                    throw argValidFailedError;
                }
                break;
        }
        return parsedArgs;
    }
    validBasicSolidityType(type, arg) {
        let effective = true;
        switch (true) {
            case type.includes("bool"): {
                effective = ["true", "false", true, false].includes(arg);
                break;
            }
            case type.includes("string"): {
                effective = typeof arg === "string";
                break;
            }
            case type.includes("int"):
            case type.includes("uint"): {
                effective = !isNaN(Number(arg));
                break;
            }
            case type.includes("byte"): {
                effective = this.web3.utils.isHexStrict(arg);
                break;
            }
            default:
                break;
        }
        return effective;
    }
    getTupleType(type, components) {
        if (!components) {
            return type;
        }
        const typeAndKeywordList = [];
        components &&
            components.forEach((input) => {
                if (input.type.includes(SolidityStructToJsName)) {
                    const internalType = this.getTupleType(input.type, input.components);
                    typeAndKeywordList.push(internalType);
                }
                else {
                    typeAndKeywordList.push(input.type);
                }
            });
        const tupleSuffix = type.includes("[]") ? "[]" : "";
        const tupleType = `${SolidityStructToJsName}(${typeAndKeywordList.join(", ")})${tupleSuffix}`;
        return tupleType;
    }
    getTupleTypeObj(inputs) {
        const tupleType = {};
        inputs &&
            inputs.forEach((input) => {
                if (input.type === SolidityStructToJsName) {
                    const internalType = this.getTupleTypeObj(input.components);
                    tupleType[input.name] = internalType;
                }
                else {
                    tupleType[input.name] = input.type;
                }
            });
        return tupleType;
    }
    numericalResult(results) {
        // eslint-disable-next-line no-proto
        const isUintArray = results.__proto__.constructor
            .toString()
            .startsWith("function Array()");
        if ((0, isArray_1.default)(results) && isUintArray) {
            return results.map((result) => this.numericalResult(result));
        }
        return Number(results);
    }
}
exports.AbiHelper = AbiHelper;
