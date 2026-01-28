import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface Company {
  id: string;
  name: string;
  color: string;
  templateUrl: string;
}

const companies: Company[] = [{
  id: "binance-exchange",
  name: "Binance Exchange",
  color: "#F0B90B",
  templateUrl: "/templates/binance-exchange.jpeg"
}, {
  id: "bnbchain",
  name: "BNB Chain",
  color: "#F0B90B",
  templateUrl: "/templates/bnbchain.jpg"
}, {
  id: "yzilabs",
  name: "Yzi Labs",
  color: "#F0B90B",
  templateUrl: "/templates/yzilabs.png"
}, {
  id: "aster",
  name: "Aster",
  color: "#F0B90B",
  templateUrl: "/templates/aster.jpg"
}, {
  id: "binance-blockchain-week",
  name: "Binance Blockchain Week",
  color: "#F0B90B",
  templateUrl: "/templates/binance-blockchain-week.jpg"
}, {
  id: "cn-community",
  name: "币安华语社区 CN community",
  color: "#F0B90B",
  templateUrl: "/templates/cn-community.jpeg"
}, {
  id: "binance-map",
  name: "Binance Map 币安地图",
  color: "#F0B90B",
  templateUrl: "/templates/binance-map.jpg"
}];

interface CompanySelectorProps {
  onSelect: (company: Company | null) => void;
  selectedCompany: Company | null;
}

const CompanySelector = ({
  onSelect,
  selectedCompany
}: CompanySelectorProps) => {
  const { t } = useLanguage();
  
  const handleValueChange = (value: string) => {
    const company = companies.find(c => c.id === value);
    onSelect(company || null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-3 text-foreground">
        {t("editor.selectProject")}
      </label>
      
      <Select value={selectedCompany?.id || ""} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full h-12 bg-background border-border hover:border-primary/50 transition-colors">
          <SelectValue placeholder={t("editor.selectPlaceholder")} />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {companies.map(company => (
            <SelectItem key={company.id} value={company.id} className="cursor-pointer hover:bg-muted focus:bg-muted">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: company.color }} />
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
