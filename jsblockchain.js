const SHA256 = require('crypto-js/sha256');

class Transactions{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
};

class Block{
    constructor(timestamp, transactions, previousHash =''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        /**
        * This will be using SHA256 cryptographic function to generate hash of this block.
        */
        return SHA256(this.timestamp+this.previousHash+JSON.stringify(this.transactions)+this.nonce).toString();
    }

    /**
    *   Proof of Work
    *   @param difficulty to the hash i.e. conditions for the miner to mine the block which gives hash value 
    *   starting from 3 zeros i.e. "000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" or 4 zeros i.e. "0000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    *   
    *   This becomes difficulty for miners to mine a new block. Hence prevent hackers to temper the block.
    *   i.e. more complex difficulty require more computational power.
    */
    mineNewBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("A new block was mined with hash "+ this.hash);
    }
}

class Blockchain{
    constructor(){
        /**
        *
        * The first variable of the array will be the genesis block and created manually.
        */
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.difficulty = 2;
        this.miningReward = 10;
    }

    createGenesisBlock(){
        return new Block('01/01/2018',"This is the genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
        block.mineNewBlock(this.difficulty);
        console.log("Block mined Successfully");

        this.chain.push(block);
        this.pendingTransactions = [
            new Transactions(null,miningRewardAddress,this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance = balance - trans.amount;
                }
                if(trans.toAddress === address){
                    balance = balance + trans.amount;
                }
            }
        }

        return balance;
    }

    checkBlockchainValid(){

        for(let i = 1; i <= this.chain.length-1; i++){
            let currentBlock = this.chain[i];
            let previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){ 
                return false;
            }
        }
        return true;
    }

    //new block object.
    //the hash of previous block.
    //calculate the current hash.
    //push the block in block chain.
}

/*
//create two blocks
let block1 = new Block(1,"05/01/2022", {"myBalance": 100});
let block2 = new Block(2,"06/01/2022", {"myBalance": 200});

//create new blockchain
let myBlockChain = new BlockChain();

//add the blocks
myBlockChain.addBlock(block1);
myBlockChain.addBlock(block2);


console.log(JSON.stringify(myBlockChain, null,4));
console.log("First Validating Block chain : "+myBlockChain.checkBlockValidity());

//try alter blockchain
myBlockChain.chain[1].data =  {"myBalance": 700};

//validating again, its false
console.log("Second Validating Block chain : "+myBlockChain.checkBlockValidity());
*/



let kelvinCoin = new Blockchain();

transaction1 = new Transactions("tom", "jerry", 100);
kelvinCoin.createTransaction(transaction1);

transaction2 = new Transactions("jerry", "tom", 30);
kelvinCoin.createTransaction(transaction2);

//donald will have zero because his transaction is still pending and hasnt been validated
console.log("Started mining by miner...");
kelvinCoin.minePendingTransactions("donald");

console.log("Balance for tom is: "+kelvinCoin.getBalanceOfAddress("tom"));
console.log("Balance for jerry is: "+kelvinCoin.getBalanceOfAddress("jerry"));
console.log("Balance for miner donald is: "+kelvinCoin.getBalanceOfAddress("donald"));

kelvinCoin.minePendingTransactions("donald");
console.log("Balance for miner donald is: "+kelvinCoin.getBalanceOfAddress("donald"));
