"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Select, Segmented } from "antd";
import useStyles from "./style";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserActions, useUserState } from "../../providers/userProvider";

const ROLE_OPTIONS = [
  { value: "SalesRep", label: "Sales Rep" },
  { value: "SalesManager", label: "Sales Manager" },
  {
    value: "BusinessDevelopmentManager",
    label: "Business Development Manager",
  },
];

type Scenario = "new" | "join" | "default";

const SCENARIO_OPTIONS = [
  { label: "New Organisation", value: "new" },
  { label: "Join Organisation", value: "join" },
  { label: "Default Tenant", value: "default" },
];

const Register = () => {
  const { styles } = useStyles();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useUserActions();
  const { isPending, isSuccess, isError } = useUserState();
  const [scenario, setScenario] = useState<Scenario>("new");
  const [form] = Form.useForm();

  // Pre-populate from invite link (?tenantId=...)
  useEffect(() => {
    const tenantIdFromLink = searchParams.get("tenantId");
    if (tenantIdFromLink) {
      setScenario("join");
      form.setFieldsValue({ tenantId: tenantIdFromLink, role: "SalesRep" });
      message.info("Tenant ID pre-filled from your invitation link.");
    }
  }, [searchParams, form]);

  useEffect(() => {
    if (isSuccess) {
      message.success("Account created! Welcome to Accel.");
      router.push("/dashboard");
    }
    if (isError) {
      message.error("Registration failed. Please try again.");
    }
  }, [isSuccess, isError, router]);

  // Clear scenario-specific fields when switching
  const handleScenarioChange = (val: any) => {
    setScenario(val as Scenario);
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
      const msg =
        errorData?.detail ||
        errorData?.title ||
        "Registration failed. Please try again.";
      message.error(msg);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.logo}>Accel</h1>

      <div className={styles.card}>
        <h2 className={styles.title}>Create Account</h2>

        {/* Scenario selector */}
        <Segmented
          options={SCENARIO_OPTIONS}
          value={scenario}
          onChange={handleScenarioChange}
          style={{ marginBottom: 24, width: "100%" }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          autoComplete="off"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* ── Always shown ── */}
          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>First Name</span>}
            name="firstName"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input className={styles.input} placeholder="First Name" />
          </Form.Item>

          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Last Name</span>}
            name="lastName"
            rules={[{ required: true, message: "Required" }]}
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
              { required: true, message: "Required" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input className={styles.input} placeholder="Email Address" />
          </Form.Item>

          <Form.Item
            className={styles.formItem}
            label={<span className={styles.label}>Password</span>}
            name="password"
            rules={[
              { required: true, message: "Required" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password className={styles.input} placeholder="Password" />
          </Form.Item>

          {/* ── Scenario A: New Organisation ── */}
          {scenario === "new" && (
            <Form.Item
              className={styles.formItem}
              label={<span className={styles.label}>Organisation Name</span>}
              name="tenantName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input className={styles.input} placeholder="Your company name" />
            </Form.Item>
          )}

          {/* ── Scenario B: Join Organisation ── */}
          {scenario === "join" && (
            <>
              <Form.Item
                className={styles.formItem}
                label={<span className={styles.label}>Tenant ID</span>}
                name="tenantId"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  className={styles.input}
                  placeholder="Organisation Tenant ID (UUID)"
                />
              </Form.Item>
              <Form.Item
                className={styles.formItem}
                label={<span className={styles.label}>Role</span>}
                name="role"
                rules={[{ required: true, message: "Required" }]}
                initialValue="SalesRep"
              >
                <Select className={styles.input} options={ROLE_OPTIONS} />
              </Form.Item>
            </>
          )}

          {/* ── Scenario C: Default Tenant ── */}
          {scenario === "default" && (
            <Form.Item
              className={styles.formItem}
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

          <div style={{ marginTop: "10px", color: "#fff" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#52c41a" }}>
              Login here
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;