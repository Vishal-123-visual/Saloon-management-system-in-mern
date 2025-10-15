// src/auth/adapters/custom-adapter.js
import { Truck } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../config/endpoin.config';
import { apiFetch } from '../../pages/store-client/components/utils/ApiFetch';

export const CustomAdapter = {
  /**
   * Login with phone + password
   */
  async login(phone, password) {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }

    const data = await response.json();
    // backend should return: { token, refreshToken, user }
    //  console.log(data.token)
    //  console.log(data.refreshToken)
    // ✅ Save tokens & user to localStorage
    localStorage.setItem('token', data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return {
      access_token: data.token,
      refresh_token: data.refreshToken,
      user: data.user || null,
    };
  },

  /**
   * Register a new user
   */
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/user/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData), // {phone, password, name, email?}
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Signup failed');
    }

    const data = await response.json();
    // backend should return { token, refreshToken, user? }

    // ✅ Save tokens
    localStorage.setItem('token', data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return {
      access_token: data.token,
      refresh_token: data.refreshToken || null,
      user: data.user || null,
    };
  },


  // update user
  async updateUser(id,data){
       try {
        const response = await fetch(`${API_BASE_URL}/user/${id}`,{
          method : "PUT",
          headers : {
            'Content-Type' : 'application/json',
            Authorization : `Bearer ${localStorage.getItem('token')}`
          },
          body :JSON.stringify(data)
        })
        const resData = await response.json()
        if(resData.success){
            toast.success(resData.message)
            return resData.users
        }
        else{
          toast.error(resData.message)
          return null
        }
       } catch (error) {
        toast.error(error.message )
        console.log(error)
        return null
       }
  },
  // update user
  async deleteUser(id){
       try {
        const response = await fetch(`${API_BASE_URL}/user/${id}`,{
          method : "DELETE",
          headers : {
            Authorization : `Bearer ${localStorage.getItem('token')}`
          },
        })
        const resData = await response.json()
        if(resData.success){
            toast.success(resData.message)
            return true
        }
        else{
          toast.error(resData.message)
          return false
        }
       } catch (error) {
        toast.error(error.message )
        console.log(error)
        return false
       }
  },

  /// get user details 
  async userDetails(id){
    try {
      const response = await fetch(`${API_BASE_URL}/user/${id}`,
        {
          method : "GET",
          headers :{
            Authorization : `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const resData = await response.json()
      //console.log(resData)
      if(resData.success){
        return resData.users
      }
      else{
        toast.error(resData.message)
        return []
      }
    } catch (error) {
      console.log(error)
      return []
    }
  },
  /// get all users 
  async allUser(){
    try {
      const response = await fetch(`${API_BASE_URL}/user/all`,
        {
          method : "GET",
          headers :{
            Authorization : `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      const resData = await response.json()
      //console.log(resData)
      if(resData.success){
        return resData.users
      }
      else{
        toast.error(resData.message)
        return []
      }
    } catch (error) {
      console.log(error)
      return []
    }
  },

  /**
   * Get current logged-in user (via token)
   */
  async getCurrentUser(token) {
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.user || null;
  },

  // add customer ( for admin and staff )
  async addCustomer(customerData) {
    const response = await fetch(`${API_BASE_URL}/customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(customerData),
    });
    const data = await response.json().catch(() => {});

    if (!response.ok) {
      throw new Error(data.message);
    }

    //console.log(data);
    return {
      success: data.success ?? true,
      message: data.message ?? 'customer added',
      data: data.data || null,
    };
  },

  // add customer ( for admin and staff )
  async updateCustomer(id,customerData) {
    const response = await fetch(`${API_BASE_URL}/customer/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(customerData),
    });
    const data = await response.json().catch(() => {});

    if (!response.ok) {
      throw new Error(data.message);
    }

    //console.log(data);
    return {
      success: data.success ?? true,
      message: data.message ?? 'customer updated',
      data: data.data || null,
    };
  },

  // add customer ( for admin and staff )
  async deleteCustomer(id) {
    const response = await fetch(`${API_BASE_URL}/customer/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json().catch(() => {});
    console.log(data)

    if (!response.ok) {
      throw new Error(data.message);
    }

    //console.log(data);
    return  true
  },

  // add customer ( for admin and staff )
  async customerDetailsById(id) {
    const response = await fetch(`${API_BASE_URL}/customer/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json().catch(() => {});

    if (!response.ok) {
      throw new Error(data.message);
    }

    //console.log(data);
    return {
      success: data.success ?? true,
      message: data.message ?? 'customer details',
      data: data.data || null,
    };
  },

  // customer login for customer
  // async loginCustomer(name,phone) {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/customer/login`,{
  //       method : "POST",
  //       headers:{
  //         'Content-Type':'application/json'
  //       }
  //       ,
  //       body : JSON.stringify({name,phone})
  //     })
  //     if (!response.ok) {
  //     const err = await response.json().catch(() => ({}));
  //     throw new Error(err.message || 'Login failed');
  //   }

  //   const data = await response.json();
  //   // backend should return: { token, refreshToken, user }
  //   //  console.log(data.token)
  //   //  console.log(data.refreshToken)
  //   // ✅ Save tokens & user to localStorage
  //   localStorage.setItem('token', data.token);
  //   if (data.refreshToken) {
  //     localStorage.setItem('refreshToken', data.refreshToken);
  //   }
  //   if (data.customer) {
  //     localStorage.setItem('customer', JSON.stringify(data.customer));
  //   }

  //   return {
  //     access_token: data.token,
  //     refresh_token: data.refreshToken,
  //     customer: data.customer || null,
  //   };
  //   } catch (error) {}
  // },

  // get all customers (for admin and staff)
  async getAllCustomer() {
    try {
      const response = await fetch(`${API_BASE_URL}/customer`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch customers');
      }

      const data = await response.json();
      //console.log(data)
      return data.data || [];
    } catch (error) {
      console.error(error);
      toast.error(error.message)
      return []
    }
  },

  // get visited customer stats ( on. of visited times)
  async visitedCustomerStats(){
    try {
      const response = await fetch(`${API_BASE_URL}/customer/customer-stats`,{
        method : 'GET',
        headers :{
          Authorization : `Bearer ${localStorage.getItem('token')}`
        }
      })
      const resData = await response.json()
      return resData
    } catch (error) {
      console.log(error)
    }
  },

  // get customer by name or phone ( for admin and staff )
  async searchCustomers(query) {
    try {
      const response = await apiFetch(
        `${API_BASE_URL}/customer/search?search=${query}`,
      );
      //console.log(response)
      if (response.success) {
        //console.log(response)
        return response.customers;
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      //console.error(error)
      throw new Error('Failed to fetch customers');
    }
  },

  /**
   * Logout
   */
  async logout(token) {
    try {
      await fetch(`${API_BASE_URL}/user/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      console.warn('Logout request failed (ignored):', e);
    } finally {
      // ✅ Clear localStorage always
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
};
