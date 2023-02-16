import axios, { AxiosInstance } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

type AuthPayload = {
  life: number;
  token: string | null;
  client: AxiosInstance | null;
};
const Initialvalue: AuthPayload & { init: (() => Promise<void>) | null } = {
  life: 0,
  token: null,
  init: null,
  client: null,
};
export const AuthContext = React.createContext<
  AuthPayload & { init: (() => Promise<void>) | null }
>(Initialvalue);

export function AuthProviderComponent({ children }: any) {
  const [loading, setLoading] = useState(false);
  const [authPayload, setAuthPayload] = useState<
    AuthPayload & { init: (() => Promise<void>) | null }
  >(Initialvalue);

  const init = useCallback(async () => {
    try {
      setLoading(true);
      const fromStorage = await localStorage.getItem('token');
      if (fromStorage) {
        const data = JSON.parse(fromStorage);
        const axiosClient = axios.create({
          baseURL: 'http://localhost:5000',
          headers: {
            Authorization: 'Bearer ' + data.token,
          },
        });
        axios.interceptors.response.use(
          function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response;
          },
          function (error) {
            if (
              error?.response?.data?.err &&
              error?.response?.data?.err === 'Forbinded Resources'
            ) {
              localStorage.removeItem('token');
              location.href = 'http://localhost:5173/login';
            }

            return Promise.reject(error);
          }
        );

        setAuthPayload({ ...data, client: axiosClient });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  if (loading) return <div>Loading....</div>;

  return (
    <AuthContext.Provider value={{ ...authPayload, init }}>
      {children}
    </AuthContext.Provider>
  );
}
