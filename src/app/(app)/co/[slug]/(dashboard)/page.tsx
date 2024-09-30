'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ActualySolo } from './actualy-solo'
import { TaxationAnalysist } from './taxation-analysist'
import { Button } from '@/components/ui/button'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function Dashboard() {
  const contentRef = useRef(null)
  const { slug: co } = useParams<{ slug: string }>()

  const exportToPDF = async () => {
    const element = contentRef.current
    if (element) {
      const canvas = await html2canvas(element, { scale: 2 }) // Aumenta a escala para melhor qualidade
      const imgData = canvas.toDataURL('image/png')
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF({
        orientation: 'portrait', // ou 'landscape' para orientação paisagem
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16, // Precisão flutuante para coordenadas
      })

      const imgWidth = 210 - 20 // Largura A4 em mm menos padding (10mm de cada lado)
      const pageHeight = pdf.internal.pageSize.height // Altura da página
      const imgHeight = (canvas.height * imgWidth) / canvas.width // Altura da imagem proporcional à largura
      let heightLeft = imgHeight

      const padding = 10 // Padding de 10mm
      let position = padding // Inicia a posição com padding

      // Adiciona a imagem na posição com padding
      pdf.addImage(imgData, 'PNG', padding, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Adiciona novas páginas se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + padding // Ajusta a posição para novas páginas
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', padding, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save('dashboard.pdf')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <Tabs defaultValue="actualy-solo">
        <div className="flex w-full justify-between items-center">
          <TabsList>
            <TabsTrigger value="actualy-solo">Solo atual</TabsTrigger>
            <TabsTrigger value="taxation-analysis">
              Solo recomendado
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button onClick={exportToPDF}>Exportar em PDF</Button>
            <Button variant={'secondary'} asChild>
              <Link href={`/co/${co}/recommendations`}>
                Calcular recomendações
              </Link>
            </Button>
          </div>
        </div>
        <div>
          <TabsContent value="actualy-solo" className="mt-4">
            <div ref={contentRef}>
              <ActualySolo />
            </div>
          </TabsContent>
          <TabsContent value="taxation-analysis" className="mt-4">
            <TaxationAnalysist />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
