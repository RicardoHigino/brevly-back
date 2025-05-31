import { fastify } from 'fastify'
import { hasZodFastifySchemaValidationErrors, validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod'
import { createLinkRoute } from './routes/create-link'
import { deleteLinkRoute } from './routes/delete-link'
import { exportCsvRoute } from './routes/export-csv'
import { getLinksRoute } from './routes/get-links'
import { redirectRoute } from './routes/redirect'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { transformSwaggerSchema } from './transform-swagger-schema'
import fastifyMultipart from '@fastify/multipart'
const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: error.message,
      issues: error.validation,
    })
  }

  console.log(error)

  return reply.status(500).send({
    message: 'Internal server error',
  })
})

server.register(fastifyMultipart)
server.register(fastifyCors, { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] })

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.ly API',
      version: '1.0.0',
    },
  },
  transform: transformSwaggerSchema,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

server.register(createLinkRoute)
server.register(deleteLinkRoute)
server.register(exportCsvRoute)
server.register(getLinksRoute)
server.register(redirectRoute)

server.listen({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  host: '0.0.0.0',
}, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server is running on http://localhost:${process.env.PORT}/docs`)
})