"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  mapFirebaseAuthError,
  signInWithGooglePopup,
  signUpEmailPassword,
} from "@/lib/firebase/auth";

type SignupFormProps = {
  variant?: "default" | "membership";
};

export function SignupForm({ variant = "default" }: SignupFormProps) {
  const router = useRouter();
  const membership = variant === "membership";
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  async function handleEmailPasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    const name = `${firstName} ${lastName}`.trim();

    if (!firstName || !lastName) {
      setMessage("First name and last name are required.");
      return;
    }

    if (firstName.length < 2 || lastName.length < 2) {
      setMessage("First and last name must be at least 2 characters each.");
      return;
    }

    if (!email) {
      setMessage("Email is required.");
      return;
    }

    // basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Enter a valid email address.");
      return;
    }

    if (!password) {
      setMessage("Password is required.");
      return;
    }

    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }

    if (!confirmPassword) {
      setMessage("Please confirm your password.");
      return;
    }

    if (confirmPassword !== password) {
      setMessage("Passwords do not match.");
      return;
    }

    setPending(true);
    try {
      await signUpEmailPassword(email, password, name);
      router.replace("/");
      router.refresh();
    } catch (err) {
      setMessage(mapFirebaseAuthError(err));
    } finally {
      if (isMounted.current) setPending(false);
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
      if (isMounted.current) setGooglePending(false);
    }
  }

  return (
    <form
      className={membership ? "auth-form membership-form" : "auth-form"}
      onSubmit={handleEmailPasswordSubmit}
      noValidate
    >
      <div className="auth-form__stack">
        <div className="auth-form__row">
          <label className="auth-form__field">
            <span className={membership ? "auth-form__label" : "auth-form__label"}>
              First name
            </span>
            <input
              className={
                membership ? "auth-form__input membership-form__input" : "auth-form__input"
              }
              type="text"
              name="firstName"
              autoComplete="given-name"
              placeholder={membership ? "First name" : "First name"}
              aria-label="First name"
              required
            />
          </label>
          <label className="auth-form__field">
            <span className={membership ? "auth-form__label" : "auth-form__label"}>
              Last name
            </span>
            <input
              className={
                membership ? "auth-form__input membership-form__input" : "auth-form__input"
              }
              type="text"
              name="lastName"
              autoComplete="family-name"
              placeholder={membership ? "Last name" : "Last name"}
              aria-label="Last name"
              required
            />
          </label>
        </div>

        <label className="auth-form__field">
          <span className={membership ? "auth-form__label" : "auth-form__label"}>
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
          <span className={membership ? "auth-form__label" : "auth-form__label"}>
            Phone (optional)
          </span>
          <input
            className={
              membership ? "auth-form__input membership-form__input" : "auth-form__input"
            }
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder={membership ? "Phone (optional)" : "Phone (optional)"}
            aria-label="Phone (optional)"
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
            autoComplete="new-password"
            placeholder={membership ? "Password" : "Create a password"}
            aria-label="Password"
            required
          />
        </label>

        <label className="auth-form__field">
          <span className={membership ? "auth-form__label sr-only" : "auth-form__label"}>
            Confirm password
          </span>
          <input
            className={
              membership ? "auth-form__input membership-form__input" : "auth-form__input"
            }
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder={membership ? "Confirm password" : "Re-enter your password"}
            aria-label="Confirm password"
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
          {pending ? "Creating account..." : membership ? "CREATE ACCOUNT" : "Create account"}
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
          Already have an account?{" "}
          <a href="/m/login" className="membership-form__link">
            Sign in
          </a>
        </div>
      ) : null}

      {membership ? (
        <div className="membership-form__recaptcha">
          This site is protected by reCAPTCHA and{" "}
          <a href="https://policies.google.com/privacy" className="membership-form__link">
            Google Privacy Policy
          </a>{" "}
          and{" "}
          <a href="https://policies.google.com/terms" className="membership-form__link">
            Terms of Service
          </a>{" "}
          apply.
        </div>
      ) : null}

      {membership ? (
        <div className="membership-form__copyright">
          COPYRIGHT 2026 BOBBIED'S SWEET TREATS - ALL RIGHTS RESERVED.{" "}
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
