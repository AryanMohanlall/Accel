"use client";

import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import useStyles from './style';
import { useRouter } from 'next/navigation';
import { useUserActions, useUserState } from '../../providers/userProvider';

const Register = () => {
  const { styles } = useStyles();
  const router = useRouter();
  
  // Access Provider State and Actions
  const { register } = useUserActions();
  const { isPending, isSuccess, isError } = useUserState();

  // Unified Side Effects for Auth Status
  useEffect(() => {
    if (isSuccess) {
      message.success('Registration successful! Please log in.');
      router.push('/login');
    }
    if (isError) {
      message.error('Registration failed. Please try again.');
    }
  }, [isSuccess, isError, router]);

  const onFinish = (values: any) => {
    register(values);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.logo}>Accel</h1>
      
      <div className={styles.card}>
        <h2 className={styles.title}>Register</h2>
        
        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          autoComplete="off"
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Name</span>}
            name="firstName"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input className={styles.input} placeholder="First Name" />
          </Form.Item>

          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Surname</span>}
            name="lastName"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input className={styles.input} placeholder="Last Name" />
          </Form.Item>
          
          {/* Add this after LastName and before Email */}
          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Phone Number</span>}
            name="phoneNumber"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input className={styles.input} placeholder="0123456789" />
          </Form.Item>

          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Email</span>}
            name="email"
            rules={[
              { required: true, message: 'Required' },
              { type: 'email', message: 'Invalid email' }
            ]}
          >
            <Input className={styles.input} placeholder="Email Address" />
          </Form.Item>

          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Password</span>}
            name="password"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input.Password className={styles.input} placeholder="Password" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              className={styles.button}
              loading={isPending}
            >
              SIGN UP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;