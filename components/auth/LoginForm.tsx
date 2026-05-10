"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  mapFirebaseAuthError,
  signInEmailPassword,
  signInWithGooglePopup,
} from "@/lib/firebase/auth";

type LoginFormProps = {
  /** Matches membership SSO panel (placeholder inputs, square SIGN IN). */
  variant?: "default" | "membership";
};

export function LoginForm({ variant = "default" }: LoginFormProps) {
  const router = useRouter();
  const membership = variant === "membership";
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  async function handleEmailPasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email) {
      setMessage("Email is required.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Enter a valid email address.");
      return;
    }

    if (!password) {
      setMessage("Password is required.");
      return;
    }

    setPending(true);
    try {
      await signInEmailPassword(email, password);
      router.replace("/");
      router.refresh();
    } catch (err) {
      setMessage(mapFirebaseAuthError(err));
    } finally {
      setPending(false);
    }
  }

  async function handleGoogleSignIn() {
    setMessage(null);
    setGooglePending(true);

    try {
      await signInWithGooglePopup();
      router.replace("/");
      router.refresh();
    } catch (err) {
      setMessage(mapFirebaseAuthError(err));
    } finally {
      setGooglePending(false);
    }
  }

  return (
    <form
      className={membership ? "auth-form membership-form" : "auth-form"}
      onSubmit={handleEmailPasswordSubmit}
      noValidate
    >
      <div className="auth-form__stack">
        <label className="auth-form__field">
          <span className={membership ? "auth-form__label sr-only" : "auth-form__label"}>
            Email
          </span>
          <input
            className={
              membership ? "auth-form__input membership-form__input" : "auth-form__input"
            }
            type="email"
            name="email"
            autoComplete="email"
            placeholder={membership ? "Email" : "you@example.com"}
            aria-label="Email"
            required
          />
        </label>

        <label className="auth-form__field">
          <span className={membership ? "auth-form__label sr-only" : "auth-form__label"}>
            Password
          </span>
          <input
            className={
              membership ? "auth-form__input membership-form__input" : "auth-form__input"
            }
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder={membership ? "Password" : "Enter your password"}
            aria-label="Password"
            required
          />
        </label>
      </div>

      {message ? (
        <p className="auth-form__message" aria-live="polite">
          {message}
        </p>
      ) : null}

      <div className={membership ? "membership-form__actions" : "auth-form__actions"}>
        <button
          className={membership ? "membership-form__submit" : "auth-form__button"}
          type="submit"
          disabled={pending || googlePending}
        >
          {pending ? "Signing in..." : membership ? "SIGN IN" : "Sign in"}
        </button>
        {membership ? null : (
          <button
            className="auth-form__button auth-form__button--secondary"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={pending || googlePending}
          >
            {googlePending ? "Connecting..." : "Continue with Google"}
          </button>
        )}
      </div>

      {membership ? (
        <div className="membership-form__signin-link">
          Need an account?{" "}
          <a href="/m/create-account" className="membership-form__link">
            Sign up
          </a>
        </div>
      ) : null}

      {membership ? (
        <div className="membership-form__copyright">
          COPYRIGHT © 2026 BOBBIED'S SWEET TREATS - ALL RIGHTS RESERVED.{" "}
          <a href="/privacy-policy" className="membership-form__link">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/terms-and-conditions" className="membership-form__link">
            Terms and Conditions
          </a>
        </div>
      ) : null}
    </form>
  );
}
