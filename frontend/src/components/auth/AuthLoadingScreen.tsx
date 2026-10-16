import { RitmoLogo } from '../branding/RitmoLogo'

export function AuthLoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f7faf7]">
      <div className="flex flex-col items-center gap-4">
        <RitmoLogo className="size-14" />

        <div className="size-6 animate-spin rounded-full border-2 border-[#cfe1d3] border-t-[#23834b]" />

        <p className="text-sm text-[#667069]">
          Carregando...
        </p>
      </div>
    </div>
  )
}