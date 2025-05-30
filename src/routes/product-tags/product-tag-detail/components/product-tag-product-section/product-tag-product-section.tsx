import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { _DataTable } from "../../../../../components/table/data-table"
import { useProducts } from "../../../../../hooks/api"
import { useProductTableColumns } from "../../../../../hooks/table/columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters"
import { useProductTableQuery } from "../../../../../hooks/table/query"
import { useDataTable } from "../../../../../hooks/use-data-table"

type ProductTagProductSectionProps = {
  productTag: HttpTypes.AdminProductTag
}

const PAGE_SIZE = 10
const PREFIX = "pt"

export const ProductTagProductSection = ({
  productTag,
}: ProductTagProductSectionProps) => {
  const { t } = useTranslation()

  const { searchParams, raw } = useProductTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const { products, count, isPending, isError, error } = useProducts(
    {
      ...searchParams,
      fields: "*tags",
      limit: 9999,
    },
    undefined,
    {
      ...searchParams,
      tagId: productTag.id!,
    }
  )

  const filters = useProductTableFilters(["product_tags"])
  const columns = useProductTableColumns()

  const { table } = useDataTable({
    data: products,
    count,
    columns,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y px-0 py-0">
      <div className="px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
      </div>
      <_DataTable
        table={table}
        filters={filters}
        queryObject={raw}
        isLoading={isPending}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        navigateTo={(row) => `/products/${row.original.id}`}
        search
        pagination
        orderBy={[
          { key: "title", label: t("fields.title") },
          { key: "status", label: t("fields.status") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
      />
    </Container>
  )
}
