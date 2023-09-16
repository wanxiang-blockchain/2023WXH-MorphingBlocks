// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const czWeb3Helper = require("../scriptUtils/czWeb3Helper");
var json = require('../package-lock.json');
const { utils } = require("mocha");
const { stringify } = require("querystring");
//console.log(json)
// 方法 - 延时
async function sleep(time) {
  return new Promise((resolve) => setTimeout(async () => {
    resolve()
  }, (time) * 1000));
}

async function onRewardMeritSuccess  (userAddr,tokenType,amount) {
  console.log('=====> onRewardMeritSuccess',userAddr,tokenType,amount);
}
  
async function onInsertCoin(macAddress,inAmount,txCounter) {
  console.log('=====> onInsertCoin',macAddress,inAmount,txCounter);
}
  
// deploy MeritToken contract
async function deployMeritToken() {
  const contractFactory = await ethers.getContractFactory("MeritToken");
  //const deployer = await contractFactory.deploy("https://example.com/api/token/{id}.json");
  const deployer = await contractFactory.deploy('MeritToken','MeritToken');
  console.log("Contract MeritToken deployed to address:", deployer.address);

  return deployer;
}
// deploy morphing block contract
async function deployMorphingBlock() {
  const contractFactory = await ethers.getContractFactory("MorphingBlock");
  const deployer = await contractFactory.deploy();
  console.log("Contract MorphingBlock deployed to address:", deployer.address);

  return deployer;
}

async function showBalance(deployer) {
  let masterBalance = await deployer.getMyBalance();
  console.log('showBalance has: ', masterBalance);
}
// deploy master contract
async function deployMaster() {

  // 部署合约时，默认使用第一个账号（index 0）
  const [deployer] = await ethers.getSigners();
  console.log('deployer => ',deployer.address);

  // step1: deploy contract
  const meritTokenDeployer = await deployMeritToken();
  const morphingBlockDeployer = await deployMorphingBlock();
 

  // step2: 设置权限
  await meritTokenDeployer.addMintAuth(morphingBlockDeployer.address,true);
  await morphingBlockDeployer.setMeritSlave(meritTokenDeployer.address);

  morphingBlockDeployer.on('onRewardMeritSuccess', onRewardMeritSuccess)
  morphingBlockDeployer.on('onInsertCoin', onInsertCoin)

  // step3: 注册设备
  let macAddr = 'mac:10086';
  await morphingBlockDeployer.registerDevice(macAddr,100000,deployer.address);

    
  const oneETH = 1000000000000000000;
  let allWalletList = [];
  for (let idx = 0; idx < 1; ++idx) { 
    let {privateKey, address} = await czWeb3Helper.getWalletWithMoney(morphingBlockDeployer.provider);
    userWallet = new ethers.Wallet(privateKey, morphingBlockDeployer.provider);
    allWalletList.push(userWallet);
    let beginBalance = await userWallet.getBalance(); 
    console.log('getWalletWithMoney:',address,beginBalance/oneETH); 
    {     
      console.log('addDeviceHolder device : ',allWalletList[idx].address);
      // 模拟验证
      await morphingBlockDeployer.addDeviceHolder(macAddr,100000*(idx+1),userWallet.address);
      await sleep(2)
    } 
  } 

  await sleep(5)
  let devicelist = await morphingBlockDeployer.getDeviceList(0);
  // console.log('devicelist len ===> ',devicelist[0]);
  for(let idx = 0;idx < devicelist[0]; ++idx){
    console.log('===> ',devicelist[0],devicelist[1][idx]);
  }


  let userlist = await morphingBlockDeployer.getUserList(0);
  // console.log('userlist len ===> ',userlist[0]);
  for(let idx = 0;idx < userlist[0]; ++idx){
    console.log('===> ',userlist[0],userlist[1][idx]);
  }
  console.log("deployMaster done"); 
 
}
async function main() {
  await deployMaster();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});