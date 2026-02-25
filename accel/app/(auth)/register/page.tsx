"use client";

import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import useStyles from './style';

const { Text } = Typography;

const Register = () => {
  const { styles } = useStyles();

  const onFinish = (values: any) => {
    console.log('Success:', values);
    // This is where you'd call your /api/Auth/register endpoint
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
        >
          {/* Name Field */}
          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Name</span>}
            name="firstName"
          >
            <Input className={styles.input} placeholder="Enter your name" />
          </Form.Item>

          {/* Surname Field */}
          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Surname</span>}
            name="lastName"
          >
            <Input className={styles.input} placeholder="Enter your surname" />
          </Form.Item>

          {/* Email Field */}
          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Email</span>}
            name="email"
            rules={[{ type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input className={styles.input} placeholder="Enter your email" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Password</span>}
            name="password"
          >
            <Input.Password className={styles.input} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            
            <Button type="primary" htmlType="submit" className={styles.button}>
              SIGN UP
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;