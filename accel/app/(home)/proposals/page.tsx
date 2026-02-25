"use client";

import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons';
import useStyles from './style';
import { useProposalState, useProposalActions } from '../../providers/proposalsProvider';
import { Proposal } from '../../providers/proposalsProvider/context';

const STATUS_COLORS: Record<number, string> = {
  1: 'blue',
  2: 'orange',
  3: 'green',
  4: 'red',
};

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);

const formatDate = (dateStr: string | null) =>
  dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const ProposalsPage = () => {
  const { styles } = useStyles();
  const { proposals, isPending, selected } = useProposalState();
  const { fetchProposals, setSelected, deleteProposal } = useProposalActions();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProposals();
  }, []);

  const filtered = proposals.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    p.proposalNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (record: Proposal) =>
    setSelected(selected?.id === record.id ? null : record);

  const handleDelete = async () => {
    if (!selected) return;
    await deleteProposal(selected.id);
    setSelected(null);
  };

  const columns: ColumnsType<Proposal> = [
    {
      title: '#',
      dataIndex: 'proposalNumber',
      key: 'proposalNumber',
      width: 110,
      render: (val: string) => (
        <span className={styles.proposalNumber}>
          <FileTextOutlined className={styles.proposalIcon} /> {val}
        </span>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (val: string) => <span className={styles.titleCell}>{val}</span>,
    },
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (val: string) => <span className={styles.clientCell}>{val}</span>,
    },
    {
      title: 'Opportunity',
      dataIndex: 'opportunityTitle',
      key: 'opportunityTitle',
      render: (val: string) => <span className={styles.mutedCell}>{val}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (_: any, record: Proposal) => (
        <Tag color={STATUS_COLORS[record.status] ?? 'default'} className={styles.statusTag}>
          {record.statusName}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      render: (val: number, record: Proposal) => (
        <span className={styles.amountCell}>{formatCurrency(val, record.currency)}</span>
      ),
    },
    {
      title: 'Line Items',
      dataIndex: 'lineItemsCount',
      key: 'lineItemsCount',
      width: 90,
      align: 'center',
      render: (val: number) => <span className={styles.badgeCell}>{val}</span>,
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      width: 120,
      render: (val: string) => <span className={styles.dateCell}>{formatDate(val)}</span>,
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
      width: 120,
      render: (val: string) => <span className={styles.dateCell}>{formatDate(val)}</span>,
    },
    {
      title: 'Created By',
      dataIndex: 'createdByName',
      key: 'createdByName',
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
          pagination={{ pageSize: 10, size: 'small' }}
          size="small"
          className={styles.table}
          rowClassName={(record) =>
            record.id === selected?.id ? styles.rowSelected : styles.row
          }
          onRow={(record) => ({ onClick: () => handleSelect(record) })}
          scroll={{ y: 'calc(100% - 40px)' }}
        />
      </div>

      <div className={styles.actionBar}>
        <Button icon={<PlusOutlined />} className={styles.btnCreate}>
          Create
        </Button>
        <Button
          icon={<EditOutlined />}
          className={`${styles.btnAction} ${!selected ? styles.btnDisabled : ''}`}
          disabled={!selected}
        >
          Update
        </Button>
        <Button
          icon={<DeleteOutlined />}
          className={`${styles.btnAction} ${!selected ? styles.btnDisabled : ''}`}
          disabled={!selected}
          loading={isPending}
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined className={styles.searchIcon} />}
          className={styles.searchInput}
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
        />
      </div>
    </div>
  );
};

export default ProposalsPage;