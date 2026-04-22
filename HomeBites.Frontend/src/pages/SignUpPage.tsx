import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Form, Input, Button, Alert, Upload, message as antMessage } from 'antd'
import { UploadOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import axios from 'axios'
import { registerFamilyApi } from '../api/auth'
import type { RegisterFamilyRequest, ApiError } from '../api/auth'
import styles from './SignUpPage.module.scss'

// ── Form values type ───────────────────────────────────────────────────────

interface SignUpFormValues {
  name: string
  email: string
  whatsAppNumber: string
  location?: string
  bio?: string
  password: string
  confirmPassword: string
}

// ── Error helper ───────────────────────────────────────────────────────────

function resolveErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiError
    if (data?.code === 'email_in_use') return 'This email is already registered. Try signing in.'
    if (data?.errors?.length) return data.errors.join(' ')
    if (data?.message) return data.message
  }
  return 'Something went wrong. Please try again.'
}

// ── Component ──────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm<SignUpFormValues>()
  const [bannerError, setBannerError] = useState<string | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const mutation = useMutation({
    mutationFn: registerFamilyApi,
    onSuccess: () => {
      navigate('/login', { 
        replace: true, 
        state: { message: 'Account created! Your kitchen is ready. Please sign in.' } 
      })
    },
    onError: (err) => {
      setBannerError(resolveErrorMessage(err))
    },
  })

  const onFinish = (values: SignUpFormValues) => {
    setBannerError(null)
    const payload: RegisterFamilyRequest = {
      name: values.name,
      email: values.email,
      password: values.password,
      whatsAppNumber: values.whatsAppNumber,
      location: values.location,
      bio: values.bio,
      profileImage: fileList[0]?.originFileObj as File | undefined,
    }
    mutation.mutate(payload)
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
        <div className={styles.inner}>
          {/* ── Page Header ── */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Join HomeBites</h1>
            <p className={styles.pageSubtitle}>Register as a family cook and start sharing your meals</p>
          </div>

          {/* ── Card ── */}
          <div className={styles.card}>
            {bannerError && (
              <Alert
                type="error"
                title={bannerError}
                showIcon
                closable={{ onClose: () => setBannerError(null) }}
                className={styles.errorBanner}
              />
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              scrollToFirstError
              className={styles.form}
            >
              {/* ── Row 1: Name + Email ── */}
              <div className={styles.row2}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Full name is required' }]}
                >
                  <Input id="signup-name" placeholder="Your family or kitchen name" size="large" autoComplete="name" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Email is required' },
                    { type: 'email', message: 'Enter a valid email' },
                  ]}
                >
                  <Input id="signup-email" type="email" placeholder="you@example.com" size="large" autoComplete="email" />
                </Form.Item>
              </div>

              {/* ── WhatsApp ── */}
              <Form.Item
                name="whatsAppNumber"
                label="WhatsApp Number"
                rules={[
                  { required: true, message: 'WhatsApp number is required' },
                  {
                    pattern: /^\+?\d{7,15}$/,
                    message: 'Enter a valid phone number (e.g. +966 5X XXX XXXX)',
                  },
                ]}
              >
                <Input
                  id="signup-whatsapp"
                  placeholder="+90 5XX XXX XX XX"
                  size="large"
                  autoComplete="tel"
                  prefix={<span className={styles.waPrefix}>📱</span>}
                />
              </Form.Item>

              {/* ── Row 2: Location + Profile Photo ── */}
              <div className={styles.row2}>
                <Form.Item name="location" label={<>Location <span className={styles.optional}>(optional)</span></>}>
                  <Input id="signup-location" placeholder="İstanbul, Beşiktaş" size="large" autoComplete="address-level2" />
                </Form.Item>

                <Form.Item label={<>Profile Photo <span className={styles.optional}>(optional)</span></>}>
                  <Upload
                    id="signup-photo"
                    accept="image/jpeg,image/png,image/webp"
                    maxCount={1}
                    fileList={fileList}
                    beforeUpload={() => false}
                    onChange={({ fileList: fl }) => setFileList(fl)}
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />} size="large" className={styles.uploadBtn}>
                      Choose photo
                    </Button>
                  </Upload>
                </Form.Item>
              </div>

              {/* ── Bio ── */}
              <Form.Item name="bio" label={<>About your kitchen <span className={styles.optional}>(optional)</span></>}>
                <Input.TextArea
                  id="signup-bio"
                  placeholder="Tell families about your cooking style, specialties, and what makes your meals special…"
                  rows={3}
                  size="large"
                  style={{ resize: 'none' }}
                />
              </Form.Item>

              {/* ── Row 3: Password + Confirm ── */}
              <div className={styles.row2}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Password is required' },
                    { min: 8, message: 'Must be at least 8 characters' },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    id="signup-password"
                    placeholder="••••••••"
                    size="large"
                    autoComplete="new-password"
                    iconRender={(v) => (v ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Please confirm your password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('Passwords do not match'))
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    id="signup-confirm-password"
                    placeholder="••••••••"
                    size="large"
                    autoComplete="new-password"
                    iconRender={(v) => (v ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
              </div>

              {/* ── Submit ── */}
              <Form.Item style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                <Button
                  id="signup-submit"
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={mutation.isPending}
                  className={styles.submitBtn}
                >
                  Create Account
                </Button>
              </Form.Item>
            </Form>

            <p className={styles.footer}>
              Already have an account?{' '}
              <Link to="/login" className={styles.footerLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
