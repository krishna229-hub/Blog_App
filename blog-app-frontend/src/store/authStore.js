import {create} from "zustand"
import {persist} from "zustand/middleware"
import axios from "axios"

export const useAuth = create((set) => ({
    currentUser:null,
    loading:false,
    isAuthenticated:false,
    error:null,
    login: async(userCredWithRole) => {
        const {role,...userCredObj} = userCredWithRole;
        try{   

            // set loading to true
            set({loading:true,error:null})

            let res = await axios.post("http://localhost:4000/common-api/login",userCredObj, {withCredentials:true});
            // console.log(res);

            set({
                loading:false,
                error:null,
                isAuthenticated:true,
                currentUser:res.data.payload
            })
            return {ok:true,user:res.data.payload}

        }catch(err){
            const message = err.response?.data?.error || "Login failed";
            set({
                loading:false,
                error:message || "Login failed",
                isAuthenticated:false,
                currentUser:null,
            })
            return {ok:false, message}
        }
    },
    logout: async()=> {
        try {
            set({loading:true,error:null})
            // make api call
            let res = await axios.get("http://localhost:4000/common-api/logout",{withCredentials:true})
            // update the state
            set({currentUser:null,loading:false,isAuthenticated:false})
        } catch (err) {
            console.log(err);
            set({
                loading:false,
                error:err.response?.data?.error || "Login failed",
                isAuthenticated:false,
                currentUser:null,
            })
        }
    },
    checkAuth : async () => {
        try {
            set({loading:true,error:null});
            let res = await axios.get("http://localhost:4000/common-api/check-auth",{withCredentials:true});
            // console.log(res);
            set({currentUser:res.data.payload,loading:false,isAuthenticated:true})
        } catch (err) {
            set({
                loading:false,
                error:null,
                isAuthenticated:false,
                currentUser:null,
            })
        }
    }
}))