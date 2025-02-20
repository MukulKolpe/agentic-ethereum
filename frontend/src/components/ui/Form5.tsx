// @ts-nocheck comment
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

interface Form2Props {
  getName: (name: string) => void;
  getSummary: (summary: string) => void;
}

export default function Form5({ getName, getSummary }: Form2Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">DAO Registration</h2>
      <div className="space-y-2">
        <Label htmlFor="name">DAO Name</Label>
        <Input
          id="name"
          placeholder="Enter DAO name"
          onChange={(e) => getName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          placeholder="Write a brief description about your community mission"
          onChange={(e) => getSummary(e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}
