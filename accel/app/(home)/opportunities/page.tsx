"use client";

import React, { useEffect, useState } from 'react';
import { Button, Input, Empty, Spin, Tag, Typography, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import useStyles from './style';
import { getAxiosInstance } from '@/app/utils/axiosInstance';

const { Text, Title } = Typography;

interface Opportunity {
  id: string;
  title: string;
  clientName: string;
  contactName: string | null;
  ownerName: string;
  estimatedValue: number;
  currency: string;
  probability: number;
  stage: number;
  stageName: string;
  expectedCloseDate: string;
  isActive: boolean;
}

interface OpportunitiesResponse {
  items: Opportunity[];
  totalCount: number;
}

const STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation'];

const STAGE_COLORS: Record<string, string> = {
  Lead:        '#6C8EBF',
  Qualified:   '#82B366',
  Proposal:    '#D6B656',
  Negotiation: '#AE4132',
};

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const OpportunityCard = ({
  opportunity,
  styles,
  isSelected,
  onClick,
}: {
  opportunity: Opportunity;
  styles: any;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <div
    className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
    onClick={onClick}
  >
    <div className={styles.cardHeader}>
      <Text className={styles.cardTitle}>{opportunity.title}</Text>
      <Tag className={styles.probabilityTag}>{opportunity.probability}%</Tag>
    </div>

    <Text className={styles.clientName}>{opportunity.clientName}</Text>

    {opportunity.contactName && (
      <div className={styles.cardRow}>
        <UserOutlined className={styles.cardIcon} />
        <Text className={styles.cardMeta}>{opportunity.contactName}</Text>
      </div>
    )}

    <div className={styles.cardRow}>
      <DollarOutlined className={styles.cardIcon} />
      <Text className={styles.cardValue}>
        {formatCurrency(opportunity.estimatedValue, opportunity.currency)}
      </Text>
    </div>

    <div className={styles.cardFooter}>
      <Text className={styles.cardDate}>
        Close: {formatDate(opportunity.expectedCloseDate)}
      </Text>
      <Avatar size={20} className={styles.ownerAvatar}>
        {opportunity.ownerName?.trim()?.[0] ?? '?'}
      </Avatar>
    </div>
  </div>
);

const Opportunities = () => {
  const { styles } = useStyles();
  const instance = getAxiosInstance();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [selected, setSelected]           = useState<Opportunity | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await instance.get<OpportunitiesResponse>('/api/Opportunities');
        setOpportunities(res.data.items);
      } catch (e) {
        console.error('Failed to fetch opportunities:', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = opportunities.filter(o =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const byStage = (stageName: string) =>
    filtered.filter(o => o.stageName === stageName);

  const handleSelect = (opp: Opportunity) =>
    setSelected(prev => prev?.id === opp.id ? null : opp);

  return (
    <div className={styles.wrapper}>

      {/* KANBAN BOARD */}
      <div className={styles.board}>
        {loading ? (
          <div className={styles.spinWrapper}>
            <Spin size="large" />
          </div>
        ) : (
          STAGES.map(stage => (
            <div key={stage} className={styles.column}>
              <div className={styles.columnHeader}>
                <span
                  className={styles.stageIndicator}
                  style={{ background: STAGE_COLORS[stage] }}
                />
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
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      styles={styles}
                      isSelected={selected?.id === opp.id}
                      onClick={() => handleSelect(opp)}
                    />
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
          onClick={() => console.log('Create')}
        >
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
          onClick={() => console.log('Delete', selected)}
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

export default Opportunities;