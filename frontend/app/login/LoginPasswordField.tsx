"use client";

import { useState } from "react";

export default function LoginPasswordField({
  defaultValue = "",
  disabled = false,
}: {
  defaultValue?: string;
  disabled?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="osp-login-password-wrap">
      <input
        name="password"
        type={visible ? "text" : "password"}
        defaultValue={defaultValue}
        placeholder="Enter your password"
        autoComplete="current-password"
        disabled={disabled}
        required
      />
      <button
        className="osp-login-show-password"
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
