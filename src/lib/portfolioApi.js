import { isSupabaseConfigured, supabase } from "./supabase";
import { defaultSiteContent } from "../data/siteContent";
import { defaultTestimonials } from "../data/testimonials";

const VISITOR_KEY = "mermouz_visitor_id";
const LOCAL_VISITS_KEY = "mermouz_local_visitors";

function getVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_KEY);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, visitorId);
  }
  return visitorId;
}

export async function recordVisit(pathname) {
  const visitorId = getVisitorId();
  if (!isSupabaseConfigured) {
    const visitors = new Set(
      JSON.parse(localStorage.getItem(LOCAL_VISITS_KEY) || "[]"),
    );
    visitors.add(visitorId);
    localStorage.setItem(LOCAL_VISITS_KEY, JSON.stringify([...visitors]));
    return;
  }

  const sessionKey = `mermouz_visit_${pathname}`;
  if (sessionStorage.getItem(sessionKey)) return;
  const { error } = await supabase.from("website_visits").insert({
    visitor_id: visitorId,
    page_path: pathname,
    referrer: document.referrer || null,
  });
  if (!error) sessionStorage.setItem(sessionKey, "recorded");
}

export async function getVisitorStats() {
  if (!isSupabaseConfigured) {
    const visitors = JSON.parse(localStorage.getItem(LOCAL_VISITS_KEY) || "[]");
    return {
      visitors: visitors.length,
      visits: visitors.length,
      source: "local",
    };
  }

  const { data, error } = await supabase.rpc("get_public_visit_stats");
  if (error) throw error;
  const stats = Array.isArray(data) ? data[0] : data;
  return {
    visitors: Number(stats?.unique_visitors || 0),
    visits: Number(stats?.total_visits || 0),
    source: "supabase",
  };
}

export async function createContactRequest(payload) {
  if (!isSupabaseConfigured) {
    const current = JSON.parse(
      localStorage.getItem("mermouz_contact_requests") || "[]",
    );
    current.unshift({
      id: crypto.randomUUID(),
      ...payload,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("mermouz_contact_requests", JSON.stringify(current));
    return;
  }

  const { error } = await supabase.from("contact_requests").insert(payload);
  if (error) throw error;
}

export async function getContactRequests() {
  const { data, error } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateContactStatus(id, status) {
  const { error } = await supabase
    .from("contact_requests")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function getProjects({ publishedOnly = false } = {}) {
  let query = supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });
  if (publishedOnly) query = query.eq("status", "published");
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function saveProject(project) {
  const { id, ...values } = project;
  const query = id
    ? supabase.from("projects").update(values).eq("id", id)
    : supabase.from("projects").insert(values);
  const { error } = await query;
  if (error) throw error;
}

export async function deleteProject(id) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function getServices({ activeOnly = false } = {}) {
  let query = supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });
  if (activeOnly) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function saveService(service) {
  const { id, ...values } = service;
  const query = id
    ? supabase.from("services").update(values).eq("id", id)
    : supabase.from("services").insert(values);
  const { error } = await query;
  if (error) throw error;
}

export async function deleteService(id) {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}

export async function getSiteContent() {
  if (!isSupabaseConfigured) return defaultSiteContent;
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "main")
    .maybeSingle();
  if (error) throw error;
  const stored = data?.value || {};
  const storedAbout = { ...(stored.about || {}) };
  delete storedAbout.currentRole;
  delete storedAbout.freelance;
  delete storedAbout.approach;
  delete storedAbout.ambition;
  return {
    ...defaultSiteContent,
    ...stored,
    profile: {
      ...defaultSiteContent.profile,
      ...stored.profile,
      fullName:
        stored.profile?.fullName === "BIAOU Marius"
          ? "Marius BIAOU"
          : stored.profile?.fullName || defaultSiteContent.profile.fullName,
      photoUrl:
        stored.profile?.photoUrl === "/marius-navy-portrait.png"
          ? "/marius-navy-portrait-optimized.jpg"
          : stored.profile?.photoUrl || defaultSiteContent.profile.photoUrl,
    },
    social: { ...defaultSiteContent.social, ...stored.social },
    home: { ...defaultSiteContent.home, ...stored.home },
    about: { ...defaultSiteContent.about, ...storedAbout },
    cv: {
      ...defaultSiteContent.cv,
      ...stored.cv,
      experiences: stored.cv?.experiences || defaultSiteContent.cv.experiences,
      education: stored.cv?.education || defaultSiteContent.cv.education,
      skills:
        !stored.cv?.skills?.length ||
        stored.cv.skills.some((skill) => skill.title === "Création web")
          ? defaultSiteContent.cv.skills
          : stored.cv.skills,
    },
  };
}

export async function saveSiteContent(value) {
  const { error } = await supabase.from("site_settings").upsert({
    key: "main",
    value,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function uploadProfilePhoto(file) {
  const extension = file.name.split(".").pop() || "jpg";
  const path = `profile/profile-${Date.now()}.${extension}`;
  const { error } = await supabase.storage
    .from("portfolio-media")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  return supabase.storage.from("portfolio-media").getPublicUrl(path).data
    .publicUrl;
}

export async function uploadProjectScreenshot(file) {
  const extension = file.name.split(".").pop() || "jpg";
  const path = `projects/project-${Date.now()}.${extension}`;
  const { error } = await supabase.storage
    .from("portfolio-media")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  return supabase.storage.from("portfolio-media").getPublicUrl(path).data
    .publicUrl;
}

export async function getTestimonials({ publishedOnly = false } = {}) {
  if (!isSupabaseConfigured) {
    return defaultTestimonials.filter(
      (item) => !publishedOnly || item.is_published,
    );
  }
  let query = supabase
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (publishedOnly) query = query.eq("is_published", true);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function saveTestimonial(testimonial) {
  const { id, ...values } = testimonial;
  const query =
    id && !String(id).startsWith("demo-")
      ? supabase.from("testimonials").update(values).eq("id", id)
      : supabase.from("testimonials").insert(values);
  const { error } = await query;
  if (error) throw error;
}

export async function deleteTestimonial(id) {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadTestimonialScreenshot(file) {
  const extension = file.name.split(".").pop() || "jpg";
  const path = `testimonials/review-${Date.now()}.${extension}`;
  const { error } = await supabase.storage
    .from("portfolio-media")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  return supabase.storage.from("portfolio-media").getPublicUrl(path).data
    .publicUrl;
}
