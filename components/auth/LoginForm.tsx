"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
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
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setPending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setMessage(null);
    setGooglePending(true);

    const supabase = createBrowserSupabaseClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    setGooglePending(false);

    if (error) {
      setMessage(error.message);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleEmailPasswordSubmit} noValidate>
      <div className="auth-form__stack">
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
            autoComplete="current-password"
            placeholder="Enter your password"
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
        <button className="auth-form__button" type="submit" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
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
