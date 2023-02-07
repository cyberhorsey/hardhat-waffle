"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const util_1 = require("hardhat/internal/core/providers/util");
const plugins_1 = require("hardhat/plugins");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = require("fs-extra");
const helpers_1 = require("./helpers");
describe("Waffle plugin plugin", function () {
    describe("Hardhat's Waffle provider adapter", function () {
        describe("provider.getWallets", function () {
            describe("With hardhat", function () {
                describe("With the default hardhat accounts", function () {
                    (0, helpers_1.useEnvironment)("hardhat-project", "hardhat");
                    it("Should return a wallet for each of the default accounts", function () {
                        const wallets = this.env.waffle.provider.getWallets();
                        chai_1.assert.equal(this.env.network.name, plugins_1.HARDHAT_NETWORK_NAME);
                        const netConfig = this.env.network.config;
                        const accounts = (0, util_1.normalizeHardhatNetworkAccountsConfig)(netConfig.accounts);
                        chai_1.assert.lengthOf(wallets, accounts.length);
                        for (let i = 0; i < wallets.length; i++) {
                            chai_1.assert.equal(wallets[i].privateKey.toLowerCase(), accounts[i].privateKey.toLowerCase());
                        }
                    });
                });
                describe("With customized hardhat accounts", function () {
                    (0, helpers_1.useEnvironment)("hardhat-project-custom-accounts", "hardhat");
                    it("Should return a wallet for each of the custom accounts", function () {
                        const wallets = this.env.waffle.provider.getWallets();
                        const accounts = require(path_1.default.join(process.cwd(), "hardhat.config.js")).networks.hardhat.accounts;
                        chai_1.assert.lengthOf(wallets, accounts.length);
                        for (let i = 0; i < wallets.length; i++) {
                            chai_1.assert.equal(wallets[i].privateKey.toLowerCase(), accounts[i].privateKey.toLowerCase());
                        }
                    });
                });
            });
            describe("Using other network", function () {
                (0, helpers_1.useEnvironment)("hardhat-project");
                it("Should throw an error", function () {
                    chai_1.assert.throws(() => this.env.waffle.provider.getWallets(), "This method only works with Hardhat Network");
                });
            });
            describe("Deprecated getWallets", function () {
                describe("With hardhat", function () {
                    describe("With the default hardhat accounts", function () {
                        (0, helpers_1.useEnvironment)("hardhat-project", "hardhat");
                        it("Should return a wallet for each of the default accounts", function () {
                            const wallets = this.env.waffle.provider.getWallets();
                            chai_1.assert.equal(this.env.network.name, plugins_1.HARDHAT_NETWORK_NAME);
                            const netConfig = this.env.network.config;
                            const accounts = (0, util_1.normalizeHardhatNetworkAccountsConfig)(netConfig.accounts);
                            chai_1.assert.lengthOf(wallets, accounts.length);
                            for (let i = 0; i < wallets.length; i++) {
                                chai_1.assert.equal(wallets[i].privateKey.toLowerCase(), accounts[i].privateKey.toLowerCase());
                            }
                        });
                    });
                });
            });
        });
    });
    describe("Test environment initialization", function () {
        (0, helpers_1.useEnvironment)("hardhat-project", "hardhat");
        it("Should load the Waffle chai matchers", async function () {
            await this.env.run("test");
            // Mocha's exit code is the number of failed tests (up to 255).
            // We expect one failed test ("Should fail", throwing on purpose).
            chai_1.assert.equal(process.exitCode, 1);
            process.exitCode = 0;
        });
    });
    const configs = [
        "default",
        "inject-history",
        "skip-gas",
        "skip-gas-inject-history",
    ];
    const projectDir = process.cwd();
    for (const config of configs) {
        describe(`Test environment initialization with ${config} config`, async function () {
            (0, helpers_1.useEnvironment)(`configs/${config}`, "hardhat");
            it("Should adjust to the config", async function () {
                await (0, fs_extra_1.copy)(`${projectDir}/test/fixture-projects/hardhat-project/contracts`, "./contracts", { recursive: true, overwrite: true });
                await this.env.run("test");
                // Mocha's exit code is the number of failed tests (up to 255).
                // We expect zero failed tests.
                chai_1.assert.equal(process.exitCode, 0);
            });
        });
    }
});
//# sourceMappingURL=index.js.map