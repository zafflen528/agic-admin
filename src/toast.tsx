import { useEffect, useRef, useSyncExternalStore } from 'react'

type Kind = 'ok' | 'error'
type Toast = { id: number; text: string; kind: Kind }

// Module-level store so any handler can call toast()/confirmDialog() without
// threading a provider through every tab.
let toasts: Toast[] = []
let ask: { message: string; confirmLabel: string; resolve: (ok: boolean) => void } | null = null
let version = 0

const listeners = new Set<() => void>()
const emit = () => {
  version++
  listeners.forEach(l => l())
}
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

let nextId = 1

export function toast(text: string, kind: Kind = 'ok') {
  const id = nextId++
  toasts = [...toasts, { id, text, kind }]
  emit()
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id)
    emit()
  }, kind === 'error' ? 6000 : 3000)
}

/** Resolves true if the user confirms, false on cancel or Esc. */
export const confirmDialog = (message: string, confirmLabel = 'Delete') =>
  new Promise<boolean>(resolve => {
    ask = { message, confirmLabel, resolve }
    emit()
  })

function answer(ok: boolean) {
  if (!ask) return
  ask.resolve(ok)
  ask = null
  emit()
}

const btn = {
  padding: '9px 16px',
  borderRadius: 6,
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
} as const

export function Toaster() {
  useSyncExternalStore(subscribe, () => version)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (ask && !d.open) d.showModal()
    if (!ask && d.open) d.close()
  })

  return (
    <>
      <dialog
        ref={dialog}
        onClose={() => answer(false)}
        style={{
          border: 'none',
          borderRadius: 10,
          padding: 24,
          maxWidth: 400,
          fontFamily: 'inherit',
          color: 'oklch(20% 0.01 260)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 20 }}>{ask?.message}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={() => answer(false)}
            style={{
              ...btn,
              background: 'transparent',
              border: '1px solid oklch(85% 0.01 260)',
              color: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            autoFocus
            onClick={() => answer(true)}
            style={{ ...btn, background: 'oklch(52% 0.17 30)', color: '#fff', border: 'none' }}
          >
            {ask?.confirmLabel}
          </button>
        </div>
      </dialog>

      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 100,
        }}
      >
        {toasts.map(t => (
          <div
            key={t.id}
            role="status"
            style={{
              background: t.kind === 'error' ? 'oklch(96% 0.04 30)' : '#fff',
              border: `1px solid ${
                t.kind === 'error' ? 'oklch(80% 0.09 30)' : 'oklch(88% 0.008 260)'
              }`,
              color: t.kind === 'error' ? 'oklch(40% 0.15 30)' : 'oklch(20% 0.01 260)',
              borderRadius: 8,
              padding: '12px 16px',
              fontSize: 14,
              fontWeight: 600,
              maxWidth: 340,
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            }}
          >
            {t.kind === 'ok' ? '✓ ' : ''}
            {t.text}
          </div>
        ))}
      </div>
    </>
  )
}
