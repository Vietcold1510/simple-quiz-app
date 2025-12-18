import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fallback nếu không có biến môi trường
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = `${BASE_URL}/quizzes`;

// --- HELPER FUNCTION (Phải khai báo trước) ---
const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// --- ASYNC THUNKS (Phải khai báo TRƯỚC createSlice) ---

// 1. Lấy danh sách Quiz (Public)
export const fetchQuizzes = createAsyncThunk(
  "quiz/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 2. Tạo Quiz mới (Admin)
export const createQuiz = createAsyncThunk(
  "quiz/create",
  async (quizData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, quizData, getConfig());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 3. Xóa Quiz (Admin)
export const deleteQuiz = createAsyncThunk(
  "quiz/delete",
  async (quizId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${quizId}`, getConfig());
      return quizId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 4. Tạo câu hỏi (Admin)
export const createQuestion = createAsyncThunk(
  "quiz/createQuestion",
  async ({ quizId, questionData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/${quizId}/question`,
        questionData,
        getConfig()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 5. Xóa câu hỏi (Admin)
export const deleteQuestion = createAsyncThunk(
  "quiz/deleteQuestion",
  async (questionId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/question/${questionId}`, getConfig());
      return questionId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- SLICE ---
const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    quizzes: [],
    currentQuiz: null,
    currentQuestionIndex: 0,
    score: 0,
    isFinished: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    selectQuiz: (state, action) => {
      state.currentQuiz = action.payload;
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.isFinished = false;
    },
    submitAnswer: (state, action) => {
      const { selectedOptionIndex, correctAnswerIndex } = action.payload;
      if (selectedOptionIndex === correctAnswerIndex) {
        state.score += 1;
      }
      const totalQuestions = state.currentQuiz.questions.length;
      if (state.currentQuestionIndex + 1 < totalQuestions) {
        state.currentQuestionIndex += 1;
      } else {
        state.isFinished = true;
      }
    },
    restartQuiz: (state) => {
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.isFinished = false;
    },
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.isFinished = false;
    },
  },
  extraReducers: (builder) => {
    // --- QUAN TRỌNG: Xử lý fetchQuizzes ---
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.isLoading = false;
        // Logic an toàn: Chấp nhận cả mảng [] hoặc object { quizzes: [] }
        state.quizzes = action.payload.quizzes || action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // --- Admin Actions ---
    builder.addCase(createQuiz.fulfilled, (state, action) => {
      state.quizzes.push(action.payload);
    });

    builder.addCase(deleteQuiz.fulfilled, (state, action) => {
      state.quizzes = state.quizzes.filter(
        (quiz) => quiz._id !== action.payload
      );
    });

    builder.addCase(createQuestion.fulfilled, (state, action) => {
      if (state.currentQuiz && state.currentQuiz._id === action.payload.quiz) {
        state.currentQuiz.questions.push(action.payload);
      }
    });

    builder.addCase(deleteQuestion.fulfilled, (state, action) => {
      if (state.currentQuiz) {
        state.currentQuiz.questions = state.currentQuiz.questions.filter(
          (q) => q._id !== action.payload
        );
      }
    });
  },
});

export const { selectQuiz, submitAnswer, restartQuiz, clearCurrentQuiz } =
  quizSlice.actions;
export default quizSlice.reducer;
