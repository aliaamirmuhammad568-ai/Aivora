import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useAppTheme } from '../context/ThemeContext.js'

export default function Input({ label, error, secureTextEntry, style, ...props }) {
  const { theme } = useAppTheme()
  const [hidden, setHidden] = useState(secureTextEntry)

  return (
    <View style={style}>
      {label && <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>}
      <View style={styles.row}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              borderColor: error ? theme.danger : theme.border,
              color: theme.text,
              paddingRight: secureTextEntry ? 44 : 14,
            },
          ]}
          placeholderTextColor={theme.textDim}
          secureTextEntry={hidden}
          autoCapitalize="none"
          {...props}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setHidden((h) => !h)} style={styles.eyeButton}>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>{hidden ? 'Show' : 'Hide'}</Text>
          </Pressable>
        )}
      </View>
      {error && <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
  row: { position: 'relative', justifyContent: 'center' },
  input: { borderWidth: 1, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, fontSize: 15 },
  eyeButton: { position: 'absolute', right: 12 },
  error: { fontSize: 12, marginTop: 4 },
})
