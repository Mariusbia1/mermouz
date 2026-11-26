import { useEffect, useState } from "react";
import { portfolioServices } from "../data/services";
import { defaultProjects, projectIcons, projectTones } from "../data/projects";
import { defaultTestimonials } from "../data/testimonials";
import {
  getProjects,
  getServices,
  getTestimonials,
} from "../lib/portfolioApi";

/**
 * Charge des données distantes avec une valeur par défaut locale.
 * - garde les données locales si l'API échoue ou renvoie une liste vide
 * - ignore la réponse si le composant a été démonté entre-temps
 */
function useRemoteList(fetcher, fallback, normalize, enabled = true) {
  const [items, setItems] = useState(fallback);

  useEffect(() => {
    if (!enabled) return undefined;
    let active = true;
    fetcher()
      .then((data) => {
        if (active && Array.isArray(data) && data.length) {
          setItems(data.map(normalize));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
    // fetcher / normalize sont des fonctions stables définies au niveau module
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return items;
}

const fetchServices = () => getServices({ activeOnly: true });
const normalizeService = (item) => ({
  ...item,
  short: item.short_description ?? item.short ?? "",
  icon:
    portfolioServices.find((service) => service.slug === item.slug)?.icon ||
    portfolioServices[0].icon,
});

const fetchProjects = () => getProjects({ publishedOnly: true });
const normalizeProject = (item, index) => ({
  ...item,
  description: item.summary ?? item.description ?? "",
  tags: Array.isArray(item.tags) ? item.tags : [],
  icon: projectIcons[index % projectIcons.length],
  tone: projectTones[index % projectTones.length],
});

const fetchTestimonials = () => getTestimonials({ publishedOnly: true });
const identity = (item) => item;

export function useServices() {
  return useRemoteList(fetchServices, portfolioServices, normalizeService);
}

export function useProjects() {
  return useRemoteList(fetchProjects, defaultProjects, normalizeProject);
}

export function useTestimonials(enabled = true) {
  return useRemoteList(
    fetchTestimonials,
    defaultTestimonials,
    identity,
    enabled,
  );
}
