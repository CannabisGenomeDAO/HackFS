import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MyContext } from "./_app";
import type { NextPage } from "next";
import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContract, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { tokens, setTokens } = useContext(MyContext);
  // const [tokens, setTokens] = useState([]);
  const router = useRouter();
  const { data: DatasetTokens } = useScaffoldContract({ contractName: "DatasetTokens" });

  useEffect(() => {
    getDatasetTokens();
  }, [DatasetTokens]);

  const handleClick = () => {
    router.push("/datasetDetails");

    console.log("🚀", router.query);

    // setSelectedRestaurant('New value');
    // console.log("🚀 ~ file: Card.tsx:17 ~ handleClick ~ setSelectedRestaurant:", setSelectedRestaurant);
  };
  // THINGS TO DO
  // fetch all tokens from the smart contract and ipfs
  // onclick display all details of the datset and have a buy mint(1, 1, abi.encode())
  // add upload to ipfs page

  const getDatasetTokens = async () => {
    try {
      const nonce = await DatasetTokens.nonce();
      const numOfTokens = nonce.toNumber();
      const tokens = [];

      for (let id = 3; id <= numOfTokens; id++) {
        const price = await DatasetTokens.datasetTokenPrices(id);
        const expiryTime = await DatasetTokens.datasetTokenExpiryTimes(id);
        const uri = await DatasetTokens.datasetTokenURIs(id);

        const getNFTStorageData = await fetch(uri);
        const dataSet = await getNFTStorageData.json();
        console.log("______dataSet:", dataSet);

        const dataObj = JSON.parse(dataSet.description);
        console.log("🚀 ~ file: index.tsx:37 ~ getDatasetTokens ~ dataObj:", dataObj);
        // obj.fundraiserId = fundraiserId

        tokens.push({
          id,
          price: price.toNumber(),
          expiryTime: expiryTime.toNumber(),
          createdDate: dataObj.createdDate,
          description: dataObj.description,
          expiration_date: dataObj.expiration,
          tags: dataObj.tags,
          image: dataObj.image,
          title: dataObj.title,
        });
      }

      console.log({ tokens });
      setTokens(tokens);
    } catch (error) {
      console.log({ error });
    }
  };

  const tokens1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Data DAO </span>
          </h1>
          <p className="text-center text-lg">
            The Data DAO platform revolutionizes the way datasets are discovered, published, and exchanged.
          </p>
          <p className="text-center text-lg">
            Users can effortlessly explore an extensive collection of datasets, ranging from diverse fields and
            industries. They can also seamlessly publish their own datasets, contributing to the growing pool of
            knowledge.
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-20 py-12">
          <div className="flex justify-center items-center gap-12 sm:flex-wrap">
            {tokens1.length > 0
              ? tokens1.map((token, idx) => (
                  <div
                    className="flex flex-col bg-base-100 px-6 py-6 text-center items-center max-w-xs rounded-3xl"
                    key={idx}
                    onClick={handleClick}
                  >
                    {/* <BugAntIcon className="h-8 w-8 fill-secondary" /> */}
                    <div className="flex font-light">
                      <p className="text-sm px-3 ">dataset</p>
                      <p className="text-sm px-3 border-l-2 border-solid border-gray-300">PLETUR-55</p>
                      <p className="text-sm px-3 border-l-2 border-solid border-gray-300">Polygon</p>
                    </div>

                    <div className="text-left mt-0">
                      <p className="font-bold mt-0 mb-0">OCEAN/USDT orderbook</p>
                      <p className="text-sm font-extralight mt-0">0x4Ab0…0f6a</p>
                      <p className="text-sm font-light mt-0 mb-0">
                        Real time BTC/USDT orderbook To take the bid orders, access data.bids array To take t…
                      </p>
                      <p className="text-md mb-0 ">
                        <strong>18,071 </strong>
                        <span className="text-sm font-light">mOCEAN</span>
                      </p>
                      <div className="flex justify-between  ">
                        <p className="text-sm font-light mt-1">2,412,915 veOCEAN</p>
                        <p className="text-sm font-light mt-1">
                          {" "}
                          <strong>43</strong> sales
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              : "No DataSets found"}
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-6 py-6 text-center items-center max-w-xs rounded-3xl">
              {/* <BugAntIcon className="h-8 w-8 fill-secondary" /> */}
              <div className="flex font-light">
                <p className="text-sm px-3 ">dataset</p>
                <p className="text-sm px-3 border-l-2 border-solid border-gray-300">PLETUR-55</p>
                <p className="text-sm px-3 border-l-2 border-solid border-gray-300">Polygon</p>
              </div>

              <div className="text-left mt-0">
                <p className="font-bold mt-0 mb-0">OCEAN/USDT orderbook</p>
                <p className="text-sm font-extralight mt-0">0x4Ab0…0f6a</p>
                <p className="text-sm font-light mt-0 mb-0">
                  Real time BTC/USDT orderbook To take the bid orders, access data.bids array To take t…
                </p>
                <p className="text-md mb-0 ">
                  <strong>18,071 </strong>
                  <span className="text-sm font-light">mOCEAN</span>
                </p>
                <div className="flex justify-between  ">
                  <p className="text-sm font-light mt-1">2,412,915 veOCEAN</p>
                  <p className="text-sm font-light mt-1">
                    {" "}
                    <strong>43</strong> sales
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-base-100 px-6 py-6 text-center items-center max-w-xs rounded-3xl">
              {/* <BugAntIcon className="h-8 w-8 fill-secondary" /> */}
              <div className="flex font-light">
                <p className="text-sm px-3 ">dataset</p>
                <p className="text-sm px-3 border-l-2 border-solid border-gray-300">PLETUR-55</p>
                <p className="text-sm px-3 border-l-2 border-solid border-gray-300">Polygon</p>
              </div>

              <div className="text-left mt-0">
                <p className="font-bold mt-0 mb-0">OCEAN/USDT orderbook</p>
                <p className="text-sm font-extralight mt-0">0x4Ab0…0f6a</p>
                <p className="text-sm font-light mt-0 mb-0">
                  Real time BTC/USDT orderbook To take the bid orders, access data.bids array To take t…
                </p>
                <p className="text-md mb-0 ">
                  <strong>18,071 </strong>
                  <span className="text-sm font-light">mOCEAN</span>
                </p>
                <div className="flex justify-between  ">
                  <p className="text-sm font-light mt-1">2,412,915 veOCEAN</p>
                  <p className="text-sm font-light mt-1">
                    {" "}
                    <strong>43</strong> sales
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-base-100 px-6 py-6 text-center items-center max-w-xs rounded-3xl">
              {/* <BugAntIcon className="h-8 w-8 fill-secondary" /> */}
              <div className="flex font-light">
                <p className="text-sm px-3 ">dataset</p>
                <p className="text-sm px-3 border-l-2 border-solid border-gray-300">PLETUR-55</p>
                <p className="text-sm px-3 border-l-2 border-solid border-gray-300">Polygon</p>
              </div>

              <div className="text-left mt-0">
                <p className="font-bold mt-0 mb-0">OCEAN/USDT orderbook</p>
                <p className="text-sm font-extralight mt-0">0x4Ab0…0f6a</p>
                <p className="text-sm font-light mt-0 mb-0">
                  Real time BTC/USDT orderbook To take the bid orders, access data.bids array To take t…
                </p>
                <p className="text-md mb-0 ">
                  <strong>18,071 </strong>
                  <span className="text-sm font-light">mOCEAN</span>
                </p>
                <div className="flex justify-between  ">
                  <p className="text-sm font-light mt-1">2,412,915 veOCEAN</p>
                  <p className="text-sm font-light mt-1">
                    {" "}
                    <strong>43</strong> sales
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="flex flex-col bg-base-100 px-6 py-10 text-center items-center max-w-xs rounded-3xl">
              <SparklesIcon className="h-8 w-8 fill-secondary" />
              <p>
                Experiment with{" "}
                <Link href="/example-ui" passHref className="link">
                  Example UI
                </Link>{" "}
                to build your own UI.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
