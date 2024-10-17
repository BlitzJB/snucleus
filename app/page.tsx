import Link from "next/link"
import { SessionManagerComponent } from "@/components/session-manager"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function Home() {
  return (
    <main>
      <SessionManagerComponent />
    </main>
  )
}
