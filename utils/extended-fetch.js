import { fetchHandler } from "./fetch";

const BASE_URL =
  process.env.BASE_URL || "http://localhost:3000/api";

export const api = {
  auth: {
    oAuthSignIn: ({
      user,
      provider,
      providerAccountId,
    }) =>
      fetchHandler(`${BASE_URL}/auth/oauthSignin`, {
        method: "POST",
        body: JSON.stringify({ user, provider, providerAccountId }),
      }),
  },
  users: {
    getAll: () => fetchHandler(`${BASE_URL}/users`),
    getById: (id) => fetchHandler(`${BASE_URL}/users/${id}`),
    getByEmail: (email) =>
      fetchHandler(`${BASE_URL}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    create: (userData) =>
      fetchHandler(`${BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    update: (id, userData) =>
      fetchHandler(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      }),

    delete: (id) =>
      fetchHandler(`${BASE_URL}/users/${id}`, { method: "DELETE" }),
  },
  accounts: {
    getAll: () => fetchHandler(`${BASE_URL}/accounts`),
    getById: (id) => fetchHandler(`${BASE_URL}/accounts/${id}`),
    getByProvider: (providerAccountId) =>
      fetchHandler(`${BASE_URL}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      }),
    create: (accountData) =>
      fetchHandler(`${BASE_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(accountData),
      }),
    update: (id, accountData) =>
      fetchHandler(`${BASE_URL}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(accountData),
      }),
    delete: (id) =>
      fetchHandler(`${BASE_URL}/accounts/${id}`, { method: "DELETE" }),
  },
  ai: {
    answers: (question, description) => fetchHandler(`${BASE_URL}/api/answer`, {
      method: "POST",
      body: JSON.stringify({ question, description }),
    })
  }
};
