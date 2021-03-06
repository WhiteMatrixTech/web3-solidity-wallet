import { StateMutabilityType, AbiInput, AbiOutput, AbiType } from 'web3-utils';

export declare namespace We3SolidityWallet {
  type Web3AbiType = AbiType | 'receive';
  interface IWeb3SolidityAbiItem {
    anonymous?: boolean;
    constant?: boolean;
    inputs: AbiInput[];
    name?: string;
    outputs?: AbiOutput[];
    payable?: boolean;
    stateMutability: StateMutabilityType;
    type: Web3AbiType;
    gas?: number;
  }

  enum EEventType {
    TRANSACTION_ERROR = 'transactionError',
    TRANSACTION_HASH = 'transactionHash',
    RECEIPT = 'receipt',
    CONFIRMATION = 'confirmation',
  }

  enum EInteractEventType {
    GET_TRANSACTION_ERROR = 'get/transactionError',
    SEND_TRANSACTION_HASH = 'send/transactionHash',
    SEND_RECEIPT = 'send/receipt',
    SEND_CONFIRMATION = 'send/confirmation',
    CALL_RESULT = 'call/result',
  }
  interface IEvent<T> {
    type: T;
    data?: unknown;
    meta?: unknown;
  }
  interface IEthereumReceipt {
    blockHash: string;
    blockNumber: number;
    contractAddress: string;
    cumulativeGasUsed: number;
    from: string;
    gasUsed: string;
    transactionHash: string;
  }

  interface IWalletAccount {
    address: string;
    balance: number;
    privateKey?: string;
    isValidAddress?: boolean | void;
  }

  interface IWalletState {
    currentChainID: string;
    isBrowserWalletExist: string;
    currentAccounts: IWalletAccount[];
    currentAccount?: IWalletAccount | null;
  }

  interface IWeb3AbiItem {
    anonymous?: boolean;
    constant?: boolean;
    inputs?: AbiInput[];
    name?: string;
    outputs?: AbiOutput[];
    payable?: boolean;
    stateMutability?: StateMutabilityType;
    type: Web3AbiType;
    gas?: number;
  }

  interface AddressTranslator {
    ethAddressToCkbAddress: (ethAddress: string) => string;
    ethAddressToGodwokenShortAddress: (ethAddress: string) => string;
  }

  interface IRpcAddParams {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    iconUrls?: string[];
  }

  /**
   *  CompilerInput follows tha same format of solcjs
   *  https://github.com/ethereum/solc-js
   *  https://solidity.readthedocs.io/en/v0.5.0/using-the-compiler.html#compiler-input-and-output-json-description
   */
  interface ICompilerInput {
    language: 'Solidity';
    settings: any;
    sources: any;
  }

  interface ICompileContractActionData {
    compileArgs: ICompilerInput;
    fileId: string;
  }

  interface IEstimateGasAndCollateralParams {
    from: string;
    nonce?: string;
    to?: string | null;
    constructorArgs: Record<string, unknown>;
    solcCompiledOutput: ISolcSelectedContractOutput;
  }

  interface IEstimateGasAndCollateralResult {
    storageCollateralized: number;
    gasLimit: number;
    gasPrice: number;
    gasUsed: number;
  }

  /*
   * item: according to new filesystem data structure
   *     code: raw content in string
   * path: a string list
   */
  interface ICompiledContract {
    // solcRawOutput: ISolcRawOutput;
    contractName: string;
    fileName: string;
    solcSelectedContractOutput: ISolcSelectedContractOutput;
    path: string;
  }

  interface IWeb3AbiInput {
    name: string;
    type: string;
    components: any;
  }

  interface ISolcSelectedContractOutput {
    abi: IWeb3SolidityAbiItem[];
    evm: {
      bytecode: {
        object: string;
        opcodes: string;
        sourceMap: string;
      };
      gasEstimation: {
        creation: {
          codeDepositCost: string;
          executionCost: string;
          totalCost: string;
        };
      };
    };
  }

  interface ISolcRawOutput {
    contracts: {
      [fileName: string]: {
        [contractName: string]: ISolcSelectedContractOutput;
      };
    };
    errors: any;
    sources: any;
  }

  /**
   *  CompilerOutput
   *  if code = 0 means no errros
   *    data: follows tha same format of solcjs https://github.com/ethereum/solc-js
   *    https://solidity.readthedocs.io/en/v0.5.0/using-the-compiler.html#compiler-input-and-output-json-description
   *  elif code = 1 means something is wrong
   *    data: error message
   */
  interface ICompileContractResult {
    code: number;
    data: ISolcRawOutput | any;
  }

  interface ICompileContractSuccessActionData {
    result: ICompileContractResult;
    fileId: string;
  }

  /**
   * Deploy options passed to Metamask
   * unit only support 'wei' and 'gwei'
   */
  interface IDeployOptions {
    storageLimit?: number;
    gasLimit?: number;
    gasPrice?: string;
    payPrice?: string;
  }

  interface IDeployUiOptions {
    gasLimit: string;
    gasLimitErrorMsg: string;
    unit: string;
    value: string;
    valueErrorMsg: string;
  }

  interface IDeployContractActionData {
    fileName: string;
    contractName: string;
    solcCompiledOutput: ISolcSelectedContractOutput;
    account: IWalletAccount;
    currentChainID: string;
    deployOptions: IDeployOptions;
    constructorArgs: Record<string, unknown>;
    path: string;
  }

  interface IImportDeployedActionData {
    chainId: string;
    abi: IWeb3SolidityAbiItem[];
    contractName: string;
    contractAddress: string;
  }

  /**
   * item: according to new filesystem data structure
   *    code: raw content in string
   */
  interface IDeployedContract {
    deployedInfo: IDeployedInfo;
    path: string;
    error?: string;
  }

  interface IDeployedInfo {
    abi: IWeb3SolidityAbiItem[];
    contractName: string;
    contractAddress: string;
    chainId: string;
    deployActionData?: IDeployContractActionData;
    transactionHash?: string;
    confirmed?: number;
    receipt?: IEthereumReceipt;
  }

  interface IInteractContractActionData {
    interactArgs: Record<string, unknown>;
    contractAddress: string;
    abiEntryIdx: number;
    accountAddress: string;
    abi: IWeb3SolidityAbiItem[];
    chainId: string;
    payableValue?: string;
    account: IWalletAccount | null;
  }

  interface IInteractContractCallSuccessActionData {
    contractAddress: string;
    abiEntryIdx: number;
    result: any;
  }

  interface ICalldataActionData {
    contractName: string;
    contractAddress: string;
    accountAddress: string;
    abi: IWeb3SolidityAbiItem[];
    chainId: string;
    calldata?: string;
    payableValue?: string | number;
    account: IWalletAccount | null;
  }
}
