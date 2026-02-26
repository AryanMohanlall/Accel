"use client";

import React from "react";
import { Tag, Typography, Avatar } from "antd";
import {
  GlobalOutlined, TeamOutlined, FileTextOutlined,
  ApartmentOutlined, TrophyOutlined,
} from "@ant-design/icons";
import { Client } from "../providers/clientsProvider/context";

const { Text } = Typography;

const CLIENT_TYPE_LABELS: Record<number, string> = {
  1: "Prospect",
  2: "Active",
  3: "Partner",
  4: "Churned",
};

const CLIENT_TYPE_COLORS: Record<number, string> = {
  1: "blue",
  2: "green",
  3: "purple",
  4: "red",
};

interface ClientCardProps {
  client: Client;
  styles: any;
  isSelected: boolean;
  onClick: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, styles, isSelected, onClick }) => (
  <div
    className={`${styles.clientCard} ${isSelected ? styles.clientCardSelected : ""}`}
    onClick={onClick}
  >
    <div className={styles.clientCardHeader}>
      <Avatar className={styles.clientAvatar} size={40}>
        {client.name?.trim()?.[0]?.toUpperCase() ?? "?"}
      </Avatar>
      <div className={styles.clientCardMeta}>
        <Text className={styles.clientName}>{client.name}</Text>
        <Text className={styles.clientIndustry}>{client.industry || "—"}</Text>
      </div>
      <Tag
        color={CLIENT_TYPE_COLORS[client.clientType] ?? "default"}
        className={styles.clientTypeTag}
      >
        {CLIENT_TYPE_LABELS[client.clientType] ?? "Unknown"}
      </Tag>
    </div>

    <div className={styles.clientCardStats}>
      <div className={styles.statChip}>
        <TeamOutlined />
        <span>{client.contactsCount}</span>
      </div>
      <div className={styles.statChip}>
        <FileTextOutlined />
        <span>{client.contractsCount}</span>
      </div>
      {client.website && (
        <div className={styles.statChip}>
          <GlobalOutlined />
          <span className={styles.websiteText}>{client.website}</span>
        </div>
      )}
    </div>

    {client.companySize && (
      <div className={styles.clientCardFooter}>
        <ApartmentOutlined style={{ fontSize: 11, color: "#555" }} />
        <Text className={styles.clientFooterText}>{client.companySize}</Text>
        <Text className={styles.clientFooterText} style={{ marginLeft: "auto" }}>
          {client.createdByName}
        </Text>
      </div>
    )}
  </div>
);

export default ClientCard;
