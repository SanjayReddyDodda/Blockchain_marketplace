const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
let contract;
let userAccount;
async function startApp() {
    const contractAddress ='0x0a82432b3e404d62360849b619fA347803dAaa5e'; 
    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "buyItem",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "seller",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "ItemListed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "seller",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "ItemSold",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_title",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "listItem",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "getItem",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address payable",
                            "name": "seller",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "title",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "price",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "sold",
                            "type": "bool"
                        }
                    ],
                    "internalType": "struct Marketplace.Item",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "itemCount",
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
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "items",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "address payable",
                    "name": "seller",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "sold",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    contract = new web3.eth.Contract(contractABI, contractAddress);

    document.getElementById('connectWallet').onclick = connectWallet;
    document.getElementById('listItemButton').onclick = listItem;
    document.getElementById('buyItemButton').onclick = buyItem;
    renderItems();
}
async function connectWallet() {
    const accounts = await web3.eth.requestAccounts();
    userAccount = accounts[0];
    document.getElementById('connectWallet').innerText = `Wallet Connected: ${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;
}
async function listItem() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    try {
        const response = await contract.methods.listItem(title, description, price).send({from: userAccount});
        console.log("Transaction hash for listing item:", response.transactionHash);
        localStorage.setItem('listHash_' + response.events.ItemListed.returnValues.id, response.transactionHash);
        alert("Item listed successfully! Transaction hash: " + response.transactionHash);
        renderItems();
    } catch (error) {
        console.error("Failed to list item:", error);
        alert("Failed to list item, please try again.");
    }
}

async function buyItem() {
    const id = document.getElementById('itemIdToBuy').value.trim();
    if (!id || isNaN(id)) {
        alert("Please enter a valid item ID.");
        return; 
    }
    try {
        const item = await contract.methods.items(id).call();
        if (!item || item.sold === undefined) {
            alert("This item does not exist.");
            return;
        }
        if (item.sold) {
            alert("This item is already sold.");
        } else {
            const response = await contract.methods.buyItem(id).send({ from: userAccount, value: item.price });
            console.log("Transaction hash:", response.transactionHash);
            localStorage.setItem('buyHash_' + id, response.transactionHash);
            alert("Purchase successful! Transaction hash: " + response.transactionHash);
            renderItems();
        }
    } catch (error) {
        console.error("Failed to retrieve or buy item:", error);
        alert("Operation failed, please try again.");
    }
}
async function renderItems() {
    const itemCount = await contract.methods.itemCount().call();
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';
    for (let i = 0; i < itemCount; i++) {
        const item = await contract.methods.getItem(i).call();
        const listItem = document.createElement('li');
        listItem.className = 'item-entry';
        const listHash = localStorage.getItem('listHash_' + item.id);
        const buyHash = localStorage.getItem('buyHash_' + item.id);
        const listHashLink = listHash ? `<a href="https://sepolia.etherscan.io/tx/${listHash}" target="_blank" rel="noopener noreferrer">${listHash}</a>` : 'Unavailable';
        const buyHashLink = buyHash ? `<a href="https://sepolia.etherscan.io/tx/${buyHash}" target="_blank" rel="noopener noreferrer">${buyHash}</a>` : 'Unavailable';
        listItem.innerHTML = `
            <div class="item-info">
                <strong>ID:</strong> ${item.id} <br>
                <strong>Title:</strong> ${item.title} <br>
                <strong>Price:</strong> ${item.price} Wei <br>
                <strong>Sold:</strong> ${item.sold ? 'Yes' : 'No'}
            </div>
            <div class="transaction-info">
                <strong>Listing TX:</strong> ${listHashLink} <br>
                <strong>Buy TX:</strong> ${buyHashLink}
            </div>
        `;
        itemsList.appendChild(listItem);
    }
}


async function renderSoldItems() {
    const itemCount = await contract.methods.itemCount().call();
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';
    for (let i = 0; i < itemCount; i++) {
        const item = await contract.methods.getItem(i).call();
        if (item.sold && item.seller === userAccount) {
            const listItem = document.createElement('li');
            listItem.innerText = `ID: ${item.id}, Title: ${item.title}, Price: ${item.price} Wei, Sold: ${item.sold}`;
            itemsList.appendChild(listItem);
        }
    }
}
async function renderUnsoldItems() {
    const itemCount = await contract.methods.itemCount().call();
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';
    for (let i = 0; i < itemCount; i++) {
        const item = await contract.methods.getItem(i).call();
        if (!item.sold && item.seller === userAccount) {
            const listItem = document.createElement('li');
            listItem.innerText = `ID: ${item.id}, Title: ${item.title}, Price: ${item.price} Wei, Sold: ${item.sold}`;
            itemsList.appendChild(listItem);
        }
    }
}
async function renderAvailableItems() {
    const itemCount = await contract.methods.itemCount().call();
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';
    for (let i = 0; i < itemCount; i++) {
        const item = await contract.methods.getItem(i).call();
        if (!item.sold && item.seller !== userAccount) { 
            const listItem = document.createElement('li');
            listItem.innerText = `ID: ${item.id}, Title: ${item.title}, Price: ${item.price} Wei, Available: ${!item.sold}`;
            itemsList.appendChild(listItem);
        }
    }
}
window.addEventListener('load', function() {
    startApp();
});
