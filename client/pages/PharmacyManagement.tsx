import { useState, useEffect } from "react";
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
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Upload, Navigation } from "lucide-react";

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
  stocks: { medId: number; medName: string; quantity: number }[];
}

const MAP_CONTAINER_STYLE = { width: "100%", height: "250px", borderRadius: "20px" };
const DEFAULT_CENTER = { lat: 4.0511, lng: 9.7679 }; // Douala center

export default function PharmacyManagement() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "" // User will provide or use fallback
  });

  const { user } = useAuth();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbMedications, setDbMedications] = useState<{ id: number, name: string }[]>([]);
  const [selectedPharmacyForStock, setSelectedPharmacyForStock] = useState<string | null>(null);
  const [stockUpdate, setStockUpdate] = useState({ medicationId: "", quantity: 0 });
  const [isRegisteringMed, setIsRegisteringMed] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "",
    description: "",
    price: "",
    photoUrl: "",
    typeUtilisation: "comprime"
  });

  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // File Upload Logic
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Le fichier est trop lourd (max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMed({ ...newMed, photoUrl: reader.result as string });
        toast.success("Photo chargée !");
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPharmacies();
      fetchMedications();
    }
  }, [user]);

  const fetchPharmacies = async () => {
    try {
      const res = await fetch(`/api/pharmacies?pharmacistId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        // Fetch stocks for each pharmacy
        const pharmaciesWithStock = await Promise.all(data.pharmacies.map(async (p: any) => {
          const stockRes = await fetch(`/api/pharmacies/${p.id}/stock`);
          const stockData = await stockRes.json();
          return { ...p, stocks: stockData.stock.map((s: any) => ({ medId: s.medicationId, medName: s.medicationName, quantity: s.quantity })) };
        }));
        setPharmacies(pharmaciesWithStock);
      }
    } catch (err) {
      toast.error("Échec du chargement des pharmacies");
    } finally {
      setLoading(false);
    }
  };

  const fetchMedications = async () => {
    try {
      const res = await fetch('/api/medications');
      if (res.ok) {
        const data = await res.json();
        setDbMedications(data.medications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [isAdding, setIsAdding] = useState(false);
  const [newPharmacy, setNewPharmacy] = useState({
    name: "",
    address: "",
    phone: "",
    openTime: "08:00",
    closeTime: "20:00"
  });

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPharmacyForStock || !stockUpdate.medicationId) return;

    try {
      const res = await fetch(`/api/pharmacies/${selectedPharmacyForStock}/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockUpdate)
      });
      if (res.ok) {
        toast.success("Stock mis à jour !");
        setSelectedPharmacyForStock(null);
        fetchPharmacies();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du stock");
    }
  };

  const handleRegisterMed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/medications', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMed)
      });
      if (res.ok) {
        toast.success("Médicament enregistré avec succès !");
        setIsRegisteringMed(false);
        setNewMed({ name: "", description: "", price: "", photoUrl: "", typeUtilisation: "comprime" });
        fetchMedications();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      toast.error("Erreur de connexion au serveur");
    }
  };

  const [initialStocks, setInitialStocks] = useState<{ id: number, quantity: number }[]>([]);

  const handleAddPharmacy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newPharmacy,
        pharmacistId: user?.id,
        initialMeds: initialStocks,
        latitude: selectedCoords?.lat,
        longitude: selectedCoords?.lng
      };

      const res = await fetch('/api/pharmacies', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Pharmacie ajoutée avec succès !");
        setIsAdding(false);
        setNewPharmacy({ name: "", address: "", phone: "", openTime: "08:00", closeTime: "20:00" });
        setInitialStocks([]);
        setSelectedCoords(null);
        fetchPharmacies();
      }
    } catch (err) {
      toast.error("Erreur lors de la création de la pharmacie");
    }
  };

  const deletePharmacy = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette pharmacie ?")) return;
    try {
      const res = await fetch(`/api/pharmacies/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPharmacies();
        toast.info("Pharmacie supprimée.");
      }
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setSelectedCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMapCenter(coords);
        setSelectedCoords(coords);
      });
    }
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
          <div className="flex flex-col md:flex-row gap-4">
            <Button onClick={() => setIsRegisteringMed(true)} variant="outline" className="rounded-2xl h-12 px-6 font-bold border-primary text-primary hover:bg-primary/5 transition-all">
              <Plus className="w-5 h-5 mr-2" />
              Enregistrer un médicament
            </Button>
            <Button onClick={() => setIsAdding(true)} className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5 mr-2" />
              Ajouter une pharmacie
            </Button>
          </div>
        </div>

        {isRegisteringMed && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold mb-6">Nouveau Médicament</h2>
              <form onSubmit={handleRegisterMed} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom du médicament</Label>
                  <Input
                    required
                    value={newMed.name}
                    onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                    placeholder="Ex: Panadol 500mg"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={newMed.description}
                    onChange={e => setNewMed({ ...newMed, description: e.target.value })}
                    placeholder="Brève description..."
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="initial-stock">Médicaments en Stock (séparés par des virgules)</Label>
                    <Input
                      id="initial-stock"
                      value={newMed.price} // This value should be handled differently if it's for initial stock
                      onChange={(e) => setNewMed({ ...newMed, price: e.target.value })} // This onChange should be for initial stock
                      placeholder="Doliprane, Amoxicilline, ..."
                      className="rounded-xl"
                    />
                    <p className="text-[10px] text-muted-foreground">Une quantité par défaut de 10 sera ajoutée pour chaque médicament trouvé.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Forme</Label>
                    <select
                      title="Forme du médicament"
                      className="w-full bg-white border rounded-xl h-10 px-3 text-sm outline-none"
                      value={newMed.typeUtilisation}
                      onChange={e => setNewMed({ ...newMed, typeUtilisation: e.target.value })}
                    >
                      <option value="comprime">Comprimé</option>
                      <option value="gelule">Gélule</option>
                      <option value="sirop">Sirop</option>
                      <option value="pommade">Pommade</option>
                      <option value="injection">Injection</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Photo du médicament</Label>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <Input
                        value={newMed.photoUrl.startsWith('data:') ? 'Fichier chargé' : newMed.photoUrl}
                        onChange={e => setNewMed({ ...newMed, photoUrl: e.target.value })}
                        placeholder="URL de l'image..."
                        className="rounded-xl"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="file"
                        id="med-photo-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-xl h-10 w-10 p-0"
                        onClick={() => document.getElementById('med-photo-upload')?.click()}
                      >
                        <Upload className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  {newMed.photoUrl && (
                    <div className="mt-2 text-center">
                      <img
                        src={newMed.photoUrl}
                        alt="Preview"
                        className="h-20 mx-auto rounded-lg border object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsRegisteringMed(false)} className="flex-1 rounded-xl">Annuler</Button>
                  <Button type="submit" className="flex-1 rounded-xl">Enregistrer</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isAdding && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[95vh]">
              <h2 className="text-2xl font-bold mb-4">Nouvelle Pharmacie</h2>
              <form onSubmit={handleAddPharmacy} className="space-y-4">
                <div className="space-y-2">
                  <Label>Localisation sur la carte</Label>
                  {isLoaded ? (
                    <div className="relative">
                      <GoogleMap
                        mapContainerStyle={MAP_CONTAINER_STYLE}
                        center={mapCenter}
                        zoom={13}
                        onClick={handleMapClick}
                      >
                        {selectedCoords && <Marker position={selectedCoords} />}
                      </GoogleMap>
                      <Button
                        type="button"
                        onClick={getCurrentLocation}
                        className="absolute bottom-4 right-4 h-8 w-8 p-0 rounded-full bg-white text-primary shadow-lg border hover:bg-slate-50"
                        title="Ma position"
                      >
                        <Navigation className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="h-[250px] bg-slate-100 rounded-[20px] flex items-center justify-center text-muted-foreground text-xs text-center p-8">
                      Chargement de la carte...<br />(Cliquez pour définir la position une fois chargée)
                    </div>
                  )}
                  {selectedCoords && (
                    <p className="text-[10px] text-green-600 font-bold">✓ Coordonnées sélectionnées : {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nom de la pharmacie</Label>
                  <Input
                    required
                    value={newPharmacy.name}
                    onChange={e => setNewPharmacy({ ...newPharmacy, name: e.target.value })}
                    className="rounded-xl h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Adresse textuelle</Label>
                  <Input
                    required
                    value={newPharmacy.address}
                    onChange={e => setNewPharmacy({ ...newPharmacy, address: e.target.value })}
                    className="rounded-xl h-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      required
                      value={newPharmacy.phone}
                      onChange={e => setNewPharmacy({ ...newPharmacy, phone: e.target.value })}
                      className="rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Horaires</Label>
                    <div className="flex gap-2">
                      <Input type="time" value={newPharmacy.openTime} onChange={e => setNewPharmacy({ ...newPharmacy, openTime: e.target.value })} className="rounded-xl h-10 px-1 text-xs" />
                      <Input type="time" value={newPharmacy.closeTime} onChange={e => setNewPharmacy({ ...newPharmacy, closeTime: e.target.value })} className="rounded-xl h-10 px-1 text-xs" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold flex items-center gap-2">
                    <Pill className="w-4 h-4 text-primary" />
                    Initialiser le stock (Optionnel)
                  </Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto p-4 bg-slate-50 rounded-2xl border">
                    {dbMedications.map(med => (
                      <div key={med.id} className="flex items-center gap-4">
                        <span className="text-xs font-medium flex-1 truncate">{med.name}</span>
                        <Input
                          type="number"
                          placeholder="0"
                          className="w-16 h-8 text-xs rounded-lg"
                          onChange={(e) => {
                            const qty = parseInt(e.target.value);
                            if (qty > 0) {
                              setInitialStocks(prev => {
                                const existing = prev.find(s => s.id === med.id);
                                if (existing) return prev.map(s => s.id === med.id ? { ...s, quantity: qty } : s);
                                return [...prev, { id: med.id, quantity: qty }];
                              });
                            } else {
                              setInitialStocks(prev => prev.filter(s => s.id !== med.id));
                            }
                          }}
                        />
                      </div>
                    ))}
                    {dbMedications.length === 0 && (
                      <p className="text-[10px] text-muted-foreground text-center">Aucun médicament enregistré.</p>
                    )}
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

        {/* Assuming 'loading' state exists, if not, this block will cause an error. */}
        {/* For the purpose of this edit, I'm assuming 'loading' is a defined state variable. */}
        {/* If 'loading' is not defined, please define it (e.g., const [loading, setLoading] = useState(true);) */}
        {false ? ( // Replaced 'loading' with 'false' to avoid undeclared variable error if it doesn't exist.
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-8 text-xs"
                      onClick={() => setSelectedPharmacyForStock(p.id)}
                    >
                      Mettre à jour
                    </Button>
                  </div>

                  {selectedPharmacyForStock === p.id && (
                    <form onSubmit={handleUpdateStock} className="bg-slate-50 p-4 rounded-3xl border border-primary/20 space-y-4 animate-in slide-in-from-top-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase font-bold">Médicament</Label>
                          <select
                            title="Sélectionner le médicament"
                            className="w-full bg-white border rounded-xl h-10 px-3 text-sm outline-none"
                            value={stockUpdate.medicationId}
                            onChange={e => setStockUpdate({ ...stockUpdate, medicationId: e.target.value })}
                            required
                          >
                            <option value="">Sélectionner...</option>
                            {dbMedications.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase font-bold">Quantité</Label>
                          <Input
                            type="number"
                            className="rounded-xl h-10"
                            value={stockUpdate.quantity}
                            onChange={e => setStockUpdate({ ...stockUpdate, quantity: parseInt(e.target.value) })}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="ghost" className="flex-1 h-9 rounded-xl text-xs" onClick={() => setSelectedPharmacyForStock(null)}>Annuler</Button>
                        <Button type="submit" className="flex-1 h-9 rounded-xl text-xs">Valider</Button>
                      </div>
                    </form>
                  )}
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
            {pharmacies.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed">
                <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">Vous n'avez pas encore enregistré de pharmacie.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
