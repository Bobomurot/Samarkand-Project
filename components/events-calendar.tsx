"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  ExternalLink,
  X,
  GripVertical,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Phone,
  Facebook,
  MessageCircle
} from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, isWithinInterval, isAfter, isBefore, startOfDay, endOfDay } from "date-fns"
import { uz } from "date-fns/locale"

interface Event {
  id: number
  date: string
  endDate?: string
  name: string
  description: string
  location: string
  image: string
  "location-yandex-map": string
}

interface EventsCalendarProps {
  events: Event[]
}

export function EventsCalendar({ events }: EventsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [calendarWidth, setCalendarWidth] = useState(50) // Percentage
  const [isResizing, setIsResizing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [registrationEvent, setRegistrationEvent] = useState<Event | null>(null)
  const resizeRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Get events for the current month
  const getEventsForMonth = (date: Date) => {
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    
    return events.filter(event => {
      const eventStart = startOfDay(new Date(event.date))
      const eventEnd = event.endDate ? endOfDay(new Date(event.endDate)) : startOfDay(new Date(event.date))
      
      // Check if event overlaps with the month
      return (eventStart <= monthEnd && eventEnd >= monthStart)
    })
  }

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)
    
    return events.filter(event => {
      const eventStart = startOfDay(new Date(event.date))
      const eventEnd = event.endDate ? endOfDay(new Date(event.endDate)) : startOfDay(new Date(event.date))
      
      // Check if day is within event range
      return (eventStart <= dayEnd && eventEnd >= dayStart)
    })
  }

  // Get event position in range (start, middle, end, single)
  const getEventPositionInRange = (event: Event, date: Date): 'start' | 'middle' | 'end' | 'single' => {
    if (!event.endDate) return 'single'
    
    const eventStart = startOfDay(new Date(event.date))
    const eventEnd = endOfDay(new Date(event.endDate))
    const currentDay = startOfDay(date)
    
    if (isSameDay(eventStart, currentDay) && isSameDay(eventEnd, currentDay)) {
      return 'single'
    }
    if (isSameDay(eventStart, currentDay)) {
      return 'start'
    }
    if (isSameDay(eventEnd, currentDay)) {
      return 'end'
    }
    return 'middle'
  }

  const isDateInEventRange = (date: Date, event: Event) => {
    if (!event.endDate) return false
    const eventStart = startOfDay(new Date(event.date))
    const eventEnd = endOfDay(new Date(event.endDate))
    const targetDay = startOfDay(date)
    return targetDay >= eventStart && targetDay <= eventEnd
  }

  const getSelectedMultiDayEvent = (date: Date | null) => {
    if (!date) return null
    const dayEvents = getEventsForDay(date)
    return (
      dayEvents.find(event => {
        if (!event.endDate) return false
        return !isSameDay(new Date(event.date), new Date(event.endDate))
      }) || null
    )
  }

  // Format event date range
  const formatEventDateRange = (event: Event): string => {
    const startDate = new Date(event.date)
    if (!event.endDate) {
      return format(startDate, 'd MMMM', { locale: uz })
    }
    const endDate = new Date(event.endDate)
    const startMonth = startDate.getMonth()
    const endMonth = endDate.getMonth()
    
    if (startMonth === endMonth) {
      return `${format(startDate, 'd', { locale: uz })}-${format(endDate, 'd MMMM', { locale: uz })}`
    } else {
      return `${format(startDate, 'd MMMM', { locale: uz })} - ${format(endDate, 'd MMMM', { locale: uz })}`
    }
  }

  // Get event status (past, current, upcoming)
  const getEventStatus = (eventDate: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const event = new Date(eventDate)
    event.setHours(0, 0, 0, 0)
    
    if (event < today) return 'past'
    if (event.getTime() === today.getTime()) return 'current'
    return 'upcoming'
  }

  // Get calendar days for current month
  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = new Date(monthStart)
    startDate.setDate(startDate.getDate() - getDay(monthStart))
    
    const endDate = new Date(monthEnd)
    endDate.setDate(endDate.getDate() + (6 - getDay(monthEnd)))
    
    return eachDayOfInterval({ start: startDate, end: endDate })
  }

  const calendarDays = getCalendarDays()
  const monthEvents = getEventsForMonth(currentDate)
  const calendarWeeks: Date[][] = []
  const selectedMultiDayEvent = getSelectedMultiDayEvent(selectedDate)

  for (let i = 0; i < calendarDays.length; i += 7) {
    calendarWeeks.push(calendarDays.slice(i, i + 7))
  }

  const monthNames = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
  ]

  const dayNames = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"]

  // Event details handler
  const handleEventDetails = (event: Event) => {
    setSelectedEvent(event)
    setIsEventDetailsOpen(true)
  }

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Resize functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
    
    // Constrain between 20% and 80%
    const constrainedWidth = Math.min(Math.max(newWidth, 20), 80)
    setCalendarWidth(constrainedWidth)
  }, [isResizing])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="lg" 
          className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-300 hover:from-purple-500/30 hover:to-pink-500/30"
        >
          <CalendarIcon className="mr-2 h-5 w-5" />
          Tadbirlar taqvimi
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="overflow-hidden p-0 bg-gradient-to-br from-background to-muted/20 w-[98vw] h-[95vh] max-w-[98vw] max-h-[95vh] sm:w-[95vw] sm:max-w-[95vw] lg:w-[90vw] lg:max-w-[90vw] xl:w-[85vw] xl:max-w-[85vw]"
        style={{
          width: 'min(98vw, 1500px)',
          height: '95vh',
          maxWidth: 'min(98vw, 1500px)',
          maxHeight: '95vh'
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Tadbirlar taqvimi</DialogTitle>
          <DialogDescription>Samarqanddagi tadbirlarni ko'rish va rejalashtirish uchun taqvim</DialogDescription>
        </DialogHeader>
        <div ref={containerRef} className="flex flex-col lg:flex-row h-full relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full translate-y-12 -translate-x-12"></div>
          {/* Calendar Section */}
          <div 
            className="p-3 sm:p-4 lg:p-6 border-r lg:border-r border-b lg:border-b-0 overflow-y-auto lg:overflow-y-visible max-h-[45vh] lg:max-h-none scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
            style={{ width: isMobile ? '100%' : `${calendarWidth}%` }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-4">
              <h2 className="text-xl lg:text-2xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="text-xs lg:text-sm"
                >
                  <ChevronLeft className="h-3 w-3 lg:h-4 lg:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="text-xs lg:text-sm"
                >
                  <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date()
                    setCurrentDate(today)
                    
                    // Check if today has events
                    const todayEvents = getEventsForDay(today)
                    if (todayEvents.length > 0) {
                      // If today has events, select today to show them
                      setSelectedDate(today)
                    } else {
                      // If no events today, clear selection to show all month events
                      setSelectedDate(null)
                    }
                  }}
                  className={`
                    text-xs lg:text-sm transition-colors relative
                    hover:bg-green-50 hover:border-green-300 hover:text-green-700 
                    dark:hover:bg-green-900/20 dark:hover:border-green-700 dark:hover:text-green-300
                    ${(() => {
                      const today = new Date()
                      const todayEvents = getEventsForDay(today)
                      const isToday = isSameDay(currentDate, today)
                      return isToday && todayEvents.length > 0 
                        ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300' 
                        : ''
                    })()}
                  `}
                  title="Bugungi tadbirlarni ko'rish yoki oyning barcha tadbirlarini ko'rish"
                >
                  <span className="flex items-center gap-1">
                    Bugun
                    {(() => {
                      const today = new Date()
                      const todayEvents = getEventsForDay(today)
                      const isToday = isSameDay(currentDate, today)
                      return isToday && todayEvents.length > 0 ? (
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      ) : null
                    })()}
                  </span>
                </Button>
              </div>
            </div>

            {/* Color Legend */}
            <div className="mb-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>O'tgan tadbirlar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Bugungi tadbirlar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Kelajakdagi tadbirlar</span>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 lg:mb-4">
              {dayNames.map((day) => (
                <div key={day} className="p-1 sm:p-2 lg:p-3 text-center text-xs sm:text-sm lg:text-base font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1 sm:gap-2">
              {calendarWeeks.map((week, weekIndex) => {
                const weekStart = startOfDay(week[0])
                const weekEnd = endOfDay(week[6])
                const multiDayEventsForWeek = monthEvents.filter(event => {
                  if (!event.endDate) return false
                  const eventStart = startOfDay(new Date(event.date))
                  const eventEnd = endOfDay(new Date(event.endDate))
                  if (isSameDay(eventStart, eventEnd)) return false
                  return eventStart <= weekEnd && eventEnd >= weekStart
                })

                return (
                  <div key={weekIndex} className="relative">
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {week.map((day, index) => {
                        const dayEvents = getEventsForDay(day)
                        const dayEventsForBadges = dayEvents.filter(event => {
                          if (!event.endDate) return true
                          return isSameDay(new Date(event.date), new Date(event.endDate))
                        })
                        const multiDayStartEvents = dayEvents.filter(event => {
                          if (!event.endDate) return false
                          const eventStart = startOfDay(new Date(event.date))
                          const eventEnd = endOfDay(new Date(event.endDate))
                          return isSameDay(eventStart, day) && !isSameDay(eventStart, eventEnd)
                        })
                        const isCurrentMonth = isSameMonth(day, currentDate)
                        const isToday = isSameDay(day, new Date())
                        const isSelectedDay = Boolean(selectedDate && isSameDay(day, selectedDate))
                        const isInSelectedRange = Boolean(
                          selectedMultiDayEvent && isDateInEventRange(day, selectedMultiDayEvent)
                        )
                        const isSelected = isSelectedDay || isInSelectedRange
                        
                        // Determine event status for color coding
                        // For multi-day events, use the status from the start date
                        let eventStatus = null
                        if (dayEvents.length > 0) {
                          const firstEvent = dayEvents[0]
                          const eventStartDate = new Date(firstEvent.date)
                          eventStatus = getEventStatus(eventStartDate)
                        }
                        
                        const isPast = day < new Date() && !isToday
                        const isUpcoming = day > new Date()

                        // Check if events continue to next/previous day for visual connection
                        const nextDay = new Date(day)
                        nextDay.setDate(nextDay.getDate() + 1)
                        const prevDay = new Date(day)
                        prevDay.setDate(prevDay.getDate() - 1)
                        
                        const hasContinuingEvents = dayEvents.some(event => {
                          if (!event.endDate) return false
                          const eventEnd = endOfDay(new Date(event.endDate!))
                          return eventEnd >= endOfDay(nextDay)
                        })
                        
                        const hasStartingEvents = dayEvents.some(event => {
                          const eventStart = startOfDay(new Date(event.date))
                          return isSameDay(eventStart, day) && event.endDate && !isSameDay(new Date(event.endDate), day)
                        })
                        
                        const hasEndingEvents = dayEvents.some(event => {
                          if (!event.endDate) return false
                          const eventEnd = endOfDay(new Date(event.endDate!))
                          return isSameDay(eventEnd, day) && !isSameDay(new Date(event.date), day)
                        })
                        
                        // Check if previous day has continuing events (for left border removal)
                        const prevDayEvents = getEventsForDay(prevDay)
                        const prevDayHasContinuing = prevDayEvents.some(event => {
                          if (!event.endDate) return false
                          const eventEnd = endOfDay(new Date(event.endDate!))
                          return eventEnd >= endOfDay(day)
                        })
                        
                        // Determine if this is part of a multi-day event
                        const isPartOfMultiDayEvent = hasContinuingEvents || prevDayHasContinuing
                        
                        // Get the multi-day event for consistent styling
                        const multiDayEvent = dayEvents.find(e => e.endDate && (
                          hasContinuingEvents || prevDayHasContinuing
                        ))
                        const multiDayEventStatus = multiDayEvent ? getEventStatus(new Date(multiDayEvent.date)) : null
                        
                        // Determine background for multi-day events
                        let multiDayBg = ''
                        if (isPartOfMultiDayEvent && !isSelected && dayEvents.length > 0) {
                          if (multiDayEventStatus === 'past') {
                            multiDayBg = 'bg-red-50 dark:bg-red-900/10'
                          } else if (multiDayEventStatus === 'current') {
                            multiDayBg = 'bg-green-50 dark:bg-green-900/20'
                          } else if (multiDayEventStatus === 'upcoming') {
                            multiDayBg = 'bg-blue-50 dark:bg-blue-900/10'
                          } else {
                            multiDayBg = isCurrentMonth ? 'bg-background' : 'bg-muted/50'
                          }
                        }

                        return (
                          <div
                            key={`${weekIndex}-${index}`}
                            className={`
                              relative p-1 sm:p-2 lg:p-3 h-16 sm:h-20 lg:h-24 cursor-pointer transition-all duration-300
                              ${isPartOfMultiDayEvent ? 'hover:shadow-md' : 'hover:scale-105 hover:shadow-lg active:scale-95'}
                              ${isPartOfMultiDayEvent ? (
                                hasStartingEvents && hasEndingEvents ? 'rounded-lg' :
                                hasStartingEvents ? 'rounded-l-lg rounded-r-none' :
                                hasEndingEvents ? 'rounded-r-lg rounded-l-none' :
                                'rounded-none'
                              ) : 'rounded-lg'}
                              ${hasContinuingEvents ? '-mr-1 sm:-mr-2' : ''}
                              ${prevDayHasContinuing ? '-ml-1 sm:-ml-2' : ''}
                              ${isPartOfMultiDayEvent && dayEvents.length > 0 && !isSelected ? `
                                border-t border-b border-primary/50
                                ${hasStartingEvents ? 'border-l border-primary/50' : 'border-l-0'}
                                ${hasContinuingEvents ? 'border-r-0' : 'border-r border-primary/50'}
                                ${multiDayBg}
                              ` : ''}
                              ${!isPartOfMultiDayEvent ? 'border' : ''}
                              ${!isPartOfMultiDayEvent && isCurrentMonth ? 'bg-background hover:bg-primary/5 hover:text-foreground' : ''}
                              ${!isPartOfMultiDayEvent && !isCurrentMonth ? 'bg-muted/50 text-muted-foreground' : ''}
                              ${isToday && !isPartOfMultiDayEvent ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg' : ''}
                              ${isToday && isPartOfMultiDayEvent ? 'ring-2 ring-green-500 ring-inset' : ''}
                              ${isSelected ? `
                                bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 
                                text-white shadow-2xl scale-105 ring-4 ring-blue-400/50
                                border-blue-500 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900
                                hover:shadow-2xl hover:ring-blue-400/70 border-2
                              ` : ''}
                              ${isPast && isCurrentMonth && !isSelected && !isPartOfMultiDayEvent ? 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300 hover:text-red-700 dark:hover:text-red-300' : ''}
                              ${isUpcoming && isCurrentMonth && !isSelected && !isPartOfMultiDayEvent ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-700 hover:text-blue-700 dark:hover:text-blue-300' : ''}
                              ${dayEvents.length > 0 && !isSelected && !isPartOfMultiDayEvent ? 'border-primary/50 hover:border-primary shadow-sm hover:shadow-md' : ''}
                              ${isPartOfMultiDayEvent && multiDayEventStatus === 'past' && !isSelected ? 'text-red-700 dark:text-red-300' : ''}
                              ${isPartOfMultiDayEvent && multiDayEventStatus === 'upcoming' && !isSelected ? 'text-blue-700 dark:text-blue-300' : ''}
                            `}
                            style={{
                              zIndex: isPartOfMultiDayEvent ? 1 : 0
                            }}
                            onClick={() => {
                              if (isPartOfMultiDayEvent && multiDayEvent) {
                                setSelectedDate(startOfDay(new Date(multiDayEvent.date)))
                                return
                              }
                              setSelectedDate(day)
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className={`
                                text-xs sm:text-sm lg:text-base font-medium
                                ${isSelected ? 'text-white font-bold text-shadow-sm' : ''}
                              `}>
                                {format(day, 'd')}
                              </div>
                              {dayEventsForBadges.length > 0 && (
                                <div className={`
                                  w-1.5 h-1.5 rounded-full animate-pulse
                                  ${isSelected ? 'bg-white/80' : 'bg-primary/60'}
                                `}></div>
                              )}
                            </div>
                            {(multiDayStartEvents.length > 0 || dayEventsForBadges.length > 0) && (
                              <div className="absolute bottom-1 sm:bottom-1.5 lg:bottom-2 left-1 sm:left-1.5 lg:left-2 right-1 sm:right-1.5 lg:right-2">
                                <div className="flex flex-col gap-0.5 sm:gap-1">
                                  {multiDayStartEvents.length > 0 && (
                                    <div
                                      className={`
                                        px-1 py-0.5 text-[8px] sm:text-[9px] lg:text-[10px] font-semibold rounded-md border
                                        ${isSelected ? 'bg-white/90 text-gray-800 border-white/50' : 'bg-primary/20 text-primary border-primary/30'}
                                        shadow-sm truncate
                                      `}
                                      title={multiDayStartEvents[0].name}
                                    >
                                      {multiDayStartEvents[0].name.length > 8
                                        ? `${multiDayStartEvents[0].name.substring(0, 8)}...`
                                        : multiDayStartEvents[0].name}
                                    </div>
                                  )}
                                  {dayEventsForBadges.slice(0, 2).map((event) => {
                                    const eventStatus = getEventStatus(new Date(event.date))
                                    const eventPosition = getEventPositionInRange(event, day)
                                    const isMultiDay = Boolean(
                                      event.endDate && !isSameDay(new Date(event.date), new Date(event.endDate))
                                    )
                                    const shouldShowLabel = !isMultiDay || eventPosition === 'start'
                                    let badgeVariant = 'default'
                                    let badgeClass = ''
                                    
                                    if (eventStatus === 'past') {
                                      badgeVariant = 'secondary'
                                      badgeClass = 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700'
                                    } else if (eventStatus === 'current') {
                                      badgeVariant = 'default'
                                      badgeClass = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700'
                                    } else if (eventStatus === 'upcoming') {
                                      badgeVariant = 'outline'
                                      badgeClass = 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
                                    }
                                    
                                    // Determine border radius based on position
                                    let borderRadiusClass = 'rounded-md'
                                    if (eventPosition === 'start') {
                                      borderRadiusClass = 'rounded-l-md rounded-r-none'
                                    } else if (eventPosition === 'end') {
                                      borderRadiusClass = 'rounded-r-md rounded-l-none'
                                    } else if (eventPosition === 'middle') {
                                      borderRadiusClass = 'rounded-none'
                                    }
                                    
                                    return (
                                      <div
                                        key={event.id}
                                        className={`
                                          px-1 py-0.5 text-[8px] sm:text-[9px] lg:text-[10px] font-medium ${borderRadiusClass} border
                                          ${isSelected ? `
                                            bg-white/90 text-gray-800 border-white/50 
                                            shadow-md hover:bg-white hover:shadow-lg
                                            backdrop-blur-sm
                                          ` : badgeClass}
                                          ${!isSelected ? 'shadow-sm hover:shadow-md' : ''}
                                          transition-all duration-200
                                          truncate max-w-full
                                          ${!shouldShowLabel ? 'text-transparent select-none pointer-events-none' : ''}
                                          ${!isSelected ? 'hover:!text-inherit' : ''}
                                        `}
                                        title={shouldShowLabel ? event.name : ''}
                                      >
                                        {shouldShowLabel
                                          ? (event.name.length > 8 ? `${event.name.substring(0, 8)}...` : event.name)
                                          : '\u00A0'}
                                      </div>
                                    )
                                  })}
                                  {dayEventsForBadges.length > 2 && (
                                    <div className={`
                                      px-1.5 py-0.5 text-[8px] sm:text-[9px] lg:text-[10px] 
                                      ${isSelected ? `
                                        bg-white/90 text-gray-800 border-white/50 
                                        shadow-md hover:bg-white hover:shadow-lg
                                        backdrop-blur-sm
                                      ` : `
                                        bg-gradient-to-r from-primary/20 to-secondary/20 
                                        text-primary-foreground border-primary/30 shadow-sm
                                        hover:!text-primary-foreground
                                      `}
                                      font-semibold rounded-md border
                                      flex items-center justify-center
                                      transition-all duration-200
                                    `}>
                                      +{dayEventsForBadges.length - 2} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    {multiDayEventsForWeek.length > 0 && (
                      <div className="absolute inset-0 grid grid-cols-7 gap-1 sm:gap-2 pointer-events-none">
                        {multiDayEventsForWeek.map((event, eventIndex) => {
                          const eventStart = startOfDay(new Date(event.date))
                          const eventEnd = endOfDay(new Date(event.endDate!))
                          const startIndex = eventStart <= weekStart
                            ? 0
                            : week.findIndex(d => isSameDay(d, eventStart))
                          const endIndex = eventEnd >= weekEnd
                            ? 6
                            : week.findIndex(d => isSameDay(d, eventEnd))

                          if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
                            return null
                          }

                          const eventStatus = getEventStatus(new Date(event.date))
                          let barClass = 'bg-blue-200/70 border-blue-300 text-blue-800'

                          if (eventStatus === 'past') {
                            barClass = 'bg-red-200/70 border-red-300 text-red-800'
                          } else if (eventStatus === 'current') {
                            barClass = 'bg-green-200/70 border-green-300 text-green-800'
                          }

                          const isSelectedRange = Boolean(
                            selectedMultiDayEvent && selectedMultiDayEvent.id === event.id
                          )

                          return (
                            <div
                              key={event.id}
                              className={`pointer-events-auto h-4 sm:h-5 rounded-md border px-1 text-[8px] sm:text-[9px] font-medium flex items-center ${barClass} ${isSelectedRange ? 'ring-2 ring-blue-400/70 shadow-md' : ''}`}
                              style={{
                                gridColumn: `${startIndex + 1} / ${endIndex + 2}`,
                                marginTop: 4 + eventIndex * 12,
                                alignSelf: 'start'
                              }}
                              onClick={() => setSelectedDate(startOfDay(new Date(event.date)))}
                              title={event.name}
                            >
                              <span className="truncate">{event.name}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Resize Handle - Only show on desktop */}
          {!isMobile && (
            <div 
              ref={resizeRef}
              className="hidden lg:flex w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors duration-200 relative group"
              onMouseDown={handleMouseDown}
            >
            <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
              <div className="w-0.5 h-8 bg-muted-foreground/30 group-hover:bg-primary/70 rounded-full transition-colors duration-200 flex items-center justify-center">
                <GripVertical className="w-3 h-3 text-muted-foreground/50 group-hover:text-primary/70" />
              </div>
            </div>
            </div>
          )}

          {/* Events Section */}
          <div 
            className="p-3 sm:p-4 lg:p-6 overflow-y-auto min-h-0 max-h-[50vh] lg:max-h-none scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
            style={{ width: isMobile ? '100%' : `${100 - calendarWidth}%` }}
          >
            {selectedDate ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg lg:text-xl font-semibold">
                    {format(selectedDate, 'd MMMM yyyy', { locale: uz })}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDate(null)}
                    className="lg:hidden"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {getEventsForDay(selectedDate).length > 0 ? (
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    {getEventsForDay(selectedDate).map((event) => {
                      const eventStatus = getEventStatus(new Date(event.date))
                      let borderColor = 'border-l-primary/50'
                      let bgColor = 'bg-gradient-to-br from-primary/20 to-secondary/20'
                      
                      if (eventStatus === 'past') {
                        borderColor = 'border-l-red-500'
                        bgColor = 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20'
                      } else if (eventStatus === 'current') {
                        borderColor = 'border-l-green-500'
                        bgColor = 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20'
                      } else if (eventStatus === 'upcoming') {
                        borderColor = 'border-l-blue-500'
                        bgColor = 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20'
                      }
                      
                      const dateRange = formatEventDateRange(event)
                      
                      return (
                        <Card key={event.id} className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 ${borderColor} group`}>
                        <div className="flex flex-col sm:flex-row">
                          <div className="w-full sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 relative overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10 group-hover:opacity-90 transition-opacity">
                            <img 
                              src={event.image} 
                              alt={event.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const parent = target.parentElement
                                if (parent) {
                                  parent.className = `${bgColor} flex items-center justify-center`
                                  parent.innerHTML = `
                                    <div class="text-center">
                                      <div class="text-base sm:text-lg lg:text-xl font-bold ${eventStatus === 'past' ? 'text-red-600 dark:text-red-400' : eventStatus === 'current' ? 'text-green-600 dark:text-green-400' : eventStatus === 'upcoming' ? 'text-blue-600 dark:text-blue-400' : 'text-primary'}">
                                        ${format(selectedDate, 'd')}
                                      </div>
                                      <div class="text-xs text-muted-foreground">
                                        ${monthNames[selectedDate.getMonth()]}
                                      </div>
                                    </div>
                                  `
                                }
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-1 left-1 right-1 text-center">
                              <div className={`text-xs sm:text-sm font-bold text-white drop-shadow-md ${
                                eventStatus === 'past' ? 'text-red-200' :
                                eventStatus === 'current' ? 'text-green-200' :
                                eventStatus === 'upcoming' ? 'text-blue-200' :
                                'text-white'
                              }`}>
                                {dateRange}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 p-2 sm:p-3 lg:p-4">
                            <CardHeader className="p-0 mb-1 sm:mb-2">
                              <CardTitle className="text-sm sm:text-base lg:text-lg line-clamp-1">{event.name}</CardTitle>
                              <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="line-clamp-1">{event.location}</span>
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                                {event.description}
                              </p>
                              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEventDetails(event)}
                                  className="text-xs h-8 hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  Batafsil
                                </Button>
                                <Button size="sm" variant="outline" asChild className="text-xs h-8">
                                  <a 
                                    href={event["location-yandex-map"]} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    Xarita
                                  </a>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => {
                                    setRegistrationEvent(event)
                                    setIsRegistrationOpen(true)
                                  }}
                                  className="text-xs h-8 hover:bg-green-50 hover:border-green-300 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:border-green-700 dark:hover:text-green-300 transition-colors"
                                >
                                  <UserPlus className="h-3 w-3 mr-1" />
                                  Ro'yxat
                                </Button>
                              </div>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 lg:py-12">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                      <CalendarIcon className="h-8 w-8 lg:h-10 lg:w-10 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm lg:text-base">Bu kunda tadbir yo'q</p>
                    <p className="text-xs text-muted-foreground/60 mt-2 lg:hidden">Yuqoriga scroll qiling</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg lg:text-xl font-semibold">
                    {monthNames[currentDate.getMonth()]} oyidagi tadbirlar
                  </h3>
                </div>
                {monthEvents.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    {monthEvents.map((event) => {
                      const eventStatus = getEventStatus(new Date(event.date))
                      let borderColor = 'border-l-primary/50'
                      let bgColor = 'bg-gradient-to-br from-primary/20 to-secondary/20'
                      
                      if (eventStatus === 'past') {
                        borderColor = 'border-l-red-500'
                        bgColor = 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20'
                      } else if (eventStatus === 'current') {
                        borderColor = 'border-l-green-500'
                        bgColor = 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20'
                      } else if (eventStatus === 'upcoming') {
                        borderColor = 'border-l-blue-500'
                        bgColor = 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20'
                      }
                      
                      const dateRange = formatEventDateRange(event)
                      const eventDate = new Date(event.date)
                      
                      return (
                        <Card key={event.id} className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 ${borderColor} group`}>
                        <div className="flex flex-col sm:flex-row">
                          <div className="w-full sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 relative overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10 group-hover:opacity-90 transition-opacity">
                            <img 
                              src={event.image} 
                              alt={event.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const parent = target.parentElement
                                if (parent) {
                                  parent.className = `${bgColor} flex items-center justify-center group-hover:opacity-80 transition-colors`
                                  parent.innerHTML = `
                                    <div class="text-center">
                                      <div class="text-base sm:text-lg lg:text-xl font-bold ${eventStatus === 'past' ? 'text-red-600 dark:text-red-400' : eventStatus === 'current' ? 'text-green-600 dark:text-green-400' : eventStatus === 'upcoming' ? 'text-blue-600 dark:text-blue-400' : 'text-primary'}">
                                        ${format(eventDate, 'd')}
                                      </div>
                                      <div class="text-xs text-muted-foreground">
                                        ${monthNames[eventDate.getMonth()]}
                                      </div>
                                    </div>
                                  `
                                }
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-1 left-1 right-1 text-center">
                              <div className={`text-xs sm:text-sm font-bold text-white drop-shadow-md ${
                                eventStatus === 'past' ? 'text-red-200' :
                                eventStatus === 'current' ? 'text-green-200' :
                                eventStatus === 'upcoming' ? 'text-blue-200' :
                                'text-white'
                              }`}>
                                {dateRange}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 p-2 sm:p-3 lg:p-4">
                            <CardHeader className="p-0 mb-1 sm:mb-2">
                              <CardTitle className="text-sm sm:text-base lg:text-lg line-clamp-1">{event.name}</CardTitle>
                              <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="line-clamp-1">{event.location}</span>
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                                {event.description}
                              </p>
                              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEventDetails(event)}
                                  className="text-xs h-8 hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  Batafsil
                                </Button>
                                <Button size="sm" variant="outline" asChild className="text-xs h-8">
                                  <a 
                                    href={event["location-yandex-map"]} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    Xarita
                                  </a>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => {
                                    setRegistrationEvent(event)
                                    setIsRegistrationOpen(true)
                                  }}
                                  className="text-xs h-8 hover:bg-green-50 hover:border-green-300 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:border-green-700 dark:hover:text-green-300 transition-colors"
                                >
                                  <UserPlus className="h-3 w-3 mr-1" />
                                  Ro'yxat
                                </Button>
                              </div>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 lg:py-12">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                      <CalendarIcon className="h-8 w-8 lg:h-10 lg:w-10 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm lg:text-base">Bu oyda tadbir yo'q</p>
                    <p className="text-xs text-muted-foreground/60 mt-2 lg:hidden">Yuqoriga scroll qiling</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Event Details Modal */}
      <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                  </div>
                  {selectedEvent.name}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selectedEvent.location}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Event Image */}
                <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  <img 
                    src={selectedEvent.image} 
                    alt={selectedEvent.name}
                    className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                    style={{
                      imageRendering: 'auto',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                    loading="eager"
                    decoding="sync"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-sm font-medium">
                      {format(new Date(selectedEvent.date), 'd MMMM yyyy', { locale: uz })}
                    </div>
                  </div>
                </div>

                {/* Event Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tavsif</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      Sana
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedEvent.date), 'EEEE, d MMMM yyyy', { locale: uz })}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Manzil
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.location}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button 
                    asChild 
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    <a 
                      href={selectedEvent["location-yandex-map"]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Xaritada ko'rish
                    </a>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEventDetailsOpen(false)}
                    className="flex-1"
                  >
                    Yopish
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Registration Modal */}
      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] max-w-none h-[65vh] max-h-[65vh] overflow-hidden p-0" style={{ width: '80vw', maxWidth: 'none', height: '65vh' }}>
          <div className="flex h-full">
            {/* Event Image Section - Left Side */}
            {registrationEvent && (
              <div className="w-full sm:w-[40%] md:w-[35%] bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                <div className="relative h-full w-full" style={{ 
                  backgroundImage: `url(${registrationEvent?.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}>
                  <img 
                    src={registrationEvent.image} 
                    alt={registrationEvent.name}
                    className="w-full h-full object-cover object-center transition-all duration-300 hover:scale-105"
                    style={{
                      imageRendering: 'auto',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                    loading="eager"
                    decoding="sync"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-lg lg:text-xl font-bold mb-1">
                      {registrationEvent.name}
                    </div>
                    <div className="text-sm lg:text-base opacity-90 mb-2">
                      {format(new Date(registrationEvent.date), 'd MMMM yyyy', { locale: uz })}
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2 text-sm lg:text-base">
                      <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
                      <span className="truncate">{registrationEvent.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Right Side - Two Separate Windows */}
            <div className="w-full sm:w-[60%] md:w-[65%] flex flex-col sm:flex-row">
              {/* Event Details Window */}
              {registrationEvent && (
                <div className="w-full sm:w-1/2 p-3 sm:p-4 border-b sm:border-b-0 sm:border-r bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div className="h-full flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-6 text-center">Tadbir haqida</h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <CalendarIcon className="h-6 w-6 text-primary flex-shrink-0" />
                        <div>
                          <div className="font-medium text-lg">Sana va vaqt</div>
                          <div className="text-base text-muted-foreground">
                            {format(new Date(registrationEvent.date), 'EEEE, d MMMM yyyy', { locale: uz })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                        <div>
                          <div className="font-medium text-lg">Manzil</div>
                          <div className="text-base text-muted-foreground">
                            {registrationEvent.location}
                          </div>
                        </div>
                      </div>
                      <div className="pt-3">
                        <div className="font-medium mb-4 text-lg">Tavsif</div>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          {registrationEvent.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Registration Form Window */}
              <div className="w-full sm:w-1/2 p-3 sm:p-4 overflow-y-auto">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-bold text-center">
                    Ro'yxatdan o'ting
                  </DialogTitle>
                  <DialogDescription className="text-center text-sm">
                    Bepul hisob yarating va maxsus takliflardan foydalaning
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="calendar-fullName" className="text-sm font-medium">
                      To'liq ism
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="calendar-fullName"
                        type="text"
                        placeholder="Ismingizni kiriting"
                        className="pl-10 h-12 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calendar-email" className="text-sm font-medium">
                      Email manzil
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="calendar-email"
                        type="email"
                        placeholder="email@example.com"
                        className="pl-10 h-12 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calendar-phone" className="text-sm font-medium">
                      Telefon raqam
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="calendar-phone"
                        type="tel"
                        placeholder="+998 90 123 45 67"
                        className="pl-10 h-12 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calendar-password" className="text-sm font-medium">
                      Parol
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="calendar-password"
                        type="password"
                        placeholder="Kuchli parol yarating"
                        className="pl-10 pr-10 h-12 text-sm"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calendar-confirmPassword" className="text-sm font-medium">
                      Parolni tasdiqlang
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="calendar-confirmPassword"
                        type="password"
                        placeholder="Parolni qayta kiriting"
                        className="pl-10 pr-10 h-12 text-sm"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      id="calendar-terms"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    />
                    <Label htmlFor="calendar-terms" className="text-sm text-muted-foreground">
                      <a href="#" className="text-primary hover:underline">
                        Foydalanish shartlari
                      </a>{" "}
                      va{" "}
                      <a href="#" className="text-primary hover:underline">
                        Maxfiylik siyosati
                      </a>{" "}
                      bilan roziman
                    </Label>
                  </div>

                  <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl mt-6">
                    Ro'yxatdan o'tish
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                      <span className="bg-background px-2 text-muted-foreground">yoki</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 w-full">
                    <Button variant="outline" className="flex-1 h-12 text-sm">
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button variant="outline" className="flex-1 h-12 text-sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Telegram
                    </Button>
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    Allaqachon hisobingiz bormi?{" "}
                    <a href="#" className="text-primary hover:underline font-medium">
                      Kirish
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
