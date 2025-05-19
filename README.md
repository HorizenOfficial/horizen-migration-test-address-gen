## Horizen to Base migration test address generator

These scripts can be used to generate and fund Horizen 1 addresses that can be used to test claiming of funds with the ZENDBackupVault EVM smart contract.

Random seed phrases are generated from which Horizen 1 private keys, compressed and uncompressed addresses and public keys are derived. An Ethereum address and keys are derived from the same seed phrase.
This address is then used to deterministically derive Horizen 1 address that can be used for the claimDirect and claimDirectMultisig smart contract methods.
The claimDirectMultisig address is constructed from the `"pubKeyHorizenCompressed"` public/private key pair and the Ethereum address.


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
    "mnemonicPhrase": "cereal bike alarm double require school picture gift evolve brother party improve hip melt minimum path pistol quantum foot harsh sea fantasy level reflect",
    "network": "testnet",
    "data": [
      {
        "derivationPathHorizen": "m/44'/121'/0'/0/0",
        "rawPrivKeyHorizen": "7b3f2e4e17c93c7f1430c6bfcc41cbadbd95c3eff2cae75877043c59c7e8177b",
        "WIFPrivKeyHorizenCompressed": "cRiH399SJ8qhh32Xz5DwiiWp87d2ddYvJtky55UkVP7JMzCTz5tt",
        "WIFPrivKeyHorizenUncompressed": "92XCLWwUUu5EkWTdURyQGo7JUSWuw4kUwMLUf5e6mwrTbFL4YJB",
        "pubKeyHorizenCompressed": "0385f10f8108446157ae0feb7ffdf3ac5baef68da203f800aa5f065cd324e7d87c",
        "pubKeyHorizenUncompressed": "0485f10f8108446157ae0feb7ffdf3ac5baef68da203f800aa5f065cd324e7d87c4580e0322eb0eb530ee11652f6cd394c22fa818b79dbe8dce3bd5fb3dd5596d9",
        "addressHorizenCompressed": "ztdNgNH1VFJrEVxcxmSNNfAnBSkozVYkKW5",
        "addressHorizenUncompressed": "ztqfZ8fDp1ug2hfUCiWreU9GtEcQbupqa9N",
        "derivationPathEthereum": "m/44'/60'/0'/0/0",
        "privKeyEthereum": "0x3ed205699b2de0a6be9ad44e94d00f56774ae4162a09cef12a2c3f39354f686e",
        "pubKeyEthereum": "0x02b6abeca71876148b8499455133ab4cf90066e95079b8701a640968112d0b423d",
        "addressEthereum": "0xe997A621c4DE1aC888B80bED16CcDdD5FeC8852c",
        "claimDirectEhereumDerivedAddress": "ztWTUiKdiioiWHarMecpGExmfTjDLnCFk2c",
        "claimDirectMultisigEthereumDerivedRedeemScript": "51210385f10f8108446157ae0feb7ffdf3ac5baef68da203f800aa5f065cd324e7d87c210263bfb621d559e4d30599a4926d15aa26d37e91a0bbeb602c2127d34e5c09474152ae",
        "claimDirectMultisigEthereumDerivedAddress": "zrH9asDuZNswHHaXSwNwy2FffKUFpJM3C9N"
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
