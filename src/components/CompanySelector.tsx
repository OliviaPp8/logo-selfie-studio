import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Company {
  id: string;
  name: string;
  color: string;
}

const companies: Company[] = [
  { id: "google", name: "Google", color: "#4285F4" },
  { id: "apple", name: "Apple", color: "#000000" },
  { id: "meta", name: "Meta", color: "#0668E1" },
  { id: "amazon", name: "Amazon", color: "#FF9900" },
  { id: "microsoft", name: "Microsoft", color: "#00A4EF" },
  { id: "tesla", name: "Tesla", color: "#CC0000" },
  { id: "nvidia", name: "NVIDIA", color: "#76B900" },
  { id: "netflix", name: "Netflix", color: "#E50914" },
  { id: "openai", name: "OpenAI", color: "#412991" },
  { id: "spacex", name: "SpaceX", color: "#005288" },
];

interface CompanySelectorProps {
  onSelect: (company: Company | null) => void;
  selectedCompany: Company | null;
}

const CompanySelector = ({ onSelect, selectedCompany }: CompanySelectorProps) => {
  const handleValueChange = (value: string) => {
    const company = companies.find((c) => c.id === value);
    onSelect(company || null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-3 text-foreground">
        Select Company
      </label>
      
      <Select
        value={selectedCompany?.id || ""}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full h-12 bg-background border-border hover:border-primary/50 transition-colors">
          <SelectValue placeholder="Choose a tech giant..." />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {companies.map((company) => (
            <SelectItem
              key={company.id}
              value={company.id}
              className="cursor-pointer hover:bg-muted focus:bg-muted"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: company.color }}
                />
                <span>{company.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanySelector;
export type { Company };
