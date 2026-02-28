import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className, showGlow = false }: LogoProps & { showGlow?: boolean }) {
  return (
    <div className={cn("relative group flex items-center shrink-0", className)}>
      {/* Premium Glow Effect */}
      {showGlow && (
        <div className="absolute -inset-10 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-pulse pointer-events-none" />
      )}

      {/* Logo Container with Glassmorphism hint */}
      <div className="relative h-full w-full flex items-center justify-center transform transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-6">
        <div className="absolute -inset-2 bg-white/20 backdrop-blur-xl rounded-[30%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-white/30 shadow-2xl" />
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F41ba66cdc7114e4ab014f35ba81e151e%2F5a1738089420488d8180d4d1ece4bdbd?format=webp&width=800&height=1200"
          alt="TAKYMED Logo"
          className="max-h-full w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,114,206,0.3)] group-hover:drop-shadow-[0_12px_32px_rgba(0,114,206,0.5)] transition-all duration-500"
        />
      </div>
    </div>
  );
}
