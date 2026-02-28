import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative group flex items-center shrink-0", className)}>
      <div className="relative h-full w-full flex items-center justify-center transform transition-all duration-300 ease-out group-hover:scale-105">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F41ba66cdc7114e4ab014f35ba81e151e%2F5a1738089420488d8180d4d1ece4bdbd?format=webp&width=800&height=1200"
          alt="TAKYMED Logo"
          className="max-h-full w-auto object-contain drop-shadow-md transition-all duration-300"
        />
      </div>
    </div>
  );
}
