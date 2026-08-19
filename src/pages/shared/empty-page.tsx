import { useDocumentTitle } from '@/hooks'
import { cn } from '@/utils'

interface EmptyPageProps {
  title: string
  description: string
  icon: string
}

export function EmptyPage({ title, description, icon }: EmptyPageProps) {
  useDocumentTitle(title)

  return (
    <div className="grid min-h-[calc(100dvh-68px)] place-items-center bg-[#f8f8f8] px-6 text-center">
      <div>
        <div className="mx-auto grid size-14 place-items-center rounded-lg bg-white text-stone-400 shadow-sm">
          <span className={cn(icon, 'size-6')} aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-lg font-bold text-stone-900">{title}</h1>
        <p className="mt-2 text-sm text-stone-500">{description}</p>
      </div>
    </div>
  )
}
