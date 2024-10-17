import { AttendanceLoggerComponent } from "@/components/attendance-logger"

export default function LogAttendance({ params }: { params: { sessionId: string } }) {
  return (
    <main>
      <AttendanceLoggerComponent sessionId={params.sessionId} />
    </main>
  )
}
