require('dotenv').config()

const serverless = require('serverless-http')
const express = require('express')
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const axios = require('axios')
const jwt = require('jsonwebtoken')

const Transaction = require('./models/transaction')
const authenticateToken = require('./middleware/auth')

const app = express()
app.use(express.json())


if (process.env.NODE_ENV !== 'test') {
	mongoose
		.connect(process.env.MONGO_URI, { dbName: 'transactionsDB' })
		.then(() => console.log('MongoDB connected for server...'))
		.catch((err) => console.log(err))
}

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, { dbName: 'transactionsDB' })
		console.log('MongoDB connected for tests...')
	} catch (err) {
		console.log(err)
	}
}

const closeDB = async () => {
	await mongoose.connection.close()
	console.log('MongoDB connection closed.')
}

const normalizeBodyMiddleware = (req, res, next) => {
	if (
		req.apiGateway &&
		req.apiGateway.event &&
		req.apiGateway.event.body &&
		typeof req.apiGateway.event.body === 'string'
	) {
		try {
			req.body = JSON.parse(req.apiGateway.event.body)
		} catch (e) {
			return res.status(400).send({ message: 'Cuerpo de la petición mal formado.' })
		}
	}
	next()
}
app.use(normalizeBodyMiddleware)

const dbConnectionMiddleware = async (req, res, next) => {
	if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
		console.log('Connecting to database from middleware...')
		await connectDB()
	}
	next()
}

app.use(dbConnectionMiddleware)

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión y obtener un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, email]
 *             properties:
 *               userId:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Login exitoso, token devuelto.
 */
app.post('/login', (req, res) => {
	const { userId, email } = req.body
	if (!userId || !email) {
		return res.status(400).send({ message: 'userId y email son requeridos.' })
	}

	const userPayload = { userId, email }

	const accessToken = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' })

	res.json({ token: accessToken })
})

app.use(authenticateToken)

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Crear una nueva transacción
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, amount, currency]
 *             properties:
 *               userId: { type: 'string' }
 *               amount: { type: 'number' }
 *               currency: { type: 'string' }
 *               status: { type: 'string', enum: ['pending', 'completed', 'failed'] }
 *     responses:
 *       '201':
 *         description: Transacción creada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 */
app.post('/transactions', async (req, res) => {
	try {
		const { userId, amount, currency, status } = req.body
		if (!userId || !amount || !currency) {
			return res.status(400).send({ message: 'userId, amount, y currency son requeridos.' })
		}
		const transaction = new Transaction({ txId: uuidv4(), userId, amount, currency, status })
		await transaction.save()
		res.status(201).send(transaction)
	} catch (error) {
		res.status(500).send({ message: 'Error interno del servidor', error: error.message })
	}
})

/**
 * @swagger
 * /transactions/{txId}:
 *   get:
 *     summary: Obtener una transacción por su ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: txId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Transacción encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       '404':
 *         description: Transacción no encontrada.
 */
app.get('/transactions/:txId', async (req, res) => {
	try {
		const transaction = await Transaction.findOne({ txId: req.params.txId })
		if (!transaction) return res.status(404).send({ message: 'Transacción no encontrada.' })
		res.send(transaction)
	} catch (error) {
		res.status(500).send({ message: 'Error interno del servidor', error: error.message })
	}
})

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Listar las transacciones de un usuario
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de transacciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
app.get('/transactions', async (req, res) => {
	try {
		if (!req.query.userId) return res.status(400).send({ message: 'El parámetro userId es requerido.' })
		const transactions = await Transaction.find({ userId: req.query.userId })
		res.send(transactions)
	} catch (error) {
		res.status(500).send({ message: 'Error interno del servidor', error: error.message })
	}
})

/**
 * @swagger
 * /transactions/{txId}:
 *   put:
 *     summary: Actualizar una transacción
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: txId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount: { type: 'number' }
 *               status: { type: 'string', enum: ['pending', 'completed', 'failed'] }
 *     responses:
 *       '200':
 *         description: Transacción actualizada.
 *       '404':
 *         description: Transacción no encontrada.
 */
app.put('/transactions/:txId', async (req, res) => {
	try {
		const { amount, status } = req.body
		const updateData = {}
		if (amount !== undefined) updateData.amount = amount
		if (status !== undefined) updateData.status = status

		const updatedTx = await Transaction.findOneAndUpdate({ txId: req.params.txId }, { $set: updateData }, { new: true })
		if (!updatedTx) return res.status(404).send({ message: 'Transacción no encontrada.' })
		res.send(updatedTx)
	} catch (error) {
		res.status(500).send({ message: 'Error interno del servidor', error: error.message })
	}
})

/**
 * @swagger
 * /transactions/{txId}:
 *   delete:
 *     summary: Eliminar una transacción
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: txId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Transacción eliminada.
 *       '404':
 *         description: Transacción no encontrada.
 */
app.delete('/transactions/:txId', async (req, res) => {
	try {
		const result = await Transaction.deleteOne({ txId: req.params.txId })
		if (result.deletedCount === 0) return res.status(404).send({ message: 'Transacción no encontrada.' })
		res.status(204).send()
	} catch (error) {
		res.status(500).send({ message: 'Error interno del servidor', error: error.message })
	}
})

/**
 * @swagger
 * /balance/{walletAddress}:
 *   get:
 *     summary: Obtener el balance en USDC de una wallet
 *     tags: [Balance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: walletAddress
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Balance obtenido.
 */
app.get('/balance/:walletAddress', async (req, res) => {
	try {
		const { walletAddress } = req.params
		const url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${process.env.USDC_CONTRACT_ADDRESS}&address=${walletAddress}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`

		const response = await axios.get(url)
		if (response.data.status === '0') {
			return res.status(400).json({ message: response.data.message, result: response.data.result })
		}
		const balance = parseFloat(response.data.result) / 10 ** 6
		res.json({ walletAddress, currency: 'USDC', balance })
	} catch (error) {
		res.status(500).send({ message: 'Error al obtener el balance desde Etherscan.', error: error.message })
	}
})

app.use((req, res, next) => {
	res.status(404).send({ message: 'Ruta no encontrada.' })
})

app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send({ message: 'Algo salió mal!', error: err.message })
})

module.exports = {
	main: serverless(app),
	app: app,
	connectDB: connectDB,
	closeDB: closeDB
}
