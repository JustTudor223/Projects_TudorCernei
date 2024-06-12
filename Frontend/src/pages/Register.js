import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
  });

  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteCodeError, setInviteCodeError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const isValidInviteCode = async (code) => {
    const response = await fetch(`http://localhost:4000/api/inviteCode/checkInviteCode/${code}`);
    const data = await response.json();
    return data.valid;
  };

  const handleRoleChange = (e) => {
    setForm({ ...form, role: e.target.value });
    setIsAdmin(e.target.value === 'admin');
  };

  const handleInviteCodeChange = (e) => {
    setInviteCode(e.target.value);
    setInviteCodeError(false);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "email") {
      setEmailError(!validateEmail(e.target.value));
    } else if (e.target.name === "phoneNumber") {
      setPhoneError(!validatePhoneNumber(e.target.value));
    } else if (e.target.name === "password") {
      validatePassword(e.target.value);
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^\d{10,14}$/;
    return phonePattern.test(phoneNumber);
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("You must have at least one uppercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("You must have at least one number.");
    }
    setPasswordErrors(errors);
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (isAdmin && !(await isValidInviteCode(inviteCode))) {
      setInviteCodeError(true);
      return;
    }

    fetch("http://localhost:4000/api/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ ...form, isAdmin }),
    })
      .then((result) => {
        alert("Successfully Registered, Now Login with your details");
        navigate('/login')
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setIsFormValid(
      form.firstName &&
      form.lastName &&
      validateEmail(form.email) &&
      form.password &&
      validatePhoneNumber(form.phoneNumber) &&
      form.role &&
      (!isAdmin || inviteCode) &&
      passwordErrors.length === 0
    );
  }, [form, inviteCode, isAdmin, passwordErrors]);

  return (
    <>
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: "#6600FF" }}>
        <div className="w-full max-w-2xl space-y-12 p-12 rounded-lg bg-white">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 drop-shadow-lg">
              Stock Master
            </h1>
            <div className="flex items-center justify-center mt-4">
              <span className="text-2xl text-gray-700">Powered by</span>
              <img
                className="ml-3 h-12 w-auto"
                src="https://logolook.net/wp-content/uploads/2022/10/Nokia-Log%D0%BE.png"
                alt="Nokia Logo"
              />
            </div>
          </div>
          <form className="mt-8 space-y-6" onSubmit={registerUser}>
            <div className="flex flex-col gap-4 -space-y-px rounded-md shadow-sm">
              <div className="flex gap-4">
                <input
                  name="firstName"
                  type="text"
                  required
                  className="relative block w-full rounded-t-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg sm:leading-6"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleInputChange}
                />
                <input
                  name="lastName"
                  type="text"
                  required
                  className="relative block w-full rounded-t-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg sm:leading-6"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`relative block w-full rounded-t-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset ${
                    emailError ? "focus:ring-red-600" : "focus:ring-indigo-600"
                  } text-lg sm:leading-6`}
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleInputChange}
                />
                {emailError && <p className="text-red-600 text-sm">Invalid email address.</p>}
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg sm:leading-6"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleInputChange}
                />
                {passwordErrors.length > 0 && (
                  <ul className="text-red-600 text-sm mt-2">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <input
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  pattern="\d{10,14}"
                  required
                  className={`relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset ${
                    phoneError ? "focus:ring-red-600" : "focus:ring-indigo-600"
                  } text-lg sm:leading-6`}
                  placeholder="Phone Number"
                  value={form.phoneNumber}
                  onChange={handleInputChange}
                />
                {phoneError && <p className="text-red-600 text-sm">Invalid phone number.</p>}
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="admin"
                  onChange={handleRoleChange}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-600"
                  required
                />
                <label
                  htmlFor="admin"
                  className="block text-lg text-gray-900"
                >
                  Admin
                </label>
                <input
                  type="radio"
                  id="customer"
                  name="role"
                  value="customer"
                  onChange={handleRoleChange}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-600"
                  required
                />
                <label
                  htmlFor="customer"
                  className="block text-lg text-gray-900"
                >
                  Customer
                </label>
              </div>
              {isAdmin && (
                <div>
                  <input
                    type="text"
                    placeholder="Enter invite code"
                    className={`relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset ${
                      inviteCodeError ? "focus:ring-red-600" : "focus:ring-indigo-600"
                    } text-lg sm:leading-6`}
                    value={inviteCode}
                    onChange={handleInviteCodeChange}
                  />
                  {inviteCodeError && <p className="text-red-600 text-sm">The invite code is invalid.</p>}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className={`group relative flex w-full justify-center rounded-md py-3 px-4 text-lg font-semibold text-white ${
                  isFormValid ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-300 cursor-not-allowed"
                } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                disabled={!isFormValid}
                onClick={registerUser}
              >
                Sign up
              </button>
              <p className="mt-4 text-center text-lg text-gray-600">
                Or{" "}
                <span
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Already Have an Account, Please
                  <Link to="/login"> Sign in now </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
