import { getCsrfToken, signIn } from "next-auth/react";

export const switchAccount = async () => {
  fetch("/api/auth/signout", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    //@ts-expect-error serialization
    body: new URLSearchParams({
      csrfToken: await getCsrfToken(),
      callbackUrl: window.location.href,
      json: true,
    }),
  }).then((res) => {
    if (res.ok) signIn("google", { callbackUrl: "/" });
  });
};
