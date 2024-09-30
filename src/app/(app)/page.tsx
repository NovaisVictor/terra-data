import { Header } from '@/components/header'
import { Sprout } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <Link href={''}>
          <div className="bg-secondary rounded-md p-4 space-y-3 w-3/12">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Análise de solo</h2>
              <Sprout className="text-green-500" />
            </div>
            <p className="text-muted-foreground">Descrição</p>
          </div>
        </Link>
      </main>
    </div>
  )
}
