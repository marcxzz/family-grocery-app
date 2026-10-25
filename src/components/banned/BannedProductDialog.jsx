import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

// TODO(#12): show up this instead of editing form
export default function BannedProductDialog({ banReason }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Info & Badges */}
        <div className="space-y-3">
          <div className="p-10 text-center space-y-2">
            <Ban className="h-8 w-8 mx-auto text-destructive mb-4" />
            <h2 className="font-semibold text-base">Prodotto bannato</h2>
            <p className="text-muted-foreground text-sm">Questo prodotto è stato BANNATO.</p>
          </div>

          {/* Motivo del ban */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive mb-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              Motivo del ban
            </div>
            <p className="text-sm text-foreground whitespace-pre-line">
              {banReason || "Nessun motivo specificato."}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
          <Button
            type="button"
            // variant="destructive"
            onClick={() => setConfirmDeleteOpen(true)}
          >
            Chiudi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
