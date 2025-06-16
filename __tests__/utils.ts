import { FastifyInstance } from 'fastify'

let server: FastifyInstance
let address: string

export async function startService(buildServer: () => FastifyInstance) {
  server = buildServer()
  address = await server.listen({ port: 0 })
}

export async function stopService() {
  await server.close()
}

export function getAddress(): string {
  return address
}
