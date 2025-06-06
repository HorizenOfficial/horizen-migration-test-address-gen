#!/usr/bin/env bash
set -eEuo pipefail

mapfile -t addresses < <(jq -rc '.[].data[] | .addressHorizenCompressed,
                                 .addressHorizenUncompressed,
                                 .claimDirectEhereumDerivedAddress,
                                 .claimDirectMultisigEthereumDerivedAddressCompressed,
                                 .claimDirectMultisigEthereumDerivedAddressUncompressed' \
                         "${1:?Error - first argument needs to be a path to a json file generated by gen-test-addresses.js}")

amount="0.1"
network="-testnet"
retcode=0
for address in "${addresses[@]}"; do
  balance="$(jq -rc '.balance' <<<  "$(curl -sk "https://explorer${network}.horizen.io/api/addr/${address}")")"
  status="OK"
  [ "${balance}" != "${amount}" ] && { status="FAIL"; retcode=1; }
  echo "${status} - ${address} - balance is ${balance} ZEN"
done
exit "${retcode}"
