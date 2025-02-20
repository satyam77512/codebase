import React from 'react';
import './DisplayPage.css';
import {useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import {updateUserdata} from '../Redux/actions';
import { BaseUrl } from '../BaseUrl.js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Header from './Header.jsx';
// import imagesrc from `../../../backend/${data.ProfilePic}`;

const DisplayPage = () => {
    const navigate = useNavigate();
    const [data , setData] = useState();
    const userData = useSelector((state)=> state.userData)
    const dispatch = useDispatch();

    useEffect(() => {
      if (userData==null) {
        navigate("/login");
      }
      else
      {
        setData(userData);
      }
    }, [navigate,userData]);

    const StatusToggle = ()=>{
      const headers = {
        "Content-Type": "application/json", // multer problem due to this
      };
      axios
        .put(`${BaseUrl()}/user/details/status`,{RollNumber: data.RollNumber}, {
          headers: headers,
        })
        .then((response)=>{
            dispatch(updateUserdata("Status",response.data));
        })
    }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile,setImageFile] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const HandleChange = (e)=>{
    setImageFile(e.target.files[0]);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "multipart/form-data", // multer problem due to this
    };
    axios
      .put(`${BaseUrl()}/user/details/changeProfile`,{imageFile,RollNumber:data.RollNumber}, {
        headers: headers,
      })
      .then((response)=>{
        dispatch(updateUserdata("ProfilePic",response.data))
      })
    setIsModalOpen(false);
  };
  const handleClick = ()=>{
    if(data)
    {
      const headers = {
        "Content-Type": "application/json", // multer problem due to this
      };
      axios
        .post(`${BaseUrl()}/user/auth/email`,{Loginid : data.RollNumber}, {
          headers: headers,
        })
        .then((response)=>{
            if(response.data.success)
            {
              alert("Password reset link sent to registered email");
            }
            else
            {
                alert("email cannot be sent");
            }
        })
    }
    else
    {
      console.log("waait for data to load");
    }
  }

  return (
    <>
    <Header/>
    { data &&(
    <div className="container">
        <div className="header">
            <img
            src={`${data.ProfilePic}`}
            alt="Profile Pic"
            className="profile-pic"
            />
            <div className="app">
                <button className="open-modal-btn" onClick={handleOpenModal}>
                  Change Photo
                </button>

                {isModalOpen && (
                  <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <h3>Upload File</h3>
                      <form onSubmit={handleFileUpload} encType="multipart/form-data">
                        <input type="file" name="imageFile" onChange={HandleChange} required />
                        <button type="submit">Submit</button>
                      </form>
                    </div>
                  </div>
                )}
            </div>
            <div>
              <button className={`status-button ${data.Status ? "active" : "busy"}`} onClick={StatusToggle}>
                {data.Status ? "Active" : "Busy"}
              </button>
            </div>
            <div className="greeting">
            Hello, {data.FirstName || 'Guest'}! 😊
            </div>
        </div>
        <div className="content">
            <div className="info-item">
            <strong>First Name:</strong> {data.FirstName || 'N/A'}
            </div>
            <div className="info-item">
            <strong>Middle Name:</strong> {data.MiddleName || ''}
            </div>
            <div className="info-item">
            <strong>Last Name:</strong> {data.LastName || 'N/A'}
            </div>
            <div className="info-item">
            <strong>Email:</strong> {data.Email || 'N/A'}
            </div>
            <div className="info-item">
            <strong>Gender:</strong> {data.Gender || 'N/A'}
            </div>
            <div className="info-item">
            <strong>Department:</strong> {data.Department || 'N/A'}
            </div>
            <div className="info-item">
            <strong>Year:</strong> {data.Year || 'N/A'}
            </div>
            <div className="info-item">
            <strong>Roll Number:</strong> {data.RollNumber || 'N/A'}
            </div>
            <div className="info-item">
            <strong>Phone:</strong> {data.Phone || 'N/A'}
            </div>
            <div className="info-item">
            <strong>Skills :</strong>{' '}
            {data.Skills && data.Skills.length > 0
                ? data.Skills.join(' , ')
                : 'N/A'}
            </div>
            <div className="info-item">
            <strong>Resume:</strong>{' '}
            {data.Resume ? (
                <a href={`${data.Resume}`} target="_blank" rel="noopener noreferrer">
                View Resume
                </a>
            ) : (
                'N/A'
            )}
            </div>
            <button className='Forgot_password_button' onClick={handleClick}>Change Password</button>
        </div>
    </div>
    )}
  </>
  );
};

export default DisplayPage;
