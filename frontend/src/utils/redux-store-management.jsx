import { configureStore,createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; 
import {persistStore,persistReducer} from 'redux-persist'


const persistConfigure = {

    key:'root',
    storage,
};

export const initialState={

    cartcount: 0,
    totalamount: 0,
    offeramount: 0,
    data:'',
    checksearch:false
}


const storeslice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        addition :(state) =>{
            state.cartcount +=1;
        },
        deletion:(state)=>{
            if(state.cartcount!=0){
                state.cartcount -= 1;
            }
        },
        insubtotal:(state,action) => {
            const amount = action.payload;
           const value =  amount.replace(/,/g,'');
            state.totalamount +=Number(value);
          
        },
        desubtotal:(state,action) => {
            const amount = action.payload;
           const value =  amount.replace(/,/g,'');
            state.totalamount -= Number(value);
          
        },
        offermoney:(state,action)=>{
            const offermoney1 = action.payload;
            const value =  offermoney1.replace(/,/g,'');
            if( state.offeramount <=500 ){
            state.offeramount =500 - Number(value);
        
        }},
        deoffermoney:(state,action)=>{
            const offermoney1 = action.payload;
            const value =  offermoney1.replace(/,/g,'');
            let final;
            if( state.offeramount >=500 ){
                final = state.totalamount - value;
            state.offeramount =500 - (final>=500 ? 1000-final : final);
         
        }},
       additioncartmoney:(state,action) =>{
        const amount = action.payload;
        const value =  amount.replace(/,/g,'');
         state.totalamount +=Number(value);
        
       },
       deletecartmoney:(state,action)=>{
        const amount = action.payload;
        const value =  amount.replace(/,/g,'');
         state.totalamount -=Number(value);
       
       },
       getdata:(state,action)=>{
        const searchdata = action.payload;
        state.data=searchdata;
       },
       checksearchdata:(state,action)=>{
        state.checksearch=action.payload;
       },
       reset:(state,action)=>{
        const {cartdata,offercash,totalcash } = action.payload;
        state.cartcount = cartdata;
        state.offeramount = offercash;
        state.totalamount = totalcash;
       },

    }
});



const persistedReducer = persistReducer(persistConfigure,storeslice.reducer);


export const store = configureStore({
    reducer:{
        cart:persistedReducer
    }
});

export const persistor = persistStore(store); 

export const {addition,deletion,insubtotal,desubtotal,offermoney,deoffermoney,additioncartmoney,deletecartmoney,getdata,checksearchdata,reset} = storeslice.actions;

