// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Item {
        uint id;
        address payable seller;
        address owner;
        string title;
        string description;
        uint price;
        bool sold;
    }
    Item[] public items;
    uint public itemCount = 0;

    event ItemListed(
        uint id,
        address indexed seller,
        string title,
        uint price
    );
    event ItemSold(
        uint id,
        address indexed seller,
        address indexed buyer,
        uint price
    );
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
    function getItem(uint _id) public view returns (Item memory) {
        require(_id < itemCount, "Item does not exist");
        return items[_id];
    }
}
