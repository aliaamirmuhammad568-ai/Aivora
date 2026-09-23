import { useState } from 'react'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text } from 'react-native'
import AuthScreenLayout from '../../src/components/AuthScreenLayout.js'
import Input from '../../src/components/Input.js'
import Button from '../../src/components/Button.js'
import { useAppTheme } from '../../src/context/ThemeContext.js'
import { forgotPassword } from '../../src/data/authClient.js'

export default function ForgotPasswordScreen() {
  const { theme } = useAppTheme()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!email.trim()) return setError('Email is required.')
    setLoading(true)
    try {
      await forgotPassword({ email: email.trim() })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthScreenLayout title="Check your inbox" subtitle={`If an account exists for ${email}, you'll receive a reset link shortly.`}>
        <Link href="/(auth)/login" asChild>
          <Button title="Back to log in" variant="secondary" size="lg" />
        </Link>
      </AuthScreenLayout>
    )
  }

  return (
    <AuthScreenLayout title="Reset your password" subtitle="We'll email you a link to reset your password">
      {!!error && <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>}
      <Input label="Email" placeholder="you@company.com" value={email} onChangeText={setEmail} keyboardType="email-address" style={{ marginBottom: 16 }} />
      <Button title={loading ? 'Sending...' : 'Send reset link'} onPress={handleSubmit} loading={loading} size="lg" />
      <Link href="/(auth)/login" asChild>
        <Pressable style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: theme.brand, fontSize: 13, fontWeight: '600' }}>Back to log in</Text>
        </Pressable>
      </Link>
    </AuthScreenLayout>
  )
}

const styles = StyleSheet.create({
  error: { fontSize: 13, marginBottom: 12 },
})
