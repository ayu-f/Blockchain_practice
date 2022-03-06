//Moralis.initialize("OwQCmcVGsKLJmj9nH68jzqUjsOCzefMVnRRRcsCt");
//Moralis.serverURL = "https://ijayfk3xzree.usemoralis.com:2053/server";
const serverUrl = "https://ijayfk3xzree.usemoralis.com:2053/server";
const appId = "OwQCmcVGsKLJmj9nH68jzqUjsOCzefMVnRRRcsCt";
const contract_address = "0x0ee8d7964cc9bfe942e2769a02339356a4e2c120";
Moralis.start({ serverUrl, appId });
let currentUser;

function fetchNFTMetadata(NFTs){
    let promises = []
    for (let i = 0; i < NFTs.length; i++){
        let nft = NFTs[i];
        let id = nft.token_id;
        if(nft.metadata == null){
            continue;
        }
        promises.push(fetch("https://ijayfk3xzree.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=OwQCmcVGsKLJmj9nH68jzqUjsOCzefMVnRRRcsCt&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then(res => {
            const options = { address: contract_address, token_id: id, chain: "rinkeby" };
            return Moralis.Web3API.token.getTokenIdOwners(options);
        })
        .then( (res) => {
            nft.owners = [];
            res.result.forEach(element => {
                nft.owners.push(element.owner_of);
            });
            return nft;
        }))
    }

    return Promise.all(promises);
}

function renderMetadata(NFTs, ownerData){
    const parent = document.getElementById("app");
    for(let i = 0; i < NFTs.length; i++){
        const nft = NFTs[i];
        if(nft.metadata == null){
            continue;
        }
        let htmlString = `
        <div class="card">
            <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${nft.metadata.name}</h5>
                <p class="card-text">${nft.metadata.description}</p>
                <p class="card-text">Amount: ${nft.amount}</p>
                <p class="card-text">Number of owners: ${nft.owners.length}</p>
                <p class="card-text">Your balance: ${ownerData[nft.token_id]}</p>
                <a href="mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
                <a href="transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
            </div>
        </div>
        `
        let col = document.createElement("div");
        col.className = "col col-md-4"
        col.innerHTML = htmlString;
        parent.appendChild(col);

    }
}

async function getOwnerData() {
    let accounts = currentUser.get("accounts");
    const options = {chain: "rinkeby", address: accounts[0], token_address: contract_address};
    return Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
        let result = data.result.reduce((object, currentElement) => {
            object[currentElement.token_id] = currentElement.amount;
            return object;
        }, {})
        return result;
    });
}

async function initializeApp(){
     currentUser = Moralis.User.current();
     if(!currentUser){
         currentUser = await Moralis.Web3.authenticate();
     }

    const options = { address: contract_address, chain: "rinkeby" };
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    //fetchNFTMetadata(NFTs.result);
    let NFTwithMetadata = await fetchNFTMetadata(NFTs.result);
    let ownerData = await getOwnerData();
    renderMetadata(NFTwithMetadata, ownerData);
}


initializeApp();