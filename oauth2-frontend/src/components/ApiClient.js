export const authFetch = async (url,options = {},requiresAuth = false) => {

    const headers = options.headers || {};

    if(requiresAuth){
        const token = localStorage.getItem("token");
        if(token){
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    return fetch(url,{...options,headers})
        .then(async (response) => {
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.error || "Something went wrong!");
            }
            return data;
        })
        .catch((err) => {
            console.error("Api Client error" , err.message);
            throw err;
        });
};  