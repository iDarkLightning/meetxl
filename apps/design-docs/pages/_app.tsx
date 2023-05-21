import { AppProps } from "next/app";
import "../styles/globals.css";
import "@meetxl/ui/styles/tailwind.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  console.log(inter.className);
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  );
}
