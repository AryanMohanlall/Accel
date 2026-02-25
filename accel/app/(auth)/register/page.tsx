"use client";

import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import useStyles from './style';
import { getAxiosInstance } from '@/app/utils/axiosInstance';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

const Register = () => {
  const { styles } = useStyles();
  const instance = getAxiosInstance();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    //setLoading(true);

    try {
      const response = await instance.post('/api/Auth/register', values, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200 || response.status === 201) {
        message.success('Registration successful! Please log in.');
        router.replace('/login');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.title || 'There was an error registering!';
      message.error(errorMsg);
      console.error('Registration Error:', error.response?.data || error.message);
    } finally {
      //setLoading(false);
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
        >
          {/* firstName Field */}
          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Name</span>}
            name="firstName"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input className={styles.input} placeholder="Enter your name" />
          </Form.Item>

          {/* lastName Field */}
          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Surname</span>}
            name="lastName"
            rules={[{ required: true, message: 'Please enter your surname' }]}
          >
            <Input className={styles.input} placeholder="Enter your surname" />
          </Form.Item>

          {/* email Field */}
          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Email</span>}
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input className={styles.input} placeholder="Enter your email" />
          </Form.Item>

          {/* password Field */}
          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Password</span>}
            name="password"
            rules={[{ required: true, message: 'Please enter a password' }]}
          >
            <Input.Password className={styles.input} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className={styles.button}
              loading={loading} // Visual feedback during the API call
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