import { useEffect, useState } from "react";
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
  const auth = useAuth();

  useEffect(() => {
    // Load particles.js script dynamically
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize particles.js
      particlesJS("particles-js", {
        particles: {
          // Configuration for particles
          number: {
            value: 100,
            density: {
              enable: true,
              value_area: 500,
            },
          },
          color: {
            value: "#b1c900",
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#000000",
            },
            polygon: {
              nb_sides: 5,
            },
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 5,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "repulse",
            },
            onclick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: {
              distance: 100,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
      });
    };

    return () => {
      // Cleanup: remove the dynamically added script
      document.body.removeChild(script);
    };
  }, []);
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
