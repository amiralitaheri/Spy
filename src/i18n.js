import { createResource, createSignal } from "solid-js";

const [language, setLanguage] = createSignal("en");

const fetchStrings = async (lang) => {
  const response = await fetch(`/${lang}/strings.json`);
  return await response.json();
};

const fetchWords = async (lang) => {
  const response = await fetch(`/${lang}/words.json`);
  return await response.json();
};

const [data] = createResource(language, fetchStrings);
const [words] = createResource(language, fetchWords);

const t = (key) => data()?.[key] || key;

export { t, language, setLanguage, words as getWords };
