"use client";

import React, { useEffect, useState } from 'react';
import { Button, Input, Empty, Spin, Tag, Typography, Tooltip } from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, CheckCircleFilled, CloseCircleFilled,
  FileProtectOutlined,
} from '@ant-design/icons';
import useStyles from './style';
import { useContractState, useContractActions } from '../../providers/contractsProvider';
import { Contract } from '../../providers/contractsProvider/context';
import ContractCard from '@/app/components/contracts/contracts';



const ContractsPage = () => {
  const { styles } = useStyles();
  const { contracts, isPending, selected } = useContractState();
  const { fetchContracts, setSelected, deleteContract } = useContractActions();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchContracts();
  }, []);

  const filtered = contracts.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    c.contractNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (contract: Contract) =>
    setSelected(selected?.id === contract.id ? null : contract);

  const handleDelete = async () => {
    if (!selected) return;
    await deleteContract(selected.id);
    setSelected(null);
  };

  return (
    <div className={styles.wrapper}>

      {/* GRID */}
      <div className={styles.gridWrapper}>
        {isPending && contracts.length === 0 ? (
          <div className={styles.spinWrapper}>
            <Spin size="large" />
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.spinWrapper}>
            <Empty description="No contracts found" />
          </div>
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

export default ContractsPage;