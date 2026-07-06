import { motion } from "motion/react";
import {
  Search,
  ChevronRight,
  Download,
  Play,
  Printer,
  Check,
} from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { ActionLink } from "./ui/ActionLink";
import { PageHeader } from "./ui/PageHeader";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionDescription } from "./ui/SectionDescription";
import { ListItemCard } from "./ui/ListItemCard";
import { FadeInScroll } from "./ui/FadeInScroll";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { FilterTab } from "./ui/FilterTab";
import { GuideCard } from "./ui/GuideCard";
import { LockerItem } from "./ui/LockerItem";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { PageContainer } from "./ui/PageContainer";
import { WatercolorPanel } from "./ui/WatercolorPanel";
import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { isMaintenancePhase, isPlanNotStarted } from "../lib/childStatus";
import { getResourceGuides } from "../lib/resourceGuides";
import { getRotatingCornerClass } from "../lib/cornerStyles";

export default function ResourcesPage() {
  const { currentChild, showGlobalIcons } = useCurrentChild();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const guidesWithDynamicName = useMemo(() => {
    if (!showGlobalIcons) {
      return getResourceGuides({
        name: currentChild.name,
        isNew: currentChild.isNew,
        age: currentChild.age,
        initial: currentChild.initial
      });
    }
    return getResourceGuides({ name: "your child", isNew: false, age: 8, initial: "Y" });
  }, [currentChild, showGlobalIcons]);

  const handleClear = useCallback(() => {
    setSearch("");
    setFilter("all");
  }, []);

  const filteredGuides = useMemo(() => {
    return guidesWithDynamicName.filter((g) => {
      const matchSearch =
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || g.catId === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter, guidesWithDynamicName]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
        kicker="Resource library · Clinical-grade guidance"
        title={!showGlobalIcons ? `Resources for ${currentChild.name}.` : "Resources library."}
        titleClassName="md:leading-[4.5rem]"
        description={
          <>
            <SectionDescription>
              Short, practical, clinical-grade guides — tailored to help support {!showGlobalIcons ? `${currentChild.name}'s` : "your children's"} development, routines, and focus areas.
            </SectionDescription>
            <div className="flex items-center gap-2 text-[0.8rem] text-[var(--color-thread-gray)] mt-6">
              <Check className="w-3.5 h-3.5 text-[var(--color-thread-mid-green)] stroke-[1.8]" /> Sorted by clinical focus matching
            </div>
          </>
        }
        className="mb-24"
      />

      <FadeInScroll className="mb-24">
        <WatercolorPanel>
          <HeroQuoteCard
            kicker="Featured guide"
            quote="Starting the upcoming school term with confidence."
            showQuotes={false}
            className="mb-0 shadow-premium"
            description={`Strategies to manage ADHD-linked morning fatigue and prepare sensory transitions before ${!showGlobalIcons ? currentChild.name : "your child"} steps into the new classroom.`}
            action={
              <Button
                variant="mint"
                className="relative"
                rightIcon={<ChevronRight className="w-3.5 h-3.5 stroke-[2]" />}
              >
                Read article
              </Button>
            }
          />
        </WatercolorPanel>
      </FadeInScroll>

      {/* Modules Section */}
      <FadeInScroll className="mb-24">
        <div className="mb-8">
          <span className="text-[0.68rem] tracking-[0.12em] uppercase font-medium text-[var(--color-thread-mid-green)] mb-3 block">
            AVAILABLE MODULES
          </span>
          <SectionTitle className="mb-0">
            Guides & resources for {!showGlobalIcons ? currentChild.name : "your family"}.
          </SectionTitle>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-slate-400 stroke-[1.8]" />
          <Input
            type="text"
            placeholder="Search guides…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="search"
          />
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          <FilterTab
            active={filter === "all"}
            label="All guides"
            onClick={() => setFilter("all")}
          />
          <FilterTab
            active={filter === "tools"}
            label="Tools & Templates"
            onClick={() => setFilter("tools")}
          />
          <FilterTab
            active={filter === "health"}
            label="Health & Clinical"
            onClick={() => setFilter("health")}
          />
          <FilterTab
            active={filter === "classroom"}
            label="Classroom Strategies"
            onClick={() => setFilter("classroom")}
          />
          <FilterTab
            active={filter === "emotional"}
            label="Emotional Regulation"
            onClick={() => setFilter("emotional")}
          />
        </div>

        <span className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-400 font-medium mb-6 block">
          {filteredGuides.length}{" "}
          {filteredGuides.length === 1 ? "article" : "articles"} found
        </span>

        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
            {filteredGuides.map((guide, i) => {
              const cornerClass = getRotatingCornerClass(i);
              return <GuideCard key={i} {...guide} cornerClass={cornerClass} />;
            })}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-black/10 rounded-2xl text-slate-500">
            No guides match your search.
            <ActionLink
              variant="default"
              as="button"
              onClick={handleClear}
              className="mt-3 block mx-auto font-medium"
            >
              Clear search
            </ActionLink>
          </div>
        )}
      </FadeInScroll>

      {/* Directory Section */}
      <FadeInScroll className="mb-24">
        <div className="mb-6">
          <SectionLabel>
            Browse directory
          </SectionLabel>
          <SectionTitle>
            Browse by topic.
          </SectionTitle>
        </div>
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {[
            "Understanding ADHD",
            "Emotional Regulation",
            "School Support",
            "Learning & Cognition",
            "Daily Routines",
            "Working with Professionals",
          ].map((t, i) => (
            <ListItemCard key={i} className="bg-white border-white/5 transition-all">
              {t}
            </ListItemCard>
          ))}
        </div>
      </FadeInScroll>

      {/* Locker Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            Aids & exercises locker
          </SectionLabel>
          <SectionTitle>
            Quick activities locker.
          </SectionTitle>
        </div>

        <WatercolorPanel innerClassName="grid grid-cols-3 gap-6 max-md:grid-cols-1">
            <LockerItem
              icon={<Download className="w-[19px] h-[19px] stroke-[1.8]" />}
              title="Download templates"
              description="Editable letter templates, transition checklists and customisable behaviour journals."
              action="Download printable PDFs"
              cornerClass="rounded-tl-[32px]"
              className="shadow-premium border border-black/[0.03]"
            />
            <LockerItem
              icon={<Play className="w-[19px] h-[19px] stroke-[1.8]" />}
              title="Watch short videos"
              description="5-minute play-based co-regulation tactics designed for real parents."
              action="Launch video player"
              cornerClass="rounded-tr-[32px]"
              className="shadow-premium border border-black/[0.03]"
            />
            <LockerItem
              icon={<Printer className="w-[19px] h-[19px] stroke-[1.8]" />}
              title="Print classroom guides"
              description="Double-sided sheets designed for teachers, tutors and clinical aides."
              action="Generate print format"
              cornerClass="rounded-br-[32px]"
              className="shadow-premium border border-black/[0.03]"
            />
        </WatercolorPanel>
      </FadeInScroll>
      </PageContainer>
    </motion.div>
  );
}
