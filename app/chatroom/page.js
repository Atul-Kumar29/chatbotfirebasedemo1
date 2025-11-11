"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import {
	collection,
	query,
	orderBy,
	onSnapshot,
	addDoc,
	serverTimestamp,
} from "firebase/firestore";

export default function ChatroomPage() {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [messages, setMessages] = useState([]);
	const [text, setText] = useState("");
	const [sending, setSending] = useState(false);

	useEffect(() => {
		const unsubAuth = onAuthStateChanged(auth, (u) => {
			if (!u) {
				router.push("/login");
			} else {
				setUser(u);
			}
			setLoading(false);
		});

		return () => unsubAuth();
	}, [router]);

	useEffect(() => {
		if (!db) return;
		const q = query(
			collection(db, "messages"),
			orderBy("createdAt", "asc")
		);
		const unsub = onSnapshot(q, (snapshot) => {
			const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			setMessages(msgs);
		});
		return () => unsub();
	}, []);

	async function sendMessage(e) {
		e.preventDefault();
		if (!text.trim()) return;
		if (!user) return router.push("/login");
		setSending(true);
		try {
			await addDoc(collection(db, "messages"), {
				text: text.trim(),
				uid: user.uid,
				email: user.email || null,
				createdAt: serverTimestamp(),
			});
			setText("");
		} catch (err) {
			console.error("sendMessage error", err);
			alert("Failed to send message: " + err.message);
		} finally {
			setSending(false);
		}
	}

	if (loading) return <div className="p-8">Checking authentication...</div>;

	return (
		<div className="p-8 max-w-3xl mx-auto">
			<h1 className="text-2xl font-bold">Chatroom</h1>
			<div className="mt-4 border rounded p-4 h-96 overflow-auto bg-white">
				{messages.length === 0 ? (
					<p className="text-gray-500">No messages yet.</p>
				) : (
					messages.map((m) => (
						<div key={m.id} className="mb-2">
							<div className="text-sm text-gray-600">{m.email || m.uid}</div>
							<div className="text-base">{m.text}</div>
						</div>
					))
				)}
			</div>

			<form onSubmit={sendMessage} className="mt-4 flex gap-2">
				<input
					value={text}
					onChange={(e) => setText(e.target.value)}
					className="flex-1 p-2 border rounded"
					placeholder="Write a message..."
				/>
				<button
					type="submit"
					disabled={sending}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					{sending ? "Sending..." : "Send"}
				</button>
			</form>
		</div>
	);
}