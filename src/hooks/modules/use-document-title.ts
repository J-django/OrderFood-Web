import { useEffect } from 'react'
import { APP_TITLE } from '@/constants'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} - ${APP_TITLE}` : APP_TITLE
  }, [title])
}
