// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/DatasetTokens.sol";

contract DatasetTokensScript is Script {
  function setUp() public {}

  function run() public {
    uint256 deployPrivateKey = vm.envUint("DEPLOY_PRIVATE_KEY");

    vm.startBroadcast(deployPrivateKey);

    DatasetTokens datasetTokens = new DatasetTokens();

    datasetTokens.createDatasetToken(
      1,
      1 weeks,
      "ipfs://bafkreihynhrbjhzdm4sog4xb6yo3fhj4lmyjik672jlhlr53wtnkcubxiu"
    );

    datasetTokens.createDatasetToken(
      2,
      4 weeks,
      "ipfs://bafkreia6yfu3g5ivmr35ashdni3b6l3dkwqu5bppyfamg4o2d76oxbba6q"
    );

    vm.stopBroadcast();
  }
}
