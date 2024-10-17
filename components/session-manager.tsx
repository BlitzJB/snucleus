"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Tag, Search } from "lucide-react"
import { Session, getSessions, createSession, searchSessions } from "@/app/services/sessions"
import Link from "next/link"

export function SessionManagerComponent() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [newSessionName, setNewSessionName] = useState("")
  const [newSeriesTag, setNewSeriesTag] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    const fetchedSessions = await getSessions()
    setSessions(fetchedSessions)
  }

  const handleCreateSession = async () => {
    if (newSessionName && newSeriesTag) {
      const newSessionId = await createSession({
        name: newSessionName,
        seriesTag: newSeriesTag,
      })
      await fetchSessions()
      setNewSessionName("")
      setNewSeriesTag("")
      setIsDialogOpen(false)
    }
  }

  const handleSearch = async () => {
    if (searchTerm) {
      const searchResults = await searchSessions(searchTerm)
      setSessions(searchResults)
    } else {
      await fetchSessions()
    }
  }

  const filteredSessions = sessions.filter(
    session =>
      session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.seriesTag.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SNUcleus Session Manager</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Session
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Session</DialogTitle>
                <DialogDescription>
                  Enter the details for the new session.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="seriesTag" className="text-right">
                    Series Tag
                  </Label>
                  <Input
                    id="seriesTag"
                    value={newSeriesTag}
                    onChange={(e) => setNewSeriesTag(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateSession}>Create Session</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 relative">
            <Input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <ScrollArea className="h-[calc(100vh-200px)] rounded-md border">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No sessions found.</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                  >
                    <div>
                      <h2 className="text-lg font-semibold">{session.name}</h2>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Tag className="mr-1 h-4 w-4" />
                        {session.seriesTag}
                      </div>
                    </div>
                    <Link href={`/log-attendance/${session.id}`} passHref>
                      <Button>Record Attendance</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </main>
    </div>
  )
}
