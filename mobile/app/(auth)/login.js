import { useState } from 'react'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import AuthScreenLayout from '../../src/components/AuthScreenLayout.js'
import Input from '../../src/components/Input.js'
import Button from '../../src/components/Button.js'
import { useAppTheme } from '../../src/context/ThemeContext.js'
import { useAuth } from '../../src/context/AuthContext.js'
import { useToast } from '../../src/context/ToastContext.js'
import { login, verifyTwoFactorLogin } from '../../src/data/authClient.js'

export default function LoginScreen() {
  const { theme } = useAppTheme()
  const { refresh } = useAuth()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [tempToken, setTempToken] = useState(null)
  const [code, setCode] = useState('')

  const handleLogin = async () => {
    setError('')
    if (!email.trim() || !password) return setError('Email and password are required.')
    setLoading(true)
    try {
      const result = await login({ email: email.trim(), password, remember })
      if (result.requiresTwoFactor) {
        setTempToken(result.tempToken)
      } else {
        await refresh()
        toast.success('Welcome back!')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setError('')
    if (!code.trim()) return setError('Enter the 6-digit code from your authenticator app.')
    setLoading(true)
    try {
      await verifyTwoFactorLogin({ tempToken, code: code.trim() })
      await refresh()
      toast.success('Welcome back!')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (tempToken) {
    return (
      <AuthScreenLayout title="Two-factor verification" subtitle="Enter the 6-digit code from your authenticator app">
        {!!error && <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>}
        <Input label="Verification code" placeholder="123456" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} style={{ marginBottom: 16 }} />
        <Button title={loading ? 'Verifying...' : 'Verify & continue'} onPress={handleVerify} loading={loading} size="lg" />
        <Pressable
          onPress={() => {
            setTempToken(null)
            setCode('')
            setError('')
          }}
          style={{ marginTop: 16, alignItems: 'center' }}
        >
          <Text style={{ color: theme.textMuted, fontSize: 13 }}>Back to log in</Text>
        </Pressable>
      </AuthScreenLayout>
    )
  }

  return (
    <AuthScreenLayout title="Welcome back" subtitle="Log in to continue to your workspace">
      {!!error && <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>}
      <Input label="Email" placeholder="you@company.com" value={email} onChangeText={setEmail} keyboardType="email-address" style={{ marginBottom: 14 }} />
      <Input label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 14 }} />

      <View style={styles.rememberRow}>
        <Pressable onPress={() => setRemember((r) => !r)} style={styles.rememberTouch}>
          <View style={[styles.checkbox, { borderColor: theme.border, backgroundColor: remember ? theme.brand : 'transparent' }]} />
          <Text style={{ color: theme.textMuted, fontSize: 13 }}>Remember me</Text>
        </Pressable>
        <Link href="/(auth)/forgot-password" asChild>
          <Pressable>
            <Text style={{ color: theme.brand, fontSize: 13, fontWeight: '600' }}>Forgot password?</Text>
          </Pressable>
        </Link>
      </View>

      <Button title={loading ? 'Logging in...' : 'Log in'} onPress={handleLogin} loading={loading} size="lg" style={{ marginTop: 18 }} />

      <View style={styles.footerRow}>
        <Text style={{ color: theme.textMuted, fontSize: 13 }}>Don't have an account? </Text>
        <Link href="/(auth)/signup" asChild>
          <Pressable>
            <Text style={{ color: theme.brand, fontSize: 13, fontWeight: '700' }}>Sign up</Text>
          </Pressable>
        </Link>
      </View>
    </AuthScreenLayout>
  )
}

const styles = StyleSheet.create({
  error: { fontSize: 13, marginBottom: 12 },
  rememberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rememberTouch: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1.5 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
})
