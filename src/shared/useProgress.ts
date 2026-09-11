import { useCallback, useEffect, useState } from 'react'
import { getStickerCount, incrementStickerCount } from './db'

/** Reads/writes a simple sticker count per game to IndexedDB. */
export function useProgress(gameId: string) {
  const [stickers, setStickers] = useState(0)

  useEffect(() => {
    let cancelled = false
    getStickerCount(gameId).then((count) => {
      if (!cancelled) setStickers(count)
    })
    return () => {
      cancelled = true
    }
  }, [gameId])

  const addSticker = useCallback(async () => {
    const next = await incrementStickerCount(gameId)
    setStickers(next)
  }, [gameId])

  return { stickers, addSticker }
}
