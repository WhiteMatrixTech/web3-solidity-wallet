/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Web3 from "web3";
import { AbiItem, AbiInput, AbiOutput } from "web3-utils";
import { defaultAbiCoder } from "@ethersproject/abi";

const SolidityStructToJsName = "tuple";

export class AbiHelper {
  private web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  validAndParseArgs(abiInputs: AbiInput[], args: Record<string, string>) {
    const functionArguments: string[] = [];
    if (abiInputs.length === 0) {
      return functionArguments;
    }
    abiInputs.forEach((input) => {
      functionArguments.push(
        this.validAndParseArg(input.type, args[input.name])
      );
    });
    return functionArguments;
  }

  encodeParameters(
    abiInputs: AbiInput[],
    args: Record<string, string>
  ): string {
    const paramsTypes = this.getParamTypeArray(abiInputs);
    const functionArguments: string[] = this.validAndParseArgs(abiInputs, args);
    return defaultAbiCoder.encode(paramsTypes, functionArguments);
  }

  encodeFunctionCall(
    jsonInterface: AbiItem,
    args: Record<string, string>
  ): string {
    const sigHash = this.web3.eth.abi.encodeFunctionSignature(jsonInterface);
    const params = this.encodeParameters(jsonInterface?.inputs || [], args);
    return sigHash + params.slice(2);
  }

  getParamTypeArray(inputs: AbiInput[]) {
    const typesArray = inputs.map((input) =>
      this.getTupleType(input.type, input?.components)
    );
    return typesArray;
  }

  makeOutputMeaningful(outputs: AbiOutput[], execResult: string) {
    const fullOutputType = this.getParamTypeArray(outputs);
    const meaningFulOutput = defaultAbiCoder.decode(fullOutputType, execResult);
    return meaningFulOutput;
  }

  getFullTypesArray(inputs: AbiInput[]) {
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

  private validAndParseArg(argType: string, arg: string) {
    const isBoolType = argType === "bool";
    const isBasicArray = argType.split("[").length - 1 === 1;
    const otherArray = argType.split("[").length - 1 > 1;
    const isArrayType = isBasicArray || otherArray;
    const isStructType = argType.includes(SolidityStructToJsName);

    const argValidFailedError = new Error(
      `Error: invalid ${argType} parameter. Expect ${argType} but got ${arg}`
    );

    let parsedArgs: any;
    try {
      parsedArgs =
        isStructType || isArrayType || isBoolType ? JSON.parse(arg) : arg;
    } catch (err) {
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
        (parsedArgs as any[]).forEach((parsedArg) => {
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

  private validBasicSolidityType(type: string, arg: any) {
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

  private getTupleType(type: string, components?: AbiInput[]) {
    if (!components) {
      return type;
    }
    const typeAndKeywordList: string[] = [];
    components &&
      components.forEach((input) => {
        if (input.type.includes(SolidityStructToJsName)) {
          const internalType = this.getTupleType(input.type, input.components);
          typeAndKeywordList.push(internalType);
        } else {
          typeAndKeywordList.push(input.type);
        }
      });
    const tupleSuffix = type.includes("[]") ? "[]" : "";
    const tupleType = `${SolidityStructToJsName}(${typeAndKeywordList.join(
      ", "
    )})${tupleSuffix}`;
    return tupleType;
  }

  private getTupleTypeObj(inputs?: AbiInput[]) {
    const tupleType: { [key: string]: any } = {};
    inputs &&
      inputs.forEach((input) => {
        if (input.type === SolidityStructToJsName) {
          const internalType = this.getTupleTypeObj(input.components);
          tupleType[input.name] = internalType;
        } else {
          tupleType[input.name] = input.type;
        }
      });
    return tupleType;
  }
}
