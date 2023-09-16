// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
var json = require('../package-lock.json');
var ethers = require("ethers");

async function genOneWallet() {
   
  // 24个助记词
  let rand = ethers.utils.randomBytes(32);
  // console.log(rand);
  // 生成24个助记词
  //console.log(ethers.utils.HDNode);
  let mnemonic = ethers.utils.entropyToMnemonic(rand);
  //console.log(mnemonic);
  // 助记词路径
  let path = "m/44'/60'/0'/0/0";
  //console.log(path);
  // 检查助记词是否有效。
  if (!ethers.utils.isValidMnemonic(mnemonic)) {
    return;
  }
  // 通过助记词创建钱包
  let wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
  let { privateKey, address } = wallet;
  // 获取助记词路径
  //console.log("助记词路径：", path);
  // 获取助记词
  //console.log("钱包助记词：", mnemonic);
  // 获取助记词数量
  const wordNum = mnemonic.split(" ").length;
  //console.log("获取助记词数量：", wordNum);
  // 获取钱包的私钥
  //console.log("钱包私钥：", privateKey);
  // 获取钱包地址
  //console.log("genOneWallet:", privateKey, address);

  return wallet; 
}  
async function genOneWalletSimple() {
  const wallet = ethers.Wallet.createRandom();
  const { mnemonic, privateKey, address } = wallet;
  console.log("genOneWalletSimple:",privateKey, address);
  return wallet;
}
// 转账给默认
async function transferTo(wallet,toAddr,transValue = "10.086") {
  // All properties are optional
  let currentNonce = await wallet.getTransactionCount();
  let transaction = {
    nonce: currentNonce,
    gasLimit: 21000000,
    gasPrice: ethers.utils.parseEther('0.0000002'),
    to: toAddr,
    // ... or supports ENS names
    // to: "ricmoo.firefly.eth",

    value: ethers.utils.parseEther(transValue),
    data: "0x",

    // 这可确保无法在不同网络上重复广播
    chainId: 31337//ethers.utils.getNetwork('homestead').chainId
  }
  let txRes = await wallet.sendTransaction(transaction) 
  balance = await wallet.getBalance();
  console.log('transferTo done',toAddr,transValue);
}
// 生成钱包带有eth
async function getWalletWithMoney(provider,moneyValue = '1.0'){
  // 默认给1个eth
  let fakeNo_00 = "這裡的私鑰填寫自己的"
  let wallet =new ethers.Wallet(fakeNo_00, provider);
  let balance = await wallet.getBalance();
  let oneWallet = await genOneWallet();
  let { privateKey, address } = oneWallet;
  await transferTo(wallet,address,moneyValue);
  return oneWallet;
}
module.exports = { 
  // 方法 - 延时 
  sleep: async function (time) {
    return new Promise((resolve) => setTimeout(async () => {
      resolve()
    }, (time) * 1000));
  },
  genOneWallet:genOneWallet,
  getWalletWithMoney:getWalletWithMoney,
  genOneWalletSimple:genOneWalletSimple,
  transferTo:transferTo
}

// 以下这种写法报错SyntaxError: Unexpected token 'export'
// export const testLog = (word) => {
//   window.console.log(word);
// };