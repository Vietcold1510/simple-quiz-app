import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 1. Async Thunk để gọi API Login từ Backend
// Giả sử Backend chạy ở port 3000
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      // Gọi API login mà bạn đã viết ở Backend
      const response = await axios.post(`${BASE_URL}/users/login`, userData);

      // Lưu token vào localStorage để giữ đăng nhập khi F5
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      return response.data; // Trả về dữ liệu user + token
    } catch (error) {
      // Trả về lỗi nếu login thất bại
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Action Đăng ký
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Gọi API register của Backend
      const response = await axios.post(`${BASE_URL}/users/register`, userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Lấy user từ localStorage (nếu có) để khởi tạo state
const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage, // Thông tin user (username, admin, id...)
    isLoading: false,
    error: null,
    isSuccess: false,
  },
  reducers: {
    // Action đăng xuất
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
      state.isSuccess = false;
      state.error = null;
    },
    // Reset trạng thái lỗi/success
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Đang xử lý login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Login thành công
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // Lưu user vào state
      })
      // Login thất bại
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload; // Lưu thông báo lỗi
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Lưu ý: Sau khi đăng ký thành công, ta chưa login ngay mà yêu cầu user đăng nhập lại
        // hoặc tự động login tùy logic. Ở đây ta chỉ báo success để chuyển hướng.
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload;
      });
  },
});

export const { logout, reset } = authSlice.actions;
export default authSlice.reducer;
