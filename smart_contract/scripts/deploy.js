const main = async () => {
  const transactionsFactory = await hre.ethers.getContractFactory("Transactions");
  const transactionsContract = await transactionsFactory.deploy();

  await transactionsContract.deployed();

  console.log("Transactions address: ", transactionsContract.address);

  const domainNameAuthenticationFactory = await hre.ethers.getContractFactory("contracts/DomainNameAuthentication.sol:DomainNameAuthentication");
  const domainNameAuthenticationContract = await domainNameAuthenticationFactory.deploy();

  await domainNameAuthenticationContract.deployed();

  console.log("DomainNameAuthentication address: ", domainNameAuthenticationContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
