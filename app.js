const CONTRACT_ADDRESS = '0x0a82432b3e404d62360849b619fA347803dAaa5';
const CONTRACT_ABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        "name": "buyItem",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "seller", "type": "address" },
            { "indexed": false, "internalType": "string", "name": "title", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }
        ],
        "name": "ItemListed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "seller", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }
        ],
        "name": "ItemSold",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_title", "type": "string" },
            { "internalType": "string", "name": "_description", "type": "string" },
            { "internalType": "uint256", "name": "_price", "type": "uint256" }
        ],
        "name": "listItem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
        "name": "getItem",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "id", "type": "uint256" },
                    { "internalType": "address payable", "name": "seller", "type": "address" },
                    { "internalType": "address", "name": "owner", "type": "address" },
                    { "internalType": "string", "name": "title", "type": "string" },
                    { "internalType": "string", "name": "description", "type": "string" },
                    { "internalType": "uint256", "name": "price", "type": "uint256" },
                    { "internalType": "bool", "name": "sold", "type": "bool" }
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
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "items",
        "outputs": [
            { "internalType": "uint256", "name": "id", "type": "uint256" },
            { "internalType": "address payable", "name": "seller", "type": "address" },
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "string", "name": "title", "type": "string" },
            { "internalType": "string", "name": "description", "type": "string" },
            { "internalType": "uint256", "name": "price", "type": "uint256" },
            { "internalType": "bool", "name": "sold", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;
let userAccount = null;

function setStatus(message) {
    let statusEl = document.getElementById('statusMessage');
    if (!statusEl) {
        statusEl = document.createElement('p');
        statusEl.id = 'statusMessage';
        document.body.insertBefore(statusEl, document.body.firstChild);
    }
    statusEl.textContent = message;
}

async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        return true;
    }

    setStatus('MetaMask is required to use this site. Please install MetaMask and refresh.');
    return false;
}

async function startApp() {
    const ok = await initWeb3();
    if (!ok) return;

    document.getElementById('connectWallet').onclick = connectWallet;
    document.getElementById('listItemButton').onclick = listItem;
    document.getElementById('buyItemButton').onclick = buyItem;

    try {
        await renderItems();
        setStatus('Site loaded. Connect your wallet to continue.');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        setStatus('App loaded, but blockchain data could not be fetched yet.');
    }
}

async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        document.getElementById('connectWallet').innerText = `Wallet Connected: ${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;
        setStatus('Wallet connected successfully.');
        await renderItems();
    } catch (error) {
        console.error('Wallet connection failed:', error);
        setStatus('Wallet connection rejected or failed.');
        alert('Wallet connection failed. Please try again.');
    }
}

async function listItem() {
    if (!userAccount) {
        alert('Please connect your wallet first.');
        return;
    }

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = document.getElementById('price').value;

    if (!title || !description || !price) {
        alert('Please fill in title, description, and price.');
        return;
    }

    try {
        const response = await contract.methods.listItem(title, description, price).send({ from: userAccount });
        const listedId = response?.events?.ItemListed?.returnValues?.id;
        if (listedId !== undefined) {
            localStorage.setItem('listHash_' + listedId, response.transactionHash);
        }
        alert('Item listed successfully!');
        await renderItems();
    } catch (error) {
        console.error('Failed to list item:', error);
        alert('Failed to list item. Make sure you are on the correct network and the contract address is valid.');
    }
}

async function buyItem() {
    if (!userAccount) {
        alert('Please connect your wallet first.');
        return;
    }

    const id = document.getElementById('itemIdToBuy').value.trim();
    if (!id || isNaN(id)) {
        alert('Please enter a valid item ID.');
        return;
    }

    try {
        const item = await contract.methods.items(id).call();
        if (!item || item.sold === undefined) {
            alert('This item does not exist.');
            return;
        }
        if (item.sold) {
            alert('This item is already sold.');
            return;
        }

        const response = await contract.methods.buyItem(id).send({ from: userAccount, value: item.price });
        localStorage.setItem('buyHash_' + id, response.transactionHash);
        alert('Purchase successful!');
        await renderItems();
    } catch (error) {
        console.error('Failed to buy item:', error);
        alert('Failed to buy item. Check the contract address, wallet network, and item availability.');
    }
}

async function renderItems() {
    if (!contract) return;

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
    if (!contract || !userAccount) return;

    const itemCount = await contract.methods.itemCount().call();
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';
    for (let i = 0; i < itemCount; i++) {
        const item = await contract.methods.getItem(i).call();
        if (item.sold && item.seller && item.seller.toLowerCase() === userAccount.toLowerCase()) {
            const li = document.createElement('li');
            li.innerText = `ID: ${item.id}, Title: ${item.title}, Price: ${item.price} Wei, Sold: ${item.sold}`;
            itemsList.appendChild(li);
        }
    }
}

async function renderUnsoldItems() {
    if (!contract || !userAccount) return;

    const itemCount = await contract.methods.itemCount().call();
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';
    for (let i = 0; i < itemCount; i++) {
        const item = await contract.methods.getItem(i).call();
        if (!item.sold && item.seller && item.seller.toLowerCase() === userAccount.toLowerCase()) {
            const li = document.createElement('li');
            li.innerText = `ID: ${item.id}, Title: ${item.title}, Price: ${item.price} Wei, Sold: ${item.sold}`;
            itemsList.appendChild(li);
        }
    }
}

async function renderAvailableItems() {
    if (!contract || !userAccount) return;

    const itemCount = await contract.methods.itemCount().call();
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';
    for (let i = 0; i < itemCount; i++) {
        const item = await contract.methods.getItem(i).call();
        if (!item.sold && item.seller && item.seller.toLowerCase() !== userAccount.toLowerCase()) {
            const li = document.createElement('li');
            li.innerText = `ID: ${item.id}, Title: ${item.title}, Price: ${item.price} Wei, Available: Yes`;
            itemsList.appendChild(li);
        }
    }
}

window.addEventListener('DOMContentLoaded', startApp);
