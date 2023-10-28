import classNames from "classnames";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useCounterGetNumber, usePrepareCounterSetNumber } from "wagmi-config";

const Home: NextPage = () => {
  const [number, setNumber] = useState<bigint>(BigInt(0));

  const { data: numberFetched, refetch } = useCounterGetNumber({});

  const { config } = usePrepareCounterSetNumber({
    args: [number],
  });

  const {
    data,
    write,
    isLoading: confirmationPending,
  } = useContractWrite({ ...config });

  const { isSuccess: txDone, isLoading: transactionPending } =
    useWaitForTransaction({
      hash: data?.hash,
    });

  useEffect(() => {
    if (txDone) {
      refetch();
    }
  }, [txDone]);

  return (
    <div className="h-full flex border flex-col justify-center items-center">
      <Head>
        <title>Typescript Eth Starter</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="border shadow-md rounded-md p-2">
        <p className="font-bold">Number</p>
        <div className="flex flex-row gap-2">
          <input
            className="input input-bordered"
            type="number"
            placeholder="Set new number..."
            onChange={(e) => {
              setNumber(BigInt(e.target.value));
            }}
          />
          <button
            className={classNames("btn btn-primary", {
              loading: confirmationPending || transactionPending,
            })}
            onClick={() => {
              write && write();
            }}
          >
            SET
          </button>
        </div>
        <div className="mt-2">
          <p className="font-bold">
            Current number:
            <span className="text-red-600 ml-2">
              {numberFetched?.toString()}
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;