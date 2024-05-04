# Blockchain_marketplace
### Project Link - https://blockchain-project-422215.uc.r.appspot.com/

### Technologies Used
* Remix IDE (for contract generation and deployment)
* Metamask wallet
* Sepholia faucet
* VS code (for editing and integrating the frontend with the deployed contract)
* Live-server extension(for testing the implemented frontend and to verify the functionalities)
* Web3
* Google cloud (for deploying the D-app)
  
## Description
* The Project is a Blockchain marketplace which allows the user to connect to their respective metamask wallet with sepholia ether in it.
* The project is mainly depended on the solidilty contract for all the implementations
* The solidity contract has mainly 3 functions which are
  * Listing an Item
  * Buying an Item
  * Getting the Item count

### Listing an Item
* This function takes input as
   * Title
   * description
   * Price in Wei

### Buying an Item
* This function retrieves an item from blockchain using the ID which is generated while listing the item.

## Project Implementation
### Step-1
* Download the meta mask and create a new wallet in the metamask and configure it to sepolia Testnet
* Then using any sepolia test faucet receive Test coins Into your wallet (some faucets : ``` https://sepolia-faucet.pk910.de/ ```)
### Step -2
* Write the Smart contact in Remix IDE and compile and deploy the contract
### Step -3
* After deploying the contract we get a contract address and ABI which copy it from the remix IDE.
### Step -4
* Now we get to the development of the Frontend Code
* This project has basic implementation of HTML, JS and CSS
* Now we explore the extensions in VS code : search for live server which helps us to create a random server for the HTML page which we are gonna develop
* The live server eliminates the creation of local server as it acts as a server and doesnt require any inputs from us.
* A random Port is generated from the live server this helps us to code the Front end simultaneously along with running the webpage on a local host
### Step -5
* Now we create 3 files which are
   * app.js
   * index.html
   * styles.css
* The styles.css file has all the stylings required for the webpage.
* The index.html has the basic structure with sections for listing items, viewing items, and purchasing items.
* The app.js has the web3 initializations which is used to establish connection with etherium node. which allowed us to iteration with the blockchain
* Then we write the contract implementation code using the contract address and contract ABI
* This establishes a connection between the contract which was deployed in remix ide with the frontend
* ### Functions
  * startApp(): Initializes the application, sets up the contract instance, and binds UI elements like buttons to their respective functions.
  * connectWallet(): Connects to the user's Ethereum wallet using MetaMask or similar browser-based wallets.
  * listItem(): Lists a new item for sale on the marketplace by invoking the listItem function of the smart contract.
  * buyItem(): Allows a user to purchase an available item, handling transaction logic and updating item status.
  * renderItems(), renderSoldItems(), renderUnsoldItems(), renderAvailableItems(): These functions fetch and display items based on their sale status and relation to the user (whether they are the seller or potential buyer).


