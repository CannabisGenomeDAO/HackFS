// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin/token/ERC1155/ERC1155.sol";
import "openzeppelin/access/Ownable.sol";
import "openzeppelin/token/ERC1155/extensions/ERC1155Supply.sol";

contract DatasetTokens is ERC1155, Ownable, ERC1155Supply {
  constructor() ERC1155("") {}

  // Mapping from token ID to provider
  mapping(uint256 => address) public datasetTokenProviders;

  // A nonce to ensure we have a unique id each time we mint
  uint256 public nonce;

  // Mapping from token ID to price
  mapping(uint256 => uint256) public datasetTokenPrices;

  // Mapping from token ID to expiry time
  mapping(uint256 => uint256) public datasetTokenExpiryTimes;

  // Mapping from token ID to URI
  mapping(uint256 => string) public datasetTokenURIs;

  event CreateDatasetToken(
    address indexed provider,
    uint256 indexed id,
    uint256 price,
    uint256 expiryTime
  );

  event SetDatasetTokenPrice(
    address indexed provider, uint256 indexed id, uint256 newPrice
  );

  event SetDatasetTokenExpiryTime(
    address indexed provider, uint256 indexed id, uint256 newExpiryTime
  );

  event SetDatasetTokenURI(
    address indexed provider, uint256 indexed id, string newURI
  );

  modifier providerOnly(uint256 id, string memory settingType) {
    string memory errorMessage = string.concat(
      "Unauthorized: only the dataset provider can set ", settingType, "."
    );

    require(msg.sender == datasetTokenProviders[id], errorMessage);
    _;
  }

  function createDatasetToken(
    uint256 price,
    uint256 expiryTime,
    string memory uri
  ) public {
    uint256 id = ++nonce;

    datasetTokenProviders[id] = msg.sender;
    datasetTokenPrices[id] = price;
    datasetTokenExpiryTimes[id] = expiryTime;
    datasetTokenURIs[id] = uri;

    emit CreateDatasetToken(msg.sender, id, price, expiryTime);

    // Mint one token for the provider in order to create supply to check for
    // token's existence
    _mint(msg.sender, id, 1, abi.encode());
  }

  function setDatasetTokenPrice(uint256 id, uint256 newPrice)
    public
    providerOnly(id, "price")
  {
    datasetTokenPrices[id] = newPrice;

    emit SetDatasetTokenPrice(msg.sender, id, newPrice);
  }

  function setDatasetTokenExpiryTime(uint256 id, uint256 newExpiryTime)
    public
    providerOnly(id, "expiry time")
  {
    datasetTokenExpiryTimes[id] = newExpiryTime;

    emit SetDatasetTokenExpiryTime(msg.sender, id, newExpiryTime);
  }

  function setDatasetTokenURI(uint256 id, string memory newURI)
    public
    providerOnly(id, "URI")
  {
    datasetTokenURIs[id] = newURI;

    emit SetDatasetTokenURI(msg.sender, id, newURI);
  }

  function setURI(string memory newuri) public onlyOwner {
    _setURI(newuri);
  }

  function mint(uint256 id, uint256 amount, bytes memory data) public payable {
    uint256 price = datasetTokenPrices[id];
    uint256 total = price * amount;

    require(exists(id), "Mint: token does not exist.");
    require(msg.value == total, "Payment: wrong amount sent.");

    _mint(msg.sender, id, amount, data);
  }

  function mintBatch(
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) public payable {
    uint256 total;

    for (uint256 i = 0; i < ids.length; i++) {
      uint256 id = ids[i];
      uint256 amount = amounts[i];

      uint256 price = datasetTokenPrices[id];
      uint256 subtotal = price * amount;

      require(exists(id), "Mint: token does not exist.");

      total += subtotal;
    }

    require(msg.value == total, "Payment: wrong amount sent.");

    _mintBatch(msg.sender, ids, amounts, data);
  }

  // The following functions are overrides required by Solidity.

  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal override(ERC1155, ERC1155Supply) {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }
}
