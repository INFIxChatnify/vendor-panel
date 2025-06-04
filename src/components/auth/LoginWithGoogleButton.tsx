// src/components/auth/LoginWithGoogleButton.tsx (or similar)
import { Button } from "@medusajs/ui"
import { sdk } from "../../lib/client" // Your Medusa JS SDK client instance
import { useTranslation } from "react-i18next"
import { MEDUSA_VENDOR_URL } from "../../lib/admin-url"

export const LoginWithGoogleButton = () => {
  const { t } = useTranslation()

  const handleGoogleLogin = async () => {
    try {
      // Assuming "seller" is your actor type, and "google" is the strategy name
      // configured in your Medusa backend.
      const result = await sdk.auth.login("seller", "my-auth", {
        callback_url: `${MEDUSA_VENDOR_URL}/auth/google/callback-success`,
        location: window.location.href,
      })

      if (typeof result === "object" && result.location) {
        // Redirect the user to Google's authentication page
        window.location.href = result.location
      } else {
        // This case might indicate an issue with the SDK call or backend setup
        // if a redirect location was expected.
        console.error(
          "Google login initiation failed: No redirect location found.",
          result
        )
      }
    } catch (error) {
      console.error("Error during Google login initiation:", error)
      // It's good to check if it's a FetchError for more specific messages
      // import { isFetchError } from "../../lib/is-fetch-error";
      // if (isFetchError(error)) { alert(error.message) } else ...
    }
  }

  return (
    <Button onClick={handleGoogleLogin} variant="secondary" className="w-full">
      Sign in with Oauth
    </Button>
  )
}
