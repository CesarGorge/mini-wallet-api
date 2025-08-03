const request = require('supertest');
const { app, connectDB, closeDB } = require('../handler');

let token;
let createdTxId;
const testUserId = 'test-user-for-jest';

beforeAll(async () => {
  await connectDB();
  const res = await request(app)
    .post('/login')
    .send({
      userId: testUserId,
      email: 'test@jest.com'
    });
  token = res.body.token;
});

afterAll(async () => {
  await closeDB();
});


describe('Endpoints de Transacciones CRUD', () => {

  describe('POST /transactions', () => {
    it('debería retornar 401 Unauthorized si no se provee un token', async () => {
      const res = await request(app).post('/transactions').send({});
      expect(res.statusCode).toEqual(401);
    });

    it('debería retornar 400 Bad Request si faltan datos en el body', async () => {
      const res = await request(app)
        .post('/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: testUserId });
      expect(res.statusCode).toEqual(400);
    });

    it('debería crear una nueva transacción con datos válidos', async () => {
      const res = await request(app)
        .post('/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: testUserId,
          amount: 500,
          currency: 'USDC',
          status: 'pending'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('txId');
      expect(res.body.amount).toBe(500);

      createdTxId = res.body.txId; 
    });
  });

  describe('GET /transactions/:txId', () => {
    it('debería obtener una transacción específica con un ID válido', async () => {
      const res = await request(app)
        .get(`/transactions/${createdTxId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.txId).toBe(createdTxId);
    });

    it('debería retornar 404 Not Found para un ID que no existe', async () => {
        const res = await request(app)
          .get('/transactions/un-id-falso-123')
          .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(404);
      });
  });

  describe('PUT /transactions/:txId', () => {
    it('debería actualizar una transacción con un ID válido', async () => {
        const res = await request(app)
          .put(`/transactions/${createdTxId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
              status: 'completed',
              amount: 550.75
          });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toBe('completed');
        expect(res.body.amount).toBe(550.75);
      });
  });

  describe('DELETE /transactions/:txId', () => {
    it('debería eliminar una transacción con un ID válido', async () => {
        const res = await request(app)
          .delete(`/transactions/${createdTxId}`)
          .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(204); 
      });

    it('debería retornar 404 al intentar obtener la transacción eliminada', async () => {
        const res = await request(app)
            .get(`/transactions/${createdTxId}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(404);
    });
  });
});

describe('Endpoint de Balance', () => {
    it('debería retornar 401 Unauthorized si no se provee un token', async () => {
        const res = await request(app).get('/balance/some-address');
        expect(res.statusCode).toEqual(401);
      });
    
    it('debería obtener el balance para una dirección de wallet válida', async () => {
        const res = await request(app)
            .get('/balance/0xdAC17F958D2ee523a2206206994597C13D831ec7') //Tether
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('balance');
        expect(res.body.currency).toBe('USDC');
    });
});