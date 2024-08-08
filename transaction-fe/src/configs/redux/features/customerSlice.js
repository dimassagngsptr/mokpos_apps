import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

export const getAllCustomer = createAsyncThunk(
  "customer/all",
  async (_, thunkApi) => {
    try {
      const res = await api.get("/customers");
      return res?.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error?.response?.data?.message);
    }
  }
);
export const createCustomer = createAsyncThunk(
  "customer/create",
  async (data, thunkApi) => {
    try {
      const res = await api.post("/customers", data);
      return res?.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error?.response?.data?.message);
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    data: [],
    created: {},
    loadingAll: false,
    loadingAdd: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCustomer.pending, (state) => {
        state.loadingAll = true;
      })
      .addCase(getAllCustomer.fulfilled, (state, action) => {
        state.loadingAll = false;
        state.data = action.payload;
      })
      .addCase(getAllCustomer.rejected, (state, action) => {
        state.loadingAll = false;
        state.error = action.payload;
      });
    builder
      .addCase(createCustomer.pending, (state) => {
        state.loadingAdd = true;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loadingAdd = false;
        state.created = action.payload;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loadingAdd = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
