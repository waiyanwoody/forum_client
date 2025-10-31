import { AppShell } from "@/components/app-shell"
import { NotificationList } from "@/components/notification-list"
import { NotificationFilters } from "@/components/notification-filters"
import { mockNotifications } from "@/lib/mock-data"

export default function NotificationsPage() {
  return (
    <AppShell showSidebar={false}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>

        <NotificationFilters />
        <NotificationList notifications={mockNotifications} />
      </div>
    </AppShell>
  )
}
