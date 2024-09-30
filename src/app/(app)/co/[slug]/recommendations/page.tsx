import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Recommendations() {
  return (
    <div className="space-y-6">
      <div className="items-center">
        <h1 className="text-2xl font-bold">Calcular recomendações</h1>
        <p className="text-muted-foreground">Insira os dados do solo atual</p>
      </div>
      <div className="grid grid-cols-6 gap-4">
        <div className="flex items-center gap-2">
          <Label>Ca</Label>
          <Input type="number" />
        </div>
        <div className="flex items-center gap-2">
          <Label>Mg</Label>
          <Input type="number" />
        </div>
        <div className="flex items-center gap-2">
          <Label>H+Al</Label>
          <Input type="number" />
        </div>
        <div className="flex items-center gap-2">
          <Label>K1</Label>
          <Input type="number" />
        </div>
        <div className="flex items-center gap-2">
          <Label>K</Label>
          <Input type="number" />
        </div>
        <div className="flex items-center gap-2">
          <Label>P(meh)</Label>
          <Input type="number" />
        </div>
        <div className="flex items-center gap-2">
          <Label>P(res)</Label>
          <Input type="number" />
        </div>
        <div className="flex items-center gap-2">
          <Label>S</Label>
          <Input type="number" />
        </div>
        <div className="flex items-center gap-2">
          <Label>Mat Org</Label>
          <Input type="number" />
        </div>
        <div className="flex items-center gap-2">
          <Label>Cab Org</Label>
          <Input type="number" />
        </div>
        <div className="flex items-center gap-2">
          <Label>B</Label>
          <Input type="number" />
        </div>
        <div className="flex items-center gap-2">
          <Label>Cu</Label>
          <Input type="number" />
        </div>
      </div>
      <Button>Calcular</Button>
    </div>
  )
}
