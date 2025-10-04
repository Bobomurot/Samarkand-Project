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
} from "lucide-react"
import eventsData from "@/store/events.json"

export default function SamarkandTravelGuide() {
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
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/samarkand-registan.png')",
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Samarqanddagi eng yaxshi mehmonxonalar va restoranlarni toping!
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Sayohatingizni yanada qulay qiling: joylashuvingizni aniqlang, takliflar oling va yo'lingizni
            rejalashtiring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              <MapPin className="mr-2 h-5 w-5" />
              Joylashuvni aniqlash
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              Eng yaqin joylarni ko'rish
            </Button>
            <div className="relative group">
              <EventsCalendar events={eventsData} />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Siz qaysi xizmatni qidiryapsiz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Xizmat turi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">Mehmonxona</SelectItem>
                <SelectItem value="restaurant">Restoran</SelectItem>
                <SelectItem value="attraction">Diqqatga sazovor joy</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Narx oralig'i" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Arzon</SelectItem>
                <SelectItem value="mid">O'rtacha</SelectItem>
                <SelectItem value="luxury">Lyuks</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Baholash" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4plus">4⭐ va undan yuqori</SelectItem>
                <SelectItem value="3plus">3⭐ va undan yuqori</SelectItem>
                <SelectItem value="all">Barchasi</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full">Qidirish</Button>
          </div>
          <p className="text-center text-muted-foreground">Biz siz uchun eng yaxshi variantlarni topamiz.</p>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Bugun siz uchun eng yaxshi takliflar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/samarkand-luxury-hotel.png')",
                }}
              />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Samarqand Lux Hotel</CardTitle>
                  <Badge variant="secondary">Lyuks</Badge>
                </div>
                <CardDescription>Markazda joylashgan</CardDescription>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.8</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline">
                    <Wifi className="h-3 w-3 mr-1" />
                    Wi-Fi
                  </Badge>
                  <Badge variant="outline">
                    <Car className="h-3 w-3 mr-1" />
                    Parking
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Ko'proq ko'rish</Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/placeholder-4gaa4.png')",
                }}
              />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Caravan Oshxona</CardTitle>
                  <Badge variant="secondary">Restoran</Badge>
                </div>
                <CardDescription>Milliy taomlar</CardDescription>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.5</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline">
                    <Coffee className="h-3 w-3 mr-1" />
                    Halal
                  </Badge>
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    Oila
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Ko'proq ko'rish</Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/registan-sunset.png')",
                }}
              />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Registon Maydoni</CardTitle>
                  <Badge variant="secondary">Tarixiy joy</Badge>
                </div>
                <CardDescription>UNESCO merosi</CardDescription>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.9</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline">Bepul</Badge>
                  <Badge variant="outline">Foto</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Ko'proq ko'rish</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Boshqa sayyohlar nima deyishmoqda?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/smiling-man-profile.png" />
                    <AvatarFallback>J</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Jamshid</CardTitle>
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
                <p>"Xizmat a'lo darajada, manzil juda qulay!"</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/smiling-woman-profile.png" />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Malika</CardTitle>
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
                <p>"Milliy taomlar juda mazali, atmosfera ajoyib!"</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/tourist-man-profile.png" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Ahmad</CardTitle>
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
                <p>"Registon haqiqatan ham ajoyib, lekin juda gavjum edi."</p>
              </CardContent>
            </Card>
          </div>

          {/* Review Form */}
          <div className="mt-12 max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>O'z fikringizni qoldiring</CardTitle>
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
          <h2 className="text-3xl font-bold text-center mb-12">Qayerga bormoqchisiz?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium">Interaktiv xarita</p>
                <p className="text-muted-foreground">Google Maps integratsiyasi</p>
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transport ma'lumoti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      <span>Taksi narxi</span>
                    </div>
                    <span className="font-semibold">$3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Piyoda</span>
                    </div>
                    <span className="font-semibold">10 daqiqa</span>
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

      {/* Events Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Samarqanddagi yaqin tadbirlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-lg p-3 text-center min-w-[60px]">
                    <div className="text-2xl font-bold">21</div>
                    <div className="text-sm">Mart</div>
                  </div>
                  <div>
                    <CardTitle>Navro'z</CardTitle>
                    <CardDescription>Registon maydoni</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Sharqona bayram, sumalak tayyorlash marosimi</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Batafsil</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary text-secondary-foreground rounded-lg p-3 text-center min-w-[60px]">
                    <div className="text-2xl font-bold">25</div>
                    <div className="text-sm">Mart</div>
                  </div>
                  <div>
                    <CardTitle>Lola Festivali</CardTitle>
                    <CardDescription>Farg'ona yo'nalishi</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Bahoriy guldastalar bilan sayr</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Batafsil</Button>
              </CardFooter>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              <Calendar className="mr-2 h-5 w-5" />
              To'liq taqvimni ko'rish
            </Button>
          </div>
        </div>
      </section>

      {/* Offline Banner */}
      <section className="py-8 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-2">Internet yo'qmi?</h3>
          <p>Xaritani oldindan yuklab, sayohatingizni davom ettiring!</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Samarqand Travel Guide</h3>
            <p className="text-muted-foreground mb-6">
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
