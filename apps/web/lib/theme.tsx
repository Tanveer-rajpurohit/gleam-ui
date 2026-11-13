export const THEME_STORAGE_KEY = "gleam-theme";

const script = `try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var d=s?s==="dark":true;document.documentElement.setAttribute("data-theme",d?"dark":"light")}catch(e){document.documentElement.setAttribute("data-theme","dark")}`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
