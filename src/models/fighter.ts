import { Schema, Document, model } from "mongoose"

export type IFighter = Document & {
  name: string
  emoji_id: string
  guild: string
  in_service?: boolean
}

export const FighterSchema = new Schema<IFighter>({
  emoji_id: { type: String },
  name: { type: String },
  damage: { type: Number },
  health_points: { type: Number },
  guild: { type: String },
  in_service: { type: Boolean, default: true }
})

const Fighter = model<IFighter>('Fighter', FighterSchema)

export default Fighter
