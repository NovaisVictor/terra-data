import { Header } from '@/components/header'

export default async function OrgLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="px-4">
      <div>
        <Header />
      </div>
      <main className="mx-auto w-full max-w-[1200px] py-6">{children}</main>
    </div>
  )
}
