import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"
import CameraScanner from "@/components/camera-scanner"

export default function Scanner() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Link href="/" className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold">Scanner</h1>
        <Link
          href="/scanner/upload"
          className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm"
        >
          <Upload size={20} />
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Remplacer le contenu statique par le composant CameraScanner */}
        <div className="w-full h-[70vh]">
          {/* @ts-expect-error Server Component */}
          <CameraScanner />
        </div>
      </div>
    </main>
  )
}

