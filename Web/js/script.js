// 功德數量
var gd_num = 0;

// 初始化加載
$(function () {
	let zh_name = generateRandomChineseName();
	// 隨機生成名字
	$('#name').val(zh_name);
	$('.btn').val('等待中...');
	$('.btn').addClass('un');
	$('#sp_num').html(gd_num);
	$('#wallet').val('');
});

// 切換導航
$("nav a").click(function () {
	chk_href = $(this).attr("data-href");
	$('.content').hide();
	$('#' + chk_href).show();
	if (chk_href == 'gdl') {
		$('.start').show();
		$('.run').hide();
	}
});

// 投幣捐助
$('.btn-go').click(function () {
	$('.start').hide();
	$('.run').show();
	$('.btn').val('等待中...');
	$('.btn').addClass('un');
});

// 姓氏列表（台湾繁体中文）
const surnames = ['王', '李', '張', '劉', '陳', '楊', '黃', '趙', '吳', '周', '徐', '孫', '馬', '朱', '胡', '林', '郭', '何', '高'];
// 名字列表（台湾繁体中文）
const givenNames = ['思', '美', '宇', '雨', '婷', '華', '明', '瑞', '靜', '東', '洋', '寶', '麗', '勇', '軍', '秀', '國', '紅', '偉', '雪'];
// 隨機生成中文名
function generateRandomChineseName() {
	const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
	const randomGivenName = givenNames[Math.floor(Math.random() * givenNames.length)];
	return randomSurname + randomGivenName;
}

// 連接合約
const rpcHost = 'http://127.0.0.1:8545/';
const {
	ethers
} = window;
const provider = new ethers.providers.JsonRpcProvider(rpcHost);
// 创建合约对象
const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "macAddr",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "txID",
				"type": "uint256"
			}
		],
		"name": "onInsertCoin",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "userAddr",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenType",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "onRewardMeritSuccess",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "MAX_SHARE_AMOUNT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TOKEN_AMOUNT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TRANSFER_INTERVAL",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "macAddress",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "inShareAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "addDeviceHolder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "deviceDic",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenBalance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "regTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "bValid",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "macAddress",
				"type": "string"
			}
		],
		"name": "getDevice",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"components": [
							{
								"internalType": "address",
								"name": "holder",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "shareAmount",
								"type": "uint256"
							}
						],
						"internalType": "struct MorphingBlock.ShareInfo[]",
						"name": "shareList",
						"type": "tuple[]"
					},
					{
						"internalType": "uint256",
						"name": "tokenBalance",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "regTime",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "bValid",
						"type": "bool"
					}
				],
				"internalType": "struct MorphingBlock.DeviceInfo",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "startIdx",
				"type": "uint256"
			}
		],
		"name": "getDeviceList",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"components": [
							{
								"internalType": "address",
								"name": "holder",
								"type": "address"
							},
							{
								"internalType": "uint256",
								"name": "shareAmount",
								"type": "uint256"
							}
						],
						"internalType": "struct MorphingBlock.ShareInfo[]",
						"name": "shareList",
						"type": "tuple[]"
					},
					{
						"internalType": "uint256",
						"name": "tokenBalance",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "regTime",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "bValid",
						"type": "bool"
					}
				],
				"internalType": "struct MorphingBlock.DeviceInfo[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddr",
				"type": "address"
			}
		],
		"name": "getUser",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenBalance",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastTransferTime",
						"type": "uint256"
					}
				],
				"internalType": "struct MorphingBlock.UserInfo",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "startIdx",
				"type": "uint256"
			}
		],
		"name": "getUserList",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenBalance",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastTransferTime",
						"type": "uint256"
					}
				],
				"internalType": "struct MorphingBlock.UserInfo[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "macAddress",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "inAmount",
				"type": "uint256"
			}
		],
		"name": "insertCoin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "macAddress",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "initialTokens",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "registerDevice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "macAddress",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "inAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenType",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "txID",
				"type": "uint256"
			}
		],
		"name": "rewardMerit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "intMeritTokenInst",
				"type": "address"
			}
		],
		"name": "setMeritSlave",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "txInfoDic",
		"outputs": [
			{
				"internalType": "bool",
				"name": "bValid",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "bFinished",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "txID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "txTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userTokenDic",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenBalance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastTransferTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// MAC地址
var macAddr = '';
// 錢包地址
var walletAddr = '';
var l_inAmount = '';
var l_txCounter = '';
// 合約
const contract = new ethers.Contract(contractAddress, abi, provider);

// 监听合约事件
contract.on("onInsertCoin", (macAddress, inAmount, txCounter, event) => {
	console.log(macAddress);
	console.log(inAmount);
	console.log(txCounter);
	console.log(event.blockNumber);
	macAddr = macAddress;
	l_inAmount = inAmount;
	l_txCounter = txCounter;
	$('.btn').val('領取功德');
	$('.btn').removeClass('un');
});

// 領取功德
$('.btn').click(function () {
	let wallet = $('#wallet').val();
	if (wallet.length == 0) {
		alert('請輸入您的錢包地址！');
		return;
	}
	walletAddr = wallet;
	const getUrl = 'http://127.0.0.1:18099/req_reward?macAddr=' + macAddr + '&walletAddr=' + walletAddr + '&inAmount=' + l_inAmount + '&tokenType=1&txID=' + l_txCounter;
	console.log(getUrl);
	fetch(getUrl)
		.then(response => response.json())
		.then(data => {
			// 处理 JSON 数据
			//			console.log(data);
			if (data.code == true) {
				gd_num++;
				// 領取功德成功
				gdAdd();
				// 在3秒后执行这段代码
				window.setTimeout(function () {
					gdEnd();
				}, 3000);
			} else {
				alert('功德已被領取！')
			}
		})
});

// 功德增加
function gdAdd() {
	$('#sp_num').html(gd_num);
	$('.an').addClass('fading-text');
	$('.font').addClass('fading-glow');
}

function gdEnd() {
	$('.btn').val('功德已領取，繼續等待中...');
	$('.btn').addClass('un');
	$('.an').removeClass('fading-text');
	$('.font').removeClass('fading-glow');
}