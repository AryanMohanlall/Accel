"use client";

import React, { useEffect, useState } from 'react';
import { Button, Input, Empty, Spin, Tag, Typography, Tooltip, Avatar } from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
  PhoneOutlined, MailOutlined, CalendarOutlined, TeamOutlined,
  FileTextOutlined, AlertOutlined,
} from '@ant-design/icons';
import useStyles from './style';
import { useActivityState, useActivityActions } from '../../providers/activitiesProvider';
import { Activity } from '../../providers/activitiesProvider/context';

const { Text, Title } = Typography;

const TYPE_ICONS: Record<number, React.ReactNode> = {
  1: <PhoneOutlined />,
  2: <MailOutlined />,
  3: <CalendarOutlined />,
  4: <FileTextOutlined />,
  5: <TeamOutlined />,
};

const PRIORITY_COLORS: Record<number, string> = {
  1: '#52c41a',
  2: '#faad14',
  3: '#ff4d4f',
};

const STATUS_COLORS: Record<number, string> = {
  1: 'blue',
  2: 'orange',
  3: 'green',
  4: 'default',
};

const formatDate = (dateStr: string | null) =>
  dateStr ? new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }) : '—';

const ActivityItem = ({
  activity,
  styles,
  isSelected,
  isLast,
  onClick,
}: {
  activity: Activity;
  styles: any;
  isSelected: boolean;
  isLast: boolean;
  onClick: () => void;
}) => (
  <div className={styles.timelineItem} onClick={onClick}>
    {/* LINE */}
    {!isLast && <div className={styles.timelineLine} />}

    {/* DOT */}
    <Tooltip title={activity.typeName}>
      <div className={`${styles.timelineDot} ${isSelected ? styles.timelineDotSelected : ''} ${activity.isOverdue ? styles.timelineDotOverdue : ''}`}>
        <span className={styles.dotIcon}>
          {TYPE_ICONS[activity.type] ?? <FileTextOutlined />}
        </span>
      </div>
    </Tooltip>

    {/* CONTENT */}
    <div className={`${styles.itemContent} ${isSelected ? styles.itemContentSelected : ''}`}>
      <div className={styles.itemHeader}>
        <div className={styles.itemTitleRow}>
          <Title level={5} className={styles.itemTitle}>{activity.subject}</Title>
          <div className={styles.itemTags}>
            <Tag color={STATUS_COLORS[activity.status] ?? 'default'} className={styles.tag}>
              {activity.statusName}
            </Tag>
            {activity.priorityName && (
              <Tag className={styles.tag} style={{ borderColor: PRIORITY_COLORS[activity.priority], color: PRIORITY_COLORS[activity.priority], background: 'transparent' }}>
                {activity.priorityName}
              </Tag>
            )}
            {activity.isOverdue && (
              <Tag icon={<AlertOutlined />} color="error" className={styles.tag}>
                Overdue
              </Tag>
            )}
          </div>
        </div>

        <div className={styles.itemMeta}>
          {activity.relatedToTitle && (
            <Text className={styles.metaText}>
              Re: {activity.relatedToTitle}
            </Text>
          )}
          <Text className={styles.metaText}>
            Due: {formatDate(activity.dueDate)}
          </Text>
          {activity.location && (
            <Text className={styles.metaText}>📍 {activity.location}</Text>
          )}
        </div>
      </div>

      {activity.description && (
        <Text className={styles.itemDescription}>{activity.description}</Text>
      )}

      <div className={styles.itemFooter}>
        <div className={styles.assignee}>
          <Avatar size={18} className={styles.assigneeAvatar}>
            {activity.assignedToName?.trim()?.[0] ?? '?'}
          </Avatar>
          <Text className={styles.assigneeText}>{activity.assignedToName}</Text>
        </div>
        {activity.participantsCount > 0 && (
          <Text className={styles.participants}>
            <TeamOutlined /> {activity.participantsCount}
          </Text>
        )}
        {activity.completedDate && (
          <Text className={styles.completedText}>
            ✓ {formatDate(activity.completedDate)}
          </Text>
        )}
      </div>
    </div>
  </div>
);

const ActivitiesPage = () => {
  const { styles } = useStyles();
  const { activities, isPending, selected } = useActivityState();
  const { fetchActivities, setSelected, deleteActivity } = useActivityActions();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const filtered = activities.filter(a =>
    a.subject?.toLowerCase().includes(search.toLowerCase()) ||
    a.assignedToName?.toLowerCase().includes(search.toLowerCase()) ||
    a.relatedToTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (activity: Activity) =>
    setSelected(selected?.id === activity.id ? null : activity);

  const handleDelete = async () => {
    if (!selected) return;
    await deleteActivity(selected.id);
    setSelected(null);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.timelineWrapper}>
        {isPending && activities.length === 0 ? (
          <div className={styles.centered}><Spin size="large" /></div>
        ) : filtered.length === 0 ? (
          <div className={styles.centered}>
            <Empty description={<span className={styles.emptyText}>No activities found</span>} />
          </div>
        ) : (
          <div className={styles.timeline}>
            {filtered.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                styles={styles}
                isSelected={selected?.id === activity.id}
                isLast={index === filtered.length - 1}
                onClick={() => handleSelect(activity)}
              />
            ))}
          </div>
        )}
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

export default ActivitiesPage;