import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Pill, 
  Info, 
  AlertTriangle, 
  Stethoscope, 
  Plus,
  Bookmark,
  ChevronRight,
  Filter,
  MapPin,
  Navigation,
  Store,
  CheckCircle2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MOCK_MEDICATIONS = [
  { id: 1, name: "Doliprane 1000", type: "comprimé", description: "Paracétamol, indiqué en cas de douleur et/ou fièvre.", mode: "orale", moment: "indifferent", precautions: "aucune" },
  { id: 2, name: "Amoxicilline 500", type: "gelule", description: "Antibiotique de la famille des pénicillines.", mode: "orale", moment: "pendant_repas", precautions: "aucune" },
  { id: 3, name: "Ventoline", type: "spray", description: "Traitement de fond de l'asthme.", mode: "inhalation", moment: "indifferent", precautions: "aucune" },
  { id: 4, name: "Spasfon", type: "comprimé", description: "Traitement des douleurs spasmodiques.", mode: "orale", moment: "avant_repas", precautions: "aucune" },
  { id: 5, name: "Maxilase", type: "sirop", description: "Indiqué en cas d'oedèmes de la gorge.", mode: "orale", moment: "apres_repas", precautions: "aucune" },
  { id: 6, name: "Gaviscon", type: "sirop", description: "Remontées acides et brûlures d'estomac.", mode: "orale", moment: "apres_repas", precautions: "aucune" },
];

const MOCK_PHARMACIES = [
  { id: 1, name: "Pharmacie de la Paix", address: "Bonapriso, Douala", phone: "+237 6001", distance: 1.2, stocks: [1, 2, 4] },
  { id: 2, name: "Pharmacie Saint Jean", address: "Akwa, Douala", phone: "+237 6002", distance: 3.5, stocks: [1, 3, 5] },
  { id: 3, name: "Pharmacie du Littoral", address: "Deido, Douala", phone: "+237 6003", distance: 0.8, stocks: [2, 3, 6] },
];

export default function SearchMedications() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedMed, setSelectedMed] = useState<typeof MOCK_MEDICATIONS[0] | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const filtered = MOCK_MEDICATIONS.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));

  const handleGetLocation = () => {
    setIsFindingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setIsFindingLocation(false);
          toast.success("Position récupérée !");
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsFindingLocation(false);
          toast.error("Impossible de récupérer votre position.");
        }
      );
    } else {
      setIsFindingLocation(false);
      toast.error("Géolocalisation non supportée par votre navigateur.");
    }
  };

  const pharmaciesWithStock = selectedMed 
    ? MOCK_PHARMACIES.filter(p => p.stocks.includes(selectedMed.id)).sort((a, b) => a.distance - b.distance)
    : [];

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
           <h1 className="text-4xl font-extrabold tracking-tight mb-4">Rechercher un Médicament</h1>
           <p className="text-muted-foreground max-w-lg mx-auto">
            Trouvez les informations et vérifiez la disponibilité dans les pharmacies les plus proches.
           </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
           {/* Search & Location Row */}
           <div className="flex flex-col md:flex-row gap-4 items-center group">
              <div className="relative flex-1 w-full flex items-center bg-white border rounded-[30px] p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="ml-4 h-6 w-6 text-muted-foreground" />
                <Input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tapez le nom d'un médicament..." 
                  className="border-none text-xl h-14 focus-visible:ring-0 bg-transparent rounded-none"
                />
              </div>
              <Button 
                onClick={handleGetLocation} 
                disabled={isFindingLocation}
                variant="outline" 
                className="h-16 px-8 rounded-[30px] font-bold gap-2 border-primary/20 hover:bg-primary/5 text-primary"
              >
                <Navigation className={cn("w-5 h-5", isFindingLocation && "animate-spin")} />
                {userLocation ? "Ma position ok" : "Pharmacie à proximité"}
              </Button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Results List */}
              <div className="lg:col-span-4 space-y-4">
                 <div className="flex items-center justify-between px-2 text-sm text-muted-foreground mb-2">
                    <span>{filtered.length} médicaments trouvés</span>
                 </div>
                 <div className="space-y-3">
                   {filtered.map(m => (
                     <button 
                        key={m.id} 
                        onClick={() => setSelectedMed(m)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-3xl border bg-white transition-all text-left hover:border-primary/50",
                          selectedMed?.id === m.id ? "border-primary ring-4 ring-primary/5 bg-primary/5" : "border-slate-100"
                        )}
                     >
                       <div className={cn(
                         "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                         selectedMed?.id === m.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                       )}>
                         <Pill className="w-6 h-6" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h3 className="font-bold truncate">{m.name}</h3>
                         <p className="text-xs text-muted-foreground">{m.type}</p>
                       </div>
                       <ChevronRight className="w-4 h-4 text-slate-300" />
                     </button>
                   ))}
                 </div>
              </div>

              {/* Detail View & Availability */}
              <div className="lg:col-span-8 space-y-8">
                {selectedMed ? (
                  <>
                    {/* Med Info Card */}
                    <div className="bg-white rounded-[40px] border shadow-sm p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                         <div className="space-y-2">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                              {selectedMed.type}
                            </div>
                            <h2 className="text-4xl font-extrabold text-foreground">{selectedMed.name}</h2>
                         </div>
                         <div className="flex gap-3">
                            <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-slate-200">
                              <Bookmark className="w-5 h-5" />
                            </Button>
                            <Button className="rounded-2xl h-12 px-6 font-bold bg-primary shadow-lg shadow-primary/20">
                               <Plus className="w-4 h-4 mr-2" />
                               Ajouter au traitement
                            </Button>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary font-bold">
                               <Info className="w-5 h-5" />
                               <span>Description</span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {selectedMed.description}
                            </p>
                         </div>
                         <div className="space-y-4">
                            <div className="flex items-center gap-2 text-amber-600 font-bold">
                               <AlertTriangle className="w-5 h-5" />
                               <span>Précautions</span>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-sm text-amber-800">
                              Précautions: {selectedMed.precautions}. Mode: {selectedMed.mode}.
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Availability Card */}
                    <div className="bg-white rounded-[40px] border shadow-sm p-8 space-y-6">
                       <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold flex items-center gap-3">
                            <Store className="w-6 h-6 text-primary" />
                            Disponibilité en pharmacie
                          </h3>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {pharmaciesWithStock.map(p => (
                            <div key={p.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50 space-y-4 hover:border-primary/50 transition-all group">
                               <div className="flex justify-between items-start">
                                  <div className="space-y-1">
                                     <h4 className="font-bold text-lg">{p.name}</h4>
                                     <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <MapPin className="w-3 h-3" />
                                        {p.address}
                                     </div>
                                  </div>
                                  <div className="bg-white px-2 py-1 rounded-lg border text-[10px] font-bold text-primary">
                                     {p.distance} km
                                  </div>
                               </div>
                               <div className="flex items-center justify-between pt-2">
                                  <div className="flex items-center gap-1 text-green-600 font-bold text-xs">
                                     <CheckCircle2 className="w-4 h-4" />
                                     En stock
                                  </div>
                                  <Button variant="ghost" className="h-8 rounded-xl text-xs font-bold gap-2">
                                     Appeler
                                  </Button>
                               </div>
                            </div>
                          ))}
                          {pharmaciesWithStock.length === 0 && (
                            <div className="md:col-span-2 p-12 text-center text-muted-foreground bg-slate-50 rounded-[30px] border border-dashed">
                               Aucune pharmacie repertoriée ne possède ce médicament en stock pour le moment.
                            </div>
                          )}
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="h-[500px] bg-white rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-50">
                     <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <Pill className="w-10 h-10" />
                     </div>
                     <div className="space-y-1">
                        <p className="font-bold text-slate-600">Sélectionnez un médicament</p>
                        <p className="text-sm text-slate-400">Pour voir sa description et ses stocks en pharmacie.</p>
                     </div>
                  </div>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
