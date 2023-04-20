import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ENS } from "@ensdomains/ensjs";
import { UrlJsonRpcProvider } from "@ethersproject/providers";


import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;
const provider = new ethers.providers.Web3Provider(ethereum);


const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ domainName: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  
  // const resolveDomain = async (domain) => {
  //   try {
  //     if (ethereum) {
  //       const provider = new ethers.providers.InfuraProvider("mainnet", "e86f13f03bfa43499cccc1dc07e52084");
  //       const address = await provider.resolveName(domain);
  
  //       if (address === null) {
  //         throw new Error("Domain not found");
  //       }
  
  //       return address;
  //     } else {
  //       throw new Error("No ethereum object");
  //     }
  //   } catch (error) {
  //     console.error("Error resolving domain:", error);
  //     throw new Error("Error resolving domain");
  //   }
  // };
  
  const resolveDomain = async (domain) => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/e86f13f03bfa43499cccc1dc07e52084");
        const address = await provider.resolveName(domain);
  
        console.log("Resolved address:", address); // Add this line
  
        if (address === null) {
          throw new Error("Domain not found");
        }
  
        return address;
      } else {
        throw new Error("No ethereum object");
      }
    } catch (error) {
      console.error("Error resolving domain:", error);
      throw new Error("Error resolving domain");
    }
  };
  
  
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }));

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };


  

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  async function sendTransaction(receiver, amount, message, keyword) {
    console.log('sendTransaction called');
    if (!ethers.utils.isAddress(receiver) && !ethers.utils.isValidName(receiver)) {
      setError('Invalid input');
      return;
    }
  
    try {
      let toAddress = receiver;
      if (ethers.utils.isValidName(receiver)) {
        console.log('Resolving domain:', receiver);
        const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/e86f13f03bfa43499cccc1dc07e52084');
        toAddress = await provider.resolveName(receiver);
        if (!toAddress) {
          throw new Error('Domain not found');
        }
      }
  
      console.log('Receiver address:', toAddress);
  
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const weiAmount = ethers.utils.parseEther(amount.toString());
      const transaction = await contract.addToBlockchain(toAddress, weiAmount, message, keyword);
  console.log("sender addresss:", signer);
      await transaction.wait();
  
      setTransactions((prevData) => [...prevData, { from: signer.getAddress(), to: toAddress, amount, message, keyword }]);
    } catch (error) {
      console.error('Error sending transaction:', error);
      setError('Error sending transaction');
    }
  }
  
  
  
  
  
  
  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
