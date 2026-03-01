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
  InputNumber,
  Select,
  DatePicker,
  message,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  DollarOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import useStyles from "./style";
import {
  useOpportunityState,
  useOpportunityActions,
} from "../../providers/opportunitiesProvider";
import {
  useClientState,
  useClientActions,
} from "../../providers/clientsProvider";
import {
  useContactState,
  useContactActions,
} from "../../providers/contactsProvider";
import withAuth from "@/app/hoc/withAuth";
import { useUserState } from "@/app/providers/userProvider";
import { getAxiosInstance } from "@/app/utils/axiosInstance";

const { Text, Title } = Typography;

const STAGES = ["Lead", "Qualified", "Proposal", "Negotiation"];
const STAGE_NUMBERS: Record<string, number> = {
  Lead: 1,
  Qualified: 2,
  Proposal: 3,
  Negotiation: 4,
};
const STAGE_COLORS: Record<string, string> = {
  Lead: "#6C8EBF",
  Qualified: "#82B366",
  Proposal: "#D6B656",
  Negotiation: "#AE4132",
};
const STAGE_OPTIONS = [
  { value: 1, label: "Lead" },
  { value: 2, label: "Qualified" },
  { value: 3, label: "Proposal" },
  { value: 4, label: "Negotiation" },
  { value: 5, label: "Closed Won" },
  { value: 6, label: "Closed Lost" },
];
const SOURCE_OPTIONS = [
  { value: 0, label: "Unknown" },
  { value: 1, label: "Website" },
  { value: 2, label: "Cold Call" },
  { value: 3, label: "Referral" },
  { value: 4, label: "LinkedIn" },
  { value: 5, label: "Event" },
];
const CURRENCY_OPTIONS = [
  { value: "ZAR", label: "ZAR" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
];

// Users who can be assigned opportunities
const ASSIGNABLE_ROLES = ["SalesRep", "SalesManager", "BusinessDevelopmentManager"];

interface OrgUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const OpportunitiesPage = () => {
  const { styles } = useStyles();
  const { opportunities, isPending, selected } = useOpportunityState();
  const {
    fetchOpportunities,
    setSelected,
    createOpportunity,
    updateOpportunity,
    moveOpportunityStage,
    assignOpportunity,
    deleteOpportunity,
  } = useOpportunityActions();
  const { clients, isPending: clientsLoading } = useClientState();
  const { fetchClients, createClient } = useClientActions();
  const { contacts, isPending: contactsLoading } = useContactState();
  const { fetchContacts, createContact } = useContactActions();
  const { user } = useUserState();
  const instance = getAxiosInstance();

  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [pendingStageMove, setPendingStageMove] = useState<{
    id: string;
    stage: number;
    stageName: string;
  } | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [addingClient, setAddingClient] = useState(false);
  const [addingContact, setAddingContact] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Users state for assign modal
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [stageForm] = Form.useForm();
  const [assignForm] = Form.useForm();

  const isAdminOrManager =
    user?.roles?.includes("Admin") || user?.roles?.includes("SalesManager");

  useEffect(() => {
    fetchOpportunities();
    fetchClients();
    fetchContacts();
  }, []);

  // ── Fetch org users for assign modal ──────────────────────────────────────
  const fetchOrgUsers = async (search?: string) => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({ pageSize: "100" });
      if (search) params.append("searchTerm", search);
      const res = await instance.get(`/api/users?${params.toString()}`);
      const items: OrgUser[] = (res.data.items ?? []).filter((u: OrgUser) =>
        u.isActive &&
        u.roles.some(r => ASSIGNABLE_ROLES.includes(r))
      );
      setOrgUsers(items);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleOpenAssign = () => {
    if (!selected) return;
    assignForm.resetFields();

    fetchOrgUsers();
    setAssignModalOpen(true);
  };

  const handleAssign = async (values: { userId: string }) => {
    if (!selected) return;
    try {
      await assignOpportunity(selected.id, values.userId);
      const assignedUser = orgUsers.find(u => u.id === values.userId);
      message.success(`Assigned to ${assignedUser?.fullName ?? "user"}`);
      setAssignModalOpen(false);
      assignForm.resetFields();
    } catch (error: any) {
      message.error(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Failed to assign",
      );
    }
  };

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    createForm.setFieldValue("contactId", undefined);
    setContactSearch("");
    fetchContacts(clientId);
  };

  const filtered = opportunities.filter(
    (o) =>
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.clientName.toLowerCase().includes(search.toLowerCase()),
  );
  const byStage = (stageName: string) =>
    filtered.filter((o) => o.stageName === stageName);

  const handleSelect = (id: string) => {
    const opp = opportunities.find((o) => o.id === id) ?? null;
    setSelected(selected?.id === id ? null : opp);
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteOpportunity(selected.id);
      message.success(`"${selected.title}" deleted`);
      setSelected(null);
      setDeleteModalOpen(false);
    } catch (error: any) {
      message.error(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Failed to delete",
      );
    }
  };

  const handleOpenUpdate = () => {
    if (!selected) return;
    fetchContacts(selected.clientId ?? undefined);
    updateForm.setFieldsValue({
      title: selected.title,
      contactId: selected.contactId ?? undefined,
      estimatedValue: selected.estimatedValue,
      currency: selected.currency,
      probability: selected.probability,
      source: selected.source,
      expectedCloseDate: selected.expectedCloseDate
        ? dayjs(selected.expectedCloseDate)
        : undefined,
      description: selected.description ?? "",
    });
    setUpdateModalOpen(true);
  };

  const handleCreate = async (values: any) => {
    try {
      await createOpportunity({
        ...values,
        expectedCloseDate: values.expectedCloseDate?.format("YYYY-MM-DD"),
      });
      message.success("Opportunity created");
      setCreateModalOpen(false);
      createForm.resetFields();
      setClientSearch("");
      setContactSearch("");
      setSelectedClientId(null);
    } catch (error: any) {
      message.error(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Failed to create",
      );
    }
  };

  const handleUpdate = async (values: any) => {
    if (!selected) return;
    try {
      await updateOpportunity(selected.id, {
        ...values,
        expectedCloseDate: values.expectedCloseDate?.format("YYYY-MM-DD"),
      });
      message.success("Opportunity updated");
      setUpdateModalOpen(false);
      updateForm.resetFields();
    } catch (error: any) {
      message.error(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Failed to update",
      );
    }
  };

  // ── Drag and drop ──────────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, opportunityId: string) => {
    e.dataTransfer.setData("opportunityId", opportunityId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stageName: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stageName);
  };

  const handleDragLeave = () => setDragOverStage(null);

  const handleDrop = (e: React.DragEvent, targetStageName: string) => {
    e.preventDefault();
    setDragOverStage(null);
    const opportunityId = e.dataTransfer.getData("opportunityId");
    const opp = opportunities.find((o) => o.id === opportunityId);
    if (!opp || opp.stageName === targetStageName) return;
    setPendingStageMove({
      id: opportunityId,
      stage: STAGE_NUMBERS[targetStageName],
      stageName: targetStageName,
    });
    stageForm.resetFields();
    setStageModalOpen(true);
  };

  const handleStageConfirm = async (values: any) => {
    if (!pendingStageMove) return;
    try {
      await moveOpportunityStage(
        pendingStageMove.id,
        pendingStageMove.stage,
        values.notes,
        values.lossReason,
      );
      message.success(`Moved to ${pendingStageMove.stageName}`);
      setStageModalOpen(false);
      setPendingStageMove(null);
      stageForm.resetFields();
    } catch (error: any) {
      message.error(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Failed to move stage",
      );
    }
  };

  // ── Inline client/contact creation ────────────────────────────────────────
  const handleAddClient = async () => {
    if (!clientSearch.trim()) return;
    setAddingClient(true);
    try {
      await createClient({ name: clientSearch.trim() });
      message.success(`Client "${clientSearch}" created`);
      setClientSearch("");
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to create client");
    } finally {
      setAddingClient(false);
    }
  };

  useEffect(() => {
    if (!clientSearch.trim()) return;
    const match = clients.find(
      (c) => c.name.toLowerCase() === clientSearch.trim().toLowerCase(),
    );
    if (match) {
      createForm.setFieldValue("clientId", match.id);
      setSelectedClientId(match.id);
      fetchContacts(match.id);
      setClientSearch("");
    }
  }, [clients]);

  const handleAddContact = async () => {
    if (!contactSearch.trim() || !selectedClientId) return;
    setAddingContact(true);
    const parts = contactSearch.trim().split(" ");
    try {
      await createContact({
        clientId: selectedClientId,
        firstName: parts[0],
        lastName: parts.slice(1).join(" ") || ".",
        email: "",
        phoneNumber: "",
        position: "",
        isPrimaryContact: false,
      });
      message.success(`Contact "${contactSearch}" created`);
      setContactSearch("");
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to create contact");
    } finally {
      setAddingContact(false);
    }
  };

  useEffect(() => {
    if (!contactSearch.trim()) return;
    const match = contacts.find(
      (c) => c.fullName.toLowerCase() === contactSearch.trim().toLowerCase(),
    );
    if (match) {
      createForm.setFieldValue("contactId", match.id);
      setContactSearch("");
    }
  }, [contacts]);

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }));
  const contactOptions = contacts.map((c) => ({ value: c.id, label: c.fullName }));

  const userOptions = orgUsers.map((u) => ({
    value: u.id,
    label: u.fullName,
    desc: u.roles.join(", "),
  }));

  const contactDropdown = (menu: React.ReactNode) => (
    <>
      {menu}
      {contactSearch.trim() &&
        !contacts.some(
          (c) => c.fullName.toLowerCase() === contactSearch.trim().toLowerCase(),
        ) && (
          <>
            <Divider style={{ margin: "6px 0" }} />
            <div style={{ padding: "4px 8px" }}>
              <Button
                type="text"
                icon={<PlusOutlined />}
                loading={addingContact}
                onClick={handleAddContact}
                style={{ width: "100%", textAlign: "left", color: "#00b86e" }}
              >
                Add "{contactSearch}"
              </Button>
            </div>
          </>
        )}
    </>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.board}>
        {isPending && opportunities.length === 0 ? (
          <div className={styles.spinWrapper}>
            <Spin size="large" />
          </div>
        ) : (
          STAGES.map((stage) => (
            <div
              key={stage}
              className={`${styles.column} ${dragOverStage === stage ? styles.columnDragOver : ""}`}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className={styles.columnHeader}>
                <span
                  className={styles.stageIndicator}
                  style={{ background: STAGE_COLORS[stage] }}
                />
                <Title level={5} className={styles.columnTitle}>
                  {stage}
                </Title>
                <span className={styles.columnCount}>
                  {byStage(stage).length}
                </span>
              </div>
              <div className={styles.columnBody}>
                {byStage(stage).length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <span className={styles.emptyText}>No opportunities</span>
                    }
                    className={styles.empty}
                  />
                ) : (
                  byStage(stage).map((opp) => (
                    <div
                      key={opp.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, opp.id)}
                      className={`${styles.card} ${selected?.id === opp.id ? styles.cardSelected : ""}`}
                      onClick={() => handleSelect(opp.id)}
                    >
                      <div className={styles.cardHeader}>
                        <Text className={styles.cardTitle}>{opp.title}</Text>
                        <Tag className={styles.probabilityTag}>
                          {opp.probability}%
                        </Tag>
                      </div>
                      <Text className={styles.clientName}>{opp.clientName}</Text>
                      {opp.contactName && (
                        <div className={styles.cardRow}>
                          <UserOutlined className={styles.cardIcon} />
                          <Text className={styles.cardMeta}>{opp.contactName}</Text>
                        </div>
                      )}
                      <div className={styles.cardRow}>
                        <DollarOutlined className={styles.cardIcon} />
                        <Text className={styles.cardValue}>
                          {formatCurrency(opp.estimatedValue, opp.currency)}
                        </Text>
                      </div>
                      <div className={styles.cardFooter}>
                        <Text className={styles.cardDate}>
                          Close: {formatDate(opp.expectedCloseDate)}
                        </Text>
                        <Avatar size={20} className={styles.ownerAvatar}>
                          {opp.ownerName?.trim()?.[0] ?? "?"}
                        </Avatar>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ACTION BAR */}
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
          className={`${styles.btnAction} ${!selected ? styles.btnDisabled : ""}`}
          disabled={!selected}
          onClick={handleOpenUpdate}
        >
          Update
        </Button>

        {/* Assign — Admin & SalesManager only */}
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

        {/* Delete — Admin only */}
        {user?.roles?.includes("Admin") && (
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
          placeholder="Search opportunities..."
          prefix={<SearchOutlined style={{ color: "#555" }} />}
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </div>

      {/* ASSIGN MODAL */}
      <Modal
        title={`Assign — ${selected?.title ?? ""}`}
        open={assignModalOpen}
        onCancel={() => { setAssignModalOpen(false); assignForm.resetFields(); }}
        onOk={() => assignForm.submit()}
        okText="Assign"
        confirmLoading={isPending}
        okButtonProps={{ style: { background: "#00b86e", borderColor: "#00b86e" } }}
        width={440}
      >
        <Form form={assignForm} layout="vertical" onFinish={handleAssign}>
          <Form.Item
            name="userId"
            label="Assign to"
            rules={[{ required: true, message: "Please select a user" }]}
          >
            <Select
              showSearch
              placeholder="Search team members..."
              loading={usersLoading}
              onSearch={(val) => { setUserSearch(val); fetchOrgUsers(val); }}
              filterOption={false}
              optionLabelProp="label"
              options={userOptions.map(u => ({
                value: u.value,
                label: u.label,
                desc: u.desc,
              }))}
              optionRender={(option) => (
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{option.data.label}</span>
                  <span style={{ fontSize: "0.7rem", color: "#454545" }}>{option.data.desc}</span>
                </div>
              )}
            />
          </Form.Item>
        </Form>

        {selected?.ownerName && (
          <p style={{ color: "#3f3f3f", fontSize: "0.8rem", marginTop: 0 }}>
            Currently assigned to: <strong style={{ color: "#515151" }}>{selected.ownerName}</strong>
          </p>
        )}
      </Modal>

      {/* STAGE MOVE MODAL */}
      <Modal
        title={`Move to "${pendingStageMove?.stageName}"?`}
        open={stageModalOpen}
        onCancel={() => {
          setStageModalOpen(false);
          setPendingStageMove(null);
          stageForm.resetFields();
        }}
        onOk={() => stageForm.submit()}
        okText="Confirm"
        okButtonProps={{ style: { background: "#00b86e", borderColor: "#00b86e" } }}
        confirmLoading={isPending}
      >
        <Form form={stageForm} layout="vertical" onFinish={handleStageConfirm}>
          <Form.Item name="notes" label="Notes (optional)">
            <Input.TextArea rows={2} placeholder='e.g. "Proposal sent to client"' />
          </Form.Item>
          {pendingStageMove?.stageName === "Closed Lost" && (
            <Form.Item name="lossReason" label="Loss Reason">
              <Input.TextArea rows={2} placeholder='e.g. "Budget constraints"' />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* CREATE MODAL */}
      <Modal
        title="Create Opportunity"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          createForm.resetFields();
          setClientSearch("");
          setContactSearch("");
          setSelectedClientId(null);
        }}
        onOk={() => createForm.submit()}
        okText="Create"
        confirmLoading={isPending}
        okButtonProps={{ style: { background: "#00b86e", borderColor: "#00b86e" } }}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ currency: "ZAR", stage: 1, source: 0, probability: 50 }}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Opportunity title" />
          </Form.Item>
          <Form.Item name="clientId" label="Client" rules={[{ required: true, message: "Required" }]}>
            <Select
              showSearch
              placeholder="Search or create a client"
              loading={clientsLoading || addingClient}
              options={clientOptions}
              searchValue={clientSearch}
              onSearch={setClientSearch}
              onChange={handleClientChange}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              popupRender={(menu) => (
                <>
                  {menu}
                  {clientSearch.trim() &&
                    !clients.some((c) => c.name.toLowerCase() === clientSearch.trim().toLowerCase()) && (
                      <>
                        <Divider style={{ margin: "6px 0" }} />
                        <div style={{ padding: "4px 8px" }}>
                          <Button
                            type="text"
                            icon={<PlusOutlined />}
                            loading={addingClient}
                            onClick={handleAddClient}
                            style={{ width: "100%", textAlign: "left", color: "#00b86e" }}
                          >
                            Add "{clientSearch}"
                          </Button>
                        </div>
                      </>
                    )}
                </>
              )}
            />
          </Form.Item>
          <Form.Item name="contactId" label="Contact (optional)">
            <Select
              showSearch
              placeholder={selectedClientId ? "Search or create a contact" : "Select a client first"}
              disabled={!selectedClientId}
              loading={contactsLoading || addingContact}
              options={contactOptions}
              searchValue={contactSearch}
              onSearch={setContactSearch}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              popupRender={contactDropdown}
            />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="estimatedValue" label="Estimated Value" rules={[{ required: true, message: "Required" }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="currency" label="Currency">
            <Select options={CURRENCY_OPTIONS} />
          </Form.Item>
          <Form.Item name="stage" label="Stage">
            <Select options={STAGE_OPTIONS} />
          </Form.Item>
          <Form.Item name="source" label="Source">
            <Select options={SOURCE_OPTIONS} />
          </Form.Item>
          <Form.Item name="probability" label="Probability (%)">
            <InputNumber style={{ width: "100%" }} min={0} max={100} />
          </Form.Item>
          <Form.Item name="expectedCloseDate" label="Expected Close Date" rules={[{ required: true, message: "Required" }]}>
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal
        title={`Update — ${selected?.title ?? ""}`}
        open={updateModalOpen}
        onCancel={() => { setUpdateModalOpen(false); updateForm.resetFields(); }}
        onOk={() => updateForm.submit()}
        okText="Save"
        confirmLoading={isPending}
        okButtonProps={{ style: { background: "#00b86e", borderColor: "#00b86e" } }}
      >
        <Form form={updateForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: "Required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contactId" label="Contact (optional)">
            <Select
              showSearch
              allowClear
              placeholder="Search or create a contact"
              loading={contactsLoading || addingContact}
              options={contactOptions}
              searchValue={contactSearch}
              onSearch={setContactSearch}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              popupRender={contactDropdown}
            />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="estimatedValue" label="Estimated Value" rules={[{ required: true, message: "Required" }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="currency" label="Currency">
            <Select options={CURRENCY_OPTIONS} />
          </Form.Item>
          <Form.Item name="source" label="Source">
            <Select options={SOURCE_OPTIONS} />
          </Form.Item>
          <Form.Item name="probability" label="Probability (%)">
            <InputNumber style={{ width: "100%" }} min={0} max={100} />
          </Form.Item>
          <Form.Item name="expectedCloseDate" label="Expected Close Date" rules={[{ required: true, message: "Required" }]}>
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        title="Delete Opportunity"
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true, loading: isPending }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete <strong>"{selected?.title}"</strong>?</p>
        <p style={{ color: "#888", fontSize: "0.85rem" }}>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default withAuth(OpportunitiesPage);