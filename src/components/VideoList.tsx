'use client'

import { useState } from 'react'
import { Play, X } from 'lucide-react'

interface VideoItem {
  id: string
  title: string
  durationSeconds: number | null
}

export function VideoList({ items }: { items: VideoItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggle(id: string) {
    if (openId === id) {
      close()
      return
    }
    setOpenId(id)
    setUrl(null)
    setError('')
  }

  function close() {
    setOpenId(null)
    setUrl(null)
    setError('')
  }

  async function loadVideo(itemId: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/content/${itemId}/url`)
      if (!res.ok) throw new Error('Could not load video')
      const data = await res.json()
      setUrl(data.url)
    } catch {
      setError('Failed to load video. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((item) => {
        const isOpen = openId === item.id
        const mins = item.durationSeconds ? Math.floor(item.durationSeconds / 60) : null
        return (
          <div key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              style={{
                width: '100%', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer',
                border: `1px solid ${isOpen ? 'var(--orange)' : 'var(--border)'}`,
                borderRadius: 14, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16,
                background: isOpen ? 'rgba(229,143,63,0.06)' : 'var(--paper)',
              }}
            >
              <span style={{
                width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                background: 'var(--orange)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Play size={20} fill="white" />
              </span>
              <span style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{item.title}</div>
                {mins && <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{mins} min</div>}
              </span>
            </button>

            {isOpen && (
              <div style={{ marginTop: 10, borderRadius: 14, overflow: 'hidden', background: '#000', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--paper)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{item.title}</span>
                  <button
                    onClick={close}
                    aria-label="Close video"
                    style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--fg-2)', display: 'flex', padding: 4 }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {url ? (
                  <video
                    controls
                    autoPlay
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ width: '100%', display: 'block', maxHeight: 480 }}
                    src={url}
                  />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '16 / 9', maxHeight: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                    <button
                      onClick={() => loadVideo(item.id)}
                      disabled={loading}
                      aria-label={`Play ${item.title}`}
                      style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: loading ? 'rgba(255,255,255,0.15)' : 'var(--orange)',
                        color: 'white', border: 0, cursor: loading ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Play size={26} fill="white" />
                    </button>
                    {error && (
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#F0A99A' }}>{error}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
