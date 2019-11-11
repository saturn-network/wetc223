var WETC223 = artifacts.require("./WETC223.sol")

function assertJump(error) {
  let revertOrInvalid = error.message.search('invalid opcode|revert')
  assert.isAbove(revertOrInvalid, -1, 'Invalid opcode error must be returned')
}

contract('WETC223', function(accounts) {
  it("Cannot burn tokens if you have none", async () => {
    const wetc223 = await WETC223.deployed()

    try {
      await wetc223.burn(1, { from: accounts[0] })
      assert.fail('Rejected!')
    } catch(error) {
      assertJump(error)
    }
  })

  it("Can mint wetc223 tokens", async () => {
    const wetc223 = await WETC223.deployed()
    let amount = 42

    await wetc223.mint({ from: accounts[0], value: amount })
    let balance = await wetc223.balanceOf(accounts[0])
    assert.equal(balance.toString(), amount.toString())
  })

  it("Can burn, but not more than you have", async () => {
    const wetc223 = await WETC223.deployed()
    let amount = 42

    let etcBalanceBefore = web3.eth.getBalance(accounts[1]);

    await wetc223.mint({ from: accounts[1], value: amount, gasPrice: 0 })
    let wetc223balanceBefore = await wetc223.balanceOf(accounts[1])
    assert.equal(wetc223balanceBefore.toString(), amount.toString())

    try {
      await wetc223.burn(amount + 1, { from: accounts[1], gasPrice: 0 })
      assert.fail('Rejected!')
    } catch(error) {
      assertJump(error)
    }

    await wetc223.burn(amount, { from: accounts[1], gasPrice: 0 })
    let wetc223balanceAfter = await wetc223.balanceOf(accounts[1])
    assert.equal(wetc223balanceAfter.toString(), '0')

    let etcBalanceAfter = web3.eth.getBalance(accounts[1]);
    assert.equal(etcBalanceAfter.toString(), etcBalanceBefore.toString())
  })
})
