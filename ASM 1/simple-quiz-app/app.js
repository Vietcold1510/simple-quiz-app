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
const allowedOrigins = [
  'http://localhost:5173', // Cho phép Localhost để test
  'https://simple-quiz-app-mwo8.vercel.app', // LINK FRONTEND VERCEL (Sẽ điền sau khi deploy xong frontend)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép request không có origin (như Postman) hoặc nằm trong whitelist
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Quan trọng nếu có cookie/token
  })
);

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
