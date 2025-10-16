// pages/index.tsx
import dynamic from "next/dynamic";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Mint1155 = dynamic(() => import("../components/Mint1155"), { ssr: false });

export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 860, margin: "0 auto" }}>
      <h1>Woolly Eggs — Mint 1155</h1>
      <p style={{ opacity: 0.8, marginBottom: 16 }}>
        Only Monad Testnet (chainId 10143) — the app will force switch before sending a tx.
      </p>
      <ConnectButton />
      <Mint1155 />
    </main>
  );
}
