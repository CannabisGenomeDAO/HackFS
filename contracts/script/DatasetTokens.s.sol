// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/DatasetTokens.sol";

contract DatasetTokensScript is Script {
  function setUp() public {}

  function run() public {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    vm.startBroadcast(deployerPrivateKey);

    DatasetTokens datasetTokens = new DatasetTokens();

    vm.stopBroadcast();
  }
}
