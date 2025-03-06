"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log("Submitted Form Data", formData);

    if (type === "signup") {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("All Fields are required");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    } else {
      if (!formData.username || !formData.password) {
        setError("All Fields are required.");
        return;
      }
    }

    try {
      if (type === "login") {
        const result = await signIn("credentials", {
          redirect: false,
          username: formData.username,
          password: formData.password,
        });

        if (result?.error) {
          setError("Invalid username or password.");
          return;
        }

        router.push("/");
      } else {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");

        alert("Account created! Redirecting to login...");
        router.push("/Login");
      }
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="max-w-md mx-auto mt-24 bg-[#212121] p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl text-center font-bold mb-6">
        {type === "login" ? "Login to Your Account" : "Create an Account"}
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 bg-[#444] border border-[#555] rounded-md text-white focus:border-[#888] outline-none"
        />
        {type === "signup" && (
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-[#444] border border-[#555] rounded-md text-white focus:border-[#888] outline-none"
          />
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 bg-[#444] border border-[#555] rounded-md text-white focus:border-[#888] outline-none"
        />
        {type === "signup" && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 bg-[#444] border border-[#555] rounded-md text-white focus:border-[#888] outline-none"
          />
        )}

        <button
          type="submit"
          className="w-full bg-[#919191] text-white py-3 rounded-md font-bold hover:bg-[#5e5e5e] transition"
        >
          {type === "login" ? "Login" : "Create Account"}
        </button>
      </form>

      <div className="text-center mt-4 text-sm">
        {type === "login" ? (
          <p>
            Don't have an account?{" "}
            <Link href="/Sign-up" className="text-blue-400 underline hover:text-blue-600">
              Sign up here
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link href="/Login" className="text-blue-400 underline hover:text-blue-600">
              Login here
            </Link>
          </p>
        )}
      </div>
    </section>
  );
};

export default AuthForm;
