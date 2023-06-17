import React, { useState } from "react";
import { apiKey } from "../components/APIKEYS";
import axios from "axios";
import { File, NFTStorage } from "nft.storage";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import { useScaffoldContract, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

function ConfirmationUpload({ name, description, tags, image, price, writeToContract }) {
  return (
    <div className="flex justify-center p-8">
      <div
        className="rounded-md overflow-hidden shadow-lg border border-gray-300"
        style={{ width: "700px", padding: "6rem", paddingTop: "3rem" }}
      >
        <h1 className="text-lg font-bold mb-2 pb-4">Before publishing, please review your DataSet</h1>
        <img
          style={{
            width: "150px",
            top: "0",
            left: "0",
          }}
          src={image ? image : "/assets/Rectangle 77.png"}
          alt="userBGimage"
        />
        <p className="text-md mb-2 pb-4">
          <strong>Title</strong>
          <br /> {name}
        </p>

        <p className="text-md mb-2 pb-4">
          <strong>Description</strong>
          <br /> {description}
        </p>

        <p className="text-md mb-2 pb-4">
          <strong>Tags</strong>
          <br /> {tags}
        </p>

        <p className="text-md mb-2 pb-4">
          <strong>Price </strong>
          <br /> {price}
        </p>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          onClick={writeToContract}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

function Upload(props) {
  const [name, setName] = useState("");
  const [displayUpload, setDisplayUpload] = useState(true);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [value, onChange] = useState(new Date());
  const [price, setPrice] = useState("");
  const [ipf_url, setIpf_url] = useState("");
  console.log("__state ipf_url:", ipf_url);
  const [image, setImage] = useState("");

  const { data: DatasetTokens } = useScaffoldContract({ contractName: "DatasetTokens" });
  console.log("DatasetTokens", DatasetTokens?.createDatasetToken);
  console.log("___All:", name, description, tags, value, price, image);

  const handleImage = async event => {
    const updataData = new FormData();
    updataData.append("file", event.target.files[0]);
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", updataData, {
      maxContentLength: "Infinity",
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: "2f7a99fef33b2783bde7",
        pinata_secret_api_key: "9082e887ce9262fcf525cd85b5a0da348a5b1fc3fb725bacdd5af3d80a051d5c",
      },
    });
    setImage("https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash);
  };

  const getDay = async () => {
    const d = new Date();
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    return `${mo}-${da}-${ye}`;
  };

  const saveToNFTStorage = async event => {
    event.preventDefault();
    try {
      const createdDate = await getDay();
      const obj = {
        title: name,
        description,
        tags,
        expiration_date: value,
        price,
        image,
        createdDate,
      };
      const client = new NFTStorage({ token: apiKey });
      const metadata = await client.store({
        name: name,
        description: JSON.stringify(obj),
        image: new File([image], "imageName", { type: "image/*" }),
      });

      if (metadata) {
        console.log("metadata URL", metadata?.url);
        const url = metadata?.url.substring(7); //  bafyreifeiksc7pfbdex5fhes2inqdail7cvf3jfphugtpyzw4rpzte3rca/metadata.json
        const fullUrl = `https://cloudflare-ipfs.com/ipfs/${url}`;
        setIpf_url(fullUrl);
        setDisplayUpload(false);
        // writeToContract(fullUrl);
        // console.log("fullUrl", fullUrl);

        // const saveToContract = await contract.createGroup(fullUrl, targetAmmount);
        // const tx = await saveToContract.wait();
        // console.log("tx", tx);
        // history.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const expirationTime = 200;

  const { writeAsync: writeToContract, isLoading } = useScaffoldContractWrite({
    contractName: "DatasetTokens",
    functionName: "createDatasetToken",
    args: [price, expirationTime, ipf_url],
  });

  return (
    <div className="flex justify-center p-8">
      {displayUpload ? (
        <div
          className="rounded-md overflow-hidden shadow-lg border border-gray-300"
          style={{ width: "700px", padding: "4rem" }}
        >
          <div>
            <h1 className="text-lg font-bold mb-2 pb-4">Publish into Data DAO</h1>
            <p className="text-md mb-2 pb-4">
              Highlight the important features of your dataset or algorithm to make it more discoverable and catch the
              interest of data consumers.
            </p>

            <form onSubmit={saveToNFTStorage}>
              <img
                style={{
                  width: "150px",
                  top: "0",
                  left: "0",
                }}
                src={image ? image : "/assets/Rectangle 77.png"}
                alt="userBGimage"
              />
              <label className="text-md" htmlFor="formFileImage5">
                + Add Data NFT
              </label>
              <div className="mb-4">
                <input
                  type="file"
                  id="formFileImage5"
                  onChange={handleImage}
                  defaultValue={image}
                  style={{ display: "none" }}
                  className="border rounded py-2 px-3 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none"
                  id="name"
                  type="text"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="font-bold mb-2" htmlFor="location">
                  Description
                </label>
                <textarea
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none"
                  id="description"
                  rows="4"
                  type="text"
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-2" htmlFor="website">
                  Tags separated by comma
                </label>
                <input
                  className="border border-gray-300 rounded-md py-2 px-3 w-full"
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={event => setTags(event.target.value)}
                />
              </div>

              <div className="flex justify-between pt-4 pb-5">
                <div className="mb-4">
                  <label className="block  font-bold mb-2" htmlFor="attributes">
                    Price in DAI
                  </label>
                  <input
                    className="border border-gray-300 rounded-md py-2 px-3 w-full"
                    id="attributes"
                    type="number"
                    value={price}
                    onChange={event => setPrice(event.target.value)}
                  />
                </div>
              </div>

              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={saveToNFTStorage}
              >
                Save and Continue
              </button>
            </form>
          </div>
        </div>
      ) : (
        <ConfirmationUpload
          name={name}
          description={description}
          tags={tags}
          value={value}
          image={image}
          price={price}
          writeToContract={writeToContract}
        />
      )}
    </div>
  );
}

export default Upload;
