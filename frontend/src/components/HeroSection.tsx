import { CoffeeHeroInteractive } from "@/components/hero/CoffeeHeroInteractive";
import type { HeroFlavor } from "@/lib/hero-flavors";
import type { InfoToko, Promo } from "@/lib/types";

interface HeroSectionProps {
  infoToko: InfoToko;
  promoTerbaru?: Promo;
  flavors?: HeroFlavor[];
}

export function HeroSection({ infoToko, promoTerbaru, flavors }: HeroSectionProps) {
  return (
    <CoffeeHeroInteractive
      infoToko={infoToko}
      promoTerbaru={promoTerbaru}
      flavors={flavors}
    />
  );
}
