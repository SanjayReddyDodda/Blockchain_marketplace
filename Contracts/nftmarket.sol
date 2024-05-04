// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Marketplace Smart Contract
 * This contract allows users to list items for sale and buy them.
 */
contract Marketplace {
    // Defines the structure of an item within the marketplace.
    struct Item {
        uint id;                // Unique identifier for tracking items.
        address payable seller; // Address of the item's seller.
        address owner;          // Address of the item's current owner.
        string title;           // Title of the item.
        string description;     // Description of the item.
        uint price;             // Price of the item in wei.
        bool sold;              // Status of the item, sold or not.
    }

    // Array of all items listed in the marketplace.
    Item[] public items;

    // Keeps track of the number of items in `items` array.
    uint public itemCount = 0;

    // Event that is emitted when a new item is listed in the marketplace.
    event ItemListed(uint id, address indexed seller, string title, uint price);

    // Event that is emitted when an item is sold to a new owner.
    event ItemSold(uint id, address indexed seller, address indexed buyer, uint price);

    /**
     * Lists an item for sale on the marketplace.
     * @param _title - Title of the item.
     * @param _description - Description of the item.
     * @param _price - Price of the item in wei.
     * Requires the item price to be greater than 0.
     */
    function listItem(string memory _title, string memory _description, uint _price) public {
        require(_price > 0, "Price must be at least 1 wei");
        items.push(Item({
            id: itemCount,
            seller: payable(msg.sender),
            owner: msg.sender,
            title: _title,
            description: _description,
            price: _price,
            sold: false
        }));
        emit ItemListed(itemCount, msg.sender, _title, _price);
        itemCount++;
    }

    /**
     * Buys an item from the marketplace.
     * @param _id - The unique identifier of the item to buy.
     * Ensures that the item exists, has not been sold, and the sender is not buying their own item.
     * Transfers the amount from buyer to seller and updates the item's status.
     */
    function buyItem(uint _id) public payable {
        require(_id < itemCount, "Item does not exist");
        Item storage item = items[_id];
        require(msg.value >= item.price, "Not enough Ether provided");
        require(!item.sold, "Item already sold");
        require(msg.sender != item.seller, "Seller cannot buy their own item");

        item.seller.transfer(item.price);
        item.owner = msg.sender;
        item.sold = true;

        emit ItemSold(_id, item.seller, msg.sender, item.price);
    }

    /**
     * Retrieves details about a specific item by its ID.
     * @param _id - The unique identifier of the item.
     * Checks if the item exists and returns its details.
     */
    function getItem(uint _id) public view returns (Item memory) {
        require(_id < itemCount, "Item does not exist");
        return items[_id];
    }
}
