import { Observable } from "rxjs";
import { We3SolidityWallet } from "./type";
import { AbiHelper } from "./utils/AbiHelper";
declare const defaultAbiHelper: AbiHelper;
declare class We3SolidityWalletInst {
    walletId: string;
    walletProvider?: unknown;
    addressTranslator?: We3SolidityWallet.AddressTranslator;
    init: () => Promise<void | Error>;
    fetchNetWork: () => Promise<string>;
    fetchAccount: () => Promise<We3SolidityWallet.IWalletAccount[]>;
    getAccountBalance: (address: string) => Promise<We3SolidityWallet.IWalletAccount>;
    deploy: (data: We3SolidityWallet.IDeployContractActionData) => Observable<We3SolidityWallet.IEvent<We3SolidityWallet.EEventType>>;
    interact: (data: We3SolidityWallet.IInteractContractActionData) => Observable<We3SolidityWallet.IEvent<We3SolidityWallet.EInteractEventType>>;
    estimate?: (estimateData: We3SolidityWallet.IEstimateGasAndCollateralParams) => Promise<We3SolidityWallet.IEstimateGasAndCollateralResult>;
    calldata?: (data: We3SolidityWallet.ICalldataActionData) => Observable<We3SolidityWallet.IEvent<We3SolidityWallet.EInteractEventType>>;
    getChainInfo?: <T>(serviceUrl?: string) => Promise<T>;
    addRpcNetInWallet?: (netRpcOption?: We3SolidityWallet.IRpcAddParams) => Promise<string>;
    setWeb3ConfigInWallet?: (web3Url: string) => void;
    setBlocksToWait?: (blocksToWait: number) => void;
    setInterval?: (interval: number) => void;
    setMaxTimes?: (maxTimes: number) => void;
}
export { AbiHelper, We3SolidityWalletInst, defaultAbiHelper };
