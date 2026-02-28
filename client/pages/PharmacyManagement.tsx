import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  Pill, 
  Trash2, 
  Edit3,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
  stocks: { medId: number; medName: string; quantity: number }[];
}

export default function PharmacyManagement() {
  const { user } = useAuth();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([
    {
      id: "1",
      name: "Pharmacie de la Paix",
      address: "123 Rue de la Santé, Douala",
      phone: "+237 600000001",
      openTime: "08:00",
      closeTime: "22:00",
      stocks: [
        { medId: 1, medName: "Doliprane 1000", quantity: 50 },
        { medId: 2, medName: "Amoxicilline 500", quantity: 20 }
      ]
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newPharmacy, setNewPharmacy] = useState({
    name: "",
    address: "",
    phone: "",
    openTime: "08:00",
    closeTime: "20:00"
  });

  const handleAddPharmacy = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    setPharmacies([...pharmacies, { ...newPharmacy, id, stocks: [] }]);
    setIsAdding(false);
    setNewPharmacy({ name: "", address: "", phone: "", openTime: "08:00", closeTime: "20:00" });
    toast.success("Pharmacie ajoutée avec succès !");
  };

  const deletePharmacy = (id: string) => {
    setPharmacies(pharmacies.filter(p => p.id !== id));
    toast.info("Pharmacie supprimée.");
  };

  if (user?.type !== "pharmacist") {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Accès restreint</h1>
        <p className="text-muted-foreground">Seuls les pharmaciens peuvent accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Gestion des Pharmacies</h1>
            <p className="text-muted-foreground mt-2">Gérez vos officines, adresses et stocks de médicaments.</p>
          </div>
          <Button onClick={() => setIsAdding(true)} className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5 mr-2" />
            Ajouter une pharmacie
          </Button>
        </div>

        {isAdding && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white rounded-[40px] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
                <h2 className="text-2xl font-bold mb-6">Nouvelle Pharmacie</h2>
                <form onSubmit={handleAddPharmacy} className="space-y-4">
                   <div className="space-y-2">
                      <Label>Nom de la pharmacie</Label>
                      <Input 
                        required 
                        value={newPharmacy.name} 
                        onChange={e => setNewPharmacy({...newPharmacy, name: e.target.value})}
                        className="rounded-xl"
                      />
                   </div>
                   <div className="space-y-2">
                      <Label>Adresse</Label>
                      <Input 
                        required 
                        value={newPharmacy.address} 
                        onChange={e => setNewPharmacy({...newPharmacy, address: e.target.value})}
                        className="rounded-xl"
                      />
                   </div>
                   <div className="space-y-2">
                      <Label>Téléphone</Label>
                      <Input 
                        required 
                        value={newPharmacy.phone} 
                        onChange={e => setNewPharmacy({...newPharmacy, phone: e.target.value})}
                        className="rounded-xl"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ouverture</Label>
                        <Input 
                          type="time" 
                          value={newPharmacy.openTime} 
                          onChange={e => setNewPharmacy({...newPharmacy, openTime: e.target.value})}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fermeture</Label>
                        <Input 
                          type="time" 
                          value={newPharmacy.closeTime} 
                          onChange={e => setNewPharmacy({...newPharmacy, closeTime: e.target.value})}
                          className="rounded-xl"
                        />
                      </div>
                   </div>
                   <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="flex-1 rounded-xl">Annuler</Button>
                      <Button type="submit" className="flex-1 rounded-xl">Enregistrer</Button>
                   </div>
                </form>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {pharmacies.map(p => (
             <div key={p.id} className="bg-white rounded-[40px] border shadow-sm p-8 space-y-8 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-4 rounded-3xl text-primary">
                        <Store className="w-8 h-8" />
                      </div>
                      <div>
                         <h3 className="text-2xl font-bold">{p.name}</h3>
                         <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <MapPin className="w-3 h-3" />
                            {p.address}
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-muted-foreground"><Edit3 className="w-5 h-5" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deletePharmacy(p.id)} className="rounded-xl h-10 w-10 text-destructive"><Trash2 className="w-5 h-5" /></Button>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                   <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Téléphone</div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                         <Phone className="w-3 h-3 text-primary" />
                         {p.phone}
                      </div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Horaires</div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                         <Clock className="w-3 h-3 text-primary" />
                         {p.openTime} - {p.closeTime}
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="font-bold flex items-center gap-2">
                        <Pill className="w-4 h-4 text-primary" />
                        Stocks Disponibles
                      </h4>
                      <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs">Mettre à jour</Button>
                   </div>
                   <div className="space-y-2">
                      {p.stocks.map(s => (
                        <div key={s.medId} className="flex justify-between items-center text-sm p-3 bg-white border rounded-2xl">
                           <span className="font-medium">{s.medName}</span>
                           <span className={cn(
                             "px-3 py-1 rounded-full font-bold",
                             s.quantity > 10 ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                           )}>
                             {s.quantity} unités
                           </span>
                        </div>
                      ))}
                      {p.stocks.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4 bg-slate-50 rounded-2xl border border-dashed">
                          Aucun médicament en stock.
                        </p>
                      )}
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
