"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function SignupForm() {
  const router = useRouter();
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
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!name) {
      setMessage("Name is required.");
      return;
    }

    if (name.length < 2) {
      setMessage("Name must be at least 2 characters.");
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
    const supabase = createBrowserSupabaseClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/`;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            name,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.session) {
        router.replace("/");
        router.refresh();
        return;
      }

      router.replace("/?signup=check-email");
      router.refresh();
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      if (isMounted.current) setPending(false);
    }
  }

  async function handleGoogleSignIn() {
    setMessage(null);
    setGooglePending(true);

    const supabase = createBrowserSupabaseClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/`;
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        setMessage(error.message);
      }
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      if (isMounted.current) setGooglePending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleEmailPasswordSubmit} noValidate>
      <div className="auth-form__stack">
        <label className="auth-form__field">
          <span className="auth-form__label">Name</span>
          <input
            className="auth-form__input"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </label>

        <label className="auth-form__field">
          <span className="auth-form__label">Email</span>
          <input
            className="auth-form__input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="auth-form__field">
          <span className="auth-form__label">Password</span>
          <input
            className="auth-form__input"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a password"
            required
          />
        </label>

        <label className="auth-form__field">
          <span className="auth-form__label">Confirm password</span>
          <input
            className="auth-form__input"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            required
          />
        </label>
      </div>

      {message ? (
        <p className="auth-form__message" aria-live="polite">
          {message}
        </p>
      ) : null}

      <div className="auth-form__actions">
        <button className="auth-form__button" type="submit" disabled={pending || googlePending}>
          {pending ? "Creating account..." : "Create account"}
        </button>
        <button
          className="auth-form__button auth-form__button--secondary"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={pending || googlePending}
        >
          {googlePending ? "Connecting..." : "Continue with Google"}
        </button>
      </div>
    </form>
  );
}
