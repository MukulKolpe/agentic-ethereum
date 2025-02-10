// @ts-nocheck comment
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

interface VoteResultsProps {
  isOpen: boolean;
  onClose: () => void;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  finalVerdict: string;
}

export default function VoteResults({
  isOpen,
  onClose,
  yesVotes,
  noVotes,
  abstainVotes,
  finalVerdict,
}: VoteResultsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Voting Results</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Option</TableHead>
              <TableHead className="text-right">Votes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Yes</TableCell>
              <TableCell className="text-right">{yesVotes}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell className="text-right">{noVotes}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Abstain</TableCell>
              <TableCell className="text-right">{abstainVotes}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Final Verdict</TableCell>
              <TableCell className="text-right font-medium">
                {finalVerdict}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
