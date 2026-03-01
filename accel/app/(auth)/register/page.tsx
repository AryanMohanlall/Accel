"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Form, Input, Button, message, Select, Spin } from "antd";
import {
  PlusCircleOutlined,
  TeamOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import useStyles from "./style";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserActions, useUserState } from "../../providers/userProvider";

const ROLE_OPTIONS = [
  { value: "SalesRep", label: "Sales Rep" },
  { value: "SalesManager", label: "Sales Manager" },
  { value: "BusinessDevelopmentManager", label: "Business Development Manager" },
];

type Scenario = "new" | "join" | "default";

const SCENARIOS: { value: Scenario; label: string; icon: React.ReactNode }[] = [
  { value: "new", label: "New Organisation", icon: <PlusCircleOutlined /> },
  { value: "join", label: "Join Organisation", icon: <TeamOutlined /> },
  { value: "default", label: "Default Tenant", icon: <AppstoreOutlined /> },
];

// ── Inner component that uses useSearchParams (must be inside Suspense) ──
const RegisterForm = () => {
  const { styles } = useStyles();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useUserActions();
  const { isPending, isSuccess, isError } = useUserState();
  const [form] = Form.useForm();

  const tenantIdFromLink = searchParams.get("tenantId");
  const [scenario, setScenario] = useState<Scenario>(
    tenantIdFromLink ? "join" : "new"
  );

  useEffect(() => {
    if (tenantIdFromLink) {
      form.setFieldsValue({ tenantId: tenantIdFromLink, role: "SalesRep" });
      message.info("Tenant ID pre-filled from your invitation link.");
    }
  }, [tenantIdFromLink, form]);

  useEffect(() => {
    if (isSuccess) {
      message.success("Account created! Welcome to Accel.");
      router.push("/dashboard");
    }
    if (isError) {
      message.error("Registration failed. Please try again.");
    }
  }, [isSuccess, isError, router]);

  const handleScenarioChange = (val: Scenario) => {
    setScenario(val);
    form.resetFields(["tenantName", "tenantId", "role"]);
  };

  const onFinish = async (values: any) => {
    try {
      const payload: any = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      };

      if (scenario === "new") {
        payload.tenantName = values.tenantName;
      } else if (scenario === "join") {
        payload.tenantId = values.tenantId;
        payload.role = values.role;
      } else {
        if (values.role) payload.role = values.role;
      }

      await register(payload);
    } catch (error: any) {
      const errorData = error.response?.data;
      message.error(
        errorData?.detail || errorData?.title || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.logo}>Accel</h1>

      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>

        {/* ── Custom scenario switcher ── */}
        <div className={styles.scenarioSwitcher}>
          {SCENARIOS.map((s) => (
            <div
              key={s.value}
              className={`${styles.scenarioBtn} ${scenario === s.value ? styles.scenarioBtnActive : ""}`}
              onClick={() => handleScenarioChange(s.value)}
            >
              <span className="scenario-icon">{s.icon}</span>
              <span className="scenario-label">{s.label}</span>
            </div>
          ))}
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          autoComplete="off"
          className={styles.form}
        >
          <div className={styles.grid}>
            <Form.Item
              className={styles.gridItem}
              label={<span className={styles.label}>First Name</span>}
              name="firstName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input className={styles.input} placeholder="First Name" />
            </Form.Item>

            <Form.Item
              className={styles.gridItem}
              label={<span className={styles.label}>Last Name</span>}
              name="lastName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input className={styles.input} placeholder="Last Name" />
            </Form.Item>

            <Form.Item
              className={styles.gridItem}
              label={<span className={styles.label}>Email</span>}
              name="email"
              rules={[
                { required: true, message: "Required" },
                { type: "email", message: "Invalid email" },
              ]}
            >
              <Input className={styles.input} placeholder="Email Address" />
            </Form.Item>

            <Form.Item
              className={styles.gridItem}
              label={<span className={styles.label}>Phone Number</span>}
              name="phoneNumber"
            >
              <Input className={styles.input} placeholder="0123456789" />
            </Form.Item>

            <Form.Item
              className={styles.gridItem}
              label={<span className={styles.label}>Password</span>}
              name="password"
              rules={[
                { required: true, message: "Required" },
                { min: 6, message: "Minimum 6 characters" },
              ]}
            >
              <Input.Password className={styles.input} placeholder="Password" />
            </Form.Item>

            <Form.Item
              className={styles.gridItem}
              label={<span className={styles.label}>Confirm Password</span>}
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Required" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value)
                      return Promise.resolve();
                    return Promise.reject("Passwords do not match");
                  },
                }),
              ]}
            >
              <Input.Password className={styles.input} placeholder="Confirm Password" />
            </Form.Item>
          </div>

          {scenario === "new" && (
            <Form.Item
              className={styles.fullItem}
              label={<span className={styles.label}>Organisation Name</span>}
              name="tenantName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input className={styles.input} placeholder="Your company name" />
            </Form.Item>
          )}

          {scenario === "join" && (
            <div className={styles.grid}>
              <Form.Item
                className={styles.gridItem}
                label={<span className={styles.label}>Tenant ID</span>}
                name="tenantId"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input className={styles.input} placeholder="Organisation UUID" />
              </Form.Item>
              <Form.Item
                className={styles.gridItem}
                label={<span className={styles.label}>Role</span>}
                name="role"
                rules={[{ required: true, message: "Required" }]}
                initialValue="SalesRep"
              >
                <Select className={styles.input} options={ROLE_OPTIONS} />
              </Form.Item>
            </div>
          )}

          {scenario === "default" && (
            <Form.Item
              className={styles.fullItem}
              label={<span className={styles.label}>Role (optional)</span>}
              name="role"
              initialValue="SalesRep"
            >
              <Select className={styles.input} options={ROLE_OPTIONS} />
            </Form.Item>
          )}

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

        <div className={styles.footer}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#52c41a" }}>
            Login here
          </a>
        </div>
      </div>
    </div>
  );
};

// ── Page export wraps RegisterForm in Suspense ──
const Register = () => (
  <Suspense fallback={<div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}><Spin size="large" /></div>}>
    <RegisterForm />
  </Suspense>
);

export default Register;