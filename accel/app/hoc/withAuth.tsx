"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { useUserState } from "../providers/userProvider";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const ProtectedComponent = (props: P) => {
    const { user, isPending } = useUserState();
    const router = useRouter();

    useEffect(() => {
      if (!isPending && !user) {
        router.replace("/login");
      }
    }, [user, isPending, router]);

    if (isPending) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "#080808",
          }}
        >
          <Spin size="large" />
        </div>
      );
    }

    if (!user) return null;

    return <WrappedComponent {...props} />;
  };

  ProtectedComponent.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"})`;

  return ProtectedComponent;
};

export default withAuth;
