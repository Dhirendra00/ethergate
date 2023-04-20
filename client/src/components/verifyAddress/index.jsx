import React from 'react'
import DomainNameAuthentication from '../../context/DomainNameAuthentication';
// import { TransactionContext } from "../context/TransactionContext";

const index = () => {
  return (
    <div className='h-screen'>
 
      <DomainNameAuthentication/>
    </div>
  )
}

export default index




// import React from 'react'

// import DomainAuthContract from './contracts/DomainAuth.json';

// const domainAuthContract = new web3.eth.Contract(
//   DomainAuthContract.abi,
//   '0x1234567890123456789012345678901234567890' // Replace with your contract address
// );

// const domainName = 'example.com'; // Replace with the domain name to verify

// const index = async () => {
//   const account = (await web3.eth.getAccounts())[0];
//   const address = await domainAuthContract.methods.verifyDomain(domainName).call();
//   if (address === account) {
//     console.log('Domain authentication successful');
//   } else {
//     console.error('Domain authentication failed');
//   }
// }
//   export default index