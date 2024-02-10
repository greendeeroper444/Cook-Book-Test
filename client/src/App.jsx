import { Route, Routes } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import SigninPage from './pages/SigninPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import axios  from 'axios'
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from '../contexts/userContext';


axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

function App() {

  return (
    <UserContextProvider>
      <Toaster position='top-right' toastOptions={{ 
      // duration: 2000,
      className: '',
      style: {
        border: '1px solid #713200',
        padding: '10px',
        color: '#713200',
      },
      }}
      containerStyle={{
        top: 100,
      }} 
      />
      <Routes>
        <Route path='/' element={<SigninPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/home' element={<HomePage/>}/>
      </Routes>
    </UserContextProvider>
  )
}

export default App
