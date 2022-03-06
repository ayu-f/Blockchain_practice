pragma solidity ^0.8.12;

// SPDX-License-Identifier: MIT

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract NFTContract is ERC1155, Ownable {
    uint256 public constant ART_WORK = 0;
    uint256 public constant PHOTO = 1;

    constructor() ERC1155("") {
        _mint(msg.sender, ART_WORK, 1, "");
        _mint(msg.sender, PHOTO, 1, "");
    }

    function mint(address account, uint256 id, uint256 amount) public onlyOwner {
        _mint(account, id, amount, "");
    }

    function burn(address account, uint256 id, uint256 amount) public {
        require(msg.sender == account);
        _burn(account, id, amount);
    }
}

 