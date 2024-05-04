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

* Coming to the transaction hashes are stored in the local storage as this would require a new database if we wanted to display all the transaction hashes
* I felt that it would be better for the user who use it to see only their hashes
  * the ones which they list in that current session or the ones which they buy in that session

### Step -6
* The above three files should be enough to deploy the code in local host using the live server.
* Now to deploy the files we create a app.yaml file which is used as configuration file for the google cloud.
* This file dictates how the app performs
* In the app.yaml file we have used python39 runtime environment
* We use 4 specific handlers to handle the application
  * handler-1 fevicon.ico: This tells App Engine to serve the favicon.ico file when this URL is accessed.
  * handler-2 This matches any requests that begin with /static. It is intended for serving a directory of static files.
  * handler-3 url: /(.*\.(gif|png|jpg|css|js)): This regular expression matches any URL ending in .gif, .png, .jpg, .css, or .js. The .* means "any sequence of characters," and the parentheses capture this part of the URL for reuse in the configuration.
  * handler-4 url: /.*: This pattern matches any URL (.* means any sequence of characters).
static_files: index.html: No matter what URL is requested, this configuration tells App Engine to serve the index.html file.
  * secure: always: This ensures that all requests to these URLs are served over HTTPS. If a request is made over HTTP, App Engine will redirect to HTTPS. This also avoids creating a new domain and usage of lets encrypt function.
  
### Step -7
* Now after we create these files we open the google console
* Now search for APP engine in the google console and open the new project in the app engine
* using the python39 runtime environment
```  or  ```
* simply open the app engine then open the shell
* Then create a new directory then upload all these file into the google cloud
* Then after uploading the 4 files index.html, app.js, styles.css and app.yaml into the cloud
* execute the command ``` gcloud app deploy ``` which deploys the application in as the local host but in a public domain
* Then to see the browse execute the command ``` gcloud app browse ``` which gives us the link for the application incase we miss it.
* Upon clicking the link we can see the working application   

## Execution
* upon opening the application we see the connect wallet button. click on it if its the first time connecting to the application then a contract signing gas would be charged and a notification will pop up in the meta mask wallet . By clicking confirm the application establishes a proper connection with metamask.
* If the connection is rejected an error is poped up.
* Upon succesful connection all the items which were already listed on the blockchain are shown.
  ### listing an item
  * to list an item item we have 3 parameters
  * 1 title
  * 2 description
  * 3 price of the item in wei
  * Upon entering all the details click on the listitem button to the list the item in to the block chain a gas fee is charged on to the wallet to list the item in to the marketplace.
  ### Items
  * There are 4 buttons in this part of the application
  * 1 list items - this shows all the items present in the blockchain marketplace
  * 2 sold item - this shows the items which listed by the current user which are sold
  * 3 unsold items - this shows all the items which are unsold, listed by the current user 
  * 4 Available items - this shows all the items which are available to buy for the current user listed by others
  #### !!!Note
  * The current user cannot buy their own items
  * If a meta mask account is switched wallet needs to reconnected which can be simply done by pressing the connect wallet button.(Failure to do so may not change the wallet or might lead to an error).

  ### Buying the item
  * The item can be bought by entering the existing or new Item id in the text field and upon clicking on the buy item button a notification is sent to the wallet with the price of the item plus gas fee.
  * Upon confirmation the Item sold status is updated to Yes if sucessfully bought. In case if the transaction is rejected for any reason an ERROR is popped .
  * Only the items which are shown in available items can be bought by the current user.
  * If the current user tries to buy an item which is already sold or the id does not exist in the block chain an alert is popped.

### Transanction Hashes
* The trasaction hashes are only visible if a new item is listed into the marketplace or an item is bought from the marketplace.
* The trasaction hashes are hyper-linked to Sepolia etherscan website to verify the trasactions.
  


