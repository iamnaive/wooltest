// components/Mint1155.tsx
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { abi1155Variants } from "../helpers/erc1155_mint_variants";

const CONTRACT = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "").trim() as `0x${string}`;
const TARGET_CHAIN = Number(process.env.NEXT_PUBLIC_CHAIN_ID || "10143");

const POSTER = process.env.NEXT_PUBLIC_POSTER_URL || "";
const VIDEO = process.env.NEXT_PUBLIC_VIDEO_URL || "";

const PRICE_WEI = BigInt(process.env.NEXT_PUBLIC_MINT_PRICE_WEI || "0");
const DEFAULT_ID = 1n;
const DEFAULT_AMOUNT = 1n;

// Build inline tokenURI via data:application/json;base64
function toBase64Utf8(s: string) {
  if (typeof window === "undefined") {
    // SSR / build step
    return Buffer.from(s, "utf8").toString("base64");
  }
  // Browser-safe base64 for UTF-8
  return btoa(unescape(encodeURIComponent(s)));
}
function buildDataUri(meta: unknown) {
  const s = JSON.stringify(meta);
  const b64 = toBase64Utf8(s);
  return `data:application/json;base64,${b64}`;
}


const metadata = {
  name: "Woolly Eggs — Animated 1155",
  description: "Animated purple MON crate (Monad testnet).",
  image: POSTER,
  animation_url: VIDEO,
  attributes: [
    { trait_type: "Series", value: "Airdrop" },
    { trait_type: "Type", value: "Animated" },
  ],
};

export default function Mint1155() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { data: hash, isPending, writeContractAsync, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const ensureChain = async () => {
    if (chainId !== TARGET_CHAIN) {
      // Hard stop on wrong chain
      await switchChainAsync({ chainId: TARGET_CHAIN });
    }
  };

  const onMint = async () => {
    if (!isConnected) return alert("Connect wallet first");

    await ensureChain();

    const to = address!;
    const id = DEFAULT_ID;
    const amount = DEFAULT_AMOUNT;
    const tokenURI = buildDataUri(metadata);

    // Try mintTo(to,id,amount,uri)
    try {
      await writeContractAsync({
        abi: abi1155Variants as any,
        address: CONTRACT,
        functionName: "mintTo",
        args: [to, id, amount, tokenURI],
        value: PRICE_WEI,
      });
      return;
    } catch (_) {
      // fallback
    }

    // Try mint(to,id,amount) (no URI)
    try {
      await writeContractAsync({
        abi: abi1155Variants as any,
        address: CONTRACT,
        functionName: "mint",
        args: [to, id, amount],
        value: PRICE_WEI,
      });
      alert("Mint tx sent (no URI). Ensure contract sets token URI internally.");
    } catch (e) {
      console.error(e);
      alert("Mint failed. Send me exact mint signature/ABI, I'll tailor the call.");
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "2rem auto", padding: 16, border: "1px solid #333", borderRadius: 12 }}>
      <h2 style={{ marginBottom: 8 }}>Mint ERC-1155 (Monad Testnet)</h2>
      <p style={{ fontSize: 13, opacity: 0.8, marginTop: 0 }}>
        Contract: {CONTRACT ? `${CONTRACT.slice(0, 6)}…${CONTRACT.slice(-4)}` : "—"} | Token ID: {String(DEFAULT_ID)} | Amount: {String(DEFAULT_AMOUNT)}
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        {POSTER ? <img src={POSTER} alt="poster" style={{ width: 200, height: 200, objectFit: "cover", borderRadius: 8 }} /> : null}
        {VIDEO ? <video src={VIDEO} autoPlay muted loop style={{ width: 200, height: 200, borderRadius: 8 }} /> : null}
      </div>

      <button
        onClick={onMint}
        disabled={isPending || isConfirming}
        style={{
          marginTop: 16,
          width: "100%",
          height: 44,
          borderRadius: 10,
          background: "#7a5cff",
          color: "#fff",
          fontWeight: 700,
          border: "none",
          cursor: "pointer",
        }}
      >
        {isPending ? "Sending tx…" : isConfirming ? "Confirming…" : PRICE_WEI === 0n ? "Mint (free)" : "Mint"}
      </button>

      {hash && (
        <p style={{ marginTop: 10, fontSize: 13 }}>
          Tx:{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
          >
            {hash}
          </a>
        </p>
      )}
      {isSuccess && <p style={{ marginTop: 6, color: "#3fb950" }}>Mint confirmed!</p>}
      {error && <p style={{ marginTop: 6, color: "#ff6b6b" }}>Error: {String(error.message || error)}</p>}
    </div>
  );
}
