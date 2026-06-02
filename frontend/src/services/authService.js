const backendBaseUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

function getCookieValue(name) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [rawName, ...valueParts] = cookie.trim().split("=");
    if (rawName === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

async function ensureCsrfCookie() {
  await fetch(`${backendBaseUrl}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}

function buildHeaders() {
  const csrfToken = getCookieValue("XSRF-TOKEN");

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(csrfToken ? { "X-XSRF-TOKEN": csrfToken } : {}),
  };
}

async function parseErrorResponse(response) {
  let message = "Request failed.";

  try {
    const data = await response.json();
    if (data?.message) {
      message = data.message;
    } else if (data?.errors) {
      const firstError = Object.values(data.errors)[0]?.[0];
      if (firstError) {
        message = firstError;
      }
    }
  } catch (error) {
    // Ignore JSON parse errors.
  }

  return message;
}

export async function loginUser({ email, password }) {
  await ensureCsrfCookie();

  const response = await fetch(`${backendBaseUrl}/login`, {
    method: "POST",
    headers: buildHeaders(),
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  return response;
}

export async function registerUser({ name, email, password, passwordConfirmation }) {
  await ensureCsrfCookie();

  const response = await fetch(`${backendBaseUrl}/register`, {
    method: "POST",
    headers: buildHeaders(),
    credentials: "include",
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  return response;
}

