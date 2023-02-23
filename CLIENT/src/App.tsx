import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthGuard, GuestGuard } from "./components/authGuard";
import { LoginPage } from "./screens/LoginScreen";
import { ProfilePage } from "./screens/ProfileScreen";
import { RegisterPage } from "./screens/RegisterScreen";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import {onError} from "@apollo/client/link/error";


const errorLink = onError (({graphqlErrors , networkEroors}: any) => {

  if(graphqlErrors){
    graphqlErrors.map(({message,location,path}: any)=>{
      alert(`Graphql error${message}`)
    })
  }

})

const link = from([
  errorLink,
  new HttpLink({uri : "http://localhost:5000/grahpql"})
])

const client = new ApolloClient({
  cache : new InMemoryCache(),
  link: link
})

function ProtectedRoutes() {
  return (
    <AuthGuard>
      <Routes>
        <Route path="" element={<ProfilePage />} />
      </Routes>
    </AuthGuard>
  );
}

function GuestRoutes() {
  return (
    <GuestGuard>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="" element={<h1>Landing Page</h1>} />
      </Routes>
    </GuestGuard>

   
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    // <Routes>
    //   <Route path="app/*" element={<ProtectedRoutes />} />
    //   <Route path="*" element={<GuestRoutes />} />
    // </Routes>

    <ApolloPr client={client} ></ApolloProvider>
  );
}

export default App;
