import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    });


    const handleSignup = async(e) => {
        e.preventDefault();
        const {name, email, password} = data;
        try {
            const response = await axios.post('/signup', {
                name,
                email,
                password
            });

            if(response.data.error){
                toast.error(response.data.error)
            }else{
                setData({});
                navigate('/');
                toast.success(response.data.message)
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
                        <h3>Create An Account </h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSignup}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="name" className="form-control" id="name" placeholder="Enter your name"
                                value={data.name} onChange={(e) =>setData({...data, name: e.target.value})} />
                            </div>
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
                            <button type="submit" className="btn btn-success">Sign Up</button>
                        </form>
                    </div>
                    <div className="card-footer">
                        <p className="mb-0">Already have an account? <Link to="/" style={{ textDecoration: 'none' }}>Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
