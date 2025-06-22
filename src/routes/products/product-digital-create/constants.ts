import { z } from "zod"

// Schema for uploaded file (used in form)
export const DigitalFileSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  file: z.any().nullable(), // File object
  type: z.string().default("MAIN_FILE"),
  mime_type: z.string().optional(),
})

// Schema for API submission
export const DigitalMediaSchema = z.object({
  type: z.string(),
  file_id: z.string(),
  mime_type: z.string(),
})

const DigitalProductVariantSchema = z.object({
  title: z.string(),
  prices: z.array(
    z.object({
      currency_code: z.string(),
      amount: z.number(),
    })
  ),
})

export type DigitalProductVariantSchema = z.infer<
  typeof DigitalProductVariantSchema
>

export const DigitalProductCreateSchema = z.object({
  name: z.string().min(1, "Digital product name is required"),
  digital_files: z
    .array(DigitalFileSchema)
    .min(1, "At least one digital file is required"),
  product: z.object({
    title: z.string().min(1, "Product title is required"),
    description: z.string().optional(),
    variants: z
      .array(DigitalProductVariantSchema)
      .min(1, "At least one variant is required"),
  }),
})

export type DigitalProductCreateSchemaType = z.infer<
  typeof DigitalProductCreateSchema
>

export const DIGITAL_PRODUCT_CREATE_FORM_DEFAULTS: Partial<DigitalProductCreateSchemaType> =
  {
    name: "",
    digital_files: [],
    product: {
      title: "",
      description: "",
      variants: [
        {
          title: "Default Variant",
          prices: [
            {
              currency_code: "usd",
              amount: 0,
            },
          ],
        },
      ],
    },
  }
