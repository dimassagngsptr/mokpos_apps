import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

export const getAllProducts = createAsyncThunk(
  "product/all",
  async ({ search = "", limit = 30, page = 1 } = {}, thunkApi) => {
    try {
      const res = await api.get("/products", {
        params: {
          search,
          limit,
          page,
        },
      });
      return res?.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error?.response?.data?.message);
    }
  }
);
export const uploadImageProduct = createAsyncThunk(
  "product/uploadImage",
  async (file, thunkApi) => {
    try {
      let formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/products/images", formData);
      return res?.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const addProducts = createAsyncThunk(
  "product/add",
  async (data, thunkApi) => {
    try {
      const res = await api.post("/products", data);
      await thunkApi.dispatch(getAllProducts());
      return res?.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loadingAll: false,
    loadingAdd: false,
    loadingUpload: false,
    data: [],
    created: {},
    url: "",
    errorAll: null,
    errorUpload: null,
    errorAdd: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loadingAll = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loadingAll = false;
        state.data = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loadingAll = false;
        state.errorAll = action.payload;
      });

    builder
      .addCase(uploadImageProduct.pending, (state) => {
        state.loadingUpload = true;
      })
      .addCase(uploadImageProduct.fulfilled, (state, action) => {
        state.loadingUpload = false;
        state.url = action.payload.url;
      })
      .addCase(uploadImageProduct.rejected, (state, action) => {
        state.loadingUpload = false;
        state.errorUpload = action.payload;
      });

    builder
      .addCase(addProducts.pending, (state) => {
        state.loadingAdd = true;
      })
      .addCase(addProducts.fulfilled, (state, action) => {
        state.loadingAdd = false;
        state.created = action.payload;
      })
      .addCase(addProducts.rejected, (state, action) => {
        state.loadingAdd = false;
        state.errorAdd = action.payload;
      });
  },
});

export default productSlice.reducer;
