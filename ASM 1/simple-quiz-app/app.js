const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cors = require('cors');
const quizRouter = require('./routes/quizRouter');
const userRouter = require('./routes/userRouter');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// --- CẤU HÌNH VIEW ENGINE ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- KÍCH HOẠT CORS ---
// 2. Thêm dòng này để cho phép mọi nguồn (Frontend) kết nối vào
app.use(cors());

app.use(express.json());

// --- KHAI BÁO ROUTE ---
app.use('/quizzes', quizRouter);
app.use('/users', userRouter);

app.get('/', (req, res) => {
  res.send('Simple Quiz API is running...');
});

app.post('/test-quiz', (req, res) => {
  console.log('--> Đã vào route test trực tiếp!');
  res.json({ message: 'Route này hoạt động tốt!' });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
