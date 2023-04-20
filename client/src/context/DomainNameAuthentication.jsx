import React, { useState } from 'react';
import { ethers } from 'ethers';
import abi from '../utils/DomainNameAuthentication.json';
import verify from "../../images/verify.svg";

const DomainNameAuthentication = () => {
  const [domainName, setDomainName] = useState('');
  const [proof, setProof] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [owner, setOwner] = useState('');
  const [domain, setDomain] = useState('');
  const [domainNameResult, setDomainNameResult] = useState('');

  const handleDomainNameChange = (event) => {
    setDomainName(event.target.value);
  };

  const handleProofChange = (event) => {
    setProof(event.target.value);
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

  const handleRegisterDomainClick = async () => {
    if (!window.ethereum) {
      alert('Please install Metamask to use this feature');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contractAddress = '0xA6F97d78fbd7C1729f96F5cdF3f9b23B8376950F'; // Replace with the actual contract address
      const contractABI = abi.abi; // Replace with the actual contract ABI

      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      await contract.registerDomain(domainName, ethers.utils.formatBytes32String(proof));
      const gasLimit = await contract.estimateGas.registerDomain(domainName, ethers.utils.formatBytes32String(proof));
      await contract.registerDomain(domainName, ethers.utils.formatBytes32String(proof), { gasLimit });
      

      setVerified(true);
      setError('');
    } catch (error) {
      setVerified(false);
      setError(`Error registering domain name: ${error.message}`);
    }
  };

  const handleUpdateClick = async () => {
    if (!window.ethereum) {
      alert('Please install Metamask to use this feature');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contractAddress = '0xA6F97d78fbd7C1729f96F5cdF3f9b23B8376950F'; // Replace with the actual contract address
      const contractABI = abi.abi; // Replace with the actual contract ABI

      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      await contract.updateDomain(domainName, ethers.utils.formatBytes32String(proof));

      setVerified(true);
      setError('');
    } catch (error) {
      setVerified(false);
      setError(`Error updating domain name: ${error.message}`);
    }
  };

  const handleGetDomainNameClick = async () => {
    if (!window.ethereum) {
      alert('Please install Metamask to use this feature');
      return;
    }

    // try {
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);

    //   const contractAddress = '0xA6F97d78fbd7C1729f96F5cdF3f9b23B8376950F'; // Replace with the actual contract address
    //   const contractABI = abi.abi; // Replace with the actual contract ABI

    //   const contract = new ethers.Contract(contractAddress, contractABI, provider);

    //   const domainOwner = await contract.getDomainOwner();
    //   const domainName = await contract.getDomainName(domainOwner);

    //   setOwner(domainOwner);
    //   setDomainName(domainName);
    //   setError('');
    // } catch (error) {
    //   setError(`Error getting domain name: ${error.message}`);
    // }
    let resolvedAddress = domainName;
    if (ethers.utils.isValidName(domainName)) {
      resolvedAddress = await resolveDomain(domainName);
      console.log("Receiver:", resolvedAddress);

      alert (resolvedAddress);
      const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/e86f13f03bfa43499cccc1dc07e52084');
      resolvedAddress = await provider.resolveName(domainName);
      if (!resolvedAddress) {
        throw new Error('Domain not found');
      }else{
        <span class="inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
   {resolvedAddress}
  </span>
      }
    }
  };
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl text-white font-bold mb-4">Domain Name verification</h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="domain-name">
            Domain Name
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="domain-name"
            type="text"
            placeholder="example.com"
            value={domainName}
            onChange={handleDomainNameChange}
          />
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleRegisterDomainClick}
          >
            Register Domain
          </button>
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleGetDomainNameClick}
          >
            Get Domain Name
          </button>
        </div>
        
        {registered && (
          <p className="text-green-600 mb-4">Domain name registered</p>
        )}
        {domainNameResult && (
          <p className="text-blue-600 mb-4">Domain name: {resolvedAddress}</p>
        )}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        
      </div>
    </div>
  );

}
export default DomainNameAuthentication;
