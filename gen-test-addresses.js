#!/usr/bin/env node

const path = require("node:path");
const bip32 = require("bip32");
const bip39 = require("bip39");
const zencashjs = require("zencashjs");
const ethers = require("ethers");
const createHash = require("create-hash");
const bs58check = require("bs58check");

if (process.argv.length < 4) {
  console.error(
    `Usage: ${path.basename(process.argv[0])} ${path.basename(process.argv[1])} numSeeds(int) numAddresses(int) testnet(optional, true || false, default false)`,
  );
  process.exit(1);
}

const numSeeds = process.argv[2];
const numAddresses = process.argv[3];
const testnet = process.argv[4] === "true";

const bip32Network = {
  mainnet: {
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    wif: 0x80,
  },
  testnet: {
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    wif: 0xef,
  },
};
const derivationPrefixHorizen = "m/44'/121'/0'/0";
const derivationPrefixEthereum = "m/44'/60'/0'/0";
const wif = testnet
  ? zencashjs.config.testnet.wif
  : zencashjs.config.mainnet.wif;
const pubKeyHash = testnet
  ? zencashjs.config.testnet.pubKeyHash
  : zencashjs.config.mainnet.pubKeyHash;
const scriptHash = testnet
  ? zencashjs.config.testnet.scriptHash
  : zencashjs.config.mainnet.scriptHash;

function ethAddressToHexString(ethereumAddress) {
  let validEthAddress;
  try {
    validEthAddress = ethers.getAddress(ethereumAddress);
  } catch (error) {
    console.error(
      "Error: ethAddressToHexString() invalid Etherum Address passed.",
    );
    process.exit(1);
  }
  return validEthAddress.slice(2);
}

function deriveClaimDirectHorizenAddress(prefix, ethereumAddress) {
  const ethAddressHexString = ethAddressToHexString(ethereumAddress);
  return bs58check.encode(
    Buffer.from(
      prefix +
        createHash("rmd160")
          .update(
            createHash("sha256")
              .update(Buffer.from(ethAddressHexString, "hex"))
              .digest(),
          )
          .digest("hex"),
      "hex",
    ),
  );
}

function deriveClaimDirectMultisigHorizenPubKey(ethereumAddress) {
  const compressedPubKeyIdentifier = "02";
  const ethAddressHexString = ethAddressToHexString(ethereumAddress);
  return (
    compressedPubKeyIdentifier +
    createHash("sha256")
      .update(Buffer.from(ethAddressHexString, "hex"))
      .digest("hex")
  );
}

function createClaimDirectMultisigRedeemScript(pubKey, derivedPubKey) {
  return zencashjs.address.mkMultiSigRedeemScript(
    [pubKey, derivedPubKey],
    1,
    2,
  );
}

const results = [];
for (let j = 0; j < numSeeds; ++j) {
  let mnemonicPhrase = bip39.generateMnemonic(256); // 24 word mnemonicPhrase
  let seed = bip39.mnemonicToSeed(mnemonicPhrase);
  let hdNodeHorizen = bip32.fromSeed(
    seed,
    testnet ? bip32Network.testnet : bip32Network.mainnet,
  );
  let hdNodeEthereum = ethers.HDNodeWallet.fromSeed(seed);
  let data = [];
  for (let i = 0; i < numAddresses; ++i) {
    // Horizen Addresses
    let derivationPathHorizen = derivationPrefixHorizen + "/" + i;
    let hdNodeHorizenDerived = hdNodeHorizen.derivePath(derivationPathHorizen);
    let rawPrivKeyHorizen = hdNodeHorizenDerived.privateKey.toString("hex");
    let WIFPrivKeyHorizenCompressed = zencashjs.address.privKeyToWIF(
      rawPrivKeyHorizen,
      true,
      wif,
    );
    let WIFPrivKeyHorizenUncompressed = zencashjs.address.privKeyToWIF(
      rawPrivKeyHorizen,
      false,
      wif,
    );
    let pubKeyHorizenCompressed = zencashjs.address.privKeyToPubKey(
      rawPrivKeyHorizen,
      true,
    );
    let pubKeyHorizenUncompressed = zencashjs.address.privKeyToPubKey(
      rawPrivKeyHorizen,
      false,
    );
    let addressHorizenCompressed = zencashjs.address.pubKeyToAddr(
      pubKeyHorizenCompressed,
      pubKeyHash,
    );
    let addressHorizenUncompressed = zencashjs.address.pubKeyToAddr(
      pubKeyHorizenUncompressed,
      pubKeyHash,
    );
    // Ethereum Addresses
    let derivationPathEthereum = derivationPrefixEthereum + "/" + i;
    let hdNodeEthereumDerived = hdNodeEthereum.derivePath(derivationPathEthereum);
    let privKeyEthereum = hdNodeEthereumDerived.privateKey;
    let pubKeyEthereum = hdNodeEthereumDerived.publicKey;
    let addressEthereum = hdNodeEthereumDerived.address;
    // claimDirect derived Addresses
    let claimDirectEhereumDerivedAddress = deriveClaimDirectHorizenAddress(
      pubKeyHash,
      addressEthereum,
    );
    // claimDirectMultisig derived Addresses
    let claimDirectMultisigEthereumDerivedRedeemScript =
      createClaimDirectMultisigRedeemScript(
        pubKeyHorizenCompressed,
        deriveClaimDirectMultisigHorizenPubKey(addressEthereum),
      );
    let claimDirectMultisigEthereumDerivedAddress =
      zencashjs.address.multiSigRSToAddress(
        claimDirectMultisigEthereumDerivedRedeemScript,
        scriptHash,
      );
    data.push({
      derivationPathHorizen: derivationPathHorizen,
      rawPrivKeyHorizen: rawPrivKeyHorizen,
      WIFPrivKeyHorizenCompressed: WIFPrivKeyHorizenCompressed,
      WIFPrivKeyHorizenUncompressed: WIFPrivKeyHorizenUncompressed,
      pubKeyHorizenCompressed: pubKeyHorizenCompressed,
      pubKeyHorizenUncompressed: pubKeyHorizenUncompressed,
      addressHorizenCompressed: addressHorizenCompressed,
      addressHorizenUncompressed: addressHorizenUncompressed,
      derivationPathEthereum: derivationPathEthereum,
      privKeyEthereum: privKeyEthereum,
      pubKeyEthereum: pubKeyEthereum,
      addressEthereum: addressEthereum,
      claimDirectEhereumDerivedAddress: claimDirectEhereumDerivedAddress,
      claimDirectMultisigEthereumDerivedRedeemScript:
        claimDirectMultisigEthereumDerivedRedeemScript,
      claimDirectMultisigEthereumDerivedAddress:
        claimDirectMultisigEthereumDerivedAddress,
    });
  }
  results.push({
    index: j,
    mnemonicPhrase: mnemonicPhrase,
    network: testnet ? "testnet" : "mainnet",
    data: data,
  });
}
console.info(JSON.stringify(results, null, 2));
