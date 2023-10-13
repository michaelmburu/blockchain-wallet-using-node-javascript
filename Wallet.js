const EC = require('elliptic').ec //Elliptic curve library
const ec = new EC('secp256k1')

export class Wallet {
  //Initialize wallet.
  //If keys are not passed in
  constructor(publicKey = null, privateKey = null) {
    if (!publicKey || !privateKey) {
      const keyPair = ec.genKeyPair()
      this.publicKey = keyPair.getPublic('hex')
      this.privateKey = keyPair.getPrivateKey('hex')
    } else {
      this.publicKey = publicKey
      this.privateKey = privateKey
    }
  }
}

// take sender address, recipient address and amount
export class Transaction {
  constructor(sender, recepient, amount) {
    this.sender = sender
    this.recepient = recepient
    this.amount = amount
    this.timestamp = Date.now()
  }

  //Calculate the hash of the transaction
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(this.sender + this.recepient + this.amount + this.timestamp)
      .digest('hex')
  }

  // Sign the transaction using the private key
  signTransaction(privateKey) {
    const key = ec.keyFromPrivate(privateKey)
    const signature = key.sign(this.calculateHash(), 'base64')
    this.signature = signature.toDER('hex')
  }

  //Check the transaction if its valid by verifying the signature with the public key used and return a bool
  isValid() {
    if (!this.signature || this.signature.length === 0) {
      return false
    }

    const key = ec.keyFromPublic(this.sender, 'hex')
    return key.verify(this.calculateHash(), this.signature)
  }
}




