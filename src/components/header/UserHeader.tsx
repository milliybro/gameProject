import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../states/auth";
import { useCallback, useEffect, useState } from "react";
import { request } from "../../request";
import { IMG_URL } from "../../constants";

import bell from "../../assets/bell.png";
import logoutIcon from "../../assets/logout.svg";

import "./Header.scss";

const UserHeader = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [unansweredMessages, setUnansweredMessages] = useState(0);
  const { userId } = useAuth();
  const [userData, setUserData] = useState({
    birthday: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    email: "",
    info: "",
    photo: "",
  });

  const controlDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const { logout } = useAuth();
  const handleLogout = () => {
    if (confirm("Are you sure you want to log")) {
      logout(navigate);
      navigate("/login");
    }
  };

  const getData = async () => {
    try {
      const res = await request.get(`user/user/${userId}/`);
      setUserData(res.data);
    } catch (err) {
      toast.error("Failed to get user data");
    }
  };

  useEffect(() => {
    getData();
  }, [unansweredMessages]);
  return (
    <header className="header">
      <span className="piece-of"></span>
      <div className="admin__container">
        <h4>@{userData?.username}</h4>
        <div className="account">
          <div className="accountim" onClick={controlDropdown}></div>
          <button onClick={handleLogout}>
            Logout
            <img src={logoutIcon} alt="" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
