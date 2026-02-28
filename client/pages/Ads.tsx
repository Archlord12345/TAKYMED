import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  ArrowRight, 
  Pill, 
  Info, 
  Calendar, 
  Stethoscope, 
  TrendingUp,
  Tag,
  Star,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const NEW_MEDICATIONS = [
  { 
    id: 1, 
    name: "Artemisia Pro", 
    tag: "Nouveau", 
    category: "Antipaludique", 
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=300",
    description: "Formule renforcée pour un traitement rapide et efficace du paludisme simple.",
    price: "4,500 FCFA"
  },
  { 
    id: 2, 
    name: "Vitamine C+ Zinc", 
    tag: "Promotion", 
    category: "Complément", 
    image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=400&h=300",
    description: "Boostez votre système immunitaire avec notre nouvelle synergie Vitamine C et Zinc.",
    price: "3,200 FCFA"
  },
  { 
    id: 3, 
    name: "CardioRelax 20mg", 
    tag: "Nouveau", 
    category: "Cardiologie", 
    image: "https://images.unsplash.com/photo-1576091160550-2173bdd99602?auto=format&fit=crop&q=80&w=400&h=300",
    description: "Traitement innovant pour la régulation de la tension artérielle légère à modérée.",
    price: "7,800 FCFA"
  }
];

export default function Ads() {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16 space-y-4">
           <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest gap-2">
             <Sparkles className="w-4 h-4 animate-pulse" />
             Nouveautés du Mois
           </div>
           <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Découvrez nos solutions santé</h1>
           <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
             Restez informé sur les derniers traitements et innovations médicales disponibles pour votre bien-être.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
           {NEW_MEDICATIONS.map((med, idx) => (
             <div key={med.id} className="group relative bg-white rounded-[40px] border shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
                <div className="h-64 overflow-hidden relative">
                   <img 
                    src={med.image} 
                    alt={med.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute top-4 left-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        med.tag === "Nouveau" ? "bg-primary text-white" : "bg-green-500 text-white"
                      )}>
                        {med.tag}
                      </span>
                   </div>
                   <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-bold text-primary shadow-lg border border-white/20">
                      {med.price}
                   </div>
                </div>
                <div className="p-8 flex-1 flex flex-col space-y-4">
                   <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                      <Tag className="w-3 h-3" />
                      {med.category}
                   </div>
                   <h3 className="text-2xl font-extrabold group-hover:text-primary transition-colors">{med.name}</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                     {med.description}
                   </p>
                   <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
                      <Link to={`/search?q=${med.name}`}>
                        <Button variant="ghost" className="rounded-xl h-10 hover:bg-slate-50 font-bold group-hover:text-primary">
                           Détails
                           <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                      <Link to="/prescription">
                        <Button className="rounded-xl h-10 font-bold shadow-lg shadow-primary/10">
                           <TrendingUp className="w-4 h-4 mr-2" />
                           Suivre
                        </Button>
                      </Link>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Health Promotion Banner */}
        <div className="relative rounded-[50px] bg-primary overflow-hidden p-12 lg:p-20 text-white shadow-2xl shadow-primary/20">
           <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
              <Stethoscope className="w-full h-full rotate-12" />
           </div>
           <div className="relative z-10 max-w-2xl space-y-8 text-center lg:text-left">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                 <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Star className="w-6 h-6 fill-white" />
                 </div>
                 <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                    Optimisez votre traitement avec TAKYMED Pro
                 </h2>
              </div>
              <p className="text-xl text-primary-foreground leading-relaxed opacity-90">
                 Accédez à des rapports détaillés, une assistance prioritaire et des notifications illimitées par SMS et WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                 <Link to="/register">
                    <Button size="lg" className="h-16 px-8 rounded-2xl bg-white text-primary hover:bg-slate-100 font-extrabold text-lg shadow-xl shadow-black/20 group">
                       Passer au compte Pro
                       <ArrowUpRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                 </Link>
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-slate-200 overflow-hidden shadow-lg">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-primary bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px] font-bold">
                       +500
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Month Summary */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <StatItem label="Nouveaux Produits" value="12" icon={<Plus className="w-4 h-4" />} />
           <StatItem label="Pharmacies Partenaires" value="+150" icon={<CheckCircle2 className="w-4 h-4" />} />
           <StatItem label="Utilisateurs Satisfaits" value="2.5k" icon={<TrendingUp className="w-4 h-4" />} />
           <StatItem label="Mise à jour BD" value="Aujourd'hui" icon={<Calendar className="w-4 h-4" />} />
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-2 group hover:border-primary/50 transition-colors">
       <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
          <div className="p-1 bg-slate-50 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            {icon}
          </div>
          {label}
       </div>
       <div className="text-3xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
          {value}
       </div>
    </div>
  );
}
