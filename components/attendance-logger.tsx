"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { UserPlus, Users } from "lucide-react"
import { getSession, Session } from "@/app/services/sessions"
import { logAttendance, getAttendanceCountForSession } from "@/app/services/attendance"
import BarcodeScanner from "react-qr-barcode-scanner"

interface AttendanceLoggerProps {
  sessionId: string
}

export function AttendanceLoggerComponent({ sessionId }: AttendanceLoggerProps) {
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [attendanceCount, setAttendanceCount] = useState(0)
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false)
  const [manualRollNumber, setManualRollNumber] = useState("")
  const [session, setSession] = useState<Session | null>(null)
  const [isScannerActive, setIsScannerActive] = useState(true)

  useEffect(() => {
    fetchSession()
    fetchAttendanceCount()
  }, [sessionId])

  const fetchSession = async () => {
    const fetchedSession = await getSession(sessionId)
    setSession(fetchedSession)
  }

  const fetchAttendanceCount = async () => {
    const count = await getAttendanceCountForSession(sessionId)
    setAttendanceCount(count)
  }

  const handleBarcodeScanned = (result: string) => {
    setScannedBarcode(result)
    setIsScannerActive(false)
  }

  const handleAddAttendance = async () => {
    if (scannedBarcode) {
      await logAttendance(sessionId, scannedBarcode)
      await fetchAttendanceCount()
      setScannedBarcode(null)
      setIsScannerActive(true)
      console.log(`Attendance added for ${scannedBarcode} in session ${sessionId}`)
    }
  }

  const handleManualEntry = async () => {
    if (manualRollNumber) {
      await logAttendance(sessionId, manualRollNumber)
      await fetchAttendanceCount()
      setIsManualEntryOpen(false)
      setManualRollNumber("")
      console.log(`Manual attendance added for ${manualRollNumber} in session ${sessionId}`)
    }
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full h-full">
        {isScannerActive && (
          <BarcodeScanner
            onUpdate={(err, result) => handleBarcodeScanned(result?.getText() ?? "")}
          />
        )}

        {/* Floating controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800 bg-opacity-75 p-4 rounded-lg">
          <Button variant="outline" size="icon" onClick={() => setIsManualEntryOpen(true)}>
            <UserPlus className="h-4 w-4" />
          </Button>
          <div className="w-[180px] bg-gray-700 text-white border-gray-600 p-2 rounded">
            {session.name}
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Users className="h-4 w-4" />
            <span>{attendanceCount}</span>
          </div>
        </div>
      </div>

      <Dialog open={!!scannedBarcode} onOpenChange={() => setScannedBarcode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Attendance</DialogTitle>
            <DialogDescription>
              Scanned barcode: {scannedBarcode}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setScannedBarcode(null)
              setIsScannerActive(true)
            }}>Cancel</Button>
            <Button onClick={handleAddAttendance}>Add Attendance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Entry</DialogTitle>
            <DialogDescription>
              Enter the roll number manually for students without an ID card.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rollNumber" className="text-right">
                Roll Number
              </Label>
              <Input
                id="rollNumber"
                value={manualRollNumber}
                onChange={(e) => setManualRollNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManualEntryOpen(false)}>Cancel</Button>
            <Button onClick={handleManualEntry}>Add Attendance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
