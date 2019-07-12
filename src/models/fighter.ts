import { Schema, Document, model } from "mongoose"

export type IFighter = Document & {
  name: string
  emoji_id: string
  damage: number
  health_points: number
  guild: string
}

export const FighterSchema = new Schema<IFighter>({
  emoji_id: { type: String },
  name: { type: String },
  damage: { type: Number },
  health_points: { type: Number },
  guild: { type: String }
})

const Fighter = model<IFighter>('Fighter', FighterSchema)

export default Fighter
