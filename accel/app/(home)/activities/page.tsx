"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Empty,
  Spin,
  Tag,
  Typography,
  Tooltip,
  Avatar,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  message,
  Badge,
  Segmented,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileTextOutlined,
  AlertOutlined,
  CheckOutlined,
  StopOutlined,
  ClockCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import useStyles from "./style";
import {
  useActivityState,
  useActivityActions,
} from "../../providers/activitiesProvider";
import { useUserState } from "../../providers/userProvider";
import { Activity } from "../../providers/activitiesProvider/context";
import withAuth from "@/app/hoc/withAuth";

const { Text, Title } = Typography;
const { TextArea } = Input;

// ── Constants ──────────────────────────────────────────────────────────────────

const TYPE_OPTIONS = [
  { value: 1, label: "Call", icon: <PhoneOutlined /> },
  { value: 2, label: "Email", icon: <MailOutlined /> },
  { value: 3, label: "Meeting", icon: <CalendarOutlined /> },
  { value: 4, label: "Note", icon: <FileTextOutlined /> },
  { value: 5, label: "Task", icon: <TeamOutlined /> },
];

const PRIORITY_OPTIONS = [
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
];

const RELATED_TO_TYPE_OPTIONS = [
  { value: 1, label: "Client" },
  { value: 2, label: "Opportunity" },
  { value: 3, label: "Proposal" },
  { value: 4, label: "Contract" },
];

const TYPE_ICONS: Record<number, React.ReactNode> = {
  1: <PhoneOutlined />,
  2: <MailOutlined />,
  3: <CalendarOutlined />,
  4: <FileTextOutlined />,
  5: <TeamOutlined />,
};

const PRIORITY_COLORS: Record<number, string> = {
  1: "#52c41a",
  2: "#faad14",
  3: "#ff4d4f",
};

const STATUS_COLORS: Record<number, string> = {
  1: "blue",
  2: "orange",
  3: "green",
  4: "default",
};

const formatDate = (dateStr: string | null) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

// ── Sub-component: Activity Item ───────────────────────────────────────────────

const ActivityItem = ({
  activity,
  styles,
  isSelected,
  isLast,
  onClick,
}: {
  activity: Activity;
  styles: any;
  isSelected: boolean;
  isLast: boolean;
  onClick: () => void;
}) => (
  <div className={styles.timelineItem} onClick={onClick}>
    {!isLast && <div className={styles.timelineLine} />}

    <Tooltip title={activity.typeName}>
      <div
        className={`${styles.timelineDot}
        ${isSelected ? styles.timelineDotSelected : ""}
        ${activity.isOverdue ? styles.timelineDotOverdue : ""}`}
      >
        <span className={styles.dotIcon}>
          {TYPE_ICONS[activity.type] ?? <FileTextOutlined />}
        </span>
      </div>
    </Tooltip>

    <div
      className={`${styles.itemContent} ${isSelected ? styles.itemContentSelected : ""}`}
    >
      <div className={styles.itemHeader}>
        <div className={styles.itemTitleRow}>
          <Title level={5} className={styles.itemTitle}>
            {activity.subject}
          </Title>
          <div className={styles.itemTags}>
            <Tag
              color={STATUS_COLORS[activity.status] ?? "default"}
              className={styles.tag}
            >
              {activity.statusName}
            </Tag>
            {activity.priorityName && (
              <Tag
                className={styles.tag}
                style={{
                  borderColor: PRIORITY_COLORS[activity.priority],
                  color: PRIORITY_COLORS[activity.priority],
                  background: "transparent",
                }}
              >
                {activity.priorityName}
              </Tag>
            )}
            {activity.isOverdue && (
              <Tag
                icon={<AlertOutlined />}
                color="error"
                className={styles.tag}
              >
                Overdue
              </Tag>
            )}
          </div>
        </div>

        <div className={styles.itemMeta}>
          {activity.relatedToTitle && (
            <Text className={styles.metaText}>
              Re: {activity.relatedToTitle}
            </Text>
          )}
          <Text className={styles.metaText}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            Due: {formatDate(activity.dueDate)}
          </Text>
          {activity.duration && (
            <Text className={styles.metaText}>{activity.duration} min</Text>
          )}
          {activity.location && (
            <Text className={styles.metaText}>📍 {activity.location}</Text>
          )}
        </div>
      </div>

      {activity.description && (
        <Text className={styles.itemDescription}>{activity.description}</Text>
      )}

      <div className={styles.itemFooter}>
        <div className={styles.assignee}>
          <Avatar size={18} className={styles.assigneeAvatar}>
            {activity.assignedToName?.trim()?.[0] ?? "?"}
          </Avatar>
          <Text className={styles.assigneeText}>{activity.assignedToName}</Text>
        </div>
        {activity.participantsCount > 0 && (
          <Text className={styles.participants}>
            <TeamOutlined /> {activity.participantsCount}
          </Text>
        )}
        {activity.completedDate && (
          <Text className={styles.completedText}>
            ✓ {formatDate(activity.completedDate)}
          </Text>
        )}
      </div>
    </div>
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────────

const ActivitiesPage = () => {
  const { styles } = useStyles();
  const { activities, isPending, selected } = useActivityState();
  const {
    fetchActivities,
    setSelected,
    createActivity,
    updateActivity,
    completeActivity,
    cancelActivity,
    deleteActivity,
  } = useActivityActions();
  const { user } = useUserState();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [completeForm] = Form.useForm();

  useEffect(() => {
    fetchActivities();
  }, []);

  // ── Filtering ──
  const statusFiltered =
    filterStatus === "All"
      ? activities
      : activities.filter((a) => a.statusName === filterStatus);

  const filtered = statusFiltered.filter(
    (a) =>
      a.subject?.toLowerCase().includes(search.toLowerCase()) ||
      a.assignedToName?.toLowerCase().includes(search.toLowerCase()) ||
      a.relatedToTitle?.toLowerCase().includes(search.toLowerCase()),
  );

  // Summary counts for badges
  const overdueCount = activities.filter((a) => a.isOverdue).length;
  const scheduledCount = activities.filter(
    (a) => a.statusName === "Scheduled",
  ).length;

  const handleSelect = (activity: Activity) =>
    setSelected(selected?.id === activity.id ? null : activity);

  // ── Create ──
  const handleCreate = async (values: any) => {
    try {
      await createActivity({
        type: values.type,
        subject: values.subject,
        description: values.description,
        priority: values.priority,
        dueDate: values.dueDate?.toISOString(),
        assignedToId: user?.userId,
        relatedToType: values.relatedToType,
        relatedToId: values.relatedToId,
        duration: values.duration,
        location: values.location,
      });
      message.success("Activity created");
      setCreateModalOpen(false);
      createForm.resetFields();
    } catch (error: any) {
      message.error(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Failed to create activity",
      );
    }
  };

  // ── Update ──
  const handleOpenUpdate = () => {
    if (!selected) return;
    updateForm.setFieldsValue({
      type: selected.type,
      subject: selected.subject,
      description: selected.description,
      priority: selected.priority,
      dueDate: selected.dueDate ? dayjs(selected.dueDate) : undefined,
      relatedToType: selected.relatedToType,
      relatedToId: selected.relatedToId,
      duration: selected.duration,
      location: selected.location,
    });
    setUpdateModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selected) return;
    try {
      await updateActivity(selected.id, {
        type: values.type,
        subject: values.subject,
        description: values.description,
        priority: values.priority,
        dueDate: values.dueDate?.toISOString(),
        assignedToId: user?.userId,
        duration: values.duration,
        location: values.location,
      });
      message.success("Activity updated");
      setUpdateModalOpen(false);
      updateForm.resetFields();
    } catch (error: any) {
      message.error(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Failed to update activity",
      );
    }
  };

  // ── Complete ──
  const handleComplete = async (values: any) => {
    if (!selected) return;
    try {
      await completeActivity(selected.id, values.outcome);
      message.success("Activity marked as complete");
      setCompleteModalOpen(false);
      completeForm.resetFields();
    } catch (error: any) {
      message.error(
        error.response?.data?.detail || "Failed to complete activity",
      );
    }
  };

  // ── Cancel ──
  const handleCancel = async () => {
    if (!selected) return;
    try {
      await cancelActivity(selected.id);
      message.success(`"${selected.subject}" cancelled`);
    } catch (error: any) {
      message.error(
        error.response?.data?.detail || "Failed to cancel activity",
      );
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteActivity(selected.id);
      message.success(`"${selected.subject}" deleted`);
      setSelected(null);
      setDeleteModalOpen(false);
    } catch (error: any) {
      message.error(
        error.response?.data?.detail || "Failed to delete activity",
      );
    }
  };

  // Status-aware button rules
  const isScheduled = selected?.statusName === "Scheduled";
  const isCompleted = selected?.statusName === "Completed";
  const isCancelled = selected?.statusName === "Cancelled";
  const canComplete = isScheduled;
  const canCancel = isScheduled;
  const canUpdate = isScheduled;

  return (
    <div className={styles.wrapper}>
      {/* ── STATS STRIP ── */}
      <div className={styles.statsStrip}>
        <div className={styles.statBadge}>
          <ClockCircleOutlined style={{ color: "#faad14" }} />
          <Text className={styles.statLabel}>{scheduledCount} Scheduled</Text>
        </div>
        {overdueCount > 0 && (
          <div className={styles.statBadge}>
            <AlertOutlined style={{ color: "#ff4d4f" }} />
            <Text className={styles.statLabel} style={{ color: "#ff4d4f" }}>
              {overdueCount} Overdue
            </Text>
          </div>
        )}
        <div className={styles.statBadge}>
          <FileTextOutlined style={{ color: "#888" }} />
          <Text className={styles.statLabel}>{activities.length} Total</Text>
        </div>
      </div>

      {/* ── STATUS FILTER ── */}
      <div className={styles.filterBar}>
        <Segmented
          value={filterStatus}
          onChange={(val) => setFilterStatus(val as string)}
          options={["All", "Scheduled", "Completed", "Cancelled"]}
          className={styles.segmented}
        />
      </div>

      {/* ── TIMELINE ── */}
      <div className={styles.timelineWrapper}>
        {isPending && activities.length === 0 ? (
          <div className={styles.centered}>
            <Spin size="large" />
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.centered}>
            <Empty
              description={
                <span className={styles.emptyText}>No activities found</span>
              }
            />
          </div>
        ) : (
          <div className={styles.timeline}>
            {filtered.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                styles={styles}
                isSelected={selected?.id === activity.id}
                isLast={index === filtered.length - 1}
                onClick={() => handleSelect(activity)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── ACTION BAR ── */}
      <div className={styles.actionBar}>
        <Button
          icon={<PlusOutlined />}
          className={styles.btnCreate}
          onClick={() => setCreateModalOpen(true)}
        >
          Create
        </Button>
        <Button
          icon={<EditOutlined />}
          className={`${styles.btnAction} ${!canUpdate ? styles.btnDisabled : ""}`}
          disabled={!canUpdate}
          onClick={handleOpenUpdate}
        >
          Update
        </Button>
        <Button
          icon={<CheckOutlined />}
          className={`${styles.btnAction} ${!canComplete ? styles.btnDisabled : ""}`}
          disabled={!canComplete}
          onClick={() => setCompleteModalOpen(true)}
        >
          Complete
        </Button>
        <Button
          icon={<StopOutlined />}
          className={`${styles.btnAction} ${!canCancel ? styles.btnDisabled : ""}`}
          disabled={!canCancel}
          loading={isPending}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        {user?.roles.includes("Admin") && (
          <Button
            icon={<DeleteOutlined />}
            className={`${styles.btnAction} ${!selected ? styles.btnDisabled : ""}`}
            disabled={!selected}
            loading={isPending}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete
          </Button>
        )}

        <Input
          placeholder="Search..."
          prefix={<SearchOutlined className={styles.searchIcon} />}
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </div>

      {/* ── CREATE MODAL ── */}
      <Modal
        title="Create Activity"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          createForm.resetFields();
        }}
        onOk={() => createForm.submit()}
        okText="Create"
        confirmLoading={isPending}
        okButtonProps={{
          style: { background: "#00b86e", borderColor: "#00b86e" },
        }}
        width={580}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ type: 3, priority: 2 }}
        >
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              options={TYPE_OPTIONS.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="e.g. Discovery call with procurement team" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={2} placeholder="Additional details..." />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select options={PRIORITY_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: "Required" }]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
          <Form.Item name="duration" label="Duration (minutes)">
            <InputNumber style={{ width: "100%" }} min={0} placeholder="60" />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input placeholder="e.g. Microsoft Teams, Office" />
          </Form.Item>
          <Form.Item name="relatedToType" label="Related To (type)">
            <Select
              options={RELATED_TO_TYPE_OPTIONS}
              placeholder="Select entity type"
              allowClear
            />
          </Form.Item>
          <Form.Item name="relatedToId" label="Related To (ID)">
            <Input placeholder="UUID of related entity" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── UPDATE MODAL ── */}
      <Modal
        title={`Update — ${selected?.subject ?? ""}`}
        open={updateModalOpen}
        onCancel={() => {
          setUpdateModalOpen(false);
          updateForm.resetFields();
        }}
        onOk={() => updateForm.submit()}
        okText="Save"
        confirmLoading={isPending}
        okButtonProps={{
          style: { background: "#00b86e", borderColor: "#00b86e" },
        }}
        width={520}
      >
        <Form form={updateForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              options={TYPE_OPTIONS.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select options={PRIORITY_OPTIONS} />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date">
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
          <Form.Item name="duration" label="Duration (minutes)">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── COMPLETE MODAL ── */}
      <Modal
        title={`Complete — ${selected?.subject ?? ""}`}
        open={completeModalOpen}
        onCancel={() => {
          setCompleteModalOpen(false);
          completeForm.resetFields();
        }}
        onOk={() => completeForm.submit()}
        okText="Mark Complete"
        confirmLoading={isPending}
        okButtonProps={{
          style: { background: "#00b86e", borderColor: "#00b86e" },
        }}
      >
        <Form form={completeForm} layout="vertical" onFinish={handleComplete}>
          <Form.Item
            name="outcome"
            label="Outcome"
            rules={[{ required: true, message: "Please describe the outcome" }]}
          >
            <TextArea
              rows={4}
              placeholder='e.g. "Client confirmed interest in full package. Follow-up scheduled."'
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── DELETE MODAL ── */}
      <Modal
        title="Delete Activity"
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true, loading: isPending }}
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete <strong>"{selected?.subject}"</strong>
          ?
        </p>
        <p style={{ color: "#888", fontSize: "0.85rem" }}>
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default withAuth(ActivitiesPage);
