import { Contract } from "@/app/providers/contractsProvider/context";
import useStyles from "../../(home)/contracts/style";

import React, { useEffect, useState } from "react";
import { Button, Input, Empty, Spin, Tag, Typography, Tooltip } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  FileProtectOutlined,
} from "@ant-design/icons";

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (dateStr: string | null) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const { Text } = Typography;

const STATUS_COLORS: Record<number, string> = {
  1: "blue",
  2: "green",
  3: "orange",
  4: "red",
};

const ContractCard = ({
  contract,
  styles,
  isSelected,
  onClick,
}: {
  contract: Contract;
  styles: any;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <div
    className={`${styles.card} ${isSelected ? styles.cardSelected : ""} ${contract.isExpiringSoon ? styles.cardExpiring : ""}`}
    onClick={onClick}
  >
    <div className={styles.cardTop}>
      <Tag
        color={STATUS_COLORS[contract.status] ?? "default"}
        className={styles.statusTag}
      >
        {contract.statusName}
      </Tag>
      {contract.isExpiringSoon && (
        <Tag color="warning" className={styles.expiringTag}>
          Expiring Soon
        </Tag>
      )}
    </div>

    <div className={styles.cardMiddle}>
      <FileProtectOutlined className={styles.contractIcon} />
      <Text className={styles.cardTitle}>{contract.title}</Text>
      <Text className={styles.cardNumber}>{contract.contractNumber}</Text>
      <Text className={styles.clientName}>{contract.clientName}</Text>
    </div>

    <div className={styles.cardMeta}>
      <Text className={styles.metaValue}>
        {formatCurrency(contract.contractValue, contract.currency)}
      </Text>
      <Text className={styles.metaDates}>
        {formatDate(contract.startDate)} — {formatDate(contract.endDate)}
      </Text>
    </div>

    <div className={styles.cardFooter}>
      <Tooltip
        title={
          contract.isExpiringSoon
            ? `Expires in ${contract.daysUntilExpiry} days`
            : "Not expiring soon"
        }
      >
        <div className={styles.indicator}>
          <CloseCircleFilled
            className={
              contract.isExpiringSoon ? styles.iconDanger : styles.iconMuted
            }
          />
          <Text className={styles.indicatorLabel}>Expiring</Text>
        </div>
      </Tooltip>

      <Tooltip
        title={
          contract.autoRenew ? "Auto-renew enabled" : "Auto-renew disabled"
        }
      >
        <div className={styles.indicator}>
          <CheckCircleFilled
            className={
              contract.autoRenew ? styles.iconSuccess : styles.iconMuted
            }
          />
          <Text className={styles.indicatorLabel}>Auto-renew</Text>
        </div>
      </Tooltip>
    </div>
  </div>
);

export default ContractCard;
