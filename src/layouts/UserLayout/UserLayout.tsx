import { Outlet } from "react-router-dom";
import "./userLayout.scss";
import UserHeader from "../../components/header/UserHeader";
const UserLayout = () => {
  return (
    <div className="user__layout">
      <div style={{ display: "flex", backgroundColor: "grey" }}></div>
      <UserHeader />
      <main className="user__layout__contents">
        <div className="content__container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
