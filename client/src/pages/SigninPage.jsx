import axios from 'axios';
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/userContext';

export default function SigninPage() {
  const navigate = useNavigate();
  const {setUser} = useContext(UserContext);
    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const handleSignin = async(e) => {
        e.preventDefault();
        const {email, password} = data;
        try {
            
            const response = await axios.post('/signin', {
                email,
                password
            });

            if(response.data.error){
                toast.error(response.data.error)
            } else{
                setData({});
                setUser(response.data.user);
            
                const storedRecipe = JSON.parse(localStorage.getItem('selectedRecipe')) || {};
      
                //check if the user is the owner of the selected recipe
                if(storedRecipe.selectedBy && storedRecipe.selectedBy._id !== response.data.user._id){
                    localStorage.removeItem('selectedRecipe')
                }

                navigate('/home');
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header text-center">
                        <h3>Welcome Back!!!</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSignin}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter your email"
                                value={data.email} onChange={(e) =>setData({...data, email: e.target.value})} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Enter your password"
                                value={data.password} onChange={(e) => setData({...data, password: e.target.value})} />
                            </div>
                          <button type="submit" className="btn btn-success">Sign In</button>
                        </form>
                    </div>
                    <div className="card-footer">
                        <p className="mb-0">Don&apos;t have an account? <Link to="/signup" style={{ textDecoration: 'none' }}>Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
