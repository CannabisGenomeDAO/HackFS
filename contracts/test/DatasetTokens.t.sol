// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/DatasetTokens.sol";

contract DatasetTokensTest is DatasetTokens, Test {
  DatasetTokens public datasetTokens;

  // List of users
  address public contractOwner;

  address public datasetProvider;

  address public datasetConsumerOne;
  address public datasetConsumerTwo;

  function setUp() public {
    datasetTokens = new DatasetTokens();

    contractOwner = address(this);

    datasetProvider = vm.addr(100);
    vm.label(datasetProvider, "Provider");

    datasetConsumerOne = vm.addr(200);
    vm.label(datasetConsumerOne, "Consumer One");
    vm.deal(datasetConsumerOne, 100 ether);
    datasetConsumerTwo = vm.addr(201);
    vm.label(datasetConsumerTwo, "Consumer Two");
    vm.deal(datasetConsumerTwo, 100 ether);

    uint256 price = 1 ether;
    uint256 expiryTime = 2 weeks;
    string memory uri = "ipfs://baf-zdi";

    vm.prank(datasetProvider);
    datasetTokens.createDatasetToken(price, expiryTime, uri);
    vm.prank(datasetProvider);
    datasetTokens.createDatasetToken(price, expiryTime, uri);
  }

  function testCreateDatasetToken() public {
    uint256 id = datasetTokens.nonce() + 1;
    uint256 price = 1 ether;
    uint256 expiryTime = 1 weeks;
    string memory uri = "ipfs://baf-trl";

    vm.expectEmit(true, true, false, true);
    emit CreateDatasetToken(datasetProvider, id, price, expiryTime);

    vm.expectEmit(true, true, true, true);
    emit TransferSingle(datasetProvider, address(0), datasetProvider, id, 1);

    vm.prank(datasetProvider);
    datasetTokens.createDatasetToken(price, expiryTime, uri);

    assertEq(datasetProvider, datasetTokens.datasetTokenProviders(id));
    assertEq(price, datasetTokens.datasetTokenPrices(id));
    assertEq(expiryTime, datasetTokens.datasetTokenExpiryTimes(id));
    assertEq(uri, datasetTokens.datasetTokenURIs(id));
    assertEq(1, datasetTokens.balanceOf(datasetProvider, id));
  }

  function testSetDatasetTokenPrice() public {
    uint256 id = 1;
    uint256 newPrice = 2 ether;

    vm.expectEmit(true, true, false, true);
    vm.prank(datasetProvider);

    emit SetDatasetTokenPrice(datasetProvider, id, newPrice);

    datasetTokens.setDatasetTokenPrice(id, newPrice);

    assertEq(newPrice, datasetTokens.datasetTokenPrices(id));
  }

  function testRevertWhenPriceSetterIsNotProvider() public {
    uint256 id = 1;
    uint256 newPrice = 200;

    vm.expectRevert("Unauthorized: only the dataset provider can set price.");
    vm.prank(address(0));

    datasetTokens.setDatasetTokenPrice(id, newPrice);
  }

  function testSetDatasetTokenExpiryTime() public {
    uint256 id = 1;
    uint256 newExpiryTime = 4 weeks;

    vm.expectEmit(true, true, false, true);
    emit SetDatasetTokenExpiryTime(datasetProvider, id, newExpiryTime);

    vm.prank(datasetProvider);
    datasetTokens.setDatasetTokenExpiryTime(id, newExpiryTime);

    assertEq(newExpiryTime, datasetTokens.datasetTokenExpiryTimes(id));
  }

  function testRevertWhenExpiryTimeSetterIsNotProvider() public {
    uint256 id = 1;
    uint256 newExpiryTime = 4 weeks;

    vm.expectRevert(
      "Unauthorized: only the dataset provider can set expiry time."
    );
    vm.prank(address(0));

    datasetTokens.setDatasetTokenExpiryTime(id, newExpiryTime);
  }

  function testSetDatasetTokenURI() public {
    uint256 id = 1;
    string memory newURI = "ipfs://baf-trl";

    vm.expectEmit(true, true, false, true);
    emit SetDatasetTokenURI(datasetProvider, id, newURI);

    vm.prank(datasetProvider);
    datasetTokens.setDatasetTokenURI(id, newURI);

    assertEq(newURI, datasetTokens.datasetTokenURIs(id));
  }

  function testRevertWhenURISetterIsNotProvider() public {
    uint256 id = 1;
    string memory newURI = "ipfs://baf-trl";

    vm.expectRevert("Unauthorized: only the dataset provider can set URI.");
    vm.prank(address(0));

    datasetTokens.setDatasetTokenURI(id, newURI);
  }

  function testMint() public {
    uint256 id = 1;
    uint256 amount = 1;

    vm.expectEmit(true, true, true, true);
    emit TransferSingle(
      datasetConsumerOne, address(0), datasetConsumerOne, id, amount
    );

    vm.prank(datasetConsumerOne);
    datasetTokens.mint{value: 1 ether}(id, amount, abi.encode());

    assertEq(1, datasetTokens.balanceOf(datasetConsumerOne, id));
  }

  function testRevertWhenTokenDoesNotExistOnMint() public {
    uint256 id = 0;
    uint256 amount = 1;

    vm.expectRevert("Mint: token does not exist.");
    vm.prank(datasetConsumerOne);
    datasetTokens.mint{value: 1 ether}(id, amount, abi.encode());
  }

  function testRevertWhenWrongAmountSentOnMint() public {
    uint256 id = 1;
    uint256 amount = 1;

    vm.expectRevert("Payment: wrong amount sent.");
    vm.prank(datasetConsumerOne);
    datasetTokens.mint{value: 2 ether}(id, amount, abi.encode());
  }

  function testMintBatch() public {
    uint256[] memory ids = new uint256[](2);
    ids[0] = 1;
    ids[1] = 2;

    uint256[] memory amounts = new uint256[](2);
    amounts[0] = 1;
    amounts[1] = 1;

    vm.expectEmit(true, true, true, true);
    emit TransferBatch(
      datasetConsumerOne, address(0), datasetConsumerOne, ids, amounts
    );

    vm.prank(datasetConsumerOne);
    datasetTokens.mintBatch{value: 2 ether}(ids, amounts, abi.encode());

    assertEq(1, datasetTokens.balanceOf(datasetConsumerOne, ids[0]));
    assertEq(1, datasetTokens.balanceOf(datasetConsumerOne, ids[1]));
  }

  function testRevertWhenTokenDoesNotExistOnMintBatch() public {
    uint256[] memory ids = new uint256[](2);
    ids[0] = 2;
    ids[1] = 3;

    uint256[] memory amounts = new uint256[](2);
    amounts[0] = 1;
    amounts[1] = 1;

    vm.expectRevert("Mint: token does not exist.");
    vm.prank(datasetConsumerOne);
    datasetTokens.mintBatch{value: 2 ether}(ids, amounts, abi.encode());
  }

  function testRevertWhenWrongAmountSentOnMintBatch() public {
    uint256[] memory ids = new uint256[](2);
    ids[0] = 1;
    ids[1] = 2;

    uint256[] memory amounts = new uint256[](2);
    amounts[0] = 1;
    amounts[1] = 1;

    vm.expectRevert("Payment: wrong amount sent.");
    vm.prank(datasetConsumerOne);
    datasetTokens.mintBatch{value: 1 ether}(ids, amounts, abi.encode());
  }
}
