"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, createAccount, resetEmail } from "../auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
  setError(null);
  setLoading(true);
    try {
      await login(email, password);
      // redirect to profile after successful login
      router.push("/profile");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
  setError(null);
  setLoading(true);
    try {
      await createAccount(email, password);
      router.push("/profile");
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError(null);
    try {
      await resetEmail(email);
      setError("Password reset email sent if the account exists.");
    } catch (err) {
      setError(err.message || "Reset failed");
    }
  }

  return (
    <div className="bg-blue-500 min-h-screen w-full flex flex-col items-center justify-center">
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="abc@gmail.com"
          className="w-[400px] bg-white p-4"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-[400px] bg-white p-4"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-200 w-[200px] p-4 mt-2"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <button
          onClick={handleSignUp}
          className="bg-orange-200 w-[200px] p-4 mt-2"
        >
          Sign Up
        </button>

        <button
          onClick={handleReset}
          className="bg-green-200 w-[200px] p-4 mt-2"
        >
          Send Reset Email
        </button>

        {error && (
          <div className="bg-white text-red-700 p-2 mt-2 w-[400px]">{error}</div>
        )}
      </form>
    </div>
  );
}
