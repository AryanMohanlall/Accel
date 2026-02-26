"use client";

import React, { useEffect, useState } from 'react';
import {
  Button, Input, Empty, Spin, Modal, Form,
  Select, DatePicker, InputNumber, Switch, message,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, CheckOutlined, StopOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import useStyles from './style';
import { useContractState, useContractActions } from '../../providers/contractsProvider';
import { useOpportunityState, useOpportunityActions } from '../../providers/opportunitiesProvider';
import { useUserState } from '../../providers/userProvider';
import { Contract } from '../../providers/contractsProvider/context';
import ContractCard from '@/app/components/contracts/contracts';
import withAuth from '@/app/hoc/withAuth';

const { TextArea } = Input;

const CURRENCY_OPTIONS = [
  { value: 'ZAR', label: 'ZAR' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
];

const ContractsPage = () => {
  const { styles } = useStyles();
  const { contracts, isPending, selected } = useContractState();
  const { fetchContracts, setSelected, createContract, updateContract, activateContract, cancelContract, deleteContract } = useContractActions();
  const { opportunities } = useOpportunityState();
  const { fetchOpportunities } = useOpportunityActions();
  const { user } = useUserState();

  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  useEffect(() => {
    fetchContracts();
    fetchOpportunities();
  }, []);

  const filtered = contracts.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    c.contractNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (contract: Contract) =>
    setSelected(selected?.id === contract.id ? null : contract);

  // --- Create ---
  const handleCreate = async (values: any) => {
    const opp = opportunities.find(o => o.id === values.opportunityId);
    try {
      await createContract({
        opportunityId:       values.opportunityId,
        clientId:            opp?.clientId,
        proposalId:          values.proposalId ?? null,
        title:               values.title,
        contractValue:       values.contractValue,
        currency:            values.currency,
        startDate:           values.startDate?.format('YYYY-MM-DD'),
        endDate:             values.endDate?.format('YYYY-MM-DD'),
        renewalNoticePeriod: values.renewalNoticePeriod,
        autoRenew:           values.autoRenew,
        terms:               values.terms,
        ownerId:             user?.userId ?? null,
      });
      message.success('Contract created');
      setCreateModalOpen(false);
      createForm.resetFields();
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.response?.data?.title ||
        'Failed to create contract'
      );
    }
  };

  // --- Update ---
  const handleOpenUpdate = () => {
    if (!selected) return;
    updateForm.setFieldsValue({
      title:               selected.title,
      contractValue:       selected.contractValue,
      currency:            selected.currency,
      endDate:             selected.endDate ? dayjs(selected.endDate) : undefined,
      renewalNoticePeriod: selected.renewalNoticePeriod,
      autoRenew:           selected.autoRenew,
      terms:               selected.terms,
      ownerId:             selected.ownerId,
    });
    setUpdateModalOpen(true);
  };

  const handleUpdate = async (values: any) => {
    if (!selected) return;
    try {
      await updateContract(selected.id, {
        title:               values.title,
        contractValue:       values.contractValue,
        currency:            values.currency,
        endDate:             values.endDate?.format('YYYY-MM-DD'),
        renewalNoticePeriod: values.renewalNoticePeriod,
        autoRenew:           values.autoRenew,
        terms:               values.terms,
        ownerId:             user?.userId ?? selected.ownerId,
      });
      message.success('Contract updated');
      setUpdateModalOpen(false);
      updateForm.resetFields();
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.response?.data?.title ||
        'Failed to update contract'
      );
    }
  };

  // --- Activate ---
  const handleActivate = async () => {
    if (!selected) return;
    try {
      await activateContract(selected.id);
      message.success(`"${selected.title}" activated`);
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Failed to activate contract'
      );
    }
  };

  // --- Cancel ---
  const handleCancel = async () => {
    if (!selected) return;
    try {
      await cancelContract(selected.id);
      message.success(`"${selected.title}" cancelled`);
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Failed to cancel contract'
      );
    }
  };

  // --- Delete ---
  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteContract(selected.id);
      message.success(`"${selected.title}" deleted`);
      setSelected(null);
      setDeleteModalOpen(false);
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.response?.data?.title ||
        'Failed to delete contract'
      );
    }
  };

  const opportunityOptions = opportunities.map(o => ({ value: o.id, label: o.title }));

  // Status-based button visibility
  const isDraft     = selected?.statusName === 'Draft';
  const isActive    = selected?.statusName === 'Active';
  const isCancelled = selected?.statusName === 'Cancelled';
  

  return (
    <div className={styles.wrapper}>

      {/* GRID */}
      <div className={styles.gridWrapper}>
        {isPending && contracts.length === 0 ? (
          <div className={styles.spinWrapper}><Spin size="large" /></div>
        ) : filtered.length === 0 ? (
          <div className={styles.spinWrapper}><Empty description="No contracts found" /></div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(contract => (
              <ContractCard
                key={contract.id}
                contract={contract}
                styles={styles}
                isSelected={selected?.id === contract.id}
                onClick={() => handleSelect(contract)}
              />
            ))}
          </div>
        )}
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
          className={`${styles.btnAction} ${!selected ? styles.btnDisabled : ''}`}
          disabled={!selected}
          onClick={handleOpenUpdate}
        >
          Update
        </Button>

        {/* Activate — only for Draft contracts */}
        <Button
          icon={<CheckOutlined />}
          className={`${styles.btnAction} ${!isDraft ? styles.btnDisabled : ''}`}
          disabled={!isDraft}
          loading={isPending}
          onClick={handleActivate}
        >
          Activate
        </Button>

        {/* Cancel — only for Active contracts */}
        <Button
          icon={<StopOutlined />}
          className={`${styles.btnAction} ${!isActive ? styles.btnDisabled : ''}`}
          disabled={!isActive}
          loading={isPending}
          onClick={handleCancel}
        >
          Cancel
        </Button>

{
  user?.roles.includes('Admin') &&
        <Button
          icon={<DeleteOutlined />}
          className={`${styles.btnAction} ${!selected ? styles.btnDisabled : ''}`}
          disabled={!selected}
          loading={isPending}
          onClick={() => setDeleteModalOpen(true)}
        >
          Delete
        </Button>
}

        <Input
          placeholder="Search..."
          prefix={<SearchOutlined className={styles.searchIcon} />}
          className={styles.searchInput}
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
        />
      </div>

      {/* CREATE MODAL */}
      <Modal
        title="Create Contract"
        open={createModalOpen}
        onCancel={() => { setCreateModalOpen(false); createForm.resetFields(); }}
        onOk={() => createForm.submit()}
        okText="Create"
        confirmLoading={isPending}
        okButtonProps={{ style: { background: '#00b86e', borderColor: '#00b86e' } }}
        width={620}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ currency: 'ZAR', autoRenew: false, renewalNoticePeriod: 30 }}
        >
          <Form.Item name="opportunityId" label="Opportunity" rules={[{ required: true, message: 'Required' }]}>
            <Select
              showSearch
              placeholder="Select opportunity"
              options={opportunityOptions}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item name="proposalId" label="Proposal ID (optional)">
            <Input placeholder="UUID of linked proposal" />
          </Form.Item>

          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="Contract title" />
          </Form.Item>

          <Form.Item name="contractValue" label="Contract Value" rules={[{ required: true, message: 'Required' }]}>
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0.00" />
          </Form.Item>

          <Form.Item name="currency" label="Currency">
            <Select options={CURRENCY_OPTIONS} />
          </Form.Item>

          <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Required' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'Required' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="renewalNoticePeriod" label="Renewal Notice Period (days)">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item name="autoRenew" label="Auto Renew" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="terms" label="Terms">
            <TextArea rows={3} placeholder="Contract terms..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal
        title={`Update — ${selected?.title ?? ''}`}
        open={updateModalOpen}
        onCancel={() => { setUpdateModalOpen(false); updateForm.resetFields(); }}
        onOk={() => updateForm.submit()}
        okText="Save"
        confirmLoading={isPending}
        okButtonProps={{ style: { background: '#00b86e', borderColor: '#00b86e' } }}
        width={520}
      >
        <Form form={updateForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contractValue" label="Contract Value" rules={[{ required: true, message: 'Required' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="currency" label="Currency">
            <Select options={CURRENCY_OPTIONS} />
          </Form.Item>
          <Form.Item name="endDate" label="End Date">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="renewalNoticePeriod" label="Renewal Notice Period (days)">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="autoRenew" label="Auto Renew" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="terms" label="Terms">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        title="Delete Contract"
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{ danger: true, loading: isPending }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete <strong>"{selected?.title}"</strong>?</p>
        <p style={{ color: '#888', fontSize: '0.85rem' }}>This action cannot be undone.</p>
      </Modal>

    </div>
  );
};

export default withAuth(ContractsPage);
