"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultAbiHelper = exports.We3SolidityWalletInst = exports.AbiHelper = void 0;
const AbiHelper_1 = require("./utils/AbiHelper");
Object.defineProperty(exports, "AbiHelper", { enumerable: true, get: function () { return AbiHelper_1.AbiHelper; } });
const defaultAbiHelper = new AbiHelper_1.AbiHelper();
exports.defaultAbiHelper = defaultAbiHelper;
