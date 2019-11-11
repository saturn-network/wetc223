pragma solidity ^0.4.18;

import "./ERC223.sol";

contract WETC223 is ERC223I {
  function WETC223() public {
    name = "Wrapped Ethereum Classic 223";
    symbol = "WETC223";
    decimals = 18;
    totalSupply = 0;
    balances[msg.sender] = totalSupply;
  }

  // do not accept accidental incoming transfers
  function () public payable {
    revert();
  }

  function mint() public payable {
    totalSupply = totalSupply.add(msg.value);
    balances[msg.sender] = balances[msg.sender].add(msg.value);
  }

  function burn(uint256 amount) public payable {
    require(balances[msg.sender] >= amount);
    totalSupply = totalSupply.sub(amount);
    balances[msg.sender] = balances[msg.sender].sub(amount);
  }
}
