import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import useFetch from "../hooks/useFetch";
import dummyData from "../utils/dummyData";
import { shortenAddress } from "../utils/shortenAddress";
import ethereum from "../../images/ethereum.jpg";

const TransactionsCard = ({ addressTo, addressFrom, timestamp, message, keyword, amount, url }) => {
  const gifUrl = useFetch({ keyword });
  
  const shortenedAddressFrom = addressFrom ? shortenAddress(addressFrom) : '';
  const shortenedAddressTo = addressTo ? shortenAddress(addressTo) : '';

  return (
    <div className="bg-[#181918] m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      
      flex-col rounded-lg hover:shadow-2xl"
     
    >
      <div className="flex flex-col items-center w-full">
        
        <img
          src={ethereum || url}
          alt="ethereum"
          className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
        />
        <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
          <p className="text-[#37c7da] font-bold">{timestamp}</p>
        </div>
        <div className="display-flex rounded-lg  bg-[#127F98] justify-start w-full p-2">
          {addressFrom && (
            <a href={`https://goerli.etherscan.io/address/${addressFrom}`} target="_blank" rel="noreferrer">
              <p className="text-white text-base">From: {shortenedAddressFrom}</p>
            </a>
          )}
          {addressTo && (
            <a href={`https://goerli.etherscan.io/address/${addressTo}`} target="_blank" rel="noreferrer">
              <p className="text-white text-base">To: {shortenedAddressTo}</p>
            </a>
          )}
          <p className="text-white text-base">Amount: {amount} ETH</p>
          {/* {message && (
            <>
              <br />
              <p className="text-white text-base">Message: {message}</p>
            </>
          )} */}
        </div>
      </div>
      
    </div>
    
  );
  
};


const Transactions = () => {
  const { transactions, currentAccount } = useContext(TransactionContext);

  return (
    <div className="w-100 justify-center pb-6 items-center">
      <div className="md:pl-20 md:pr-20 px-2">
        {currentAccount ? (
          <h1 className="text-white text-3xl sm:text-5xl text-gradient ">
            Latest Transactions
          </h1>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the latest transactions
          </h3>
        )}
      </div>
      <div className="overflow-x-auto scrollbar-hidden md:ml-20 md:mr-20 px-4">
        <div className="flex flex-row justify-center items-center mt-10">
          {[...dummyData, ...transactions].slice(-8).map((transaction, i) => (
            <TransactionsCard key={i} {...transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;