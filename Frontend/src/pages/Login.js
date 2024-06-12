import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const authCheck = () => {
    setTimeout(() => {
      fetch("http://localhost:4000/api/login")
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("user", JSON.stringify(data));
          authContext.signin(data._id, () => {
            if (data.isAdmin) {
              navigate("/");
            } else {
              navigate("/client");
            }
          });
        })
        .catch((err) => {
          alert("Wrong credentials, Try again");
          console.log(err);
        });
    }, 3000);
  };

  const loginUser = (e) => {
    // Cannot send empty data
    if (form.email === "" || form.password === "") {
      alert("To login user, enter details to proceed...");
    } else {
      fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then((result) => {
          console.log("User login", result);
        })
        .catch((error) => {
          console.log("Something went wrong ", error);
        });
    }
    authCheck();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: "#6610FF" }}>
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
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div className="mb-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg sm:leading-6"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
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
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-lg text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-lg">
                <span
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </span>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-3 px-4 text-lg font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={loginUser}
              >
                Sign in
              </button>
              <p className="mt-4 text-center text-lg text-gray-600">
                Or{" "}
                <span
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Don't Have an Account, Please{" "}
                  <Link to="/register"> Register now </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
