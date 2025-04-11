export const authFetch = async (url,options = {},requiresAuth = false) => {

    const headers = options.headers || {};

    if(requiresAuth){
        const token = localStorage.getItem("token");
        if(token){
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    try{
        const response = await fetch(url,{...options,headers});

        if(response.status === 401){
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return { invalidToken: true };
        }

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.error || "Something went wrong!");
        }

        return data;
    }catch(error){
        console.error("Api Client error" , error.message);
        throw error;
    }
};  