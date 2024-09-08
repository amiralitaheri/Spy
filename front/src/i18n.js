import { createResource, createSignal } from "solid-js";

const [language, _setLanguage] = createSignal(
  localStorage.getItem("language") || "fa",
);

const setLanguage = (lang) => {
  _setLanguage(lang);
  localStorage.setItem("language", lang);
};

const fetchStrings = async (lang) => {
  const response = await fetch(`/strings/${lang}.json`);
  return await response.json();
};

const fetchWords = async (lang) => {
  const response = await fetch(`/words/${lang}.json`);
  return await response.json();
};

const getCategories = (lang) => {
  const commonCategories = [
    "animals",
    "cities",
    "colors",
    "countries",
    "foods",
    "fruits-and-vegetables",
    "programming-languages",
  ];
  const categories = {
    en: commonCategories,
    fa: commonCategories,
  };
  return categories[lang || language()];
};

const [data] = createResource(language, fetchStrings);
const [words] = createResource(language, fetchWords);

const t = (key) => data()?.[key] || key;

export { t, language, setLanguage, words as getWords, getCategories };
