import { useState } from 'react'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import AuthScreenLayout from '../../src/components/AuthScreenLayout.js'
import Input from '../../src/components/Input.js'
import Button from '../../src/components/Button.js'
import { useAppTheme } from '../../src/context/ThemeContext.js'
import { useAuth } from '../../src/context/AuthContext.js'
import { useToast } from '../../src/context/ToastContext.js'
import { signup } from '../../src/data/authClient.js'

export default function SignupScreen() {
  const { theme } = useAppTheme()
  const { refresh } = useAuth()
  const toast = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!name.trim() || !email.trim() || !password) return setError('All fields are required.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (!agree) return setError('You must accept the terms to continue.')

    setLoading(true)
    try {
      await signup({ name: name.trim(), email: email.trim(), password })
      await refresh()
      toast.success('Account created — welcome to Aivora!')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreenLayout title="Create your account" subtitle="Start using Aivora free">
      {!!error && <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>}
      <Input label="Full name" placeholder="Jane Doe" value={name} onChangeText={setName} style={{ marginBottom: 14 }} />
      <Input label="Email" placeholder="you@company.com" value={email} onChangeText={setEmail} keyboardType="email-address" style={{ marginBottom: 14 }} />
      <Input label="Password" placeholder="At least 8 characters" value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 14 }} />

      <Pressable onPress={() => setAgree((a) => !a)} style={styles.agreeRow}>
        <View style={[styles.checkbox, { borderColor: theme.border, backgroundColor: agree ? theme.brand : 'transparent' }]} />
        <Text style={{ color: theme.textMuted, fontSize: 12, flex: 1 }}>
          I agree to the Terms of Service and Privacy Policy
        </Text>
      </Pressable>

      <Button title={loading ? 'Creating account...' : 'Create account'} onPress={handleSubmit} loading={loading} size="lg" style={{ marginTop: 18 }} />

      <View style={styles.footerRow}>
        <Text style={{ color: theme.textMuted, fontSize: 13 }}>Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text style={{ color: theme.brand, fontSize: 13, fontWeight: '700' }}>Log in</Text>
          </Pressable>
        </Link>
      </View>
    </AuthScreenLayout>
  )
}

const styles = StyleSheet.create({
  error: { fontSize: 13, marginBottom: 12 },
  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 4 },
  checkbox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1.5, marginTop: 2 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
})
