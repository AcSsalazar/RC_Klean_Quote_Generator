"use client"

import { useEffect, useState } from "react"
import { login } from "../../src/utils/auth"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../src/RCA/auth"
import { Link } from "react-router-dom"
import "./styles/login.css"

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetForm = () => {
    setUsername("")
    setPassword("")
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await login(username, password)

    if (error) {
      alert(error)
    } else {
      navigate("/")
      resetForm()
    }

    setIsLoading(false)
  }

  return (
    <section className="login-section">
      <main>
        <div className="login-container">
          <section>
            <div className="login-row">
              <div className="login-col">
                <div className="login-card">
                  <div className="login-card-body">
                    <h3 className="login-title">Login</h3>

                    <form className="login-form" onSubmit={handleLogin}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="username">
                          Email
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          placeholder="Enter your email address"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={password}
                          placeholder="Enter your password"
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-input"
                          required
                        />
                      </div>

                      <button className="login-button" type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span>Processing...</span>
                            <div className="spinner" />
                          </>
                        ) : (
                          <>
                            <span>Login</span>
                            <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </>
                        )}
                      </button>

                      <div className="login-links">
                        <p>
                          ¿You don't have an account?{" "}
                          <Link to="/register" className="login-link">
                            Register here
                          </Link>
                        </p>
{/*                         <p>
                          <Link to="/forgot-password" className="login-link danger">
                            
                          </Link>
                        </p> */}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  )
}

export default Login

