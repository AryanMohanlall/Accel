"use client";

import React from "react";
import { Button, Dropdown, message } from "antd";
import {
  ShareAltOutlined,
  CopyOutlined,
  MailOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

interface ShareTenantButtonProps {
  tenantId: string;
}

const ShareTenantButton: React.FC<ShareTenantButtonProps> = ({ tenantId }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(tenantId).then(() => {
      message.success("Tenant ID copied to clipboard");
    });
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("Join my Accel organisation");
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to invite you to join my organisation on Accel.\n\nTo register, go to the sign-up page, select "Join Organisation", and enter the following Tenant ID:\n\n${tenantId}\n\nSee you there!`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const items: MenuProps["items"] = [
    {
      key: "copy",
      icon: <CopyOutlined />,
      label: "Copy Tenant ID",
      onClick: handleCopy,
    },
    {
      key: "email",
      icon: <MailOutlined />,
      label: "Share via Email",
      onClick: handleEmail,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Button
        icon={<ShareAltOutlined />}
        style={{
          background: "rgba(0,184,110,0.1)",
          border: "1px solid rgba(0,184,110,0.3)",
          color: "#00b86e",
          borderRadius: 10,
          fontWeight: 600,
          fontSize: "0.8rem",
        }}
      >
        Share Org
      </Button>
    </Dropdown>
  );
};

export default ShareTenantButton;
