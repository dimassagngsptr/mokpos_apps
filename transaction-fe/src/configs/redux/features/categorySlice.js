import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

export const getAllCategories = createAsyncThunk(
  "categories/all",
  async (_, thunkApi) => {
    try {
      const res = await api.get("/categories");
      return res?.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error?.response?.data?.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    loadingAll: false,
    loadingAdd: false,
    data: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.loadingAll = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loadingAll = false;
        state.data = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loadingAll = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
