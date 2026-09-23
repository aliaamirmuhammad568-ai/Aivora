import { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Card from '../../src/components/Card.js'
import Input from '../../src/components/Input.js'
import Button from '../../src/components/Button.js'
import Badge from '../../src/components/Badge.js'
import Modal from '../../src/components/Modal.js'
import LoadingSpinner from '../../src/components/LoadingSpinner.js'
import { useAppTheme } from '../../src/context/ThemeContext.js'
import { useAuth } from '../../src/context/AuthContext.js'
import { useToast } from '../../src/context/ToastContext.js'
import { getNotificationPreferences, updateNotificationPreferences } from '../../src/data/settingsClient.js'
import { changePassword, setupTwoFactor, confirmTwoFactor, disableTwoFactor } from '../../src/data/authClient.js'

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
]

function Toggle({ value, onChange }) {
  const { theme } = useAppTheme()
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={[styles.toggle, { backgroundColor: value ? theme.brand : theme.dark ? '#2a2a3d' : '#e2e8f0' }]}
    >
      <View style={[styles.toggleThumb, { transform: [{ translateX: value ? 20 : 2 }] }]} />
    </Pressable>
  )
}

export default function SettingsScreen() {
  const { theme, scheme, setScheme } = useAppTheme()
  const { user, logout, refresh } = useAuth()
  const toast = useToast()

  const [tab, setTab] = useState('profile')
  const [notifs, setNotifs] = useState(null)
  const [notifsSaving, setNotifsSaving] = useState(false)

  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNext, setPwNext] = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSaving, setPwSaving] = useState(false)

  const [setupData, setSetupData] = useState(null)
  const [setupCode, setSetupCode] = useState('')
  const [setupError, setSetupError] = useState('')
  const [setupLoading, setSetupLoading] = useState(false)

  const [disableOpen, setDisableOpen] = useState(false)
  const [disableValue, setDisableValue] = useState('')
  const [disableError, setDisableError] = useState('')
  const [disableLoading, setDisableLoading] = useState(false)

  useEffect(() => {
    if (tab === 'notifications' && !notifs) {
      getNotificationPreferences().then(setNotifs).catch((err) => toast.error(err.message))
    }
  }, [tab])

  const saveNotifications = async () => {
    setNotifsSaving(true)
    try {
      await updateNotificationPreferences(notifs)
      toast.success('Preferences saved')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setNotifsSaving(false)
    }
  }

  const submitPasswordChange = async () => {
    setPwError('')
    if (pwNext.length < 8) return setPwError('New password must be at least 8 characters.')
    if (pwNext !== pwConfirm) return setPwError('New passwords do not match.')
    setPwSaving(true)
    try {
      await changePassword({ currentPassword: pwCurrent, newPassword: pwNext })
      toast.success('Password updated')
      setPwCurrent('')
      setPwNext('')
      setPwConfirm('')
    } catch (err) {
      setPwError(err.message)
    } finally {
      setPwSaving(false)
    }
  }

  const startSetup = async () => {
    setSetupError('')
    try {
      setSetupData(await setupTwoFactor())
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmSetup = async () => {
    setSetupError('')
    setSetupLoading(true)
    try {
      await confirmTwoFactor(setupCode.trim())
      await refresh()
      toast.success('Two-factor authentication enabled')
      setSetupData(null)
      setSetupCode('')
    } catch (err) {
      setSetupError(err.message)
    } finally {
      setSetupLoading(false)
    }
  }

  const submitDisable = async () => {
    setDisableError('')
    setDisableLoading(true)
    try {
      const payload = user?.provider === 'local' ? { password: disableValue } : { code: disableValue }
      await disableTwoFactor(payload)
      await refresh()
      toast.success('Two-factor authentication disabled')
      setDisableOpen(false)
      setDisableValue('')
    } catch (err) {
      setDisableError(err.message)
    } finally {
      setDisableLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <Text style={[styles.h1, { color: theme.text }]}>Settings</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
        {TABS.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => setTab(t.id)}
            style={[styles.tabChip, { backgroundColor: tab === t.id ? theme.brand : theme.card, borderColor: theme.cardBorder }]}
          >
            <Text style={{ color: tab === t.id ? '#fff' : theme.textMuted, fontSize: 13, fontWeight: '600' }}>{t.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll}>
        {tab === 'profile' && (
          <Card>
            <View style={styles.avatarRow}>
              <View style={[styles.avatar, { backgroundColor: theme.brand }]}>
                <Text style={styles.avatarText}>{(user?.name || 'A').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}</Text>
              </View>
              <View>
                <Text style={{ color: theme.text, fontWeight: '700', fontSize: 15 }}>{user?.name}</Text>
                <Text style={{ color: theme.textMuted, fontSize: 12 }}>{user?.email}</Text>
              </View>
            </View>
            <Badge label={user?.provider === 'local' ? 'Email account' : `Signed in with ${user?.provider}`} tone="brand" />
            <Button title="Log out" variant="danger" onPress={logout} style={{ marginTop: 20 }} />
          </Card>
        )}

        {tab === 'appearance' && (
          <Card>
            <Text style={{ color: theme.text, fontWeight: '700', marginBottom: 12 }}>Theme</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {['dark', 'light'].map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setScheme(s)}
                  style={[styles.themeOption, { borderColor: scheme === s ? theme.brand : theme.cardBorder }]}
                >
                  <View style={[styles.themeSwatch, { backgroundColor: s === 'dark' ? '#0a0a14' : '#f1f5f9' }]} />
                  <Text style={{ color: theme.text, fontSize: 13, textTransform: 'capitalize' }}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </Card>
        )}

        {tab === 'notifications' && (
          <Card>
            <Text style={{ color: theme.text, fontWeight: '700', marginBottom: 12 }}>Notification preferences</Text>
            {!notifs ? (
              <LoadingSpinner />
            ) : (
              <>
                {[
                  ['product', 'Product updates'],
                  ['security', 'Security alerts'],
                  ['marketing', 'Marketing emails'],
                  ['weekly', 'Weekly usage summary'],
                ].map(([key, label]) => (
                  <View key={key} style={styles.notifRow}>
                    <Text style={{ color: theme.text, fontSize: 13 }}>{label}</Text>
                    <Toggle value={notifs[key]} onChange={(v) => setNotifs({ ...notifs, [key]: v })} />
                  </View>
                ))}
                <Button title="Save preferences" onPress={saveNotifications} loading={notifsSaving} style={{ marginTop: 14 }} />
              </>
            )}
          </Card>
        )}

        {tab === 'security' && (
          <View style={{ gap: 14 }}>
            {user?.provider === 'local' ? (
              <Card>
                <Text style={{ color: theme.text, fontWeight: '700', marginBottom: 12 }}>Change password</Text>
                {!!pwError && <Text style={{ color: theme.danger, fontSize: 12, marginBottom: 10 }}>{pwError}</Text>}
                <Input label="Current password" secureTextEntry value={pwCurrent} onChangeText={setPwCurrent} style={{ marginBottom: 12 }} />
                <Input label="New password" secureTextEntry value={pwNext} onChangeText={setPwNext} style={{ marginBottom: 12 }} />
                <Input label="Confirm new password" secureTextEntry value={pwConfirm} onChangeText={setPwConfirm} style={{ marginBottom: 14 }} />
                <Button title="Update password" onPress={submitPasswordChange} loading={pwSaving} />
              </Card>
            ) : (
              <Card>
                <Text style={{ color: theme.text, fontWeight: '700' }}>Password</Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 6 }}>
                  You signed in with {user?.provider}, so there's no password to change.
                </Text>
              </Card>
            )}

            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: theme.text, fontWeight: '700' }}>Two-factor authentication</Text>
                <Badge label={user?.twoFactorEnabled ? 'Enabled' : 'Not enabled'} tone={user?.twoFactorEnabled ? 'green' : 'amber'} />
              </View>
              {user?.twoFactorEnabled ? (
                <Button title="Disable 2FA" variant="secondary" onPress={() => setDisableOpen(true)} style={{ marginTop: 12 }} />
              ) : (
                <Button title="Enable 2FA" variant="secondary" onPress={startSetup} style={{ marginTop: 12 }} />
              )}
            </Card>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={!!setupData}
        onClose={() => {
          setSetupData(null)
          setSetupCode('')
          setSetupError('')
        }}
        title="Set up two-factor authentication"
      >
        {setupData && (
          <ScrollView>
            <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 12 }}>
              Scan with Google Authenticator, Authy, or any TOTP app.
            </Text>
            <Image source={{ uri: setupData.qrCode }} style={{ width: 200, height: 200, alignSelf: 'center', borderRadius: 12 }} />
            <Text style={{ color: theme.textDim, fontSize: 11, textAlign: 'center', marginTop: 12 }}>
              Or enter manually: <Text style={{ fontWeight: '700' }}>{setupData.secret}</Text>
            </Text>
            {!!setupError && <Text style={{ color: theme.danger, fontSize: 12, marginTop: 12 }}>{setupError}</Text>}
            <Input label="6-digit code" value={setupCode} onChangeText={setSetupCode} keyboardType="number-pad" maxLength={6} style={{ marginTop: 14, marginBottom: 14 }} />
            <Button title="Confirm & enable" onPress={confirmSetup} loading={setupLoading} />
          </ScrollView>
        )}
      </Modal>

      <Modal
        visible={disableOpen}
        onClose={() => {
          setDisableOpen(false)
          setDisableValue('')
          setDisableError('')
        }}
        title="Disable two-factor authentication"
      >
        <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 12 }}>
          {user?.provider === 'local' ? 'Enter your password to confirm.' : 'Enter a current authenticator code.'}
        </Text>
        {!!disableError && <Text style={{ color: theme.danger, fontSize: 12, marginBottom: 10 }}>{disableError}</Text>}
        <Input
          label={user?.provider === 'local' ? 'Password' : 'Code'}
          secureTextEntry={user?.provider === 'local'}
          value={disableValue}
          onChangeText={setDisableValue}
          style={{ marginBottom: 14 }}
        />
        <Button title="Disable 2FA" variant="danger" onPress={submitDisable} loading={disableLoading} />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: '800', paddingHorizontal: 16, paddingTop: 16 },
  tabsRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  tabChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1 },
  scroll: { padding: 16, paddingTop: 0 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800' },
  themeOption: { alignItems: 'center', gap: 8, borderWidth: 2, borderRadius: 14, padding: 12, flex: 1 },
  themeSwatch: { width: '100%', height: 40, borderRadius: 8 },
  notifRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(148,163,184,0.15)' },
  toggle: { width: 42, height: 24, borderRadius: 12, padding: 2, justifyContent: 'center' },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
})
