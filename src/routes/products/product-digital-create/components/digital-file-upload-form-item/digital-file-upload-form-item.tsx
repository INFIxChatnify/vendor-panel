import { useCallback } from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import {
  FileType,
  FileUpload,
} from "../../../../../components/common/file-upload"
import { Form } from "../../../../../components/common/form"
import { DigitalProductCreateSchemaType } from "../../types"

const SUPPORTED_FORMATS = [
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "audio/mpeg",
  "audio/wav",
]

const SUPPORTED_FORMATS_FILE_EXTENSIONS = [
  ".pdf",
  ".zip",
  ".xlsx",
  ".xls",
  ".doc",
  ".docx",
  ".txt",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".mp4",
  ".mp3",
  ".wav",
]

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const DigitalFileUploadFormItem = ({
  form,
}: {
  form: UseFormReturn<DigitalProductCreateSchemaType>
}) => {
  const { fields, append, remove } = useFieldArray({
    name: "digital_files",
    control: form.control,
    keyName: "field_id",
  })

  const hasInvalidFiles = useCallback(
    (fileList: FileType[]) => {
      // Check file type
      const invalidFile = fileList.find(
        (f) => !SUPPORTED_FORMATS.includes(f.file.type)
      )

      if (invalidFile) {
        form.setError("digital_files", {
          type: "invalid_file",
          message: `Invalid file type: ${invalidFile.file.name}. Supported formats: ${SUPPORTED_FORMATS_FILE_EXTENSIONS.join(", ")}`,
        })

        return true
      }

      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024 // 50MB in bytes
      const oversizedFile = fileList.find((f) => f.file.size > maxSize)

      if (oversizedFile) {
        form.setError("digital_files", {
          type: "file_too_large",
          message: `File too large: ${oversizedFile.file.name}. Maximum size is 50MB.`,
        })

        return true
      }

      return false
    },
    [form]
  )

  const onUploaded = useCallback(
    (files: FileType[]) => {
      form.clearErrors("digital_files")
      if (hasInvalidFiles(files)) {
        return
      }

      files.forEach((f) =>
        append({
          ...f,
          type: "MAIN_FILE",
          mime_type: f.file.type,
        })
      )
    },
    [form, append, hasInvalidFiles]
  )

  const removeFile = (index: number) => {
    remove(index)
  }

  return (
    <Form.Field
      control={form.control}
      name="digital_files"
      render={() => {
        return (
          <Form.Item>
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-1">
                <Form.Label>Digital Files</Form.Label>
                <Form.Hint>
                  Upload your digital product files (PDF, ZIP, Documents, etc.)
                </Form.Hint>
              </div>

              <Form.Control>
                <FileUpload
                  label="Upload Digital Files"
                  hint="Drag and drop or click to browse your digital files"
                  hasError={!!form.formState.errors.digital_files}
                  formats={SUPPORTED_FORMATS}
                  onUploaded={onUploaded}
                  multiple={true}
                />
              </Form.Control>

              {/* Display uploaded files */}
              {fields.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-ui-fg-base">
                    Uploaded Files:
                  </p>
                  {fields.map((field, index) => (
                    <div
                      key={field.field_id}
                      className="flex items-center justify-between p-3 bg-ui-bg-subtle border border-ui-border-base rounded-md"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-ui-fg-base">
                          {field.file?.name}
                        </span>
                        <span className="text-xs text-ui-fg-muted">
                          {field.mime_type} • {field.type} •{" "}
                          {formatFileSize(field.file?.size || 0)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-ui-fg-error hover:text-ui-fg-error-hover text-sm font-medium px-2 py-1 rounded hover:bg-ui-bg-subtle-hover"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Form.ErrorMessage />
            </div>
          </Form.Item>
        )
      }}
    />
  )
}
