"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SigninPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("api/users/login", user);
      console.log("\n\n\n response --> %s", response);
      console.log("login success");
      router.push("/profile");
    } catch (error: any) {
      console.log("Sigin Falied");
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <span className="text-3xl font-bold mb-10">
        {loading ? "Processing" : "Sigin"}
      </span>
      <hr />
      <div className="py-4">
        <div className="grid grid-cols-2 grid-flow-col">
          <label className="p-4" htmlFor="email">
            Email
          </label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 foucs:outline-none focus:border-gray-600 text-black"
            type="text"
            name=""
            id="email"
            value={user.email}
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
            }}
          />
        </div>
        <div className="grid grid-cols-2 grid-flow-col">
          <label className="p-4" htmlFor="password">
            Password
          </label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 foucs:outline-none focus:border-gray-600 text-black"
            type="password"
            name=""
            id="password"
            value={user.password}
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={onSignin}
            className="px-10 py-2 border border-gray-300 rounded-xl m-10 focus:outline-none focus:border-gray-600"
            disabled={buttonDisabled ? true : false}
          >
            Login
          </button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Link href="/signup">
            Don't have an account yet?{" "}
            <span className="text-teal-400 font-semibold">Signup</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
