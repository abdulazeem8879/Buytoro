// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { loginUser } from "../services/authService";
// import { useContext, useState } from "react";

// const Login = () => {
//   // form state

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // auth context
//   const { login } = useContext(AuthContext);

//   // navigate
//   const navigate = useNavigate();

//   //   submit handler
//   const submitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       // login user
//       const data = await loginUser(email, password);

//       // save user + token to context
//       login(data);
//             alert("login successful");


//       // navigate to dashboard
//       navigate("/");
//     } catch (error) {
//       alert("Invalid email or password");
//     }
//   };

//   return (
//     <div>
//       <h1>login</h1>

//       <form onSubmit={submitHandler}>
//         <div>
//           <label>Email</label>
//           <br />
//           <input
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <br />
//         <div>
//           <label>Password</label>
//           <br />
//           <input
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>

//         <br />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;
// ..........................................................................

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { useContext, useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);
      login(data);
      alert("login successful");
      navigate("/");
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center">Login</h1>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
