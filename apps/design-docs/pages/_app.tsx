import { AppProps } from "next/app";
import "../styles/globals.css";
import "@meetxl/ui/styles/tailwind.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
