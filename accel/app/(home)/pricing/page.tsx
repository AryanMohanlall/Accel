"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Empty,
  Spin,
  Tag,
  Typography,
  Avatar,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Segmented,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  UserSwitchOutlined,
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import useStyles from "./style";
import {
  usePricingRequestState,
  usePricingRequestActions,
} from "../../providers/pricingProvider";
import {
  useOpportunityState,
  useOpportunityActions,
} from "../../providers/opportunitiesProvider";
import { useUserState } from "../../providers/userProvider";
import { getAxiosInstance } from "@/app/utils/axiosInstance";
import withAuth from "@/app/hoc/withAuth";

const { Text } = Typography;

// ── Constants ──────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<number, string> = {
  1: "default",
  2: "processing",
  3: "success",
};
const STATUS_LABELS: Record<number, string> = {
  1: "Pending",
  2: "In Progress",
  3: "Completed",
};

const PRIORITY_COLORS: Record<number, string> = {
  1: "green",
  2: "blue",
  3: "orange",
  4: "red",
};
const PRIORITY_LABELS: Record<number, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Urgent",
};

const PRIORITY_OPTIONS = [
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
  { value: 4, label: "Urgent" },
];

const VIEW_OPTIONS = ["All", "My Requests", "Pending (Unassigned)"];

interface OrgUser {
  id: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
}

// ── Page ───────────────────────────────────────────────────────────────────────

const PricingRequestsPage = () => {
  const { styles } = useStyles();
  const { user } = useUserState();
  const instance = getAxiosInstance();

  const { pricingRequests, isPending, selected } = usePricingRequestState();
  const {
    fetchPricingRequests,
    fetchMyRequests,
    fetchPendingRequests,
    setSelected,
    createPricingRequest,
    updatePricingRequest,
    assignPricingRequest,
    completePricingRequest,
  } = usePricingRequestActions();

  const { opportunities } = useOpportunityState();
  const { fetchOpportunities } = useOpportunityActions();

  const [view, setView] = useState("All");
  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);

  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [assignForm] = Form.useForm();

  const isAdminOrManager =
    user?.roles?.includes("Admin") || user?.roles?.includes("SalesManager");

  // ── Load data ────────────────────────────────────────────────────────────────

  useEffect(() => {
    loadByView(view);
    fetchOpportunities();
  }, []);

  const loadByView = (v: string) => {
    if (v === "My Requests") return fetchMyRequests();
    if (v === "Pending (Unassigned)") return fetchPendingRequests();
    return fetchPricingRequests();
  };

  const handleViewChange = (v: string) => {
    setView(v as string);
    setSelected(null);
    loadByView(v as string);
  };

  // ── Fetch org users ──────────────────────────────────────────────────────────

  const fetchOrgUsers = async (searchTerm?: string) => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({ pageSize: "100" });
      if (searchTerm) params.append("searchTerm", searchTerm);
      const res = await instance.get(`/api/users?${params.toString()}`);
      setOrgUsers((res.data.items ?? []).filter((u: OrgUser) => u.isActive));
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  // ── Filtered list ────────────────────────────────────────────────────────────

  const filtered = pricingRequests.filter(
    (r) =>
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.requestNumber?.toLowerCase().includes(search.toLowerCase()) ||
      r.opportunityTitle?.toLowerCase().includes(search.toLowerCase()) ||
      r.requestedByName?.toLowerCase().includes(search.toLowerCase()) ||
      r.assignedToName?.toLowerCase().includes(search.toLowerCase()),
  );

  const pendingCount = pricingRequests.filter((r) => r.status === 1).length;
  const inProgressCount = pricingRequests.filter((r) => r.status === 2).length;
  const completedCount = pricingRequests.filter((r) => r.status === 3).length;

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleSelect = (id: string) => {
    const req = pricingRequests.find((r) => r.id === id) ?? null;
    setSelected(selected?.id === id ? null : req);
  };

  const handleCreate = async (values: any) => {
    try {
      await createPricingRequest({
        ...values,
        requiredByDate: values.requiredByDate?.format("YYYY-MM-DD"),
      });
      message.success("Pricing request created");
      setCreateModal(false);
      createForm.resetFields();
    } catch (err: any) {
      message.error(
        err.response?.data?.detail ||
          err.response?.data?.title ||
          "Failed to create",
      );
    }
  };

  const handleOpenUpdate = () => {
    if (!selected) return;
    updateForm.setFieldsValue({
      title: selected.title,
      description: selected.description ?? "",
      priority: selected.priority,
      requiredByDate: selected.requiredByDate
        ? dayjs(selected.requiredByDate)
        : undefined,
    });
    setUpdateModal(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selected) return;
    try {
      await updatePricingRequest(selected.id, {
        ...values,
        requiredByDate: values.requiredByDate?.format("YYYY-MM-DD"),
      });
      message.success("Pricing request updated");
      setUpdateModal(false);
      updateForm.resetFields();
    } catch (err: any) {
      message.error(
        err.response?.data?.detail ||
          err.response?.data?.title ||
          "Failed to update",
      );
    }
  };

  const handleOpenAssign = () => {
    if (!selected) return;
    assignForm.resetFields();
    if (selected.assignedToId)
      assignForm.setFieldValue("userId", selected.assignedToId);
    fetchOrgUsers();
    setAssignModal(true);
  };

  const handleAssign = async (values: { userId: string }) => {
    if (!selected) return;
    try {
      await assignPricingRequest(selected.id, values.userId);
      const u = orgUsers.find((u) => u.id === values.userId);
      message.success(`Assigned to ${u?.fullName ?? "user"}`);
      setAssignModal(false);
      assignForm.resetFields();
    } catch (err: any) {
      message.error(
        err.response?.data?.detail ||
          err.response?.data?.title ||
          "Failed to assign",
      );
    }
  };

  const handleComplete = async () => {
    if (!selected) return;
    try {
      await completePricingRequest(selected.id);
      message.success("Marked as completed");
      setCompleteModal(false);
    } catch (err: any) {
      message.error(
        err.response?.data?.detail ||
          err.response?.data?.title ||
          "Failed to complete",
      );
    }
  };

  const isOverdue = (req: (typeof pricingRequests)[0]) =>
    req.status !== 3 && dayjs(req.requiredByDate).isBefore(dayjs(), "day");

  const opportunityOptions = opportunities.map((o) => ({
    value: o.id,
    label: o.title,
  }));
  const userOptions = orgUsers.map((u) => ({
    value: u.id,
    label: u.fullName,
    desc: u.roles.join(", "),
  }));

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className={styles.wrapper}>
      {/* Filter bar */}
      <div className={styles.filterBar}>
        <Segmented
          value={view}
          onChange={handleViewChange}
          options={
            isAdminOrManager
              ? VIEW_OPTIONS
              : VIEW_OPTIONS.filter((v) => v !== "Pending (Unassigned)")
          }
          className={styles.segmented}
        />

        <div className={styles.statsStrip}>
          <div className={styles.statBadge}>
            <Text className={styles.statLabel}>Pending</Text>
            <Tag color="default" style={{ margin: 0 }}>
              {pendingCount}
            </Tag>
          </div>
          <div className={styles.statBadge}>
            <Text className={styles.statLabel}>In Progress</Text>
            <Tag color="processing" style={{ margin: 0 }}>
              {inProgressCount}
            </Tag>
          </div>
          <div className={styles.statBadge}>
            <Text className={styles.statLabel}>Completed</Text>
            <Tag color="success" style={{ margin: 0 }}>
              {completedCount}
            </Tag>
          </div>
        </div>
      </div>

      {/* List */}
      <div className={styles.listWrapper}>
        {isPending && pricingRequests.length === 0 ? (
          <div className={styles.centered}>
            <Spin size="large" />
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.centered}>
            <Empty description="No pricing requests found" />
          </div>
        ) : (
          filtered.map((req) => {
            const overdue = isOverdue(req);
            return (
              <div
                key={req.id}
                className={`${styles.requestCard} ${selected?.id === req.id ? styles.requestCardSelected : ""}`}
                onClick={() => handleSelect(req.id)}
              >
                {/* Top row */}
                <div className={styles.cardTop}>
                  <div className={styles.cardMeta}>
                    <Text className={styles.requestNumber}>
                      {req.requestNumber}
                    </Text>
                    <Text className={styles.requestTitle}>
                      {req.title || (
                        <span style={{ color: "#d8d8d8", fontStyle: "italic" }}>
                          Untitled
                        </span>
                      )}
                    </Text>
                    <div className={styles.tagRow}>
                      <LinkOutlined
                        style={{ fontSize: "0.65rem", color: "#444" }}
                      />
                      <Text className={styles.opportunityChip}>
                        {req.opportunityTitle}
                      </Text>
                    </div>
                  </div>

                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      alignItems: "flex-end",
                    }}
                  >
                    <Tag
                      color={STATUS_COLORS[req.status]}
                      style={{ margin: 0, fontSize: "0.65rem" }}
                    >
                      {STATUS_LABELS[req.status] ?? req.statusName}
                    </Tag>
                    <Tag
                      color={PRIORITY_COLORS[req.priority]}
                      style={{ margin: 0, fontSize: "0.65rem" }}
                    >
                      {PRIORITY_LABELS[req.priority] ?? req.priorityName}
                    </Tag>
                  </div>
                </div>

                {/* Description */}
                {req.description && (
                  <Text
                    style={{
                      fontSize: "0.75rem",
                      color: "#bebebe",
                      display: "block",
                    }}
                  >
                    {req.description.length > 120
                      ? req.description.slice(0, 120) + "…"
                      : req.description}
                  </Text>
                )}

                {/* Bottom row */}
                <div className={styles.cardBottom}>
                  {/* Requested by */}
                  <Tooltip title={`Requested by ${req.requestedByName}`}>
                    <div className={styles.metaItem}>
                      <UserOutlined />
                      <span>{req.requestedByName}</span>
                    </div>
                  </Tooltip>

                  {/* Assigned to */}
                  {req.assignedToName?.trim().length ? (
                    <Tooltip title={`Assigned to ${req.assignedToName}`}>
                      <div className={styles.metaItem}>
                        <Avatar size={16} className={styles.assigneeAvatar}>
                          {req.assignedToName.trim()[0]?.toUpperCase()}
                        </Avatar>
                        <span>{req.assignedToName}</span>
                      </div>
                    </Tooltip>
                  ) : (
                    <div
                      className={styles.metaItem}
                      style={{ color: "#3a3a3a" }}
                    >
                      <UserOutlined />
                      <span>Unassigned</span>
                    </div>
                  )}

                  {/* Required by date */}
                  <div
                    className={`${styles.metaItem} ${overdue ? styles.overdueText : ""}`}
                  >
                    <CalendarOutlined />
                    <span>
                      {overdue ? "Overdue · " : "Due "}
                      {dayjs(req.requiredByDate).format("DD MMM YYYY")}
                    </span>
                  </div>

                  {/* Completed date */}
                  {req.completedDate && (
                    <div
                      className={`${styles.metaItem} ${styles.completedText}`}
                    >
                      <CheckOutlined />
                      <span>
                        Completed{" "}
                        {dayjs(req.completedDate).format("DD MMM YYYY")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action bar */}
      <div className={styles.actionBar}>
        <Button
          icon={<PlusOutlined />}
          className={styles.btnCreate}
          onClick={() => setCreateModal(true)}
        >
          Create
        </Button>
        <Button
          icon={<EditOutlined />}
          className={`${styles.btnAction} ${!selected ? styles.btnDisabled : ""}`}
          disabled={!selected}
          onClick={handleOpenUpdate}
        >
          Update
        </Button>

        {isAdminOrManager && (
          <Button
            icon={<UserSwitchOutlined />}
            className={`${styles.btnAction} ${!selected ? styles.btnDisabled : ""}`}
            disabled={!selected}
            onClick={handleOpenAssign}
          >
            Assign
          </Button>
        )}

        <Button
          icon={<CheckOutlined />}
          className={`${styles.btnAction} ${!selected || selected.status === 3 ? styles.btnDisabled : ""}`}
          disabled={!selected || selected.status === 3}
          onClick={() => setCompleteModal(true)}
        >
          Complete
        </Button>

        <Input
          placeholder="Search requests..."
          prefix={<SearchOutlined className={styles.searchIcon} />}
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </div>

      {/* ── CREATE MODAL ── */}
      <Modal
        title="Create Pricing Request"
        open={createModal}
        onCancel={() => {
          setCreateModal(false);
          createForm.resetFields();
        }}
        onOk={() => createForm.submit()}
        okText="Create"
        confirmLoading={isPending}
        okButtonProps={{
          style: { background: "#00b86e", borderColor: "#00b86e" },
        }}
        width={520}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ priority: 2 }}
        >
          <Form.Item
            name="opportunityId"
            label="Opportunity"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              showSearch
              placeholder="Select opportunity"
              options={opportunityOptions}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input placeholder="e.g. Custom Pricing for Client X" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea
              rows={3}
              placeholder="Describe the pricing request..."
            />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select options={PRIORITY_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="requiredByDate"
            label="Required By Date"
            rules={[{ required: true, message: "Required" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          {isAdminOrManager && (
            <Form.Item name="assignedToId" label="Assign To (optional)">
              <Select
                showSearch
                allowClear
                placeholder="Search users..."
                loading={usersLoading}
                options={userOptions}
                onFocus={() => fetchOrgUsers()}
                onSearch={fetchOrgUsers}
                filterOption={false}
                optionRender={(option) => (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                      {option.data.label}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "#888" }}>
                      {option.data.desc}
                    </span>
                  </div>
                )}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* ── UPDATE MODAL ── */}
      <Modal
        title={`Update — ${selected?.requestNumber ?? ""}`}
        open={updateModal}
        onCancel={() => {
          setUpdateModal(false);
          updateForm.resetFields();
        }}
        onOk={() => updateForm.submit()}
        okText="Save"
        confirmLoading={isPending}
        okButtonProps={{
          style: { background: "#00b86e", borderColor: "#00b86e" },
        }}
        width={480}
      >
        <Form form={updateForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select options={PRIORITY_OPTIONS} />
          </Form.Item>
          <Form.Item name="requiredByDate" label="Required By Date">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── ASSIGN MODAL ── */}
      <Modal
        title={`Assign — ${selected?.requestNumber ?? ""}`}
        open={assignModal}
        onCancel={() => {
          setAssignModal(false);
          assignForm.resetFields();
        }}
        onOk={() => assignForm.submit()}
        okText="Assign"
        confirmLoading={isPending}
        okButtonProps={{
          style: { background: "#00b86e", borderColor: "#00b86e" },
        }}
        width={440}
      >
        <Form form={assignForm} layout="vertical" onFinish={handleAssign}>
          <Form.Item
            name="userId"
            label="Assign to"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              showSearch
              placeholder="Search team members..."
              loading={usersLoading}
              options={userOptions}
              onSearch={fetchOrgUsers}
              filterOption={false}
              optionRender={(option) => (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 1 }}
                >
                  <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                    {option.data.label}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "#888" }}>
                    {option.data.desc}
                  </span>
                </div>
              )}
            />
          </Form.Item>
        </Form>
        {selected?.assignedToName?.trim() && (
          <p style={{ color: "#666", fontSize: "0.8rem", marginTop: 0 }}>
            Currently assigned to:{" "}
            <strong style={{ color: "#ccc" }}>{selected.assignedToName}</strong>
          </p>
        )}
      </Modal>

      {/* ── COMPLETE MODAL ── */}
      <Modal
        title="Mark as Completed"
        open={completeModal}
        onCancel={() => setCompleteModal(false)}
        onOk={handleComplete}
        okText="Mark Complete"
        confirmLoading={isPending}
        okButtonProps={{
          style: { background: "#00b86e", borderColor: "#00b86e" },
        }}
      >
        <p>
          Mark <strong>"{selected?.requestNumber}"</strong> as completed?
        </p>
        <p style={{ color: "#888", fontSize: "0.85rem" }}>
          Status will change to <strong>Completed</strong> and cannot be
          reverted.
        </p>
      </Modal>
    </div>
  );
};

export default withAuth(PricingRequestsPage);
