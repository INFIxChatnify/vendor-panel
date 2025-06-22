import { Button, Heading, Input, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateDigitalProduct } from "../../../../../hooks/api/products"
import { Form } from "../../../../../components/common/form"
import { uploadFilesQuery } from "../../../../../lib/client"
import {
  DIGITAL_PRODUCT_CREATE_FORM_DEFAULTS,
  DigitalProductCreateSchema,
} from "../../constants"
import { DigitalProductCreateSchemaType } from "../../types"
import { DigitalFileUploadFormItem } from "../digital-file-upload-form-item"

type DigitalProductCreateFormProps = {
  store?: any
}

export const DigitalProductCreateForm = ({}: DigitalProductCreateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<DigitalProductCreateSchemaType>({
    defaultValues: DIGITAL_PRODUCT_CREATE_FORM_DEFAULTS,
    resolver: zodResolver(DigitalProductCreateSchema),
  })

  const { mutateAsync, isPending } = useCreateDigitalProduct()

  const handleSubmit = form.handleSubmit(async (values) => {
    // Upload digital files first
    let uploadedFiles: any[] = []

    try {
      if (values.digital_files?.length) {
        const fileReqs = []
        fileReqs.push(
          uploadFilesQuery(values.digital_files).then((r: any) =>
            r.files.map((f: any) => ({
              ...f,
              type: "PREVIEW",
              mime_type: f.mime_type,
            }))
          )
        )

        uploadedFiles = (await Promise.all(fileReqs)).flat()
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`File upload failed: ${error.message}`)
      }
      return
    }

    // Transform data for API
    const payload = {
      name: values.name,
      medias: uploadedFiles.map((file) => ({
        type: file.type,
        file_id: file.id,
        mime_type: "image/png",
      })),
      product: {
        title: values.product.title,
        description: values.product.description || "",
        variants: values.product.variants,
      },
    }

    await mutateAsync(payload, {
      onSuccess: () => {
        toast.success("Digital product created successfully!")
        handleSuccess()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              size="small"
              variant="primary"
              type="submit"
              isLoading={isPending}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Header>

        <RouteFocusModal.Body className="flex flex-1 justify-center overflow-y-auto px-6 py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div className="flex flex-col gap-y-1">
              <RouteFocusModal.Title asChild>
                <Heading>{t("products.create.title")}</Heading>
              </RouteFocusModal.Title>
              <RouteFocusModal.Description className="text-ui-fg-subtle">
                Create a new digital product
              </RouteFocusModal.Description>
            </div>

            <div className="flex flex-col gap-y-6">
              {/* Digital Product Name */}
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Digital Product Name</Form.Label>
                    <Form.Control>
                      <Input
                        {...field}
                        placeholder="Enter digital product name"
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />

              {/* Product Title */}
              <Form.Field
                control={form.control}
                name="product.title"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>{t("products.fields.title.label")}</Form.Label>
                    <Form.Control>
                      <Input {...field} placeholder="Enter product title" />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />

              {/* Product Description */}
              <Form.Field
                control={form.control}
                name="product.description"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>
                      {t("products.fields.description.label")}
                    </Form.Label>
                    <Form.Control>
                      <Textarea
                        {...field}
                        placeholder="Enter product description"
                        rows={4}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />

              {/* Digital Files Upload */}
              <DigitalFileUploadFormItem form={form} />

              {/* Variant Title */}
              <Form.Field
                control={form.control}
                name="product.variants.0.title"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Variant Title</Form.Label>
                    <Form.Control>
                      <Input {...field} placeholder="Enter variant title" />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />

              {/* Price */}
              <Form.Field
                control={form.control}
                name="product.variants.0.prices.0.amount"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Price</Form.Label>
                    <Form.Control>
                      <Input
                        {...field}
                        type="number"
                        placeholder="0"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />

              {/* Currency Code */}
              <Form.Field
                control={form.control}
                name="product.variants.0.prices.0.currency_code"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Currency</Form.Label>
                    <Form.Control>
                      <Input {...field} placeholder="usd" />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />
            </div>
          </div>
        </RouteFocusModal.Body>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
