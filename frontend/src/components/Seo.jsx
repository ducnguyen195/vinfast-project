import { useEffect } from 'react';

// Minimal SEO component without external dependencies.  
// Usage: <Seo title="Page title" description="..." url="..." image="..." />  
// You can extend it to handle other meta tags as needed.

const setMeta = (attrName, attrValue, content, isProperty = false) => {
  if (!content) return;
  let selector;
  let attr = isProperty ? 'property' : 'name';
  selector = `head meta[${attr}="${attrValue}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

export default function Seo({
  title,
  description,
  url,
  image,
  type = 'website',
  locale = 'vi_VN',
}) {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta('og:title', title, title, true);
      setMeta('twitter:title', title, title);
    }
    if (description) {
      setMeta('description', 'description', description);
      setMeta('og:description', 'description', description, true);
      setMeta('twitter:description', 'description', description);
    }
    if (url) {
      setMeta('og:url', 'og:url', url, true);
      // canonical
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    }
    if (image) {
      setMeta('og:image', 'og:image', image, true);
      setMeta('twitter:image', 'twitter:image', image);
    }
    if (type) {
      setMeta('og:type', 'og:type', type, true);
    }
    if (locale) {
      setMeta('og:locale', 'og:locale', locale, true);
    }
  }, [title, description, url, image, type, locale]);

  return null;
}
