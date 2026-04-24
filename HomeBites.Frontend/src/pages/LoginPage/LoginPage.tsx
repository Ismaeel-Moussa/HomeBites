import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Form, Input, Button, Alert } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import axios from 'axios'
import { loginApi } from '../api/auth'
import type { LoginRequest, ApiError } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import styles from './LoginPage.module.scss'

// ── Error helper ───────────────────────────────────────────────────────────

function resolveErrorMessage(err: unknown): { banner?: string; field?: 'email' | 'password' } {
  if (axios.isAxiosError(err)) {
    const code = (err.response?.data as ApiError)?.code
    if (code === 'invalid_credentials') {
      return { banner: 'Incorrect email or password. Please try again.' }
    }
    if (code === 'not_family_user') {
      return { banner: 'This account is not a family account.' }
    }
    const msg = (err.response?.data as ApiError)?.message
    if (msg) return { banner: msg }
  }
  return { banner: 'Something went wrong. Please try again.' }
}

// ── Component ──────────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form] = Form.useForm<LoginRequest>()
  const [bannerError, setBannerError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(
    (location.state as { message?: string })?.message || null
  )

  // Clear success message when user starts typing or after some time
  const clearStatus = () => {
    if (bannerError) setBannerError(null)
    if (successMsg) setSuccessMsg(null)
  }
  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data)
      navigate('/dashboard/menu', { replace: true })
    },
    onError: (err) => {
      const { banner } = resolveErrorMessage(err)
      setBannerError(banner ?? null)
    },
  })

  const onFinish = (values: LoginRequest) => {
    setBannerError(null)
    mutation.mutate(values)
  }

  return (
    <div className={styles.page}>
      {/* ── Left hero panel ── */}
      <div className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.logoMark}>🍽️</span>
          <h1 className={styles.heroTitle}>HomeBites</h1>
          <p className={styles.heroTagline}>
            Home-cooked meals,<br />delivered with love.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSubtitle}>Sign in to your family account</p>
          </div>

          {successMsg && (
            <Alert
              type="success"
              message={successMsg}
              showIcon
              closable={{ onClose: () => setSuccessMsg(null) }}
              className={styles.successBanner}
              style={{ marginBottom: '1.5rem' }}
            />
          )}

          {bannerError && (
            <Alert
              type="error"
              message={bannerError}
              showIcon
              closable={{ onClose: () => setBannerError(null) }}
              className={styles.errorBanner}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={clearStatus}
            requiredMark={false}
            className={styles.form}
          >
            <Form.Item
              name="email"
              label="Email address"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Enter a valid email address' },
              ]}
            >
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                size="large"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
              style={{ marginBottom: '0.5rem' }}
            >
              <Input.Password
                id="login-password"
                placeholder="••••••••"
                size="large"
                autoComplete="current-password"
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <div className={styles.forgotRow}>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <Form.Item style={{ marginTop: '1.5rem', marginBottom: 0 }}>
              <Button
                id="login-submit"
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={mutation.isPending}
                className={styles.submitBtn}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or</span>
            <span className={styles.dividerLine} />
          </div>

          <p className={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.footerLink}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
