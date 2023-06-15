// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/DatasetTokens.sol";

contract DatasetTokensTest is Test {
    DatasetTokens public datasetTokens;

    function setUp() public {
        datasetTokens = new DatasetTokens();
    }
}
