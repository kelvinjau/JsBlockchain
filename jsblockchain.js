const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash =''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        /**
        * This will be using SHA256 cryptographic function to generate hash of this block.
        */
        return SHA256(this.index+this.timestamp+this.previousHash+JSON.stringify(this.data)+this.nonce).toString();
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
        this.difficulty = 5;
    }

    createGenesisBlock(){
        return new Block(0,'01/01/2018',"This is the genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineNewBlock(this.difficulty);
        this.chain.push(newBlock);
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

//Creating the new blocks
let block1 = new Block(1,"02/01/2008",{message : 100});
let block2 = new Block(1,"03/01/2008",{message : 50});

//Creating the blockchain
let myBlockchain = new Blockchain();

//addin the new blocks to the blockchain
console.log("The first block creation");
myBlockchain.addBlock(block1);
console.log("The second block creation");
myBlockchain.addBlock(block2);

console.log(JSON.stringify(myBlockchain,null,4));
console.log("Validation Check for the BlockChain before hacking: "+myBlockchain.checkBlockchainValid());


