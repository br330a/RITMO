import { RitmoLogo } from '../branding/RitmoLogo'

export function AuthLoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[var(--app-bg)]">
      <div className="flex flex-col items-center gap-4">
        <RitmoLogo className="size-14" />

        <div className="size-6 animate-spin rounded-full border-2 border-[#cfe1d3] border-t-[var(--primary)]" />

        <p className="text-sm text-[var(--text-secondary)]">
          Carregando...
        </p>
      </div>
    </div>
  )
}
