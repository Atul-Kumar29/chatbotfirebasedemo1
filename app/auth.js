import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";

export async function createAccount(email, password) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(result.user);
    return result;
  } catch (error) {
    console.error("createAccount error:", error);
    throw error;
  }
}

export async function login(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error("login error:", error);
    throw error;
  }
}

export async function logout() {
  try {
    return await firebaseSignOut(auth);
  } catch (error) {
    console.error("logout error:", error);
    throw error;
  }
}

export async function resetEmail(email) {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("resetEmail error:", error);
    throw error;
  }
}