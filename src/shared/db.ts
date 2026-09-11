import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'levigames-db'
const STORE = 'progress'

let dbPromise: Promise<IDBPDatabase> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
      },
    })
  }
  return dbPromise
}

export async function getStickerCount(gameId: string): Promise<number> {
  try {
    const db = await getDb()
    const value = await db.get(STORE, gameId)
    return typeof value === 'number' ? value : 0
  } catch {
    return 0
  }
}

export async function incrementStickerCount(gameId: string): Promise<number> {
  try {
    const db = await getDb()
    const current = (await db.get(STORE, gameId)) ?? 0
    const next = current + 1
    await db.put(STORE, next, gameId)
    return next
  } catch {
    return 0
  }
}
