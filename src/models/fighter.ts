import mongoose from "mongoose"

export const FighterSchema = new mongoose.Schema<IFighter>({
  emoji: { type: String },
  name: { type: String },
  damage: { type: Number },
  health_points: { type: Number },
  guild: { type: String }
})

const Fighter = mongoose.model<IFighter>('Fighter', FighterSchema)

export interface IFighter extends mongoose.Document{
  name: string
  emoji: string
  damage: number
  health_points: number
  guild: string
}

export default Fighter
