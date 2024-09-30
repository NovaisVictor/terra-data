import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, LineChart, ScanBarcode } from 'lucide-react'
import Link from 'next/link'

export function TaxationAnalysist() {
  return (
    <div className="grid grid-cols- gap-4">
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Alerta sobre diferença à recolher (sujeito à cobrança)
          </CardTitle>
          <ScanBarcode className="size-4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold">R$4231,02</div>
          <p className="text-xs text-muted-foreground">
            +20.1% em relação a última competência
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Possuem sugestões de corração
          </CardTitle>
          <LineChart className="size-4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold">1231</div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês anterior
            </p>
            <Link href={`/`}>
              <Button size={'xs'} variant={'outline'} className="ml-auto">
                Visualizar <ArrowRight className="ml-2 size-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
