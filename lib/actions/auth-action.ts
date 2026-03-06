"use server";

import { AUTH_ENDPOINTS } from "../../lib/api/endpoint";
import {
  setAuthCookies,
  clearAuthCookies,
  getAccessToken,
} from "../../lib/cookies";

import type {
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
} from "../../app/(auth)/schema";

/**
 * ✅ Discriminated Union (Fixes TypeScript narrowing)
 */
type ActionResult<T = undefined> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; data?: undefined };

interface BackendUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "guest" | "admin" | "super_admin";
  avatar?: string;
  phone?: string;
  isEmailVerified: boolean;
  isActive: boolean;
}

/* =========================
   LOGIN
========================= */

export async function handleLogin(
  values: LoginData
): Promise<ActionResult<{ role: string; user: BackendUser }>> {
  try {
    const res = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    await setAuthCookies(
      data.data.accessToken,
      undefined,
      data.data.user
    );

    return {
      success: true,
      message: "Login successful",
      data: {
        role: data.data.user.role,
        user: data.data.user,
      },
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

/* =========================
   REGISTER (UPDATED)
========================= */

export async function handleRegister(
  values: RegisterData
): Promise<ActionResult<{ role: string; user: BackendUser }>> {
  try {
    const { confirmPassword, ...payload } = values;
    void confirmPassword;

    const res = await fetch(AUTH_ENDPOINTS.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Registration failed",
      };
    }

    // ✅ Auto-login after registration
    await setAuthCookies(
      data.data.accessToken,
      undefined,
      data.data.user
    );

    return {
      success: true,
      message: "Account created successfully",
      data: {
        role: data.data.user.role,
        user: data.data.user,
      },
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

/* =========================
   LOGOUT
========================= */

export async function handleLogout(): Promise<ActionResult> {
  try {
    const token = await getAccessToken();

    if (token) {
      await fetch(AUTH_ENDPOINTS.LOGOUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
    }
  } catch {
    // ignore
  } finally {
    await clearAuthCookies();
  }

  return {
    success: true,
    message: "Logged out",
    data: undefined as never,
  };
}

/* =========================
   FORGOT PASSWORD
========================= */

export async function handleForgotPassword(
  values: ForgotPasswordData
): Promise<ActionResult> {
  try {
    const res = await fetch(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: values.email }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Request failed",
      };
    }

    return {
      success: true,
      message: data.message || "Reset link sent",
      data: undefined as never,
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

/* =========================
   RESET PASSWORD
========================= */

export async function handleResetPassword(
  values: ResetPasswordData
): Promise<ActionResult> {
  try {
    const { confirmPassword, ...payload } = values;
    void confirmPassword;

    const res = await fetch(AUTH_ENDPOINTS.RESET_PASSWORD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Reset failed",
      };
    }

    return {
      success: true,
      message: "Password reset successful",
      data: undefined as never,
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

/* =========================
   CHANGE PASSWORD
========================= */

export async function handleChangePassword(
  values: ChangePasswordData
): Promise<ActionResult> {
  try {
    const token = await getAccessToken();

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const { confirmNewPassword, ...payload } = values;
    void confirmNewPassword;

    const res = await fetch(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Change failed",
      };
    }

    return {
      success: true,
      message: "Password changed successfully",
      data: undefined as never,
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}