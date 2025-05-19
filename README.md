## Horizen to Base migration test address generator

These scripts can be used to generate and fund Horizen 1 addresses that can be used to test claiming of funds with the ZENDBackupVault EVM smart contract.

Random seed phrases are generated from which Horizen 1 private keys, compressed and uncompressed addresses and public keys are derived. An Ethereum address and keys are derived from the same seed phrase.
This address is then used to deterministically derive Horizen 1 address that can be used for the claimDirect and claimDirectMultisig smart contract methods.
One claimDirectMultisig address is constructed from the `"pubKeyHorizenCompressed"` public/private key pair and the Ethereum address, another from the `"pubKeyHorizenUncompressed"` public/private key pair and the Ethereum address.


##### Installation:
- `npm ci`
  
##### Address generation usage:
- `node gen-test-addresses.js numSeeds(int) numAddresses(int) testnet(optional, true || false, default false)`
- `npm run gen-test-addresses` will generate 30 seed phrases with 5 addresses each written to `./horizen-migration-test-addresses.json`

##### Sample output:
```
node ./gen-test-addresses.js 1 1 true
[
  {
    "index": 0,
    "mnemonicPhrase": "benefit collect spirit dash piano carpet actor addict meadow lucky antenna another beyond armed paper uncle essence reduce top steel fiction always uncover exclude",
    "network": "testnet",
    "data": [
      {
        "derivationPathHorizen": "m/44'/121'/0'/0/0",
        "rawPrivKeyHorizen": "a4d087bcccf05814d351685a9014cddb3f69ba8e23bebc4b5a3a0844cd58edd4",
        "WIFPrivKeyHorizenCompressed": "cT75a8P8dakWtb5hL9FRTn16MCQaKb6cbheL1QyoyJBm48AH4Xx2",
        "WIFPrivKeyHorizenUncompressed": "92qW8WK9ymoZboEkaLYMx1EANLoaNtE45h2D1YiREfLCo2hf9kW",
        "pubKeyHorizenCompressed": "02d2c2e43aacf35dffa3e996c0fc1f8b79fc2e05ceb832995d91c51f97e6dc186d",
        "pubKeyHorizenUncompressed": "04d2c2e43aacf35dffa3e996c0fc1f8b79fc2e05ceb832995d91c51f97e6dc186db43e4ce3dbb2fc7daa6472b16cc2c595a3680f05d8856d88228bccdcfcc6e928",
        "addressHorizenCompressed": "zto4TMMRx2ThkWFHkPYnn13dc3s2rMApZbk",
        "addressHorizenUncompressed": "ztaYC1bovPsyAQbWKBXDn8GLez7ZYWzaKWn",
        "derivationPathEthereum": "m/44'/60'/0'/0/0",
        "privKeyEthereum": "0x3ac4c41dab7ce92a2b46cfb4c3819157f5c3f2387dcc37e0f59abdbbc1451798",
        "pubKeyEthereum": "0x03ff3008a5f4f476254160a4f9cf950652c4501d03cdabb904712a2d0dbdfecdaf",
        "addressEthereum": "0x75A8Fd44C47228312268B01351dd6276bBad6d2B",
        "claimDirectEhereumDerivedAddress": "ztVeGzgygF3m7nVVk1M9CxfiMLpVHVoc1NN",
        "claimDirectMultisigEthereumDerivedRedeemScriptCompressed": "512102d2c2e43aacf35dffa3e996c0fc1f8b79fc2e05ceb832995d91c51f97e6dc186d21025f2b5ced64fb29e3c47d874a5c34e6b8766e7c2bced01d69683b53b06dd4f78952ae",
        "claimDirectMultisigEthereumDerivedAddressCompressed": "zrPPnkXNfioKFRyho4KMNEdpFVP9YX5UPkL",
        "claimDirectMultisigEthereumDerivedRedeemScriptUncompressed": "514104d2c2e43aacf35dffa3e996c0fc1f8b79fc2e05ceb832995d91c51f97e6dc186db43e4ce3dbb2fc7daa6472b16cc2c595a3680f05d8856d88228bccdcfcc6e92821025f2b5ced64fb29e3c47d874a5c34e6b8766e7c2bced01d69683b53b06dd4f78952ae",
        "claimDirectMultisigEthereumDerivedAddressUncompressed": "zrR9f3wGTYj1oet5n8ejByEVev6VJEUoRa1"
      }
    ]
  }
]
```

##### Funding the addresses:
- Use `./fundAddresses.sh $input_filename.json` to send 0.1 ZEN to each generated address
- Adjust `from_address=`, `zen_cli=` and `network=` variables in the script to your environment
- Requires a fully synced zend node with sufficient balance in `from_address=` and `jq`

##### Checking address balances:
- Use `checkAddressesFunded.sh $input_filename.json` to check the balance of the funded addresses on the block explorer
- Adjust the `network=` variable in the script to your environment
- Requires `jq`
