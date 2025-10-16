// helpers/wagmi.tsx
import { ReactNode } from "react";
import { WagmiConfig, http, createConfig } from "wagmi";
import { monadTestnet } from "./monad";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const chains = [monadTestnet];

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "00000000000000000000000000000000";

const { connectors } = getDefaultWallets({
  appName: "Mint 1155",
  projectId,
  chains,
});

export const wagmiConfig = createConfig({
  // hard-lock to Monad Testnet only
  chains,
  connectors,
  transports: { [monadTestnet.id]: http(monadTestnet.rpcUrls.default.http[0]) },
  multiInjectedProviderDiscovery: true,
  // Important: disable auto connect (user asked earlier)
  ssr: true,
  // @ts-ignore - wagmi v2 has no explicit autoConnect flag; leaving off = false
});

const qc = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={qc}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
