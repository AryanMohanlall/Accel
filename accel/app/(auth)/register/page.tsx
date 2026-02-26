"use client";

import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import useStyles from './style';
import { useRouter } from 'next/navigation';
import { useUserActions, useUserState } from '../../providers/userProvider';

const Register = () => {
  const { styles } = useStyles();
  const router = useRouter();
  
  const { register } = useUserActions();
  const { isPending, isSuccess, isError } = useUserState();

  useEffect(() => {
    if (isSuccess) {
      message.success('Account created! Welcome to Accel.');
      router.push('/dashboard');
    }
    if (isError) {
      message.error('Registration failed. Please try again.');
    }
  }, [isSuccess, isError, router]);

  const onFinish = async (values: any) => {
    try {
      await register(values);
    } catch (error: any) {
      const errorData = error.response?.data;
      const msg = errorData?.detail || errorData?.title || 'Registration failed. Please try again.';
      message.error(msg);
    }
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
            label={<span className={styles.label}>First Name</span>}
            name="firstName"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input className={styles.input} placeholder="First Name" />
          </Form.Item>

          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Last Name</span>}
            name="lastName"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input className={styles.input} placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Phone Number</span>}
            name="phoneNumber"
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
            rules={[
              { required: true, message: 'Required' },
              { min: 6, message: 'Minimum 6 characters' }
            ]}
          >
            <Input.Password className={styles.input} placeholder="Password" />
          </Form.Item>

          {/* Creates a new organisation — caller becomes Admin */}
          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Organisation Name</span>}
            name="tenantName"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input className={styles.input} placeholder="Your company name" />
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

          <div style={{ marginTop: '10px', color: '#fff' }}>
            Already have an account? <a href="/login" style={{ color: '#52c41a' }}>Login here</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;