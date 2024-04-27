import { useState } from "react";
import { useAuth } from "../../../states/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import hide from "../../../assets/hide.png";
import show from "../../../assets/show.png";
import "./login.scss";
const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userForm, setUserForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  console.log(loading);
  
  const auth = useAuth();

  console.log(setShowPassword);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await auth.login(userForm, navigate);
      setLoading(false);
    } catch (err) {
      toast.error("Login or password reset failed");
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  return (
    <main className="main">
      <section className="section-login">
        <div className="section-main" id="login-box">
          <div className="section-login-2">
            <div className="section-login-2-main">
              <h1 className="section-login-2-title">Sign In </h1>
              <form className="section-login-2-form" onSubmit={handleLogin}>
                <div className="login-form-1">
                  <label htmlFor="input-username">Username</label>
                  <input
                    type="text"
                    onChange={handeChange}
                    name="username"
                    id="username"
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="login-form-3">
                  <label htmlFor="input-password">Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="Password"
                      required
                      onChange={handeChange}
                    />
                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={handlePasswordToggle}
                    >
                      {showPassword ? (
                        <img src={hide} alt="" />
                      ) : (
                        <img src={show} alt="" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="login-form-4">
                  <p>Forgot password?</p>
                </div>
                <div className="login-form-submit-btn">
                  <button type="submit">Next</button>
                </div>
                <div className="login-form-5">
                  <p>
                    No account? <a href="/register">Create one</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div>
        <div id="particles-js"></div>
      </div>
    </main>
  );
};

export default Login;
