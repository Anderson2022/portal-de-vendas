import { usePdv } from "../pdv-context";
import {
  ArrowRight,
  Boxes,
  Settings,
  Package,
  Tag,
  BarChart3,
  UserRound,
} from "lucide-react";
import { modes } from "../constants/modes";
import Image from "next/image";
import { PdvModuleLink } from "./pdv-module-link";
import { toolGroups } from "../constants/tool-groups";
import type { Section } from "../types/section";
export function PdvDashboardMain() {
  const { navigate, setModal } = usePdv();
  return (
    <main className="dashboard-main">
      <div className="module-grid">
        {modes.map(({ id, label, icon: Icon, color, desc }) => (
          <PdvModuleLink
            key={id}
            className={`module-card ${color}`}
            href={`/pdv?modo=${id}`}
            onOpen={() => navigate(id)}
          >
            <Image
              src={`/pdv-assets/hero-${id === "lancamento" ? "pdv" : id}.webp`}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 650px) 100vw, (max-width: 1200px) 50vw, 20vw"
              className="pdv-module-image"
            />
            <div className="module-card-spacer" />
            <div className="module-bottom">
              <span className="module-icon">
                <Icon size={30} />
              </span>
              <h2>{label}</h2>
              <p>{desc}</p>
              <span className="enter">
                <span>
                  Entrar
                  <small className="mt-1 block text-[11px] font-normal leading-tight text-white/90">
                    Ctrl + clique: nova aba
                  </small>
                </span>
                <ArrowRight size={22} />
              </span>
            </div>
          </PdvModuleLink>
        ))}
      </div>
      <div className="tools">
        <div className="tools-heading">
          <div>
            <span className="tool-heading-icon">
              <Boxes size={28} />
            </span>
            <div>
              <h2>Ferramentas do PDV</h2>
              <p>
                Acesse rapidamente as principais funcionalidades do sistema.
              </p>
            </div>
          </div>
          <button onClick={() => setModal("shortcuts")}>
            <Settings size={18} /> Personalizar atalhos
          </button>
        </div>
        <div className="tools-grid">
          {toolGroups.map((group) => (
            <div className={`tool-group tone-${group.tone}`} key={group.title}>
              <h3>
                <group.icon size={20} />
                {group.title}
              </h3>
              {group.items.map(([name, desc, dest], i) => (
                <button
                  key={i}
                  onClick={() => navigate(dest as Section)}
                  className="tool-link"
                >
                  <span className="tool-link-icon">
                    {i === 0 ? (
                      <group.icon size={22} />
                    ) : i === 1 ? (
                      <Package size={21} />
                    ) : i === 2 ? (
                      <Tag size={21} />
                    ) : i === 3 ? (
                      <BarChart3 size={21} />
                    ) : (
                      <UserRound size={21} />
                    )}
                  </span>
                  <span>
                    <strong>{name}</strong>
                    <small>{desc}</small>
                  </span>
                  {group.tone === "green" && (
                    <kbd>{["F1", "F4", "F5", "F6", "F7"][i]}</kbd>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
