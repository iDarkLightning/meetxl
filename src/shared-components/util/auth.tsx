import { useSession } from "next-auth/react";
import React from "react";
import { LoadingSpinner } from "./spinner";

export const Auth: React.FC<React.PropsWithChildren> = (props) => {
  const { status } = useSession({ required: true });

  if (status === "loading") return <LoadingSpinner />;
  return <>{props.children}</>;
};
