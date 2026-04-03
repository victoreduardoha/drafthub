import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  topLine?: boolean;
}

export function Card({ children, className, glow = false, topLine = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[#0c0e13] border border-white/[0.06] relative overflow-hidden transition-all duration-300",
        glow && "hover:border-orange-500/20 hover:shadow-[0_0_30px_rgba(249,115,22,0.07)]",
        className
      )}
    >
      {topLine && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent pointer-events-none" />
      )}
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-5 py-4 border-b border-white/[0.05]", className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}
