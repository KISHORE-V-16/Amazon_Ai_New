import {createAsyncThunk,configureStore,createSlice} from '@reduxjs/toolkit';

const initialState = {
    dataofproducts:[],
    status:""
}

export const getdata = createAsyncThunk('details/getdata',async () =>{
  const response =  await axios.get('https://fakestoreapi.com/products')
    return response.data;
});

const slicer = createSlice({
    name:'details',
    initialState,
    reducers:{},
    extraReducers:{
        [getdata.pending]:(state,action)=>{
            state.status = "pending";
        },
        [getdata.fulfilled]:(state,action)=>{
            state.dataofproducts = action.payload;
            state.status = "success";
        },
        [getdata.rejected]:(state,action)=>{
            state.status = "rejected";
        }
    }
})


export const store = configureStore({
    reducer:{
       details:slicer.reducer
    }
})

