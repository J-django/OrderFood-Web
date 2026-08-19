import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-[#f8f8f8] px-6 text-center">
      <div>
        <span className="icon-[lucide--map-pin-off] size-10 text-stone-400" />
        <h1 className="mt-4 text-xl font-bold text-stone-900">页面不存在</h1>
        <Link
          to="/"
          className="mt-6 inline-flex h-8 items-center justify-center rounded-2xl bg-stone-900 px-3 text-sm font-medium text-white transition-colors hover:bg-stone-900/80"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}
