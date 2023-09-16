# 智能合约开发模板说明

## 安装

```cmd
// PS:1、先开梯子 2、使用npm安装依赖，yarn有时候安装的依赖会报错 
npm install
```

## 快捷命令

```cmd
// 编译合约
npm rum compile

// 测试合约
npm rum test

// 测量合约
npm run coverage

// 在本地网络部署合约
// 1.启动本地网络服务
npm run node
// 2.部署合约到本地网络（PS:需新开shell窗口）
npm run localhost

// 部署合约到goerli网络
npm run goerli

// 部署合约到主网
npm run mainnet


```

## 注意事项

- 验证合约需要填写EtherScan API才能使用，所以需使用原始命令，这里就不提供后续快捷命令
- 合约开发模板已内置`OpenZeppelin`合约库，安装即可使用。

## 测试Hardhat环境

> 查看`hardhat`可用命令

```cmd
npx hardhat help
```

> 运来检查当前环境支持哪些任务

```cmd
npx hardhat
```

## 合约开发常用命令

```cmd
// 编译合约
npx hardhat compile

// 测试合约，用途：预测合约手续费报表
npx hardhat test

// 测量代码覆盖率，用途：查看代码使用率并提供一份报表
npx hardhat coverage

// 部署合约到本地网络
// 1.启动本地hardhat网络，用途：用于本地测试，方便外部客户端（MetaMask、Dapp前端或脚本）可以连接到。
npx hardhat node

// 2.新开shell窗口在本地部署合约
npx hardhat run scripts/deploy.js
或者
npx hardhat run scripts/deploy.js --network localhost

// 部署合约到goerli网络
npx hardhat run scripts/deploy.js --network goerli

// 验证合约，需要先部署到网络上
// 1.部署合约到goerli网络
npx hardhat run scripts/deploy.js --network goerli
// 2.验证合约，address参数为部署到网络上的合约地址
npx hardhat verify --network goerli <address>

```

## 协同开发

### Prettier

vscode插件市场搜索安装即可

### vscode安装插件Solidity + Hardhat

[Solidity + Hardhat](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity)

## 参考文档

[Solidity 智能合约开发 - Hardhat 框架使用](https://www.pseudoyu.com/zh/2022/06/09/learn_solidity_from_scratch_hardhat/)


## 合约底层调试打印日志：

## 增加引入如下库  import "./../utils/dbg.sol"; // 用的是console.log的那个文件打印日志文件，并修改为dbg
## 如在node_modules\@openzeppelin\contracts\token\ERC721\ERC721.sol 头部增加，就可以使用 
## dbg.log('_burn   ============> success', tokenId);
## 但是注意，部署正式合约时候需要删除，调试日志代码会占用 bytecode 字节码，导致部署合约太大而失败