// // ApiFetch.js
// import { toast } from "sonner";
// import { API_BASE_URL } from "../../../../config/endpoin.config";

// export const apiFetch = async (url, options = {}) => {
//   try {
//     const res = await fetch(`${url}`, {
//       ...options,
//       headers: {
//         "Content-Type": "application/json",
//         ...(options.headers || {}),
//       },
//       credentials: "include", // ⬅️ VERY IMPORTANT to send cookies
//     });

//     // If unauthorized, try refresh token flow
//     if (res.status === 401) {
//       const refreshed = await refreshAccessToken();
//       if (refreshed) {
//         return apiFetch(url, options); // retry once
//       } else {
//         throw new Error("Unauthorized, please log in again");
//       }
//     }

//     return res.json();
//   } catch (err) {
//     console.error("API Fetch Error:", err);
//     throw err;
//   }
// };

// // Refresh access token silently
// async function refreshAccessToken() {
//   try {
//     const res = await fetch(`${API_BASE_URL}/user/refreshToken`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include", // ⬅️ send refresh cookie
//     });

//     if (!res.ok) {
//       console.error("Failed to refresh token:", res.status);
//       return false;
//     }

//     const data = await res.json();
//     if (data.success) {
//       console.log("Token refreshed successfully");
//       return true;
//     }
//     return false;
//   } catch (err) {
//     console.error("Refresh token error:", err);
//     return false;
//   }
// }






import { toast } from "sonner";
import { API_BASE_URL } from "../../../../config/endpoin.config";

// src/utils/apiFetch.js
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const apiFetch = async (url, options = {},retry = true) => {
  // Directly get token and refreshToken from localStorage
  // const refreshToken = localStorage.getItem("refreshToken");
//   const token = cookies.getItem("token");
// console.log(token)
  const fetchOptions  = {
       ...options,
       headers :{
         ...(!(options.body instanceof FormData) && { "Content-Type" : "application/json"} ),
         ...options.headers,
  
        },
        credentials : 'include',
  
  };

  try {
    const res = await fetch(url, fetchOptions);
    const data = await res.json().catch(() => ({}));

    // Handle unauthorized (401) – refresh token logic
    if (res.status === 401) {
      if(!retry){
        sessionStorage.removeItem('user')
        toast.error('session expired,please login again.')
        return Promise.reject(data)
      }
      // if (!refreshToken) {
      //   toast.error(res.message)
      //   // No refresh token: just reject, don’t remove anything
      //   return Promise.reject("Unauthorized: No refresh token");
      // }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/user/refreshToken`, {
            method: "POST",
            // headers: { "Content-Type": "application/json" },
            credentials: 'include',
            // body: JSON.stringify({ refreshToken }),
          });
          const refreshData = await refreshRes.json().catch(()=>({}));
          isRefreshing = false;

          if (!refreshRes.ok) {
            sessionStorage.removeItem('user')
            processQueue("You are not loged In", null);
            return Promise.reject(refreshData);
          }

          // localStorage.setItem("token", refreshData.accessToken);
          isRefreshing = false;
          processQueue(null, true);
          return apiFetch(url, options,false);
        } catch (err) {
          isRefreshing = false;
          processQueue(err, null);
          return Promise.reject(err);
        }
      } else {
        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() =>  apiFetch(url, options,false));
          // options.headers = { ...options.headers, Authorization: `Bearer ${newToken}` };
          
        
      }

      // Retry original request after refresh
      // const newToken = localStorage.getItem("token");
      // options.headers = { ...options.headers, Authorization: `Bearer ${newToken}` };
      // return apiFetch(url, options);
    }

    if (!res.ok) {
      // API error: just reject with the message
      throw new Error(data.message || `API Error: ${res.status}`);
    }

    return data;

  } catch (error) {
    // Return error without clearing tokens
    return Promise.reject(error);
  }
};
