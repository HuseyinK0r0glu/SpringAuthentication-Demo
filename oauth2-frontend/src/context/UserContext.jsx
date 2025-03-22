import CreateContext from "./CreateContext";

const userReducer = (state , action) => {
    switch(action.type){
        case "SET_USER" :
            return {...state , user : action.payload} 
        case "LOG_OUT":        
            return {...state , user : null};
        default :
            return state;
    }
};

const setUser = (dispatch) => {
    return (userData) => {
        dispatch({type : "SET_USER" , payload : userData});
    };
};

const logout = (dispatch) => {
    // log out call 
    return () => {
        dispatch({type : 'LOG_OUT'})
    }
};

export const {Provider , Context} = CreateContext(userReducer , {setUser , logout} , {user : null});