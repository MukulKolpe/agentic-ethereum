// @ts-nocheck comment
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface Form1Props {
  getTokenSymbol: (symbol: string) => void;
  getTokenName: (name: string) => void;
  getTokenSupply: (supply: string) => void;
}

export default function Form4({
  getTokenSymbol,
  getTokenName,
  getTokenSupply,
}: Form1Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Token Details</h2>
      <div className="space-y-2">
        <Label htmlFor="tokenSymbol">Token Symbol</Label>
        <Input
          id="tokenSymbol"
          placeholder="Token Symbol"
          onChange={(e) => getTokenSymbol(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tokenName">Token Name</Label>
        <Input
          id="tokenName"
          placeholder="Token Name"
          onChange={(e) => getTokenName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tokenSupply">Token Supply</Label>
        <Input
          id="tokenSupply"
          placeholder="Token Supply"
          type="number"
          onChange={(e) => getTokenSupply(e.target.value)}
        />
      </div>
    </div>
  );
}
