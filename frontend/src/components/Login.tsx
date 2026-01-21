import { useRef } from "react";
import { authApi } from "../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const loginMutation = useMutation({
    mutationFn: authApi.login,

    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.setQueryData(["user", "auth"], user);
      toast.success("Login successful!");
      navigate("/dashboard");
    },

    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error logging in!");
      }
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const username = usernameRef.current?.value ?? "";
    const password = passRef.current?.value ?? "";

    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    loginMutation.mutate({ username, password });
  };

  return (
    <div className="border border-gray-200 flex flex-col items-center max-w-sm mx-auto rounded-2xl mt-36 shadow-lg">
      <div className="mt-6">
        <h1 className="text-2xl">Welcome Back</h1>
        <p className="text-sm mt-1">Sign in to your account</p>
      </div>
      <form
        onSubmit={handleLogin}
        className="my-6 space-y-6 flex flex-col w-full px-6"
      >
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
          <label htmlFor="password" className="block text-sm pb-3">
            Password
          </label>
          <input
            type="password"
            id="password"
            ref={passRef}
            placeholder="******"
            className="border border-zinc-400 px-3 rounded-lg w-full py-2"
          />
        </div>

        <button
          disabled={loginMutation.isPending}
          className="px-4 py-2 cursor-pointer text-white bg-blue-500 rounded-md disabled:opacity-50"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-sm my-6">
        Dont have an account?{" "}
        <Link to="/signup" className="text-blue-600/80 cursor-pointer">
          Signup
        </Link>
      </p>
    </div>
  );
};

export default Login;
