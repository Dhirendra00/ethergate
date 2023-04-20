import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };


  // resolve the domain name 
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

  // const sendTransaction = async () => {
  //   try {
  //     if (ethereum) {
  //       const { addressTo, amount, keyword, message } = formData;
  //       const transactionsContract = createEthereumContract();
  //       const parsedAmount = ethers.utils.parseEther(amount);


  //       let resolvedAddress = addressTo;
  //       if (ethers.utils.isValidName(addressTo)) {
  //         resolvedAddress = await resolveDomain(addressTo);
  //         console.log("Receiver:", resolvedAddress);
  //         const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/e86f13f03bfa43499cccc1dc07e52084');
  //         resolvedAddress = await provider.resolveName(addressTo);
  //         if (!resolvedAddress) {
  //           throw new Error('Domain not found');
  //         }
  //       }

  //       // await ethereum.request({
  //       //   method: "eth_sendTransaction",
  //       //   params: [{
  //       //     from: currentAccount,
  //       //     to: resolvedAddress,
  //       //     gas: "0x5208",
  //       //     value: parsedAmount._hex,
  //       //   }],
  //       // });

  //       const transactionHash = await transactionsContract(addressTo, parsedAmount, message, keyword);

  //       setIsLoading(true);
  //       console.log(`Loading - ${transactionHash.hash}`);
  //       await transactionHash.wait();
  //       console.log(`Success - ${transactionHash.hash}`);
  //       setIsLoading(false);

  //       const transactionsCount = await transactionsContract.getTransactionCount();

  //       setTransactionCount(transactionsCount.toNumber());
  //       window.location.reload();
  //     } else {
  //       console.log("No ethereum object");
  //     }
  //   } catch (error) {
  //     console.log(error);

  //     throw new Error("No ethereum object");
  //   }
  // };

  // useEffect(() => {
  //   checkIfWalletIsConnect();
  //   checkIfTransactionsExists();
  // }, []);



  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);
  
        let resolvedAddress = addressTo;
        if (ethers.utils.isValidName(addressTo)) {
          resolvedAddress = await resolveDomain(addressTo);
          console.log("Receiver:", resolvedAddress);
          const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/e86f13f03bfa43499cccc1dc07e52084');
          resolvedAddress = await provider.resolveName(addressTo);
          if (!resolvedAddress) {
            throw new Error('Domain not found');
            alert("ethereum address doesn't match!");
          }
        }
  
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: resolvedAddress,
            gas: "0x5208",
            value: parsedAmount._hex,
          }],
        });
  
        const transactionHash = await transactionsContract(resolvedAddress, parsedAmount, message, keyword);
  
        setIsLoading(true);
       
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
         
  
        const transactionsCount = await transactionsContract.getTransactionCount();
  
        setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
      } else {
        console.log("No ethereum object");
        alert("no ethereum account found!")
      }
    } catch (error) {
      // console.log(error);
      // alert("no ethereum account found!")
      // throw new Error("No ethereum object");
    }
  };
  
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