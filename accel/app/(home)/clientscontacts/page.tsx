"use client";

import React, { useEffect, useState } from "react";
import {
  Button, Input, Empty, Spin, Modal, Form,
  Select, Switch, message, Tabs, Badge,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, TeamOutlined, UserOutlined,
} from "@ant-design/icons";
import useStyles from "./style";
import { useClientState, useClientActions } from "../../providers/clientsProvider";
import { useContactState, useContactActions } from "../../providers/contactsProvider";
import { Client } from "../../providers/clientsProvider/context";
import { Contact } from "../../providers/contactsProvider/context";
import ClientCard from "../../components/ClientCard";
import ContactRow from "../../components/ContactRow";
import { useUserState } from "@/app/providers/userProvider";

const { TextArea } = Input;

const CLIENT_TYPE_OPTIONS = [
  { value: 1, label: "Prospect" },
  { value: 2, label: "Active" },
  { value: 3, label: "Partner" },
  { value: 4, label: "Churned" },
];

const COMPANY_SIZE_OPTIONS = [
  { value: "1-10",    label: "1–10 employees" },
  { value: "11-50",   label: "11–50 employees" },
  { value: "51-200",  label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+",    label: "500+ employees" },
];

// ── Main Page ──────────────────────────────────────────────
const ClientsContactsPage = () => {
  const { styles } = useStyles();

  // Clients
  const { clients, isPending: clientsPending, selected: selectedClient } = useClientState();
  const { fetchClients, setSelected: setSelectedClient, createClient, updateClient, deleteClient } = useClientActions();

  // Contacts
  const { contacts, isPending: contactsPending, selected: selectedContact } = useContactState();
  const { fetchContacts, setSelected: setSelectedContact, createContact, updateContact, deleteContact } = useContactActions();

  const [activeTab, setActiveTab]             = useState("clients");
  const [clientSearch, setClientSearch]       = useState("");
  const [contactSearch, setContactSearch]     = useState("");
  const [clientModal, setClientModal]         = useState<"create" | "update" | "delete" | null>(null);
  const [contactModal, setContactModal]       = useState<"create" | "update" | "delete" | null>(null);
  const [clientForm]  = Form.useForm();
  const [contactForm] = Form.useForm();

  useEffect(() => {
    fetchClients();
    fetchContacts();
  }, []);

  // ── Filtered lists ──
  const filteredClients = clients.filter(c =>
    c.name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.industry?.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredContacts = contacts.filter(c =>
    c.fullName?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.clientName?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.email?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.position?.toLowerCase().includes(contactSearch.toLowerCase())
  );

  // ── Client handlers ──
  const handleSelectClient = (client: Client) => {
    setSelectedClient(selectedClient?.id === client.id ? null : client);
    // load contacts for this client
    if (selectedClient?.id !== client.id) fetchContacts(client.id);
  };

  const handleCreateClient = async (values: any) => {
    try {
      await createClient(values);
      message.success("Client created");
      setClientModal(null);
      clientForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to create client");
    }
  };

  const handleOpenUpdateClient = () => {
    if (!selectedClient) return;
    clientForm.setFieldsValue({
      name:           selectedClient.name,
      industry:       selectedClient.industry,
      companySize:    selectedClient.companySize,
      website:        selectedClient.website,
      billingAddress: selectedClient.billingAddress,
      taxNumber:      selectedClient.taxNumber,
      clientType:     selectedClient.clientType,
    });
    setClientModal("update");
  };

  const handleUpdateClient = async (values: any) => {
    if (!selectedClient) return;
    try {
      await updateClient(selectedClient.id, values);
      message.success("Client updated");
      setClientModal(null);
      clientForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to update client");
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    try {
      await deleteClient(selectedClient.id);
      message.success(`"${selectedClient.name}" deleted`);
      setSelectedClient(null);
      setClientModal(null);
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to delete client");
    }
  };

  // ── Contact handlers ──
  const handleSelectContact = (contact: Contact) =>
    setSelectedContact(selectedContact?.id === contact.id ? null : contact);

  const handleCreateContact = async (values: any) => {
    try {
      await createContact(values);
      message.success("Contact created");
      setContactModal(null);
      contactForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to create contact");
    }
  };

  const handleOpenUpdateContact = () => {
    if (!selectedContact) return;
    contactForm.setFieldsValue({
      clientId:         selectedContact.clientId,
      firstName:        selectedContact.firstName,
      lastName:         selectedContact.lastName,
      email:            selectedContact.email,
      phoneNumber:      selectedContact.phoneNumber,
      position:         selectedContact.position,
      isPrimaryContact: selectedContact.isPrimaryContact,
    });
    setContactModal("update");
  };

  const handleUpdateContact = async (values: any) => {
    if (!selectedContact) return;
    try {
      await updateContact(selectedContact.id, values);
      message.success("Contact updated");
      setContactModal(null);
      contactForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to update contact");
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    try {
      await deleteContact(selectedContact.id);
      message.success(`"${selectedContact.fullName}" deleted`);
      setSelectedContact(null);
      setContactModal(null);
    } catch (error: any) {
      message.error(error.response?.data?.detail || "Failed to delete contact");
    }
  };

  const clientOptions = clients.map(c => ({ value: c.id, label: c.name }));

    const {user} = useUserState();


  // ── Tab items ──
  const tabItems = [
    {
      key: "clients",
      label: (
        <span className={styles.tabLabel}>
          <TeamOutlined /> Clients
          <Badge count={clients.length} className={styles.tabBadge} />
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          {/* Client list */}
          <div className={styles.listWrapper}>
            {clientsPending && clients.length === 0 ? (
              <div className={styles.centered}><Spin size="large" /></div>
            ) : filteredClients.length === 0 ? (
              <div className={styles.centered}><Empty description="No clients found" /></div>
            ) : (
              <div className={styles.clientGrid}>
                {filteredClients.map(client => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    styles={styles}
                    isSelected={selectedClient?.id === client.id}
                    onClick={() => handleSelectClient(client)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Client action bar */}
          <div className={styles.actionBar}>
            <Button icon={<PlusOutlined />} className={styles.btnCreate} onClick={() => setClientModal("create")}>
              Create
            </Button>
            <Button
              icon={<EditOutlined />}
              className={`${styles.btnAction} ${!selectedClient ? styles.btnDisabled : ""}`}
              disabled={!selectedClient}
              onClick={handleOpenUpdateClient}
            >
              Update
            </Button>
            {
              user?.roles.includes('Admin') &&
            <Button
              icon={<DeleteOutlined />}
              className={`${styles.btnAction} ${!selectedClient ? styles.btnDisabled : ""}`}
              disabled={!selectedClient}
              loading={clientsPending}
              onClick={() => setClientModal("delete")}
            >
              Delete
            </Button>
            }
            <Input
              placeholder="Search clients..."
              prefix={<SearchOutlined className={styles.searchIcon} />}
              className={styles.searchInput}
              value={clientSearch}
              onChange={e => setClientSearch(e.target.value)}
              allowClear
            />
          </div>
        </div>
      ),
    },
    {
      key: "contacts",
      label: (
        <span className={styles.tabLabel}>
          <UserOutlined /> Contacts
          <Badge count={contacts.length} className={styles.tabBadge} />
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          {/* Contact list */}
          <div className={styles.listWrapper}>
            {contactsPending && contacts.length === 0 ? (
              <div className={styles.centered}><Spin size="large" /></div>
            ) : filteredContacts.length === 0 ? (
              <div className={styles.centered}><Empty description="No contacts found" /></div>
            ) : (
              <div className={styles.contactList}>
                {filteredContacts.map(contact => (
                  <ContactRow
                    key={contact.id}
                    contact={contact}
                    styles={styles}
                    isSelected={selectedContact?.id === contact.id}
                    onClick={() => handleSelectContact(contact)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Contact action bar */}
          <div className={styles.actionBar}>
            <Button icon={<PlusOutlined />} className={styles.btnCreate} onClick={() => setContactModal("create")}>
              Create
            </Button>
            <Button
              icon={<EditOutlined />}
              className={`${styles.btnAction} ${!selectedContact ? styles.btnDisabled : ""}`}
              disabled={!selectedContact}
              onClick={handleOpenUpdateContact}
            >
              Update
            </Button>
            {
              user?.roles.includes('Admin') &&
            <Button
              icon={<DeleteOutlined />}
              className={`${styles.btnAction} ${!selectedContact ? styles.btnDisabled : ""}`}
              disabled={!selectedContact}
              loading={contactsPending}
              onClick={() => setContactModal("delete")}
            >
              Delete
            </Button>
            }
            <Input
              placeholder="Search contacts..."
              prefix={<SearchOutlined className={styles.searchIcon} />}
              className={styles.searchInput}
              value={contactSearch}
              onChange={e => setContactSearch(e.target.value)}
              allowClear
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className={styles.tabs}
      />

      {/* ── CLIENT CREATE MODAL ── */}
      <Modal
        title="Create Client"
        open={clientModal === "create"}
        onCancel={() => { setClientModal(null); clientForm.resetFields(); }}
        onOk={() => clientForm.submit()}
        okText="Create"
        confirmLoading={clientsPending}
        okButtonProps={{ style: { background: "#00b86e", borderColor: "#00b86e" } }}
        width={560}
      >
        <Form form={clientForm} layout="vertical" onFinish={handleCreateClient}
          initialValues={{ clientType: 1 }}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Company name" />
          </Form.Item>
          <Form.Item name="industry" label="Industry">
            <Input placeholder="e.g. Technology, Finance" />
          </Form.Item>
          <Form.Item name="companySize" label="Company Size">
            <Select options={COMPANY_SIZE_OPTIONS} placeholder="Select size" />
          </Form.Item>
          <Form.Item name="clientType" label="Client Type">
            <Select options={CLIENT_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item name="billingAddress" label="Billing Address">
            <TextArea rows={2} placeholder="Full billing address" />
          </Form.Item>
          <Form.Item name="taxNumber" label="Tax Number">
            <Input placeholder="VAT / Tax registration number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── CLIENT UPDATE MODAL ── */}
      <Modal
        title={`Update — ${selectedClient?.name ?? ""}`}
        open={clientModal === "update"}
        onCancel={() => { setClientModal(null); clientForm.resetFields(); }}
        onOk={() => clientForm.submit()}
        okText="Save"
        confirmLoading={clientsPending}
        okButtonProps={{ style: { background: "#00b86e", borderColor: "#00b86e" } }}
        width={560}
      >
        <Form form={clientForm} layout="vertical" onFinish={handleUpdateClient}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="industry" label="Industry">
            <Input />
          </Form.Item>
          <Form.Item name="companySize" label="Company Size">
            <Select options={COMPANY_SIZE_OPTIONS} />
          </Form.Item>
          <Form.Item name="clientType" label="Client Type">
            <Select options={CLIENT_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input />
          </Form.Item>
          <Form.Item name="billingAddress" label="Billing Address">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="taxNumber" label="Tax Number">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── CLIENT DELETE MODAL ── */}
      <Modal
        title="Delete Client"
        open={clientModal === "delete"}
        onCancel={() => setClientModal(null)}
        onOk={handleDeleteClient}
        okText="Delete"
        okButtonProps={{ danger: true, loading: clientsPending }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete <strong>"{selectedClient?.name}"</strong>?</p>
        <p style={{ color: "#888", fontSize: "0.85rem" }}>This action cannot be undone.</p>
      </Modal>

      {/* ── CONTACT CREATE MODAL ── */}
      <Modal
        title="Create Contact"
        open={contactModal === "create"}
        onCancel={() => { setContactModal(null); contactForm.resetFields(); }}
        onOk={() => contactForm.submit()}
        okText="Create"
        confirmLoading={contactsPending}
        okButtonProps={{ style: { background: "#00b86e", borderColor: "#00b86e" } }}
        width={520}
      >
        <Form form={contactForm} layout="vertical" onFinish={handleCreateContact}
          initialValues={{ isPrimaryContact: false }}>
          <Form.Item name="clientId" label="Client" rules={[{ required: true, message: "Required" }]}>
            <Select
              showSearch
              placeholder="Select client"
              options={clientOptions}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="First name" />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Last name" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="email@company.com" />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone Number">
            <Input placeholder="+27 11 123 4567" />
          </Form.Item>
          <Form.Item name="position" label="Position">
            <Input placeholder="e.g. Procurement Manager" />
          </Form.Item>
          <Form.Item name="isPrimaryContact" label="Primary Contact" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── CONTACT UPDATE MODAL ── */}
      <Modal
        title={`Update — ${selectedContact?.fullName ?? ""}`}
        open={contactModal === "update"}
        onCancel={() => { setContactModal(null); contactForm.resetFields(); }}
        onOk={() => contactForm.submit()}
        okText="Save"
        confirmLoading={contactsPending}
        okButtonProps={{ style: { background: "#00b86e", borderColor: "#00b86e" } }}
        width={520}
      >
        <Form form={contactForm} layout="vertical" onFinish={handleUpdateContact}>
          <Form.Item name="clientId" label="Client" rules={[{ required: true, message: "Required" }]}>
            <Select showSearch options={clientOptions}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "Required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: "Required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Phone Number">
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Position">
            <Input />
          </Form.Item>
          <Form.Item name="isPrimaryContact" label="Primary Contact" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── CONTACT DELETE MODAL ── */}
      <Modal
        title="Delete Contact"
        open={contactModal === "delete"}
        onCancel={() => setContactModal(null)}
        onOk={handleDeleteContact}
        okText="Delete"
        okButtonProps={{ danger: true, loading: contactsPending }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete <strong>"{selectedContact?.fullName}"</strong>?</p>
        <p style={{ color: "#888", fontSize: "0.85rem" }}>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default ClientsContactsPage;