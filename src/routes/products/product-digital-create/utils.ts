import { DigitalProductCreateSchemaType } from "./types"

export const normalizeDigitalProductFormValues = (
  values: DigitalProductCreateSchemaType
) => {
  return {
    name: values.name,
    medias: values.medias,
    product: {
      title: values.product.title,
      description: values.product.description || "",
      variants: values.product.variants.map((variant) => ({
        title: variant.title,
        prices: variant.prices.map((price) => ({
          currency_code: price.currency_code,
          amount: price.amount,
        })),
      })),
    },
  }
}
