import { z } from "zod"
import { DigitalProductCreateSchema } from "./constants"

export type DigitalProductCreateSchemaType = z.infer<
  typeof DigitalProductCreateSchema
>
