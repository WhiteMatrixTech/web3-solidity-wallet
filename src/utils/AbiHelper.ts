/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Web3 from 'web3';
import { AbiItem, AbiInput, AbiOutput } from 'web3-utils';

const SolidityStructToJsName = 'tuple';

export class AbiHelper {
  private web3: Web3;

  constructor() {
    this.web3 = new Web3(Web3.givenProvider);
  }

  validAndParseArgs(abiInputs: AbiInput[], args: Record<string, unknown>) {
    const functionArguments: string[] = [];
    abiInputs.forEach((input) => {
      functionArguments.push(this.validAndParseArg(input.type, args[input.name]));
    });
    return functionArguments;
  }

  encodeParameters(abiInputs: AbiInput[], args: Record<string, unknown>): string {
    const fullInputsType = this.getFullTypesArray(abiInputs);
    const functionArguments: string[] = this.validAndParseArgs(abiInputs, args);
    return this.web3.eth.abi.encodeParameters(fullInputsType, functionArguments);
  }

  encodeFunctionCall(abiInputs: AbiInput[], jsonInterface: AbiItem, args: Record<string, unknown>): string {
    const functionArguments: string[] = this.validAndParseArgs(abiInputs, args);
    return this.web3.eth.abi.encodeFunctionCall(jsonInterface, functionArguments);
  }

  getFullTypesArray(inputs: AbiInput[]) {
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

  makeOutputMeaningful(output: AbiOutput[], _results: Record<string, any>) {
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

  private validAndParseArg(argType: string, arg: any) {
    let finalArgs = arg;
    const initMes = `Error encoding arguments: Error: invalid ${argType} value`;
    if (!arg) {
      throw initMes;
    }
    switch (true) {
      case argType.includes(SolidityStructToJsName): {
        try {
          finalArgs = JSON.parse(arg);
        } catch (err) {
          console.log('Error encoding arguments:', err);
          throw initMes;
        }
        break;
      }
      case argType.includes('[]'): {
        try {
          finalArgs = JSON.parse(arg);
          if (!Array.isArray(finalArgs)) {
            throw initMes;
          }
        } catch (err) {
          console.log('Error encoding arguments:', err);
          throw initMes;
        }
        break;
      }

      case argType.includes('bool'): {
        if (!['true', 'false', true, false].includes(arg)) {
          throw initMes;
        }
        finalArgs = arg === 'true';
        break;
      }

      case argType.includes('address'): {
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

  private getTupleType(inputs?: AbiInput[]) {
    const tupleType: { [key: string]: any } = {};
    inputs &&
      inputs.forEach((input) => {
        if (input.type === SolidityStructToJsName) {
          const internalType = this.getTupleType(input.components);
          tupleType[input.name] = internalType;
        } else {
          tupleType[input.name] = input.type;
        }
      });
    return tupleType;
  }

  private meaningTupleOutput(results: any[], outputs?: AbiOutput[]) {
    const tupleType: { [key: string]: any } = {};
    outputs &&
      outputs.forEach((output, index) => {
        if (output.type === SolidityStructToJsName) {
          const internalType = this.meaningTupleOutput(results[index], output.components);
          tupleType[output.name] = internalType;
        } else {
          tupleType[output.name] = results[index];
        }
      });
    return tupleType;
  }
}
