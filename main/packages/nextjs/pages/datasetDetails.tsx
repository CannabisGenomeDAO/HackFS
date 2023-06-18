import React, { useContext, useState } from "react";
import Lit from "../utils/scaffold-eth/litProtocol";
import { MyContext } from "./_app";
import * as LitSDK from "@lit-protocol/lit-node-client";

function datasetDetails({ tokenId = 7 }) {
  const { tokens, setTokens, encryptedSymmetricKey, encryptedFile } = useContext(MyContext);
  const [download, setDownload] = useState("");

  async function decryptFile() {
    try {
      const encryptedFile = localStorage.getItem("encryptedFile");
      console.log("local_decryptFile ~ encryptedFile:", encryptedFile);
      const encryptedSymmetricKey = localStorage.getItem("encryptedSymmetricKey");

      console.log("____encryptedSymmetricKey:", encryptedSymmetricKey);

      const chain = "mumbai";
      const accessControlConditions = [
        {
          contractAddress: "0x77F9Cc01794280758C184E95924a3Dd6707316e4",
          standardContractType: "ERC1155",
          chain,
          method: "balanceOf",
          parameters: [":userAddress", "12"],
          returnValueTest: {
            comparator: ">=",
            value: "1",
          },
        },
      ];
      const authSig = await LitSDK.checkAndSignAuthMessage({
        chain,
      });

      console.log("authSig", authSig);

      const decryptionSymmetricKey = await Lit.litNodeClient.getEncryptionKey({
        accessControlConditions,
        toDecrypt: encryptedSymmetricKey,
        chain,
        authSig,
      });
      console.log("decryptionSymmetricKey:", decryptionSymmetricKey);

      const decryptedFileAsBuffer = await LitSDK.decryptFile({
        file: new Blob(encryptedFile),
        symmetricKey: decryptionSymmetricKey,
      });
      console.log("__decryptedFileAsBuffer:", decryptedFileAsBuffer);
      const filename = "dataset.md";

      const decryptedFile = new File([decryptedFileAsBuffer], filename, {
        type: "text/markdown",
      });

      const url = URL.createObjectURL(decryptedFile);
      setDownload(url);
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  }

  return (
    <div>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
          <img
            src="https://gateway.pinata.cloud/ipfs/QmcgoXB6rw2NAiWQK64U8DBFw19FvQopXYcfjDDy7yPPXr"
            alt="NFT Image"
            className="mx-auto w-48 mb-4 rounded-full"
          />
          <h2 className="text-2xl font-bold mb-2">Blue Dream Genome Dataset</h2>
          <p className="text-gray-600 mb-4">The genome data for the cannabis plant named Blue Dream.</p>
          <p className="text-gray-700">Price: $100</p>
          <div className="flex justify-between">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Mint</button>
            <button
              onClick={decryptFile}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Access
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              <a href={download} download="file.txt">
                Download
              </a>
            </button>
          </div>
        </div>
      </div>
      <br />

      <h1>Dataset Details</h1>
      {tokens.length > 0 && <></>}
    </div>
  );
}

export default datasetDetails;
