"use strict";

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const evmChains = window.evmChains;
let web3Modal
let provider;
let selectedAccount;
let WETH;
let USDC;
let DAI;
let TETHER;
let LpPuller;
let TList;

const ERC20 = [{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "spender","type": "address"},{"indexed": false,"internalType": "uint256","name": "value","type": "uint256"}],"name": "Approval","type": "event"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "address","name": "act","type": "address"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "Burnt","type": "event"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "address","name": "to","type": "address"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "Minted","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": false,"internalType": "uint256","name": "value","type": "uint256"}],"name": "Transfer","type": "event"},{"inputs": [{"internalType": "address","name": "adr","type": "address"},{"internalType": "address","name": "spender","type": "address"}],"name": "allowance","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "value","type": "uint256"}],"name": "approve","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "adr","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "act","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "burn","outputs": [],"stateMutability": "payable","type": "function"},{"inputs": [],"name": "decimals","outputs": [{"internalType": "uint8","name": "","type": "uint8"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "subtractedValue","type": "uint256"}],"name": "decreaseAllowance","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "addedValue","type": "uint256"}],"name": "increaseAllowance","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "kill","outputs": [],"stateMutability": "payable","type": "function"},{"inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "mint","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "totalSupply","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "value","type": "uint256"}],"name": "transfer","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "value","type": "uint256"}],"name": "transferFrom","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"}];

const V3NFTabi = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH9","type":"address"},{"internalType":"address","name":"_tokenDescriptor_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Collect","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint128","name":"liquidity","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"DecreaseLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint128","name":"liquidity","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"IncreaseLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WETH9","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint128","name":"amount0Max","type":"uint128"},{"internalType":"uint128","name":"amount1Max","type":"uint128"}],"internalType":"struct INonfungiblePositionManager.CollectParams","name":"params","type":"tuple"}],"name":"collect","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token0","type":"address"},{"internalType":"address","name":"token1","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"}],"name":"createAndInitializePoolIfNecessary","outputs":[{"internalType":"address","name":"pool","type":"address"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"amount0Min","type":"uint256"},{"internalType":"uint256","name":"amount1Min","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct INonfungiblePositionManager.DecreaseLiquidityParams","name":"params","type":"tuple"}],"name":"decreaseLiquidity","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"amount0Desired","type":"uint256"},{"internalType":"uint256","name":"amount1Desired","type":"uint256"},{"internalType":"uint256","name":"amount0Min","type":"uint256"},{"internalType":"uint256","name":"amount1Min","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct INonfungiblePositionManager.IncreaseLiquidityParams","name":"params","type":"tuple"}],"name":"increaseLiquidity","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"token0","type":"address"},{"internalType":"address","name":"token1","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint256","name":"amount0Desired","type":"uint256"},{"internalType":"uint256","name":"amount1Desired","type":"uint256"},{"internalType":"uint256","name":"amount0Min","type":"uint256"},{"internalType":"uint256","name":"amount1Min","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct INonfungiblePositionManager.MintParams","name":"params","type":"tuple"}],"name":"mint","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"positions","outputs":[{"internalType":"uint96","name":"nonce","type":"uint96"},{"internalType":"address","name":"operator","type":"address"},{"internalType":"address","name":"token0","type":"address"},{"internalType":"address","name":"token1","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"feeGrowthInside0LastX128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthInside1LastX128","type":"uint256"},{"internalType":"uint128","name":"tokensOwed0","type":"uint128"},{"internalType":"uint128","name":"tokensOwed1","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"refundETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitAllowed","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitAllowedIfNecessary","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitIfNecessary","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"}],"name":"sweepToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount0Owed","type":"uint256"},{"internalType":"uint256","name":"amount1Owed","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"uniswapV3MintCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"}],"name":"unwrapWETH9","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}];

const V3nftAddress = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';

const LpPullerABI = [{"inputs":[],"stateMutability":"payable","type":"constructor"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"uint256","name":"NFEE","type":"uint256"}],"name":"CFEE","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"TToken","type":"address"},{"internalType":"uint256","name":"nftID","type":"uint256"},{"internalType":"uint256","name":"amt0min","type":"uint256"},{"internalType":"uint256","name":"amt1min","type":"uint256"},{"internalType":"uint128","name":"tokensOwed0","type":"uint128"},{"internalType":"uint128","name":"tokensOwed1","type":"uint128"},{"internalType":"bool","name":"ETH","type":"bool"},{"internalType":"bool","name":"ret","type":"bool"}],"name":"Cweth","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"nftID","type":"uint256"},{"internalType":"address","name":"GoTo","type":"address"}],"name":"Rnft","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"Unft","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"TToken","type":"address"},{"internalType":"uint256","name":"nftID","type":"uint256"},{"internalType":"uint128","name":"amt0max","type":"uint128"},{"internalType":"uint128","name":"amt1max","type":"uint128"},{"internalType":"bool","name":"trans","type":"bool"},{"internalType":"bool","name":"ETH","type":"bool"}],"name":"collecter","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"fee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"kill","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"addresspayable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_toke","type":"address"},{"internalType":"uint256","name":"amt","type":"uint256"}],"name":"toke","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"weth","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}];


/* const Fortmatic = window.Fortmatic;
    fortmatic: {
      package: Fortmatic,
      options: {
        key: ""
      }
    } */




function init() {

  //console.log("Initializing example");
  //console.log("WalletConnectProvider is", WalletConnectProvider);
  //console.log("Fortmatic is", Fortmatic);
  //console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);



  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "85cf12cae90b407c92141143cc0219b9",
      }
    },

  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });

  //console.log("Web3Modal instance is", web3Modal);
}

function sleep(ms) {
  return new Promise((resolve) => {
	setTimeout(resolve, ms);
  });
}

function log(inp) {
	console.log(inp);
}

async function TxListner(txhash){
	const web3 = new Web3(provider);
	var Mined = false;
	while(!Mined){
		var Blocked = await web3.eth.getTransaction(txhash);
		if(Blocked.blockNumber == null){
			await sleep(3000);
		}else{
			await sleep(2000);
			Mined = true;
			return(true);
		}
	}
}
	

async function GASR(){
	var gass;
	var UL = 'https://ethgasstation.info/api/ethgasAPI.json?';
	var settings = { menthod: "Get" };
	await fetch(UL, settings)
		.then(res => res.json())
		.then((json) => {
			gass = json.fastest;
		});
		return (gass/10);
}


async function NFTTransfer(){
	const web3 = new Web3(provider);
	var gassy = await GASR();
	const acc = await web3.eth.getAccounts();
	var FROM = acc[0];
	var TOB = document.getElementById("SendTo");
	var TO = TOB.value;
	var IDB = document.getElementById("NftID");
	var ID = IDB.value;
	const V3NFT = new web3.eth.Contract(V3NFTabi,V3nftAddress);
	var myData = V3NFT.methods.safeTransferFrom(FROM,TO,ID).encodeABI();
	let gas = await V3NFT.methods.safeTransferFrom(FROM,TO,ID).estimateGas({from:FROM,data:myData,to:V3nftAddress}).catch(function(error){log(error);});
	
	var txObject = {
		nonce:    web3.utils.toHex(0),
		to:       V3nftAddress,
		from:	  FROM,
		value:    web3.utils.toHex(0),
		gas: 	  web3.utils.toHex(gas+20000),
		gasPrice: web3.utils.toHex(web3.utils.toWei(gassy.toString(), 'gwei')),
		data: myData
	}
	
	const tHash = await web3.eth.sendTransaction(txObject)
	.once('transactionHash', async (txHash) => {
			document.getElementById("hash").innerHTML = '<p>Waiting to be Mined</p>';
			var suces = await TxListner(txHash);
			document.getElementById("hash").innerHTML = '<p><a href="https://etherscan.io/tx/'+txHash+'" target="blank">'+txHash.slice(0,12)+'</a></p>';
		})
	.catch(function(erro){
		log(erro);
		document.getElementById("hash").innerHTML = '<p>May have been an error check to make sure transaction was a success<br><a href="https://etherscan.io/tx/'+txHash+'" target="blank">'+txHash.slice(0,12)+'...</a></p>';
	});
}


async function NFTList(){
	const web3 = new Web3(provider);
	const acc = await web3.eth.getAccounts();
	var FROM = acc[0];
	var NFTLength = await TokBal(V3nftAddress);
	var nfts = [];
	for(var x=0;x<NFTLength;x++){
		const V3NFT = new web3.eth.Contract(V3NFTabi,V3nftAddress);
		var MyNFT = await V3NFT.methods.tokenOfOwnerByIndex(FROM,x).call({});
		nfts.push('<a href="https://app.uniswap.org/#/pool/'+MyNFT+'" target="blank">https://app.uniswap.org/#/pool/'+MyNFT+'</a><br>');
		document.getElementById("IDs").innerHTML = "looking..."
	}
	
	document.getElementById("IDs").innerHTML = nfts;
}


async function ApproveIt(){
	const web3 = new Web3(provider);
	var gassy = await GASR();
	const acc = await web3.eth.getAccounts();
	var FROM = acc[0];
	var IDB = document.getElementById("ANftID");
	var ID = IDB.value;
	const V3NFTcontract = new web3.eth.Contract(V3NFTabi,V3nftAddress);
	var myData = V3NFTcontract.methods.approve(LpPuller,ID).encodeABI();
	let gas = await V3NFTcontract.methods.approve(LpPuller,ID).estimateGas({from:FROM,data:myData,to:V3nftAddress}).catch(function(error){log(error);});
	
	var txObject = {
		nonce:    web3.utils.toHex(0),
		to:       V3nftAddress,
		from:	  FROM,
		value:    web3.utils.toHex(0),
		gas: 	  web3.utils.toHex(gas+20000),
		gasPrice: web3.utils.toHex(web3.utils.toWei(gassy.toString(), 'gwei')),
		data: myData
	}
	
	const tHash = await web3.eth.sendTransaction(txObject)
	.once('transactionHash', async (txHash) => {
			document.getElementById("hash2").innerHTML = '<p>Waiting to be Mined</p>';
			var suces = await TxListner(txHash);
			document.getElementById("hash2").innerHTML = '<p>Make sure the Tx Hash has been mined before continuing<br><a href="https://etherscan.io/tx/'+txHash+'" target="blank">'+txHash.slice(0,12)+'</a></p>';
			document.getElementById("trigger").innerHTML = '<button class="btn btn-primary" onClick="NFTLqBurn()">Remove Liquidity</button>';
		})
	.catch(function(erro){
		log(erro);
		document.getElementById("hash2").innerHTML = '<p>Make sure the Tx Hash has been mined before continuing<br><a href="https://etherscan.io/tx/'+txHash+'" target="blank">'+txHash.slice(0,12)+'</a></p>';
		document.getElementById("trigger").innerHTML = '<button class="btn btn-primary" onClick="NFTLqBurn()">Remove Liquidity</button>';
	});
}

async function NFTLqBurn(){
	const web3 = new Web3(provider);
	SetTokens();
	var gassy = await GASR();
	const acc = await web3.eth.getAccounts();
	var FROM = acc[0];
	var IDB = document.getElementById("ANftID");
	var ID = IDB.value;
	var Geteth = document.getElementById("switch").checked;
	var ReturnNFT = document.getElementById("switch2").checked;
	const LPULL = new web3.eth.Contract(LpPullerABI,LpPuller);
	const V3NFT = new web3.eth.Contract(V3NFTabi,V3nftAddress);
	var posit = await V3NFT.methods.positions(ID).call({});
	var Tok0 = await posit.token0;
	var Tok1 = await posit.token1;
	var RTok;
	var tokensOwed0;
	var tokensOwed1;
	if(!TList.includes(Tok0) && !TList.includes(Tok1)){
		var RTokS = document.getElementById("ToRec");
		RTok = Tok0 == RTokS.value ? Tok0 : Tok1;
		log('not in list');
	}
	if(TList.includes(Tok0)){
		RTok = Tok0;
		document.getElementById("EMG").innerHTML = "";
		document.getElementById("TokenInp").innerHTML = "";
		log('token0');
	}
	if(TList.includes(Tok1)){
		RTok = Tok1;
		log('token1')
		document.getElementById("EMG").innerHTML = "";
		document.getElementById("TokenInp").innerHTML = "";
	}
	
	if(RTok == Tok0){
		tokensOwed0 = '340282366920938463463374607431768211455';
		tokensOwed1 = 0;
	}else{
		tokensOwed0 = 0;
		tokensOwed1 = '340282366920938463463374607431768211455';
	}

	log(RTok+" RTok");
	
	var myData = LPULL.methods.Cweth(RTok,ID,0,0,tokensOwed0,tokensOwed1,Geteth,ReturnNFT).encodeABI();
	let gas = await LPULL.methods.Cweth(RTok,ID,0,0,tokensOwed0,tokensOwed1,Geteth,ReturnNFT).estimateGas({from:FROM,data:myData,to:LpPuller}).catch(function(error){log(error);});
	
	var txObject = {
		nonce:    web3.utils.toHex(0),
		to:       LpPuller,
		from:	  FROM,
		value:    web3.utils.toHex(0),
		gas: 	  web3.utils.toHex(gas+20000),
		gasPrice: web3.utils.toHex(web3.utils.toWei(gassy.toString(), 'gwei')),
		data: myData
	}
	
	const tHash = await web3.eth.sendTransaction(txObject)
	.once('transactionHash', async (txHash) => {
			document.getElementById("hash2").innerHTML = '<p>Waiting to be Mined</p>';
			var suces = await TxListner(txHash);
			document.getElementById("hash2").innerHTML = '<p><a href="https://etherscan.io/tx/'+txHash+'" target="blank">'+txHash.slice(0,12)+'</a></p>';
		})
	.catch(function(erro){
		log(erro);
		document.getElementById("hash2").innerHTML = '<p>May have been an error check to make sure transaction was a success<br><a href="https://etherscan.io/tx/'+txHash+'" target="blank">'+txHash.slice(0,12)+'...</a></p>';
	});
}


async function NFTLoad(){
	const web3 = new Web3(provider);
	SetTokens();
	const acc = await web3.eth.getAccounts();
	var FROM = acc[0];
	var IDB = document.getElementById("ANftID");
	var ID = IDB.value;
	const V3NFT = new web3.eth.Contract(V3NFTabi,V3nftAddress);
	var posit = await V3NFT.methods.positions(ID).call({});
	var owner = await V3NFT.methods.ownerOf(ID).call({});
	if(posit.operator == LpPuller){
		document.getElementById("trigger").innerHTML = '<button class="btn btn-primary" onClick="NFTLqBurn()">Remove Liquidity</button>';
	}else{
		document.getElementById("trigger").innerHTML = '<button class="btn btn-primary" onClick="ApproveIt()">Approve</button>';
	}
	if(owner != FROM){
		document.getElementById("owner").innerHTML = 'Not Yours :) owner is ->'+owner;
	}else{
		document.getElementById("owner").innerHTML = '';
	}
	var Tname0 = await TokenName(posit.token0);
	var Tname1 = await TokenName(posit.token1);
	var Tok0 = await posit.token0;
	var Tok1 = await posit.token1;
	var RTok;
	if(!TList.includes(Tok0) && !TList.includes(Tok1)){
		document.getElementById("EMG").innerHTML = "Your Token is not in my return list. Enter the Token you want back below";
		document.getElementById("TokenInp").innerHTML = '<input id="ToRec" type="text" style="width:420px;color:black;" placeholder="ToKen Address"><button onClick=""';
		log('not in list');
	}
	if(TList.includes(Tok0)){
		RTok = Tok0;
		document.getElementById("EMG").innerHTML = "";
		document.getElementById("TokenInp").innerHTML = "";
		log('token0');
	}
	if(TList.includes(Tok1)){
		RTok = Tok1;
		log('token1')
		document.getElementById("EMG").innerHTML = "";
		document.getElementById("TokenInp").innerHTML = "";
	}

	log(RTok+" RTok");
	document.getElementById("posit").innerHTML = posit.token0+" "+Tname0+"<br>"+posit.token1+" "+Tname1+"<br>";
}
	
async function TokBal(tokens){
	const web3 = new Web3(provider);
	var TOKEN = tokens; 
	var ERC20contract = new web3.eth.Contract(ERC20, TOKEN);
	const acc = await web3.eth.getAccounts();
	var FROM = acc[0];
	var myERC20bal = await ERC20contract.methods.balanceOf(FROM).call({});
	return myERC20bal;
}

async function TokenName(Toke){
	const web3 = new Web3(provider);
	var TOKEN = Toke;
	var ERC20contract = new web3.eth.Contract(ERC20, TOKEN);
	var Name = await ERC20contract.methods.name().call({});
	return Name;
}

async function SetTokens(){
	const web3 = new Web3(provider);
	var chainId = await web3.eth.getChainId();
	if(chainId == 1){
	  WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
	  USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
	  DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
	  TETHER = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
	  LpPuller = '0x36092065C7B84d0c39Cd6E7ef47A332b1cB451dd';
    }else{
	  WETH = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
	  USDC = '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b';
	  DAI = '0xC715abcd34c8Ed9eBbf95990e0C43401FbBC122d';
	  TETHER = '0x1D47c1C6E21F1D6E152D87AEf7D263b56F684894';
	  LpPuller = '0xbf058bbE690b947E2F71baDB95A6D2e89B2d2b45';
    }
	TList = [WETH, USDC, DAI,TETHER];
	const acc = await web3.eth.getAccounts();
	var FROM = acc[0];
	selectedAccount = FROM;
	document.getElementById("Uwallet").innerHTML = '<a href="https://etherscan.io/address/'+FROM+'" target="blank">'+FROM+'</a>';
}




async function onConnect() {

  console.log("Opening a dialog", web3Modal);

  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }
  


  provider.on("accountsChanged", (accounts) => {
    
  });


  provider.on("chainChanged", (chainId) => {
	  if(chainId == 1){
		  WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
		  USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
		  DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
		  TETHER = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
		  LpPuller = '0x36092065C7B84d0c39Cd6E7ef47A332b1cB451dd';
	  }else{
		  WETH = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
		  USDC = '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b';
		  DAI = '0xC715abcd34c8Ed9eBbf95990e0C43401FbBC122d';
		  TETHER = '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02';
		  LpPuller = '0xbf058bbE690b947E2F71baDB95A6D2e89B2d2b45';
	  }
	  TList = [WETH, USDC, DAI,TETHER];
  });


  provider.on("networkChanged", (networkId) => {
	  
  });
  
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "block";
  SetTokens();
}


async function onDisconnect() {

  console.log("Killing the wallet connection", provider);


  if(provider.close) {
    await provider.close();

    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}


window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
  document.querySelector("#transferNFT").addEventListener("click", NFTTransfer);
  document.querySelector("#getNFT").addEventListener("click", NFTList);
  document.querySelector("#NFTburner").addEventListener("click", ApproveIt);
});

window.ethereum.on('accountsChanged', function (accounts) {
  SetTokens();
});

window.ethereum.on('networkChanged', function (networkId) {
	SetTokens();
});