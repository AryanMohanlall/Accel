"use client";

import React, { useEffect } from 'react';
import { Button, Input, Empty, Spin, Tag, Typography, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import useStyles from './style';
import { useOpportunityState, useOpportunityActions } from '../../providers/opportunitiesProvider';
import { useState } from 'react';

const { Text, Title } = Typography;

const STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation'];
const STAGE_COLORS: Record<string, string> = {
  Lead:        '#6C8EBF',
  Qualified:   '#82B366',
  Proposal:    '#D6B656',
  Negotiation: '#AE4132',
};

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const OpportunitiesPage = () => {
  const { styles } = useStyles();
  const { opportunities, isPending, selected } = useOpportunityState();
  const { fetchOpportunities, setSelected, deleteOpportunity } = useOpportunityActions();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const filtered = opportunities.filter(o =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const byStage = (stageName: string) => filtered.filter(o => o.stageName === stageName);

  const handleSelect = (id: string) => {
    const opp = opportunities.find(o => o.id === id) ?? null;
    setSelected(selected?.id === id ? null : opp);
  };

  const handleDelete = async () => {
    if (!selected) return;
    await deleteOpportunity(selected.id);
    setSelected(null);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.board}>
        {isPending && opportunities.length === 0 ? (
          <div className={styles.spinWrapper}><Spin size="large" /></div>
        ) : (
          STAGES.map(stage => (
            <div key={stage} className={styles.column}>
              <div className={styles.columnHeader}>
                <span className={styles.stageIndicator} style={{ background: STAGE_COLORS[stage] }} />
                <Title level={5} className={styles.columnTitle}>{stage}</Title>
                <span className={styles.columnCount}>{byStage(stage).length}</span>
              </div>
              <div className={styles.columnBody}>
                {byStage(stage).length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span className={styles.emptyText}>No opportunities</span>}
                    className={styles.empty}
                  />
                ) : (
                  byStage(stage).map(opp => (
                    <div
                      key={opp.id}
                      className={`${styles.card} ${selected?.id === opp.id ? styles.cardSelected : ''}`}
                      onClick={() => handleSelect(opp.id)}
                    >
                      <div className={styles.cardHeader}>
                        <Text className={styles.cardTitle}>{opp.title}</Text>
                        <Tag className={styles.probabilityTag}>{opp.probability}%</Tag>
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
                        <Text className={styles.cardValue}>{formatCurrency(opp.estimatedValue, opp.currency)}</Text>
                      </div>
                      <div className={styles.cardFooter}>
                        <Text className={styles.cardDate}>Close: {formatDate(opp.expectedCloseDate)}</Text>
                        <Avatar size={20} className={styles.ownerAvatar}>
                          {opp.ownerName?.trim()?.[0] ?? '?'}
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

      <div className={styles.actionBar}>
        <Button icon={<PlusOutlined />} className={styles.btnCreate} onClick={() => console.log('Create')}>
          Create
        </Button>
        <Button
          icon={<EditOutlined />}
          className={`${styles.btnAction} ${!selected ? styles.btnDisabled : ''}`}
          disabled={!selected}
          onClick={() => console.log('Update', selected)}
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

export default OpportunitiesPage;