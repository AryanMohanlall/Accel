"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  message,
  Divider,
  Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileTextOutlined,
  MinusCircleOutlined,
  SendOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import useStyles from "./style";
import {
  useProposalState,
  useProposalActions,
} from "../../providers/proposalsProvider";
import {
  useOpportunityState,
  useOpportunityActions,
} from "../../providers/opportunitiesProvider";
import { Proposal } from "../../providers/proposalsProvider/context";
import withAuth from "@/app/hoc/withAuth";
import { useUserState } from "@/app/providers/userProvider";

const { TextArea } = Input;

const STATUS_COLORS: Record<number, string> = {
  1: "blue",
  2: "orange",
  3: "green",
  4: "red",
};

const CURRENCY_OPTIONS = [
  { value: "ZAR", label: "ZAR" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
];

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

const ProposalsPage = () => {
  const { styles } = useStyles();
  const { proposals, isPending, selected } = useProposalState();
  const {
    fetchProposals,
    setSelected,
    createProposal,
    updateProposal,
    deleteProposal,
    submitProposal,
    approveProposal,
    rejectProposal,
  } = useProposalActions();
  const { opportunities } = useOpportunityState();
  const { fetchOpportunities } = useOpportunityActions();
  const { user } = useUserState();

  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [rejectForm] = Form.useForm();

  const isAdminOrManager =
    user?.roles.includes("Admin") ||
    user?.roles.includes("SalesManager") ||
    user?.roles.includes("BusinessDevelopmentManager");

  useEffect(() => {
    fetchProposals();
    fetchOpportunities();
  }, []);

  const filtered = proposals.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      p.proposalNumber?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (record: Proposal) =>
    setSelected(selected?.id === record.id ? null : record);

  // --- Create ---
  const handleCreate = async (values: any) => {
    try {
      await createProposal({
        opportunityId: values.opportunityId,
        title: values.title,
        description: values.description,
        currency: values.currency,
        validUntil: values.validUntil?.format("YYYY-MM-DD"),
        lineItems: values.lineItems ?? [],
      });
      message.success("Proposal created");
      setCreateModalOpen(false);
      createForm.resetFields();
    } catch (error: any) {
      message.error(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Failed to create proposal",
      );
    }
  };

  // --- Update ---
  const handleOpenUpdate = () => {
    if (!selected) return;
    if (selected.status !== 1) {
      message.warning("Only Draft proposals can be updated");
      return;
    }
    updateForm.setFieldsValue({
      title: selected.title,
      description: selected.description,
      currency: selected.currency,
      validUntil: selected.validUntil ? dayjs(selected.validUntil) : undefined,
    });
    setUpdateModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selected) return;
    try {
      await updateProposal(selected.id, {
        title: values.title,
        description: values.description,
        currency: values.currency,
        validUntil: values.validUntil?.format("YYYY-MM-DD"),
      });
      message.success("Proposal updated");
      setUpdateModalOpen(false);
      updateForm.resetFields();
    } catch (error: any) {
      message.error(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Failed to update proposal",
      );
    }
  };

  // --- Delete ---
  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteProposal(selected.id);
      message.success(`"${selected.title}" deleted`);
      setSelected(null);
      setDeleteModalOpen(false);
    } catch (error: any) {
      message.error(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Failed to delete proposal",
      );
    }
  };

  // --- Submit ---
  const handleSubmit = async () => {
    if (!selected) return;
    try {
      await submitProposal(selected.id);
      message.success(`"${selected.title}" submitted for approval`);
    } catch (error: any) {
      message.error(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Failed to submit proposal",
      );
    }
  };

  // --- Approve ---
  const handleApprove = async () => {
    if (!selected) return;
    try {
      await approveProposal(selected.id);
      message.success(`"${selected.title}" approved`);
    } catch (error: any) {
      message.error(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Failed to approve proposal",
      );
    }
  };

  // --- Reject ---
  const handleReject = async (values: any) => {
    if (!selected) return;
    try {
      await rejectProposal(selected.id, values.reason);
      message.success(`"${selected.title}" rejected`);
      setRejectModalOpen(false);
      rejectForm.resetFields();
    } catch (error: any) {
      message.error(
        error.response?.data?.detail ||
          error.response?.data?.title ||
          "Failed to reject proposal",
      );
    }
  };

  const opportunityOptions = opportunities.map((o) => ({
    value: o.id,
    label: o.title,
  }));

  const columns: ColumnsType<Proposal> = [
    {
      title: "#",
      dataIndex: "proposalNumber",
      key: "proposalNumber",
      width: 110,
      render: (val: string) => (
        <span className={styles.proposalNumber}>
          <FileTextOutlined className={styles.proposalIcon} /> {val}
        </span>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (val: string) => <span className={styles.titleCell}>{val}</span>,
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      render: (val: string) => <span className={styles.clientCell}>{val}</span>,
    },
    {
      title: "Opportunity",
      dataIndex: "opportunityTitle",
      key: "opportunityTitle",
      render: (val: string) => <span className={styles.mutedCell}>{val}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (_: any, record: Proposal) => (
        <Tag
          color={STATUS_COLORS[record.status] ?? "default"}
          className={styles.statusTag}
        >
          {record.statusName}
        </Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 130,
      render: (val: number, record: Proposal) => (
        <span className={styles.amountCell}>
          {formatCurrency(val, record.currency)}
        </span>
      ),
    },
    {
      title: "Line Items",
      dataIndex: "lineItemsCount",
      key: "lineItemsCount",
      width: 90,
      align: "center",
      render: (val: number) => <span className={styles.badgeCell}>{val}</span>,
    },
    {
      title: "Valid Until",
      dataIndex: "validUntil",
      key: "validUntil",
      width: 120,
      render: (val: string) => (
        <span className={styles.dateCell}>{formatDate(val)}</span>
      ),
    },
    {
      title: "Submitted",
      dataIndex: "submittedDate",
      key: "submittedDate",
      width: 120,
      render: (val: string) => (
        <span className={styles.dateCell}>{formatDate(val)}</span>
      ),
    },
    {
      title: "Created By",
      dataIndex: "createdByName",
      key: "createdByName",
      render: (val: string) => <span className={styles.mutedCell}>{val}</span>,
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableWrapper}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          loading={isPending}
          pagination={{ pageSize: 10, size: "small" }}
          size="small"
          className={styles.table}
          rowClassName={(record) =>
            record.id === selected?.id ? styles.rowSelected : styles.row
          }
          onRow={(record) => ({ onClick: () => handleSelect(record) })}
          scroll={{ y: "calc(100% - 40px)" }}
        />
      </div>

      {/* ACTION BAR */}
      <div className={styles.actionBar}>
        <Button
          icon={<PlusOutlined />}
          className={styles.btnCreate}
          onClick={() => {
            fetchOpportunities();
            setCreateModalOpen(true);
          }}
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

        {/* Submit — only for Draft proposals */}
        <Button
          icon={<SendOutlined />}
          className={`${styles.btnAction} ${!selected || selected.status !== 1 ? styles.btnDisabled : ""}`}
          disabled={!selected || selected.status !== 1}
          loading={isPending}
          onClick={handleSubmit}
        >
          Submit
        </Button>

        {/* Approve & Reject — only for Submitted proposals, Admin/Manager only */}
        {isAdminOrManager && (
          <>
            <Button
              icon={<CheckOutlined />}
              className={`${styles.btnAction} ${!selected || selected.status !== 2 ? styles.btnDisabled : ""}`}
              disabled={!selected || selected.status !== 2}
              loading={isPending}
              onClick={handleApprove}
            >
              Approve
            </Button>
            <Button
              icon={<CloseOutlined />}
              className={`${styles.btnAction} ${!selected || selected.status !== 2 ? styles.btnDisabled : ""}`}
              disabled={!selected || selected.status !== 2}
              loading={isPending}
              onClick={() => setRejectModalOpen(true)}
            >
              Reject
            </Button>
          </>
        )}

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

      {/* CREATE MODAL */}
      <Modal
        title="Create Proposal"
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
        width={680}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ currency: "ZAR", lineItems: [{}] }}
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
            <Input placeholder="Proposal title" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={2} placeholder="Brief description" />
          </Form.Item>

          <Form.Item name="currency" label="Currency">
            <Select options={CURRENCY_OPTIONS} />
          </Form.Item>

          <Form.Item name="validUntil" label="Valid Until">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Divider
            titlePlacement="left"
            style={{ fontSize: "0.8rem", color: "#888" }}
          >
            Line Items
          </Divider>
          <Form.List name="lineItems">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      background: "#f9f9f9",
                      borderRadius: 8,
                      padding: "10px 12px",
                      marginBottom: 10,
                      position: "relative",
                    }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "productServiceName"]}
                      label="Product / Service"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <Input placeholder="e.g. Consulting" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      label="Description"
                    >
                      <Input placeholder="Line item description" />
                    </Form.Item>
                    <Space style={{ width: "100%" }} size={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "quantity"]}
                        label="Qty"
                        style={{ flex: 1, marginBottom: 0 }}
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <InputNumber style={{ width: "100%" }} min={0} placeholder="1" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "unitPrice"]}
                        label="Unit Price"
                        style={{ flex: 2, marginBottom: 0 }}
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <InputNumber style={{ width: "100%" }} min={0} placeholder="0.00" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "discount"]}
                        label="Discount %"
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <InputNumber style={{ width: "100%" }} min={0} max={100} placeholder="0" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "taxRate"]}
                        label="Tax %"
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <InputNumber style={{ width: "100%" }} min={0} max={100} placeholder="0" />
                      </Form.Item>
                    </Space>
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        color: "#ff4d4f",
                        fontSize: "1rem",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  style={{ width: "100%" }}
                >
                  Add Line Item
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal
        title={`Update — ${selected?.title ?? ""}`}
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
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="currency" label="Currency">
            <Select options={CURRENCY_OPTIONS} />
          </Form.Item>
          <Form.Item name="validUntil" label="Valid Until">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        title="Delete Proposal"
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true, loading: isPending }}
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete <strong>"{selected?.title}"</strong>?
        </p>
        <p style={{ color: "#888", fontSize: "0.85rem" }}>
          This action cannot be undone.
        </p>
      </Modal>

      {/* REJECT MODAL */}
      <Modal
        title={`Reject — ${selected?.title ?? ""}`}
        open={rejectModalOpen}
        onCancel={() => {
          setRejectModalOpen(false);
          rejectForm.resetFields();
        }}
        onOk={() => rejectForm.submit()}
        okText="Reject"
        okButtonProps={{ danger: true, loading: isPending }}
        confirmLoading={isPending}
      >
        <Form form={rejectForm} layout="vertical" onFinish={handleReject}>
          <Form.Item
            name="reason"
            label="Rejection Reason"
            rules={[{ required: true, message: "Please provide a reason" }]}
          >
            <TextArea
              rows={3}
              placeholder="e.g. Pricing too high, revise and resubmit"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default withAuth(ProposalsPage);