import { useState, useRef, useCallback, useEffect } from "react"

export function useSpeech() {
  const [muted, setMuted] = useState(false)
  const [supported, setSupported] = useState(false)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const mutedRef = useRef(false)

  useEffect(() => { mutedRef.current = muted }, [muted])

  useEffect(() => {
    if (!("speechSynthesis" in window)) return
    setSupported(true)

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      if (!voices.length) return

      // Magyar hang keresés
      const hu = voices.find(v => v.lang.startsWith("hu"))
      if (hu) { voiceRef.current = hu; return }

      // Fallback: bármilyen elérhető hang
      voiceRef.current = voices[0] ?? null
    }

    pickVoice()
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice)
    return () => window.speechSynthesis.removeEventListener("voiceschanged", pickVoice)
  }, [])

  const speak = useCallback((text: string) => {
    if (!supported || mutedRef.current) return
    window.speechSynthesis.cancel()

    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = voiceRef.current?.lang ?? "hu-HU"
    utt.voice = voiceRef.current
    utt.rate = 1.0
    utt.pitch = 1.0
    utt.volume = 1.0
    window.speechSynthesis.speak(utt)
  }, [supported])

  const toggleMute = useCallback(() => {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel()
    setMuted(prev => !prev)
  }, [])

  return { speak, muted, toggleMute, supported }
}
