"use client";

import React from "react";
import { Button, Dropdown, message } from "antd";
import {
  ShareAltOutlined,
  CopyOutlined,
  MailOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

interface ShareTenantButtonProps {
  tenantId: string;
}

const ShareTenantButton: React.FC<ShareTenantButtonProps> = ({ tenantId }) => {
  const getJoinLink = () => {
    const base =
      typeof window !== "undefined"
        ? `${window.location.protocol}//${window.location.host}`
        : "";
    return `${base}/register?tenantId=${tenantId}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getJoinLink()).then(() => {
      message.success("Join link copied to clipboard");
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(tenantId).then(() => {
      message.success("Tenant ID copied to clipboard");
    });
  };

  const handleEmail = () => {
    const joinLink = getJoinLink();
    const subject = encodeURIComponent("You're invited to join my Accel organisation");
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to invite you to join my organisation on Accel — a sales CRM for managing opportunities, proposals, and contracts.\n\nClick the link below to register and you'll be automatically added to my organisation:\n\n${joinLink}\n\nAlternatively, you can sign up manually at /register, select "Join Organisation", and enter this Tenant ID:\n${tenantId}\n\nLooking forward to collaborating!\n`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const items: MenuProps["items"] = [
    {
      key: "copy-link",
      icon: <LinkOutlined />,
      label: "Copy Join Link",
      onClick: handleCopyLink,
    },
    {
      key: "copy-id",
      icon: <CopyOutlined />,
      label: "Copy Tenant ID",
      onClick: handleCopyId,
    },
    {
      type: "divider",
    },
    {
      key: "email",
      icon: <MailOutlined />,
      label: "Send Email Invitation",
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