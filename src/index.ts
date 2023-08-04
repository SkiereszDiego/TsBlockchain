// Importa a classe BlockChain do arquivo 'blockchain.js'
import { BlockChain } from './blockchain'

// Define a dificuldade da mineração, obtida a partir do argumento da linha de comando (padrão: 4)
const dificulty = Number(process.argv[2] || 4)

// Cria uma instância da classe BlockChain, passando a dificuldade como parâmetro
const blockchain = new BlockChain(dificulty)

// Obtém o número de blocos a serem criados a partir do argumento da linha de comando (padrão: 10)
const blockNumber = +process.argv[3] || 10

// Inicializa a variável 'chain' com a corrente (cadeia) de blocos da blockchain
let chain = blockchain.chain

// Loop que cria e minera 'blockNumber' blocos
for (let i = 1; i <= blockNumber; i++) {
  // Cria um novo bloco com o título 'Block {i}'
  const block = blockchain.createBlock(`Block ${i}`)
  
  // Realiza a mineração do bloco criado, encontra um numero unico um nounce, ele vai retornar varias info sendo uma delsas o bloco que foi mineirado
  const mineInfo = blockchain.mineBlock(block)
  
  // Adiciona o bloco minerado à cadeia de blocos ('chain')
  chain = blockchain.pushBlock(mineInfo.minedBlock)
}

// Imprime a cadeia de blocos gerada no console
console.log('--- GENERATED CHAIN ---\n')
console.log(chain)
