import { useEffect, useState } from "react";
import { defaultSiteContent } from "../data/siteContent";
import { getSiteContent } from "../lib/portfolioApi";

export function useSiteContent() {
  const [content, setContent] = useState(defaultSiteContent);
  useEffect(() => {
    getSiteContent()
      .then(setContent)
      .catch(() => {});
  }, []);
  return content;
}
