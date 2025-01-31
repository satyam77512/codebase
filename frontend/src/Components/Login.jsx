import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { BaseUrl } from '../BaseUrl.js';
import { useNavigate } from "react-router-dom";
import Header from './Header.jsx';
import { setUserData,setUserID } from '../Redux/actions.js';
import { useDispatch } from 'react-redux';

const Login = () => {
    const navigate = useNavigate();
    const Dispatch = useDispatch();

    const [Loginid, setLognid] = useState('');
    const [Password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const headers = {
            "Content-Type": "application/json", // multer problem due to this
          };
          axios
            .post(`${BaseUrl()}/user/auth/login`, {Loginid,Password}, {
              headers: headers,
            })
            .then((response)=>{
                console.log(response.data);
                navigate('/display',{})
                Dispatch(
                    setUserData({
                        FirstName : response.data.FirstName,
                        MiddleName: response.data.MiddleName,
                        LastName: response.data.LastName,
                        Email: response.data.Email,
                        Gender: response.data.Gender,
                        Department: response.data.Department,
                        Year: response.data.Year,
                        RollNumber: response.data.RollNumber,
                        Phone: response.data.Phone,
                        Skills: response.data.Skills,
                        ProfilePic: response.data.ProfilePic,
                        Resume: response.data.Resume,
                        Password: response.data.Password,
                        Status: response.data.Status
                    })
                )
                setLognid('')
                setPassword('')
            })
            .catch((err)=>{
                console.log(err);
            })
    };

    return (
    <>
        <Header/>
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="Loginid">Loginid</label>
                    <input
                        type="text"
                        id="Loginid"
                        placeholder="Enter your Loginid"
                        value={Loginid}
                        onChange={(e) => setLognid(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="Password"
                        placeholder="Enter your password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
        </div>
    </>
    );
};

export default Login;
