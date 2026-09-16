type RitmoLogoProps = {
  className?: string
}

export function RitmoLogo({
  className = 'size-10',
}: RitmoLogoProps) {
  return (
    <img
      src="/ritmo-logo.png"
      alt="Logo do RITMO"
      className={`shrink-0 object-contain ${className}`}
    />
  )
}