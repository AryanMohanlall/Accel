"use client";

import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, FileTextOutlined,
} from '@ant-design/icons';
import useStyles from './style';
import { getAxiosInstance } from '@/app/utils/axiosInstance';

interface Proposal {
  id: string;
  proposalNumber: string;
  opportunityTitle: string;
  clientName: string;
  title: string;
  statusName: string;
  status: number;
  totalAmount: number;
  currency: string;
  validUntil: string;
  submittedDate: string;
  createdByName: string;
  lineItemsCount: number;
}

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

const Proposals = () => {
  const { styles } = useStyles();
  const instance = getAxiosInstance();

  const [proposals, setProposals]   = useState<Proposal[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState<Proposal | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await instance.get<Proposal[]>('/api/Proposals');
        setProposals(res.data);
      } catch (e) {
        console.error('Failed to fetch proposals:', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = proposals.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    p.proposalNumber?.toLowerCase().includes(search.toLowerCase())
  );

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
          loading={loading}
          pagination={{ pageSize: 10, size: 'small' }}
          size="small"
          className={styles.table}
          rowClassName={(record) =>
            record.id === selected?.id ? styles.rowSelected : styles.row
          }
          onRow={(record) => ({
            onClick: () => setSelected(prev => prev?.id === record.id ? null : record),
          })}
          scroll={{ y: 'calc(100% - 40px)' }}
        />
      </div>

      {/* ACTION BAR */}
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

export default Proposals;