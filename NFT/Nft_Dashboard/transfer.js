const serverUrl = "https://ijayfk3xzree.usemoralis.com:2053/server";
const appId = "OwQCmcVGsKLJmj9nH68jzqUjsOCzefMVnRRRcsCt";
const contract_address = "0x0ee8d7964cc9bfe942e2769a02339356a4e2c120";
Moralis.start({ serverUrl, appId });

async function init() {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
        window.location.pathname = "/index.html";
    }

    web3 = await Moralis.Web3.enable();

    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    document.getElementById("token_id_input").value = nftId;
}

async function transfer() {
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value);

    const options = {type: "erc1155",
                     receiver: address,
                     contract_address: contract_address,
                     token_id: tokenId,
                     amount: amount}
    let result = await Moralis.transfer(options);
    console.log(result);
}

document.getElementById("submit_transfer").onclick = transfer;

init();