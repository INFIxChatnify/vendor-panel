import { useTranslation } from "react-i18next"
import { RouteFocusModal } from "../../../components/modals"
import { useStore } from "../../../hooks/api/store"
import { DigitalProductCreateForm } from "./components/digital-product-create-form"

export const ProductDigitalCreate = () => {
  const { t } = useTranslation()
  const { store, isPending: isStorePending } = useStore()

  const ready = !!store && !isStorePending

  return (
    <RouteFocusModal>
      <RouteFocusModal.Title asChild>
        <span className="sr-only">{t("products.create.title")}</span>
      </RouteFocusModal.Title>
      <RouteFocusModal.Description asChild>
        <span className="sr-only">Create a new digital product</span>
      </RouteFocusModal.Description>
      {ready && <DigitalProductCreateForm store={store} />}
    </RouteFocusModal>
  )
}
