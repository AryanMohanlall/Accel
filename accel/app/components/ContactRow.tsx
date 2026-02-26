"use client";

import React from "react";
import { Tag, Typography, Avatar, Tooltip } from "antd";
import { MailOutlined, PhoneOutlined, StarFilled } from "@ant-design/icons";
import { Contact } from "../providers/contactsProvider/context";

const { Text } = Typography;

interface ContactRowProps {
  contact: Contact;
  styles: any;
  isSelected: boolean;
  onClick: () => void;
}

const ContactRow: React.FC<ContactRowProps> = ({
  contact,
  styles,
  isSelected,
  onClick,
}) => (
  <div
    className={`${styles.contactRow} ${isSelected ? styles.contactRowSelected : ""}`}
    onClick={onClick}
  >
    <Avatar className={styles.contactAvatar} size={32}>
      {contact.firstName?.trim()?.[0]?.toUpperCase() ?? "?"}
    </Avatar>

    <div className={styles.contactInfo}>
      <div className={styles.contactNameRow}>
        <Text className={styles.contactFullName}>{contact.fullName}</Text>
        {contact.isPrimaryContact && (
          <Tooltip title="Primary Contact">
            <StarFilled className={styles.primaryStar} />
          </Tooltip>
        )}
      </div>
      <Text className={styles.contactPosition}>{contact.position || "—"}</Text>
    </div>

    <div className={styles.contactDetails}>
      {contact.email && (
        <Tooltip title={contact.email}>
          <a
            href={`mailto:${contact.email}`}
            className={styles.contactLink}
            onClick={(e) => e.stopPropagation()}
          >
            <MailOutlined /> <span>{contact.email}</span>
          </a>
        </Tooltip>
      )}
      {contact.phoneNumber && (
        <Tooltip title={contact.phoneNumber}>
          <a
            href={`tel:${contact.phoneNumber}`}
            className={styles.contactLink}
            onClick={(e) => e.stopPropagation()}
          >
            <PhoneOutlined /> <span>{contact.phoneNumber}</span>
          </a>
        </Tooltip>
      )}
    </div>

    <Tag className={styles.clientTag}>{contact.clientName}</Tag>
  </div>
);

export default ContactRow;
