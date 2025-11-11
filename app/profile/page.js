"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { logout } from "../auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  async function handleLogout() {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Profile</h1>
      {user ? (
        <div className="mt-4">
          <p>Email: {user.email}</p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-200 p-2 rounded"
          >
            Sign out
          </button>
          <button
            onClick={() => router.push("/chatroom")}
            className="mt-4 ml-4 bg-blue-200 p-2 rounded"
          >
            Go to Chatroom
          </button>
        </div>
      ) : (
        <div>
          <p>No user found. Redirecting to login...</p>
        </div>
      )}
    </div>
  );
}