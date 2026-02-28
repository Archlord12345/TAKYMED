import { Link, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Search,
  PlusCircle,
  Bell,
  Stethoscope,
  Menu
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-xl transition-all duration-500 hover:bg-background/95">
        <div className="container mx-auto px-4 h-20 md:h-32 flex items-center justify-between transition-all duration-500">
          <Link to="/" className="group flex items-center gap-3 md:gap-6 active:scale-95 transition-transform">
            <div className="relative p-2 md:p-4 rounded-2xl md:rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/40 shadow-xl group-hover:shadow-primary/20 transition-all duration-700 hover:rotate-3">
              <Logo className="h-10 md:h-24" showGlow />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xl md:text-4xl font-black tracking-tighter text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-indigo-600 animate-gradient-x">TAKYMED</span>
              <span className="text-[7px] md:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.4em] text-muted-foreground uppercase opacity-80 pl-0.5 md:pl-1">Take Your Medicine</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Tableau de bord
                </Link>
                <Link to="/prescription" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <PlusCircle className="w-4 h-4" />
                  Ordonnance
                </Link>
                <Link to="/search" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Search className="w-4 h-4" />
                  Médicaments & Stocks
                </Link>
                {user.type === "pharmacist" && (
                  <Link to="/pharmacy-mgmt" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Stethoscope className="w-4 h-4" />
                    Mes Pharmacies
                  </Link>
                )}
                <Link to="/ads" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Bell className="w-4 h-4" />
                  Nouveautés
                </Link>
              </>
            ) : null}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            {!user ? (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full px-6">S'inscrire</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 bg-slate-50 border rounded-full px-2 md:px-4 h-10">
                      <UserIcon className="h-4 w-4" />
                      <span className="hidden sm:inline truncate max-w-[100px]">{user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                    <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
                      <UserIcon className="h-4 w-4" /> Profil ({user.type})
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" /> Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Menu className="h-6 w-6 text-primary" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px] rounded-l-[2rem]">
                      <SheetHeader className="mb-8">
                        <SheetTitle className="text-left">Menu</SheetTitle>
                      </SheetHeader>
                      <nav className="flex flex-col gap-6">
                        <Link to="/dashboard" className="flex items-center gap-4 text-lg font-bold hover:text-primary transition-colors p-2 rounded-xl hover:bg-primary/5">
                          <LayoutDashboard className="w-6 h-6" />
                          Tableau de bord
                        </Link>
                        <Link to="/prescription" className="flex items-center gap-4 text-lg font-bold hover:text-primary transition-colors p-2 rounded-xl hover:bg-primary/5">
                          <PlusCircle className="w-6 h-6" />
                          Ordonnance
                        </Link>
                        <Link to="/search" className="flex items-center gap-4 text-lg font-bold hover:text-primary transition-colors p-2 rounded-xl hover:bg-primary/5">
                          <Search className="w-6 h-6" />
                          Médicaments & Stocks
                        </Link>
                        {user.type === "pharmacist" && (
                          <Link to="/pharmacy-mgmt" className="flex items-center gap-4 text-lg font-bold hover:text-primary transition-colors p-2 rounded-xl hover:bg-primary/5">
                            <Stethoscope className="w-6 h-6" />
                            Mes Pharmacies
                          </Link>
                        )}
                        <Link to="/ads" className="flex items-center gap-4 text-lg font-bold hover:text-primary transition-colors p-2 rounded-xl hover:bg-primary/5">
                          <Bell className="w-6 h-6" />
                          Nouveautés
                        </Link>
                      </nav>
                      <div className="absolute bottom-8 left-8 right-8">
                        <Button variant="destructive" className="w-full rounded-2xl h-12 font-bold" onClick={handleLogout}>
                          <LogOut className="w-5 h-5 mr-2" />
                          Déconnexion
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="pt-20 md:pt-32 min-h-[calc(100vh-80px-300px)] md:min-h-[calc(100vh-128px-300px)]">{children}</main>
      <footer className="bg-muted py-12 border-t">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black tracking-tighter text-slate-800">TAKYMED</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              TAKYMED : Votre allié pour une gestion optimale de vos ordonnances et rappels de médicaments.
              Assurez-vous de prendre vos médicaments au bon moment.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Services</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>
                <Link to="/search" className="hover:text-primary">Recherche</Link>
              </li>
              <li>
                <Link to="/prescription" className="hover:text-primary">Ordonnances</Link>
              </li>
              <li>
                <Link to="/ads" className="hover:text-primary">Nouveautés</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Légal</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>Confidentialité</li>
              <li>Conditions d'utilisation</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 pt-8 mt-8 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TAKYMED. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
