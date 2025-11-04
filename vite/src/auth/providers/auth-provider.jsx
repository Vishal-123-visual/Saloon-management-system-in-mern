// src/auth/providers/auth-provider.jsx
import { use, useEffect, useState } from "react";

import * as authHelper from "@/auth/lib/helpers";
import { AuthContext } from "../context/auth-context";
import { CustomAdapter } from "../adapters/custome-adapter";
import { useCart, useCategory, useProduct } from "../../pages/store-client/components/sheets/CartContext";

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  // const [auth, setAuth] = useState(authHelper.getAuth()); // {access_token}
  const [currentUser, setCurrentUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const {fetchCartItems} = useCart()
  const { fetchCategories } = useCategory();
    const {fetchProducts } = useProduct();


  // useEffect(() => {
  //   setIsAdmin(currentUser?.is_admin === true);
  // }, [currentUser]);

  const fetchCurrentUser = async ()=>{
    try {
      const user  = await CustomAdapter.getCurrentUser()
      console.log('user',user)
      if(user){
        setCurrentUser(user)
        sessionStorage.setItem('user',JSON.stringify(user))
        if(user.role === 'admin') setIsAdmin(true)
        else setIsAdmin(false)
      }
      else{
        setCurrentUser(undefined)
        sessionStorage.removeItem('user')
      }
    } catch (error) {
      console.log('Error fetching current user',error)
      sessionStorage.removeItem('user')
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    const savedUser = sessionStorage.getItem('user')
    if(savedUser){
      setCurrentUser(JSON.parse(savedUser))
      setLoading(false)
    }
    else{
      fetchCurrentUser()
    }
  },[])
  // const saveAuth = (authData) => {
  //   setAuth(authData);
  //   if (authData?.access_token) {
  //     authHelper.setAuth(authData);
  //   } else {
  //     authHelper.removeAuth();
  //   }
  // };

  // const verify = async () => {
  //   if (auth?.access_token) {
  //     try {
  //       const user = await getUser();
  //       setCurrentUser(user || undefined);
  //     } catch {
  //       saveAuth(undefined);
  //       setCurrentUser(undefined);
  //     }
  //   }
  // };

  
 const login = async (phone, password) => {
  try {
    const authData = await CustomAdapter.login(phone, password);
    //saveAuth(authData);
    // If login already returned user, use that
    const user = authData.user || (await CustomAdapter.getCurrentUser());
    setCurrentUser(user)
    await fetchCartItems()
    await fetchCategories()
    await fetchProducts()
    return user;
  } catch (error) {
   // saveAuth(undefined);
    throw error;
  }
};


  const register = async (userData) => {
    try {
      const authData = await CustomAdapter.register(userData);
      //saveAuth(authData);
      const user = await CustomAdapter.getCurrentUser();
      setCurrentUser(user)
      return user
    } catch (error) {
      //saveAuth(undefined);
      throw error;
    }
  };

  const getUser = async () => {
    //console.log(auth.access_token)
    if (!auth?.access_token) return null;
     const user=  await CustomAdapter.getCurrentUser();
    // console.log( 'usre',user)
    //console.log(user)
     return user
  };

  const updateProfile = async () => {
    throw new Error("updateProfile not implemented");
  };

  const requestPasswordReset = async () => {
    throw new Error("requestPasswordReset not implemented");
  };

  const resetPassword = async () => {
    throw new Error("resetPassword not implemented");
  };

  const resendVerificationEmail = async () => {
    throw new Error("resendVerificationEmail not implemented");
  };

  const logout = async () => {
    if (sessionStorage.getItem('user')) await CustomAdapter.logout();

    setCurrentUser(undefined);
  };

  // useEffect(() => {
  //   verify().finally(() => setLoading(false));
  // }, []);
 //console.log(currentUser)
  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        // auth,
        //saveAuth,
        user: currentUser,
        setUser: setCurrentUser,
        login,
        register,
        requestPasswordReset,
        resetPassword,
        resendVerificationEmail,
        getUser,
        updateProfile,
        logout,
        //verify,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
