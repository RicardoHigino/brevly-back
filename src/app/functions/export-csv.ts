import { schema } from "@/infra/db/schemas"
import { db, pg } from "@/infra/db"
import { stringify } from "csv-stringify"
import { PassThrough, Transform } from "node:stream"
import { pipeline } from "node:stream/promises"
import { uploadFileToStorage } from "@/storage/upload-file-to-storage"
import { makeRight } from "@/infra/shared/either"

export const exportCsv = async () => {
  
  const { sql } = db.select().from(schema.encurtedLinks).toSQL()

  const cursor = pg.unsafe(sql).cursor(2)
  
  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'short_url' },
      { key: 'original_url' },
      { key: 'redirect_count' },
      { key: 'created_at' },
    ],
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk)
        }

        callback()
      },
    }),
    csv,
    uploadToStorageStream,
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}-brev-ly.csv`,
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline])

  return makeRight(url)
}