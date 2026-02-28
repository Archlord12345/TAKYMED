import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import {
  Mail,
  Lock,
  Phone,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Stethoscope,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Auth({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<"form" | "payment" | "pin">("form");
  const [accountType, setAccountType] = useState<"standard" | "professional" | "pharmacist">("standard");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accountType === "standard" || accountType === "pharmacist") {
      const success = await login(email || `${accountType}@test.com`, accountType);
      if (success) {
        toast.success(mode === "login" ? "Connexion réussie !" : "Compte créé !");
        navigate("/dashboard");
      }
    } else {
      if (mode === "register") {
        setStep("payment");
      } else {
        setStep("pin");
      }
    }
  };

  const handlePayment = () => {
    toast.success("Paiement réussi ! Envoi du code PIN...");
    setStep("pin");
  };

  const handlePin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(phone || "professional@test.com", "professional", phone);
    if (success) {
      toast.success("Authentification réussie !");
      navigate("/dashboard");
    }
  };

  const setTestUser = (type: "standard" | "professional" | "pharmacist") => {
    setAccountType(type);
    if (type === "standard") {
      setEmail("test@standard.com");
      setPassword("password123");
    } else if (type === "professional") {
      setPhone("+237 612345678");
    } else if (type === "pharmacist") {
      setEmail("dr.sarah@pharmacien.com");
      setPassword("admin123");
    }
    toast.info(`Identifiants de test "${type}" remplis !`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex flex-col items-center justify-center mb-10 group">
          <span className="mt-4 text-4xl font-black tracking-tighter text-primary">TAKYMED</span>
          <span className="text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase -mt-1 opacity-60">Take Your Medicine</span>
        </Link>
        <h2 className="mt-4 md:mt-6 text-center text-3xl md:text-4xl font-black text-foreground tracking-tighter">
          {mode === "login" ? "Connexion Sécurisée" : "Rejoignez TAKYMED"}
        </h2>
        <p className="mt-2 text-center text-sm md:text-base text-muted-foreground">
          {mode === "login" ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"}{" "}
          <Link
            to={mode === "login" ? "/register" : "/login"}
            className="font-medium text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 underline-offset-4"
          >
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white py-10 px-6 shadow-2xl sm:rounded-[2.5rem] sm:px-12 border border-slate-100">
          {step === "form" && (
            <>
              <Tabs
                value={accountType}
                className="w-full mb-8"
                onValueChange={(val) => setAccountType(val as any)}
              >
                <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1 bg-slate-100 h-12">
                  <TabsTrigger value="standard" className="rounded-xl py-2">Standard</TabsTrigger>
                  <TabsTrigger value="professional" className="rounded-xl py-2">Pro</TabsTrigger>
                  <TabsTrigger value="pharmacist" className="rounded-xl py-2">Pharma</TabsTrigger>
                </TabsList>

                <TabsContent value="standard" className="mt-6">
                  <form className="space-y-6" onSubmit={handleAuth}>
                    <div className="space-y-2">
                      <Label htmlFor="email">Adresse Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-10 h-11 rounded-xl"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          className="pl-10 h-11 rounded-xl"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                      {mode === "login" ? "Se connecter" : "Créer mon compte"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="professional" className="mt-6">
                  <form className="space-y-6" onSubmit={handleAuth}>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Numéro de téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+237 ..."
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10 h-11 rounded-xl"
                          required
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Utilisé pour vous envoyer votre code PIN de connexion par WhatsApp/SMS.
                      </p>
                    </div>

                    <Button className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                      {mode === "login" ? "Recevoir mon PIN" : "S'inscrire (Pro)"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="pharmacist" className="mt-6">
                  <form className="space-y-6" onSubmit={handleAuth}>
                    <div className="space-y-2">
                      <Label htmlFor="pharma-email">Email Pharmacie</Label>
                      <div className="relative">
                        <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pharma-email"
                          type="email"
                          placeholder="pharmacie@santé.com"
                          className="pl-10 h-11 rounded-xl"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pharma-password">Mot de passe Admin</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pharma-password"
                          type="password"
                          className="pl-10 h-11 rounded-xl"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] bg-slate-900">
                      Connexion Pharmacie
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Test Users helper */}
              <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                  <Info className="h-3 w-3" />
                  Comptes de test (cliquez pour remplir)
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTestUser("standard")}
                    className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-lg hover:border-primary transition-colors font-medium"
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setTestUser("professional")}
                    className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-lg hover:border-primary transition-colors font-medium"
                  >
                    Pro (PIN)
                  </button>
                  <button
                    onClick={() => setTestUser("pharmacist")}
                    className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-lg hover:border-primary transition-colors font-medium"
                  >
                    Pharmacien
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-center text-muted-foreground">
                En continuant, vous acceptez nos <span className="underline decoration-slate-300">Conditions d'Utilisation</span> et notre <span className="underline decoration-slate-300">Politique de Confidentialité</span>.
              </div>
            </>
          )}

          {step === "payment" && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Frais d'activation de compte</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Le compte Professionnel offre des fonctionnalités illimitées et nécessite un paiement unique pour l'activation.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Activation Pro</span>
                  <span className="text-primary">5,000 FCFA</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Ordonnances illimitées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Rappels par SMS, WhatsApp & Appels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Gestion de plusieurs pharmacies</span>
                  </div>
                </div>
              </div>

              <Button className="w-full h-12 rounded-xl font-bold" onClick={handlePayment}>
                Payer et Recevoir mon PIN
              </Button>
              <Button variant="ghost" className="w-full h-11 rounded-xl text-muted-foreground" onClick={() => setStep("form")}>
                Retour
              </Button>
            </div>
          )}

          {step === "pin" && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Vérification du PIN</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Un code PIN a été envoyé à <strong>{phone || "votre numéro"}</strong>.
                  Ce code est valable pour vos prochaines connexions.
                </p>
                <p className="text-[10px] text-primary mt-2">Test: Le code est <strong>1234</strong></p>
              </div>

              <form onSubmit={handlePin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pin">Code PIN reçu</Label>
                  <Input
                    id="pin"
                    type="text"
                    placeholder="XXXX"
                    className="h-14 text-center text-3xl font-mono tracking-[1em] rounded-xl"
                    maxLength={4}
                    required
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-100">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Conservez précieusement ce PIN, il fait office de mot de passe.</span>
                </div>

                <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                  Valider et Entrer
                </Button>
                <Button variant="ghost" className="w-full h-11 rounded-xl text-muted-foreground" onClick={() => setStep("form")}>
                  Renvoyer le code
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
