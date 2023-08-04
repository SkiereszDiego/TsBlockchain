// Importa as funções 'createHash' e 'BinaryLike' do módulo 'crypto' - lib nativa do node
import { BinaryLike, createHash } from 'crypto'

// Função que recebe dados binários e retorna o hash SHA-256 em formato hexadecimal
export function hash(data: BinaryLike) {
  return createHash('sha256').update(data).digest('hex')
}

// Função que verifica se um hash atende aos requisitos de prova de trabalho
export function isHashProofed({ hash, difficulty = 4, prefix = '0' }: { hash: string, difficulty?: number, prefix?: string }) {
  // Cria um padrão de caracteres de prefixo, repetido de acordo com a dificuldade
  const check = prefix.repeat(difficulty)

  // Verifica se o hash começa com o padrão de prefixo necessário
  return hash.startsWith(check)
}
