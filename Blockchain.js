const sha256 = require('crypto-js/sha256')
import './Wallet.js'
import { Transaction } from './Wallet.js'

class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.nonce = 0
    this.previousHash = previousHash
    this.hash = this.calculateHash()
  }

  calculateHash() {
    return sha256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data + this.nonce)
    ).toString()
  }
}

class BlockChain {
  constructor(
    name,
    currency,
    totalSupply,
    miningReward,
    miningInterval,
    halvingPeriod,
    halvingPercentage
  ) {
    this.name = name
    this.currency = currency
    this.totalSupply = totalSupply
    this.miningReward = miningReward
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 2
    this.pendingTransactions = []
    this.miningInterval = miningInterval // in seconds
    this.halvingPeriod = halvingPeriod // in blocks
    this.halvingPercentage = halvingPercentage
  }

  createGenesisBlock() {
    return new Block(
      0,
      '01/01/2022',
      {
        name: this.name,
        currency: this.currency,
        totalSupply: this.totalSupply,
      },
      '0'
    )
  }

  getLatestBlock() {
    return this.chain[length - 1]
  }

  addNewBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.mineBlock(this.difficulty)
    this.chain.push(newBlock)
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }

  mineTransactionBlock(minerRewardAddress) {
    //
    const rewardTx = new Transaction(
      null,
      minerRewardAddress,
      this.miningReward
    )
    this.pendingTransactions.push(rewardTx)

    let newBlock = this.newBlock(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    )

    newBlock.mineBlock(this.difficulty)

    console.log('Block successfuly mined')

    this.chain.push(newBlock)

    this.pendingTransactions = []
  }
  addTransaction(transaction) {
    if (!transaction.sender || !transaction.recepient) {
      throw new Error('Transaction must include sender & recepient addresses')
    }
  }
}

let myBlockChain = new BlockChain()

//Initialize my wallet
const myWallet = new Wallet()
const recepientWallet = new Wallet()

// create recepient public key
const recepientAddress = recepientWallet.publicKey

//view keys
console.log('Recepient Public Key:' + recepientWallet.publicKey)
console.log('myPublic key:' + myWallet.publicKey)
console.log('myPrivate key:' + myWallet.privateKey) //N/B Never log a user private key in production on public blockchains

// create transaction
const amountToSend = 10
const transaction = new Transaction(
  myWallet.publicKey,
  recepientAddress,
  amountToSend
)

//Sign transaction
transaction.signTransaction(myWallet.privateKey)

//Mine transaction block
myBlockChain.mineTransactionBlock(transaction.recepient)
