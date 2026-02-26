"use client";

import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import useStyles from "./style";
import { useRouter } from "next/navigation";
import { useUserActions } from "../../providers/userProvider";

const Login = () => {
  const { styles } = useStyles();
  const { login } = useUserActions();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await login(values);
      message.success("Login successful! Redirecting...");
      router.replace("/dashboard");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.title || "Invalid email or password";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.logo}>Accel</h1>

      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input className={styles.input} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              className={styles.input}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.button}
              loading={loading}
            >
              LOG IN
            </Button>
          </Form.Item>

          <div style={{ marginTop: "10px", color: "#fff" }}>
            Don't have an account?{" "}
            <a href="/register" style={{ color: "#52c41a" }}>
              Register here
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
