"use client";

import { useState, type FormEvent } from "react";
import { mapFirebaseAuthError, sendResetEmail } from "@/lib/firebase/auth";

export function ResetPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setMessage("Email is required.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Enter a valid email address.");
      return;
    }

    setPending(true);
    const continueUrl = `${window.location.origin}/m/account`;
    try {
      await sendResetEmail(email, continueUrl);
      setSent(true);
    } catch (err) {
      setMessage(mapFirebaseAuthError(err));
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <p className="membership-form__success" role="status">
        If an account exists for that email, you will receive a reset link shortly.
      </p>
    );
  }

  return (
    <form
      className="auth-form membership-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="auth-form__stack">
        <label className="auth-form__field">
          <span className="auth-form__label sr-only">Email</span>
          <input
            className="auth-form__input membership-form__input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            aria-label="Email"
            required
          />
        </label>
      </div>

      {message ? (
        <p className="auth-form__message" aria-live="polite">
          {message}
        </p>
      ) : null}

      <div className="membership-form__actions">
        <button
          className="membership-form__submit"
          type="submit"
          disabled={pending}
        >
          {pending ? "Sending…" : "SEND RESET LINK"}
        </button>
      </div>
    </form>
  );
}
