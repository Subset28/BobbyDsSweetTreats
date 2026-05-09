/**
 * Wire scraped membership markup to Firebase Auth.
 * Visual DOM stays identical to the live site; only handlers are attached.
 * Firebase is imported dynamically so a failed `firebase/auth` chunk does not break this module.
 */
export function attachMembershipScrapeForms(
  root: HTMLElement,
  mode: "login" | "signup",
  navigate: (path: string) => void,
): () => void {
  const disposers: Array<() => void> = [];

  if (mode === "login") {
    const reset = root.querySelector<HTMLElement>(
      '[data-aid="MEMBERSHIP_SSO_REQ_RESET"]',
    );
    const onReset = (e: Event) => {
      e.preventDefault();
      navigate("/m/reset-password");
    };
    reset?.addEventListener("click", onReset);
    disposers.push(() => reset?.removeEventListener("click", onReset));

    const form = root.querySelector<HTMLFormElement>(
      'form[data-aid="MEMBERSHIP_SSO_FORM_REND"]',
    );
    if (form) {
      let errorEl = root.querySelector<HTMLElement>("[data-bst-sso-error]");
      if (!errorEl) {
        errorEl = document.createElement("p");
        errorEl.className = "auth-form__message";
        errorEl.setAttribute("data-bst-sso-error", "true");
        errorEl.setAttribute("role", "alert");
        errorEl.style.display = "none";
        const messageEl = root.querySelector('[data-aid="MEMBERSHIP_SSO_MESSAGE_REND"]');
        messageEl?.after(errorEl);
      }

      const submitBtn = form.querySelector<HTMLButtonElement>(
        '[data-aid="MEMBERSHIP_SSO_SUBMIT"], button[type="submit"], [data-ux="ButtonPrimary"]',
      );

      const onSubmit = async (e: Event) => {
        e.preventDefault();
        if (errorEl) {
          errorEl.style.display = "none";
          errorEl.textContent = "";
        }

        const email = (
          form.querySelector<HTMLInputElement>(
            '[data-aid="MEMBERSHIP_SSO_LOGIN_EMAIL"]',
          )?.value ?? ""
        ).trim();
        const password =
          form.querySelector<HTMLInputElement>(
            '[data-aid="MEMBERSHIP_SSO_LOGIN_PASSWORD"]',
          )?.value ?? "";

        if (!email || !email.includes("@")) {
          if (errorEl) {
            errorEl.textContent = "Enter a valid email address.";
            errorEl.style.display = "block";
          }
          return;
        }
        if (!password) {
          if (errorEl) {
            errorEl.textContent = "Password is required.";
            errorEl.style.display = "block";
          }
          return;
        }

        if (submitBtn) submitBtn.disabled = true;
        try {
          const { signInEmailPassword, mapFirebaseAuthError } = await import(
            "@/lib/firebase/auth"
          );
          try {
            await signInEmailPassword(email, password);
            window.location.assign("/");
          } catch (err) {
            if (errorEl) {
              errorEl.textContent = mapFirebaseAuthError(err);
              errorEl.style.display = "block";
            }
          }
        } catch {
          if (errorEl) {
            errorEl.textContent =
              "Could not load sign-in. Refresh the page and try again.";
            errorEl.style.display = "block";
          }
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      };

      form.addEventListener("submit", onSubmit);
      disposers.push(() => form.removeEventListener("submit", onSubmit));
    }
  }

  if (mode === "signup") {
    const form = root.querySelector<HTMLFormElement>(
      'form[data-aid="CREATE_ACCOUNT_FORM_REND"]',
    );
    if (!form) {
      return () => {
        disposers.forEach((d) => d());
      };
    }

    if (form.dataset.bstFirebaseBound === "true") {
      return () => {
        disposers.forEach((d) => d());
      };
    }
    form.dataset.bstFirebaseBound = "true";

    const emailInput = form.querySelector<HTMLInputElement>(
      '[data-aid="CREATE_ACCOUNT_EMAIL"]',
    );
    const emailWrap = emailInput?.closest("div[data-ux='Block']");
    if (emailWrap && !form.querySelector('[data-aid="BST_SIGNUP_PASSWORD"]')) {
      const cloneRow = (
        placeholder: string,
        aid: string,
        name: string,
        autocomplete: string,
      ) => {
        const row = emailWrap.cloneNode(true) as HTMLElement;
        const inp = row.querySelector("input");
        if (inp) {
          inp.type = "password";
          inp.name = name;
          inp.placeholder = placeholder;
          inp.setAttribute("autocomplete", autocomplete);
          inp.required = true;
          inp.removeAttribute("value");
          inp.setAttribute("data-aid", aid);
          inp.setAttribute("aria-label", placeholder);
        }
        return row;
      };
      const phoneField = form.querySelector('[data-aid="CREATE_ACCOUNT_PHONE"]');
      const phoneWrap = phoneField?.closest("div[data-ux='Block']");
      const insertAfter = phoneWrap ?? emailWrap;
      const p1 = cloneRow("Password", "BST_SIGNUP_PASSWORD", "bstPassword", "new-password");
      const p2 = cloneRow(
        "Confirm password",
        "BST_SIGNUP_PASSWORD_CONFIRM",
        "bstPasswordConfirm",
        "new-password",
      );
      insertAfter.after(p1);
      p1.after(p2);
    }

    let errorEl = root.querySelector<HTMLElement>("[data-bst-create-error]");
    if (!errorEl) {
      errorEl = document.createElement("p");
      errorEl.className = "auth-form__message";
      errorEl.setAttribute("data-bst-create-error", "true");
      errorEl.setAttribute("role", "alert");
      errorEl.style.display = "none";
      const heading = form.querySelector('[data-aid="CREATE_ACCOUNT_HEADING_REND"]');
      heading?.after(errorEl);
    }

    const submitBtn = form.querySelector<HTMLButtonElement>(
      'button[data-ux="ButtonPrimary"], button[type="submit"]',
    );

    const onSubmit = async (e: Event) => {
      e.preventDefault();
      if (errorEl) {
        errorEl.style.display = "none";
        errorEl.textContent = "";
      }

      const first = (
        form.querySelector<HTMLInputElement>(
          '[data-aid="CREATE_ACCOUNT_NAME_FIRST"]',
        )?.value ?? ""
      ).trim();
      const last = (
        form.querySelector<HTMLInputElement>(
          '[data-aid="CREATE_ACCOUNT_NAME_LAST"]',
        )?.value ?? ""
      ).trim();
      const email = (
        form.querySelector<HTMLInputElement>('[data-aid="CREATE_ACCOUNT_EMAIL"]')
          ?.value ?? ""
      ).trim();
      const password =
        form.querySelector<HTMLInputElement>('[data-aid="BST_SIGNUP_PASSWORD"]')
          ?.value ?? "";
      const confirm =
        form.querySelector<HTMLInputElement>(
          '[data-aid="BST_SIGNUP_PASSWORD_CONFIRM"]',
        )?.value ?? "";

      const name = `${first} ${last}`.trim();
      if (!first || !last) {
        if (errorEl) {
          errorEl.textContent = "First and last name are required.";
          errorEl.style.display = "block";
        }
        return;
      }
      if (!email.includes("@")) {
        if (errorEl) {
          errorEl.textContent = "Enter a valid email address.";
          errorEl.style.display = "block";
        }
        return;
      }
      if (password.length < 8) {
        if (errorEl) {
          errorEl.textContent = "Use at least 8 characters for your password.";
          errorEl.style.display = "block";
        }
        return;
      }
      if (password !== confirm) {
        if (errorEl) {
          errorEl.textContent = "Passwords do not match.";
          errorEl.style.display = "block";
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      try {
        const { signUpEmailPassword, mapFirebaseAuthError } = await import(
          "@/lib/firebase/auth"
        );
        try {
          await signUpEmailPassword(email, password, name);
          window.location.assign("/");
        } catch (err) {
          if (errorEl) {
            errorEl.textContent = mapFirebaseAuthError(err);
            errorEl.style.display = "block";
          }
        }
      } catch {
        if (errorEl) {
          errorEl.textContent =
            "Could not load account creation. Refresh the page and try again.";
          errorEl.style.display = "block";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    };

    form.addEventListener("submit", onSubmit);
    disposers.push(() => form.removeEventListener("submit", onSubmit));
  }

  return () => {
    disposers.forEach((d) => d());
  };
}
