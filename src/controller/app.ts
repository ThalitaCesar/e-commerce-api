import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from '../swagger'

export const app = express()

app.use(express.json())
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(3003, () => {
   console.log('Servidor rodando na porta 3003')
   console.log('Documentação disponível em /api-docs')
})