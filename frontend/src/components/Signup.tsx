import { useRef } from "react";
import { authApi } from "../api/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const nameRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const signupMutation = useMutation({
    mutationFn: authApi.signup,

    onSuccess: () => {
      toast.success("Account created! Please login.");
      navigate("/login");
    },

    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error creating account!");
      }
    },
  });

  const handleSignup = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value ?? "";
    const username = usernameRef.current?.value ?? "";
    const email = emailRef.current?.value ?? "";
    const password = passRef.current?.value ?? "";

    if (!name || !username || !email || !password) {
      toast.error("All fields are required!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    signupMutation.mutate({ name, username, email, password });
  };

  return (
    <div className="border border-gray-200 flex flex-col items-center max-w-sm mx-auto rounded-2xl mt-12 shadow-lg">
      <div className="mt-6">
        <h1 className="text-2xl">Create Account</h1>
        <p className="text-sm mt-1">Join to track task, projects</p>
      </div>
      <form
        onSubmit={handleSignup}
        className="my-6 space-y-6 flex flex-col w-full px-6"
      >
        <div>
          <label htmlFor="name" className="block text-sm pb-3">
            Name
          </label>
          <input
            type="text"
            id="name"
            ref={nameRef}
            placeholder="Your name"
            className="border border-zinc-400 px-3 rounded-lg w-full py-2"
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm pb-3">
            Username
          </label>
          <input
            type="text"
            id="username"
            ref={usernameRef}
            placeholder="Your username"
            className="border border-zinc-400 px-3 rounded-lg w-full py-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm pb-3">
            Email
          </label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            placeholder="your@email.com"
            className="border border-zinc-400 px-3 rounded-lg w-full py-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm pb-3">
            Password
          </label>
          <input
            type="password"
            id="password"
            ref={passRef}
            placeholder="******"
            minLength={6}
            required
            className="border border-zinc-400 px-3 rounded-lg w-full py-2"
          />
          <span className="text-xs text-zinc-500">
            Must be at least 6 characters
          </span>
        </div>

        <button
          disabled={signupMutation.isPending}
          className="px-4 py-2 cursor-pointer text-white bg-blue-500 rounded-md disabled:opacity-50"
        >
          {signupMutation.isPending ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="text-sm my-6">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600/80 cursor-pointer">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
