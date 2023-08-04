// Importa as funções 'hash' e 'isHashProofed' do arquivo 'helpers.js'
import { hash, isHashProofed } from './helpers'

// Define a estrutura de um bloco, header é o metadado e para fazer a mineração do bloco usaremos o 
// hash do payload concatenar com um numero e ver se o valor da zero. Tudo relacionado ao payload.
export interface Block {
  header: {
    nonce: number
    blockHash: string
  }
  payload: {
    sequence: number
    timestamp: number
    data: any
    previousHash: string
  }
}

// Classe BlockChain
export class BlockChain {
  #chain: Block[] = [] // Armazena a cadeia de blocos
  private powPrefix = '0' // Prefixo necessário para a prova de trabalho (Proof of Work). Zero é valor que eu quero que comece no meu hash

  // Construtor da classe
  constructor(private readonly difficulty: number = 4) {
    // Inicializa a cadeia com o bloco de gênese (cria o primeiro bloco da cadeia)
    this.#chain.push(this.createGenesisBlock())
  }

  // Função para criar o bloco de gênese
  private createGenesisBlock() {
    const payload = {
      sequence: 0,
      timestamp: +new Date(),
      data: 'Genesis Block',
      previousHash: ''
    }
    return {
      header: {
        nonce: 0,
        blockHash: hash(JSON.stringify(payload)) // Calcula o hash do bloco de gênese - todo paload
      },
      payload
    }
  }

  // Retorna o último bloco da cadeia
  private get lastBlock(): Block {
    return this.#chain.at(-1) as Block
  }

  // Getter para a cadeia de blocos
  get chain() {
    return this.#chain
  }

  // Retorna o hash do bloco anterior
  private getPreviousBlockHash() {
    return this.lastBlock.header.blockHash
  }

  // Cria um novo bloco com base nos dados fornecidos
  createBlock(data: any) {
    const newBlock = {
      sequence: this.lastBlock.payload.sequence + 1,
      timestamp: +new Date(),
      data,
      previousHash: this.getPreviousBlockHash()
    }

    console.log(`Created block ${newBlock.sequence}: ${JSON.stringify(newBlock, null, 2)}`)
    return newBlock
  }

  // Realiza a mineração de um bloco usando prova de trabalho
  mineBlock(block: Block['payload']) {
    let nonce = 0
    let startTime = +new Date()

    while (true) {
      const blockHash = hash(JSON.stringify(block))
      const proofingHash = hash(blockHash + nonce)

      // Verifica se o hash atende aos requisitos da prova de trabalho
      if (isHashProofed({
        hash: proofingHash,
        difficulty: this.difficulty,
        prefix: this.powPrefix
      })) {
        // Calcula informações sobre a mineração bem-sucedida
        const endTime = +new Date()
        const shortHash = blockHash.slice(0, 12)
        const mineTime = (endTime - startTime) / 1000

        // Retorna informações sobre a mineração
        return {
          minedBlock: { payload: { ...block }, header: { nonce, blockHash } },
          minedHash: proofingHash,
          shortHash,
          mineTime
        }
      }
      nonce++
    }
  }

  // Verifica se um bloco é válido
  verifyBlock(block: Block) {
    if (block.payload.previousHash !== this.getPreviousBlockHash()) {
      console.error(`Invalid block #${block.payload.sequence}: Previous block hash is "${this.getPreviousBlockHash().slice(0, 12)}" not "${block.payload.previousHash.slice(0, 12)}"`)
      return
    }

    // Verifica a validade do hash usando prova de trabalho
    if (!isHashProofed({
      hash: hash(hash(JSON.stringify(block.payload)) + block.header.nonce),
      difficulty: this.difficulty,
      prefix: this.powPrefix
    })) {
      console.error(`Invalid block #${block.payload.sequence}: Hash is not proofed, nonce ${block.header.nonce} is not valid`)
      return
    }

    return true
  }

  // Adiciona um bloco à cadeia, se for válido
  pushBlock(block: Block) {
    if (this.verifyBlock(block)) this.#chain.push(block)
    console.log(`Pushed block #${JSON.stringify(block, null, 2)}`)
    return this.#chain
  }
}
