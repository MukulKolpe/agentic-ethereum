// @ts-nocheck comment
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";

interface Form3Props {
  getJoiningThreshold: (threshold: number) => void;
  getProposal: (threshold: number) => void;
  getVisibility: (isPrivate: boolean) => void;
}

export default function Form6({
  getJoiningThreshold,
  getProposal,
  getVisibility,
}: Form3Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Governance Details</h2>
      <div className="space-y-2">
        <Label htmlFor="joiningThreshold">Joining Threshold</Label>
        <Input
          id="joiningThreshold"
          type="number"
          min={1}
          placeholder="Enter minimum tokens required to join"
          onChange={(e) => getJoiningThreshold(Number.parseInt(e.target.value))}
        />
        <p className="text-sm text-muted-foreground">
          Enter minimum number of tokens required to join DAO
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="proposalThreshold">Proposal Threshold</Label>
        <Input
          id="proposalThreshold"
          type="number"
          min={1}
          placeholder="Enter minimum tokens required for proposal"
          onChange={(e) => getProposal(Number.parseInt(e.target.value))}
        />
        <p className="text-sm text-muted-foreground">
          Enter minimum number of tokens required to create a proposal
        </p>
      </div>
      <div className="space-y-2">
        <Label>Is DAO private?</Label>
        <RadioGroup
          defaultValue="yes"
          onValueChange={(value) => getVisibility(value === "yes")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">Yes</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
