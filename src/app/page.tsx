import Link from "next/link"

export default function Home() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col">
        <p>Home</p>
        <Link href="/settings" className="w-fit underline" prefetch={true}>
          Settings
        </Link>
      </div>
    </div>
  )
}
