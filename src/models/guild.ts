import { Schema, Document, model } from "mongoose"

export type IGuild = Document & {
  guild_id: string
  broadcast_channel: string
  max_fighters: number
}

export const GuildSchema = new Schema<IGuild>({
  guild_id: { type: String },
  broadcast_channel: { type: String },
  max_fighters: { type: Number, default: 10 }
})

const Guild = model<IGuild>('Guild', GuildSchema)

export default Guild
