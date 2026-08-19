import { Link } from 'react-router'
import { useDocumentTitle } from '@/hooks'

const profileEntries = [
  {
    title: '我的家庭',
    description: '管理家庭与成员',
    path: '/profile/families',
    icon: 'icon-[lucide--house-heart]',
    color: 'bg-[#e6f3e8] text-[#27824b]',
  },
  {
    title: '我的订单',
    description: '查看历史订单与进度',
    path: '/profile/orders',
    icon: 'icon-[lucide--receipt-text]',
    color: 'bg-[#e8f1fb] text-[#3974b9]',
  },
  {
    title: '添加菜品',
    description: '创建新的家庭菜品',
    path: '/profile/dishes/new',
    icon: 'icon-[lucide--circle-plus]',
    color: 'bg-[#fff0d8] text-[#b96b22]',
  },
] as const

export default function ProfilePage() {
  useDocumentTitle('我的')

  return (
    <div className="min-h-[calc(100dvh-68px)] bg-[#f8f8f8]">
      <header className="px-5 pb-6 pt-[calc(22px+env(safe-area-inset-top))]">
        <h1 className="text-2xl font-bold text-stone-900">我的</h1>
        <div className="mt-5 flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-full bg-[#ff5a36] text-white">
            <span className="icon-[lucide--user-round] size-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">家庭管理员</h2>
            <p className="mt-1 text-xs text-stone-500">一起记录每一顿饭</p>
          </div>
        </div>
      </header>

      <section className="bg-white px-5" aria-label="我的功能">
        {profileEntries.map((entry) => (
          <Link
            key={entry.path}
            to={entry.path}
            className="flex items-center gap-3 border-b border-stone-100 py-4 last:border-b-0"
          >
            <div
              className={`grid size-11 shrink-0 place-items-center rounded-lg ${entry.color}`}
            >
              <span className={`${entry.icon} size-5`} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold text-stone-900">
                {entry.title}
              </h2>
              <p className="mt-1 text-xs text-stone-500">
                {entry.description}
              </p>
            </div>
            <span
              className="icon-[lucide--chevron-right] size-4 shrink-0 text-stone-300"
              aria-hidden="true"
            />
          </Link>
        ))}
      </section>
    </div>
  )
}
