import React, { useState } from "react";
import * as Lit from "@lit-protocol/lit-node-client";
import litClient from "~~/utils/lit-protocol/Lit";

export function useEncryptFile(file: Blob, tokenId: string) {
  const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null);
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function encryptFile(file: Blob, tokenId: string) {
      try {
        const chain = "mumbai";

        const accessControlConditions = [
          {
            contractAddress: "0x77F9Cc01794280758C184E95924a3Dd6707316e4",
            standardContractType: "ERC1155",
            chain,
            method: "balanceOf",
            parameters: [":userAddress", tokenId],
            returnValueTest: {
              comparator: ">=",
              value: "1",
            },
          },
        ];
        const authSig = await Lit.checkAndSignAuthMessage({
          chain,
        });

        const { encryptedFile, symmetricKey } = await Lit.encryptFile({ file });

        const encryptedSymmetricKey = await litClient.saveEncryptionKey({
          accessControlConditions,
          symmetricKey,
          authSig,
          chain,
        });

        setEncryptedFile(encryptedFile);
        setEncryptedSymmetricKey(Lit.uint8arrayToString(encryptedSymmetricKey, "base16"));
      } catch (error: any) {
        setLoading(false);
        console.log(error);
        console.log(error.message);
      }
    }

    if (file && tokenId) {
      encryptFile(file, tokenId);
    }
  }, [file, tokenId]);

  return [{ encryptedFile, encryptedSymmetricKey }, loading];
}
