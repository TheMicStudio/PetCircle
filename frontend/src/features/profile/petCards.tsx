import { Inert } from "../../shared/components/Inert";
import { SpeciesIcon } from "../../shared/components/SpeciesIcon";
import { PET_CARDS } from "../../shared/showcase";

// "Mes animaux" section of the handoff. No pet exists in the API, the cards are design only.
export const PetCards = () => (
  <section className="mt-[clamp(2.375rem,5vw,3.625rem)] rounded-[1.25rem] bg-pc-surface px-[clamp(1.25rem,2.6vw,2rem)] py-[clamp(1.5rem,3.4vw,2.5rem)]">
    <div className="flex flex-wrap items-baseline justify-between gap-4">
      <h2 className="font-display text-[clamp(1.625rem,3.6vw,2.125rem)] leading-none font-semibold tracking-[-0.025em] text-pc-ink">Mes animaux</h2>
      <Inert className="text-[0.84375rem] font-semibold text-pc-accent hover:text-pc-accent2">Gérer la meute</Inert>
    </div>
    <p className="mt-3 mb-7 max-w-[48ch] text-[0.9375rem] leading-[1.6] text-pc-muted">
      Cinq animaux sous le même toit, chacun avec sa page, ses abonnés et ses habitudes douteuses.
    </p>
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] gap-4">
      {PET_CARDS.map((pet) => (
        <li className={`rounded-[0.875rem] px-2.5 pt-2.5 pb-[1.125rem] ${pet.bg}`} key={pet.name}>
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[0.625rem] bg-pc-photo">
            <span className={`font-display text-[3.5rem] font-semibold opacity-40 ${pet.ink}`}>{pet.name.slice(0, 1)}</span>
          </div>
          <div className="px-2 pt-4">
            <div className="flex items-baseline justify-between gap-2.5">
              <h3 className={`font-display text-[1.375rem] leading-none font-semibold tracking-[-0.015em] ${pet.ink}`}>{pet.name}</h3>
              <span className={`text-[0.6875rem] font-semibold tracking-[0.08em] uppercase ${pet.muted}`}>{pet.age}</span>
            </div>
            <div className={`mt-2.5 flex items-center gap-2 text-[0.8125rem] leading-[1.4] ${pet.muted}`}>
              <SpeciesIcon size={16} species={pet.species} />
              {pet.breed}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className={`font-display text-[0.84375rem] font-medium italic ${pet.accent}`}>{pet.trait}</span>
              <span className={`ml-auto text-[0.75rem] ${pet.muted}`}>{pet.followers}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </section>
);
