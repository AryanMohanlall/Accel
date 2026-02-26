"use client";

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Statistic, Flex, Spin } from 'antd';
import useStyles from './style';
import { getAxiosInstance } from '@/app/utils/axiosInstance';
import withAuth from '@/app/hoc/withAuth';

const { Title, Text } = Typography;

interface DashboardData {
  opportunities: {
    totalCount: number;
    activeCount: number;
    wonCount: number;
    lostCount: number;
    totalValue: number;
    wonValue: number;
    pipelineValue: number;
    winRate: number;
    averageDealSize: number;
    averageSalesCycle: number;
  };
  pipeline: {
    stages: {
      stage: number;
      stageName: string;
      count: number;
      totalValue: number;
      averageProbability: number;
      conversionToNext: number;
    }[];
    conversionRate: number;
    weightedPipelineValue: number;
  };
  activities: {
    totalCount: number;
    upcomingCount: number;
    overdueCount: number;
    completedTodayCount: number;
    completedThisWeekCount: number;
    byType: Record<string, number>;
  };
  contracts: {
    totalActiveCount: number;
    expiringThisMonthCount: number;
    expiringThisQuarterCount: number;
    totalContractValue: number;
    averageContractValue: number;
  };
  revenue: {
    thisMonth: number;
    thisQuarter: number;
    thisYear: number;
    projectedThisMonth: number;
    projectedThisQuarter: number;
    projectedThisYear: number;
    monthlyTrend: {
      year: number;
      month: number;
      monthName: string;
      actual: number;
      projected: number;
    }[];
  };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const VISIBLE_STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation'];

const Dashboard = () => {
  const { styles } = useStyles();
  const instance = getAxiosInstance();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await instance.get('/api/dashboard/overview');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className={`${styles.glassPanel} ${styles.centered}`}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`${styles.glassPanel} ${styles.centered}`}>
        <Text className={styles.errorText}>Failed to load dashboard data.</Text>
      </div>
    );
  }

  const visibleStages = data.pipeline.stages.filter(s =>
    VISIBLE_STAGES.includes(s.stageName)
  );

  const revenueItems = [
    { label: 'Projected (Year)',     value: data.revenue.projectedThisYear },
    { label: 'Projected (Quarter)',  value: data.revenue.projectedThisQuarter },
    { label: 'Contracts Value',      value: data.contracts.totalContractValue },
    { label: 'Weighted Pipeline',    value: data.pipeline.weightedPipelineValue },
  ];

  return (
    <div className={styles.glassPanel}>

      {/* 3. SUMMARY TILES */}
      <Row gutter={[15, 0]} >
        <Col span={6}>
          <div className={styles.summaryTile}>
            <Statistic title="Active Deals" value={data.opportunities.activeCount} />
          </div>
        </Col>
        <Col span={6}>
          <div className={styles.summaryTile}>
            <Statistic title="Active Contracts" value={data.contracts.totalActiveCount} />
          </div>
        </Col>
        <Col span={6}>
          <div className={styles.summaryTile}>
            <Statistic title="Weekly Tasks" value={data.activities.completedThisWeekCount} />
          </div>
        </Col>
        <Col span={6}>
          <div className={styles.summaryTileHighlight}>
            <Statistic title="Win Rate" value={data.opportunities.winRate} suffix="%" />
          </div>
        </Col>
      </Row>

      {/* 1. PIPELINE */}
      <Card className={styles.sectionCard} variant="borderless">
        <Title level={5} className={styles.sectionTitle}>Pipeline</Title>
        <Row gutter={[12, 0]}>
          {visibleStages.map((s) => (
            <Col span={6} key={s.stage}>
              <div className={styles.statBox}>
                <Statistic
                  title={<Text className={styles.statBoxLabel}>{s.stageName}</Text>}
                  value={s.count}
                  styles={{ content: { color: '#fff', fontSize: '1.4rem', fontWeight: 600 } }}
                />
                <Text className={styles.statBoxValue}>
                  {formatCurrency(s.totalValue)}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 2. REVENUE */}
      <Card className={styles.sectionCard} variant="borderless">
        <Title level={5} className={styles.sectionTitle}>Revenue</Title>
        <Row gutter={[12, 0]}>
          {revenueItems.map((item) => (
            <Col span={6} key={item.label}>
              <Flex align="center" justify="center" className={styles.revenueBox}>
                <Statistic
                  title={<span className={styles.revenueLabel}>{item.label}:</span>}
                  value={item.value}
                  prefix="$"
                  styles={{ content: { color: '#fff', fontSize: '0.9rem', fontWeight: 700, marginLeft: 4 } }}
                />
              </Flex>
            </Col>
          ))}
        </Row>
      </Card>

    </div>
  );
};

export default withAuth(Dashboard);