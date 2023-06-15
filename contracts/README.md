# Dataset Tokens Contract

## Project

![Diagram of a dataset marketplace](./assets/images/dataset-marketplace.png)

### Purpose

The purpose of the dataset token is to tokenize datasets on Filecoin

### Users

- Data Providers: store encrypted data on Filecoin and grant access to user's who own a dataset token.
- Data Consumers: purchase dataset tokens on a marketplace to get access to the encrypted data stored on Filecoin.

## Getting Started

### Install Foundry

If you have not installed Foundry see the documentation [here](https://book.getfoundry.sh/getting-started/installation).

### Build

```
forge build
```

### Test

```
forge test
```

## Deployment

### Deploy and Verify Contract

Change directory to `contracts`:

```
cd contracts
```

Create `.env` file:

```
touch .env
```

Add Calibration Testnet RPC from [here](https://chainlist.org/chain/314159) and deployment wallet's private key to `.env`:

```
CALIBRATION_RPC_URL=<INSERT URL>
PRIVATE_KEY=<INSERT PRIVATE KEY>
```

Load environment variables:

```
source .env
```

Run deployment script:

```
forge script script/DatasetTokens.s.sol \ --rpc-url$CALIBRATION_RPC_URL \
--gas-estimate-multiplier=5000 \
--slow --broadcast --verify -vvvv
```

Note: adjust `--gas-estimate-multiplier` in case of Gas Limit errors.

Flatten the contract for contract verification:

```
forge flatten --output assets/artifacts/DatasetTokens.f.sol src/DatasetTokens.sol
```

### Deployments

- `2023-06-15` | [Filfox Link](https://calibration.filfox.info/en/address/t410fmr5vtcaekfz2xueystizgookgd23v7u2qqn6hna) | [Commit](https://github.com/CannabisGenomeDAO/HackFS/commit/f961a4dbc742096730221150bf36d510673345f4)
