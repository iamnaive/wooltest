// pages/_app.tsx
import type { AppProps } from "next/app";
import { Providers } from "../helpers/wagmi";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}
