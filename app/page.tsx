"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EventsCalendar } from "@/components/events-calendar"
import {
  MapPin,
  Star,
  Calendar,
  Users,
  Wifi,
  Car,
  Coffee,
  Phone,
  Instagram,
  Facebook,
  MessageCircle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Utensils,
  Bed,
  Sparkles,
} from "lucide-react"
import eventsData from "@/store/events.json"
import hotelsRestaurantsData from "@/store/hotels-restaurants.json"
import { isSameMonth, format } from "date-fns"
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

interface Hotel {
  id: number
  name: string
  description: string
  rating: number
  priceRange: string
  priceFrom: string
  features: string[]
  image: string
  location: string
  "location-yandex-map": string
}

interface Restaurant {
  id: number
  name: string
  description: string
  rating: number
  cuisine: string
  averageCheck: string
  features: string[]
  image: string
  location: string
  "location-yandex-map": string
}

export default function SamarkandTravelGuide() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)

  // Функция для получения событий текущего месяца
  const getEventsForCurrentMonth = () => {
    const currentDate = new Date()
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    return (eventsData as Event[]).filter(event => {
      const eventStart = new Date(event.date)
      const eventEnd = event.endDate ? new Date(event.endDate) : new Date(event.date)
      
      // Check if event overlaps with the month
      return (eventStart <= monthEnd && eventEnd >= monthStart)
    })
  }

  // Функция для получения ближайших предстоящих событий
  const getUpcomingEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return (eventsData as Event[])
      .filter(event => {
        const eventStart = new Date(event.date)
        eventStart.setHours(0, 0, 0, 0)
        // Берем только будущие события
        return eventStart >= today
      })
      .sort((a, b) => {
        // Сортируем по дате начала
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })
      .slice(0, 3) // Берем первые 3 ближайших события
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

  const currentMonthEvents = getEventsForCurrentMonth()
  const upcomingEvents = getUpcomingEvents()
  
  const monthNames = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
  ]
  return (
    <div className="min-h-screen bg-background">
      {/* Registration Button - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Ro'yxatdan o'tish
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Ro'yxatdan o'ting
              </DialogTitle>
              <DialogDescription className="text-center">
                Bepul hisob yarating va maxsus takliflardan foydalaning
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="main-fullName" className="text-sm font-medium">
                  To'liq ism
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="main-fullName"
                    type="text"
                    placeholder="Ismingizni kiriting"
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="main-email" className="text-sm font-medium">
                  Email manzil
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="main-email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="main-phone" className="text-sm font-medium">
                  Telefon raqam
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="main-phone"
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="main-password" className="text-sm font-medium">
                  Parol
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="main-password"
                    type="password"
                    placeholder="Kuchli parol yarating"
                    className="pl-10 pr-10 h-12"
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
                <Label htmlFor="main-confirmPassword" className="text-sm font-medium">
                  Parolni tasdiqlang
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="main-confirmPassword"
                    type="password"
                    placeholder="Parolni qayta kiriting"
                    className="pl-10 pr-10 h-12"
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
                  id="main-terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <Label htmlFor="main-terms" className="text-sm text-muted-foreground">
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

              <Button className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl mt-6">
                Ro'yxatdan o'tish
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">yoki</span>
                </div>
              </div>

              <div className="flex space-x-3 w-full">
                <Button variant="outline" className="flex-1 h-12">
                  <Facebook className="h-5 w-5 mr-2" />
                  Facebook
                </Button>
                <Button variant="outline" className="flex-1 h-12">
                  <MessageCircle className="h-5 w-5 mr-2" />
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
          </DialogContent>
        </Dialog>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary/25 via-secondary/20 to-accent/20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{
            backgroundImage: "url('/samarkand-registan.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 drop-shadow-lg">
            Samarqand: bugun va ertaga  barcha ko‘ngilochar va madaniy tadbirlar, qulay xizmatlar bir joyda
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-foreground/90 mb-8 drop-shadow-md">
            Safaringizni osonlashtiring: joylashuvingizni aniqlang, takliflarni oling va yo‘nalishingizni
            rejalang.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300">
              <MapPin className="mr-2 h-5 w-5" />
              Joylashuvni aniqlash
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-background/80 backdrop-blur-sm border-2 hover:bg-background shadow-lg hover:shadow-xl transition-all duration-300">
              Eng yaqin joylarni ko'rish
            </Button>
            <div className="relative group">
              <EventsCalendar events={eventsData} />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative py-16 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ 
            backgroundImage: "url('/back_images/back.jpg')",
            backgroundAttachment: "fixed"
          }}
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-foreground">Siz qaysi xizmatni qidiryapsiz?</h2>
          <p className="text-center text-muted-foreground mb-8 text-lg">Biz siz uchun eng yaxshi variantlarni topamiz</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Select>
              <SelectTrigger className="h-12 shadow-md hover:shadow-lg transition-shadow">
                <SelectValue placeholder="Xizmat turi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">Mehmonxona</SelectItem>
                <SelectItem value="restaurant">Restoran</SelectItem>
                <SelectItem value="attraction">Diqqatga sazovor joy</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="h-12 shadow-md hover:shadow-lg transition-shadow">
                <SelectValue placeholder="Narx oralig'i" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Arzon</SelectItem>
                <SelectItem value="mid">O'rtacha</SelectItem>
                <SelectItem value="luxury">Lyuks</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="h-12 shadow-md hover:shadow-lg transition-shadow">
                <SelectValue placeholder="Baholash" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4plus">4⭐ va undan yuqori</SelectItem>
                <SelectItem value="3plus">3⭐ va undan yuqori</SelectItem>
                <SelectItem value="all">Barchasi</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300">Qidirish</Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="relative py-20 px-4">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ 
              backgroundImage: "url('/back_images/back.jpg')",
              backgroundAttachment: "fixed"
            }}
          />
          <div className="absolute inset-0 bg-background/80" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <Calendar className="h-8 w-8 text-primary" />
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
                  Yaqinlashib kelayotgan tadbirlar
                </h2>
              </div>
              <p className="text-lg text-muted-foreground">Eng muhim va qiziqarli tadbirlarni kashf eting</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => {
                const eventDate = new Date(event.date)
                const day = format(eventDate, 'd')
                const monthIndex = eventDate.getMonth()
                const monthName = monthNames[monthIndex]
                const dateRange = formatEventDateRange(event)
                
                return (
                  <Card 
                    key={event.id}
                    className="border-2 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 overflow-hidden group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <div className={`${index % 2 === 0 ? 'bg-primary/90 text-primary-foreground' : 'bg-secondary/90 text-secondary-foreground'} rounded-lg px-3 py-1.5 text-center shadow-lg`}>
                          <div className="text-lg font-bold">{day}</div>
                          <div className="text-xs">{monthName}</div>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-white">
                          <div className="text-xl font-bold mb-1 drop-shadow-md">{event.name}</div>
                          <div className="text-sm opacity-90 drop-shadow-md">{dateRange}</div>
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardDescription className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/80 line-clamp-3">{event.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="button"
                        variant="outline" 
                        className="hover:bg-primary hover:text-primary-foreground transition-colors w-full"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setSelectedEvent(event)
                          setIsEventDialogOpen(true)
                        }}
                      >
                        Batafsil
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Hotels Section */}
      <section className="relative py-20 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ 
            backgroundImage: "url('/back_images/back.jpg')",
            backgroundAttachment: "fixed"
          }}
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Bed className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Eng yaxshi mehmonxonalar</h2>
            </div>
            <p className="text-lg text-muted-foreground">Samarqanddagi eng qulay va shinam mehmonxonalar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(hotelsRestaurantsData.hotels as Hotel[]).map((hotel) => (
              <Card 
                key={hotel.id} 
                className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary/90 text-primary-foreground shadow-lg">
                      {hotel.priceRange === "luxury" ? "Lyuks" : hotel.priceRange === "mid" ? "O'rtacha" : "Arzon"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < hotel.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">{hotel.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {hotel.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 mb-4 line-clamp-2">{hotel.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-green-500 text-white border-green-500">
                        {feature === "WiFi" && <Wifi className="h-3 w-3 mr-1 inline" />}
                        {feature === "Парковка" && <Car className="h-3 w-3 mr-1 inline" />}
                        {feature === "Завтрак" && <Coffee className="h-3 w-3 mr-1 inline" />}
                        {feature}
                      </Badge>
                    ))}
                    {hotel.features.length > 3 && (
                      <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                        +{hotel.features.length - 3}
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg font-bold text-primary">{hotel.priceFrom}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300">
                    Batafsil
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="relative py-20 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ 
            backgroundImage: "url('/back_images/back.jpg')",
            backgroundAttachment: "fixed"
          }}
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Utensils className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-black">Eng yaxshi restoranlar</h2>
            </div>
            <p className="text-lg text-black">Samarqanddagi eng mazali va mashhur restoranlar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(hotelsRestaurantsData.restaurants as Restaurant[]).map((restaurant) => (
              <Card 
                key={restaurant.id} 
                className="group overflow-hidden border-2 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-blue-600/90 text-white shadow-lg">
                      {restaurant.cuisine}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < restaurant.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">{restaurant.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {restaurant.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 mb-4 line-clamp-2">{restaurant.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-green-500 text-white border-green-500">
                        {feature === "Живая музыка" && <Sparkles className="h-3 w-3 mr-1 inline" />}
                        {feature === "Веранда" && <Coffee className="h-3 w-3 mr-1 inline" />}
                        {feature}
                      </Badge>
                    ))}
                    {restaurant.features.length > 3 && (
                      <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                        +{restaurant.features.length - 3}
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg font-bold text-blue-600">{restaurant.averageCheck}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-300 text-white">
                    Batafsil
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="relative py-16 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ 
            backgroundImage: "url('/back_images/back.jpg')",
            backgroundAttachment: "fixed"
          }}
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-foreground">Samarqanddagi yaqin tadbirlar</h2>
          {currentMonthEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentMonthEvents.map((event, index) => {
                  const eventDate = new Date(event.date)
                  const day = format(eventDate, 'd')
                  const monthIndex = eventDate.getMonth()
                  const monthName = monthNames[monthIndex]
                  const dateRange = formatEventDateRange(event)
                  
                  return (
                    <Card 
                      key={event.id}
                      className="border-2 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 overflow-hidden group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <div className={`${index % 2 === 0 ? 'bg-primary/90 text-primary-foreground' : 'bg-secondary/90 text-secondary-foreground'} rounded-lg px-3 py-1.5 text-center shadow-lg`}>
                            <div className="text-lg font-bold">{day}</div>
                            <div className="text-xs">{monthName}</div>
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="text-white">
                            <div className="text-xl font-bold mb-1 drop-shadow-md">{event.name}</div>
                            <div className="text-sm opacity-90 drop-shadow-md">{dateRange}</div>
                          </div>
                        </div>
                      </div>
                      <CardHeader>
                        <CardDescription className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/80 line-clamp-3">{event.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          type="button"
                          variant="outline" 
                          className="hover:bg-primary hover:text-primary-foreground transition-colors w-full"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setSelectedEvent(event)
                            setIsEventDialogOpen(true)
                          }}
                        >
                          Batafsil
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  To'liq taqvimni ko'rish
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-xl text-muted-foreground mb-2">Bu oyda tadbirlar yo'q</p>
              <p className="text-muted-foreground">Boshqa oylardagi tadbirlarni ko'rish uchun taqvimni tekshiring</p>
              <div className="mt-6">
                <Button variant="outline" size="lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  To'liq taqvimni ko'rish
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="relative py-16 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ 
            backgroundImage: "url('/back_images/back.jpg')",
            backgroundAttachment: "fixed"
          }}
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-foreground">Boshqa sayyohlar nima deyishmoqda?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/smiling-man-profile.png" />
                    <AvatarFallback>J</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-foreground">Jamshid</CardTitle>
                    <CardDescription>Toshkent</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">"Xizmat a'lo darajada, manzil juda qulay!"</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/smiling-woman-profile.png" />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-foreground">Malika</CardTitle>
                    <CardDescription>Buxoro</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">"Milliy taomlar juda mazali, atmosfera ajoyib!"</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/tourist-man-profile.png" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-foreground">Ahmad</CardTitle>
                    <CardDescription>Farg'ona</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="h-4 w-4 text-gray-300" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">"Registon haqiqatan ham ajoyib, lekin juda gavjum edi."</p>
              </CardContent>
            </Card>
          </div>

          {/* Review Form */}
          <div className="mt-12 max-w-2xl mx-auto">
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="text-foreground font-bold">O'z fikringizni qoldiring</CardTitle>
                <CardDescription>Boshqa sayyohlarga yordam bering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Baholash</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-6 w-6 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Izoh</label>
                  <textarea
                    className="w-full p-3 border rounded-md resize-none h-24"
                    placeholder="O'z tajribangiz haqida yozing..."
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Jo'natish</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-foreground">Qayerga bormoqchisiz?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium">Interaktiv xarita</p>
                <p className="text-muted-foreground">Google Maps integratsiyasi</p>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-foreground font-bold">Transport ma'lumoti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      <span className="text-foreground">Taksi narxi</span>
                    </div>
                    <span className="font-bold text-primary">$3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-foreground">Piyoda</span>
                    </div>
                    <span className="font-bold text-primary">10 daqiqa</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full bg-transparent">
                    Google Maps'da ochish
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      
      {/* Offline Banner */}
      <section className="py-8 px-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-2">Internet yo'qmi?</h3>
          <p className="font-medium">Xaritani oldindan yuklab, sayohatingizni davom ettiring!</p>
        </div>
      </section>

      {/* Event Details Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedEvent.name}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 pt-2">
                  <Calendar className="h-4 w-4" />
                  {formatEventDateRange(selectedEvent)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="relative h-64 overflow-hidden rounded-lg">
                  <img 
                    src={selectedEvent.image} 
                    alt={selectedEvent.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Joylashuv</p>
                      <p className="text-muted-foreground">{selectedEvent.location}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-2">Tavsif</p>
                    <p className="text-muted-foreground leading-relaxed">{selectedEvent.description}</p>
                  </div>
                  {selectedEvent["location-yandex-map"] && (
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(selectedEvent["location-yandex-map"], '_blank')}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Xaritada ko'rish
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t-2 border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-extrabold mb-4 text-foreground">Samarqand Travel Guide</h3>
            <p className="text-foreground/70 mb-6 font-medium">
              © 2025 Samarqand Travel Guide | Biz bilan bog'laning: info@samarqandtravel.uz
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
