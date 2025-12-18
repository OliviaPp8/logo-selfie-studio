import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface Company {
  id: string;
  name: string;
  color: string;
  templateUrl: string;
}
const companies: Company[] = [{
  id: "binance",
  name: "Binance",
  color: "#F0B90B",
  templateUrl: "/templates/binance.jpg"
}, {
  id: "spacex",
  name: "Space X",
  color: "#005288",
  templateUrl: "/templates/spacex.jpg"
}, {
  id: "bnbchain",
  name: "BNB Chain",
  color: "#F0B90B",
  templateUrl: "/templates/bnbchain.jpg"
}, {
  id: "solana",
  name: "Solana",
  color: "#9945FF",
  templateUrl: "/templates/solana.jpeg"
}, {
  id: "yzilabs",
  name: "Yzi Labs",
  color: "#1E90FF",
  templateUrl: "/templates/yzilabs.jpeg"
}, {
  id: "ycombinator",
  name: "Y Combinator",
  color: "#FF6600",
  templateUrl: "/templates/ycombinator.jpeg"
}, {
  id: "a16z",
  name: "A16Z",
  color: "#000000",
  templateUrl: ""
}, {
  id: "hyperliquid",
  name: "Hyperliquid",
  color: "#00D4AA",
  templateUrl: "/templates/hyperliquid.jpg"
}, {
  id: "aster",
  name: "Aster",
  color: "#7C3AED",
  templateUrl: ""
}];
interface CompanySelectorProps {
  onSelect: (company: Company | null) => void;
  selectedCompany: Company | null;
}
const CompanySelector = ({
  onSelect,
  selectedCompany
}: CompanySelectorProps) => {
  const handleValueChange = (value: string) => {
    const company = companies.find(c => c.id === value);
    onSelect(company || null);
  };
  return <div className="w-full">
      <label className="block text-sm font-medium mb-3 text-foreground">Select a project</label>
      
      <Select value={selectedCompany?.id || ""} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full h-12 bg-background border-border hover:border-primary/50 transition-colors">
          <SelectValue placeholder="Choose a tech giant..." />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {companies.map(company => <SelectItem key={company.id} value={company.id} className="cursor-pointer hover:bg-muted focus:bg-muted">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{
              backgroundColor: company.color
            }} />
                <span>{company.name}</span>
              </div>
            </SelectItem>)}
        </SelectContent>
      </Select>
    </div>;
};
export default CompanySelector;
export type { Company };