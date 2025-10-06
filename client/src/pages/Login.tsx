import React, { useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../assets/hero.jpeg";
import Logo from "../assets/logo.svg";

const Login: React.FC = () => {
  const [phone, setPhone] = useState<string>("");

  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-5">
        {/* Card */}
        <div className="flex items-center justify-center">
          <div className="bg-white shadow-lg rounded-2xl p-6 w-96">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img src={Logo} alt="Aahar Logo" className="h-10" />
            </div>

            {/* Title */}
            <h1 className="text-center text-2xl font-bold text-gray-800 mb-10">
              Welcome To AAHAR
            </h1>

            {/* Phone Input */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600" htmlFor="phone">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                placeholder="Phone"
                value={phone}
                onChange={onPhoneChange}
                className="p-2 w-full border-b-2 border-gray-300 focus:border-gray-500 focus:outline-none text-gray-700"
              />
            </div>

            {/* Button */}
            <Link
              to="/dashboard"
              className="flex items-center justify-center w-full bg-emerald-500 text-white py-3 px-4 mt-20 mb-10 rounded-full text-lg font-semibold shadow-md hover:bg-emerald-600 transition"
            >
              Get Started Today
            </Link>
          </div>
        </div>

        {/* Hero image */}
        <div className="flex items-center justify-center">
          <img src={Hero} alt="Hero" className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;
