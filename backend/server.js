import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import * as taskController from './src/controllers/taskController.js';
import * as chatController from './src/controllers/chatController.js';
import * as homeController from './src/controllers/homeController.js';
import * as expenseController from './src/controllers/expenseController.js';
import * as inventoryController from './src/controllers/inventoryController.js';
import * as quizController from './src/controllers/quizController.js';
import * as eventController from './src/controllers/eventController.js';
import * as crmController from './src/controllers/crmController.js';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env - thử root monorepo trước, sau đó thử thư mục hiện tại
// Trong Docker, env vars được inject qua docker-compose nên không cần file .env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

const upload = multer({ storage: multer.memoryStorage() });

const app = express();

// CORS – cho phép frontend gọi API
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.get('/', homeController.home);
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/tasks', taskController.listTasks);
app.post('/api/tasks', upload.single('file'), taskController.createTask);
app.patch('/api/tasks/:id/status', taskController.updateTaskStatus);
app.post('/api/tasks/:id/attachment', upload.single('file'), taskController.uploadAttachment);
app.delete('/api/tasks/:id/attachment', taskController.deleteAttachment);

app.get('/api/messages', chatController.listMessages);
app.post('/api/messages', chatController.sendMessage);

app.get('/api/expenses', expenseController.listTransactions);
app.post('/api/expenses', expenseController.createTransaction);

app.get('/api/inventory/items', inventoryController.listItems);
app.post('/api/inventory/items', inventoryController.createItem);
app.get('/api/inventory/logs', inventoryController.listStockLogs);
app.post('/api/inventory/logs', inventoryController.createStockLog);

app.get('/api/quiz/questions', quizController.listQuestions);
app.post('/api/quiz/submit', quizController.submitQuiz);
app.get('/api/quiz/results', quizController.listResults);

app.get('/api/events', eventController.listEvents);
app.post('/api/events', eventController.createEvent);
app.get('/api/events/registrations', eventController.listRegistrations);
app.post('/api/events/register', eventController.registerEvent);

app.get('/api/crm/customers', crmController.listCustomers);
app.post('/api/crm/customers', crmController.createCustomer);
app.put('/api/crm/customers/:id', crmController.updateCustomer);

export default app;

// Chỉ skip listen khi chạy trên Vercel (serverless)
// Docker production và local dev đều cần listen
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT || 3001);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}
