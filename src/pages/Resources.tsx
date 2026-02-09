import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Scale,
  BookOpen,
  Download,
  ExternalLink,
  Gavel,
  HelpCircle,
  Calculator,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

interface Guide {
  title: string;
  description: string;
  category: string;
  readTime: string;
  url: string;
}

const legalGuides: Guide[] = [
  {
    title: "Official Land Acquisition Act, 2013 (LARR)",
    description: "Download the full Right to Fair Compensation and Transparency in Land Acquisition Act.",
    category: "Act & Rules",
    readTime: "PDF",
    url: "https://legislative.gov.in/sites/default/files/A2013-30.pdf",
  },
  {
    title: "National Highways Act, 1956",
    description: "The primary act used for land acquisition for national highways in India.",
    category: "Highways",
    readTime: "PDF",
    url: "https://morth.nic.in/sites/default/files/National_Highways_Act_1956.pdf",
  },
  {
    title: "RERA Act, 2016",
    description: "Real Estate (Regulation and Development) Act for property buyers' protection.",
    category: "Housing",
    readTime: "PDF",
    url: "https://mohua.gov.in/upload/uploadfiles/files/Real_Estate_Act_2016.pdf",
  },
  {
    title: "Digital India Land Records",
    description: "Access modernized land records and property registration details online.",
    category: "Digital Records",
    readTime: "Portal",
    url: "https://dilrmp.gov.in/",
  },
];

const faqs = [
  {
    question: "What is the minimum notice period for land acquisition?",
    answer: "Under the 2013 Act, the government must provide at least 60 days notice before acquiring land. This includes publication in local newspapers and personal notice to affected families.",
  },
  {
    question: "How is compensation calculated?",
    answer: "Compensation is calculated based on market value (average of recent sales or ready reckoner), multiplied by a factor (1x for urban, 2x for rural), plus solatium (100% of market value) and additional amounts for structures and trees.",
  },
  {
    question: "Can I refuse to give up my land?",
    answer: "While you cannot prevent government acquisition for public purposes, you can file objections, negotiate compensation, and take legal action if proper procedures aren't followed.",
  },
  {
    question: "What is the Social Impact Assessment (SIA)?",
    answer: "SIA is mandatory for most acquisitions. It assesses the impact on affected families and communities, and must be completed before acquisition proceedings begin.",
  },
  {
    question: "How long does the acquisition process take?",
    answer: "The entire process typically takes 4-5 years from initial notification to final compensation, though it can vary based on project complexity and legal challenges.",
  },
];

const templates = [
  {
    title: "Objection Letter Template",
    description: "Standard format for filing objections to Section 11 notification",
    content: `To,
The District Collector / Land Acquisition Officer,
[District Name], [State]

Subject: Objection to Land Acquisition Notification No. [Number] dated [Date]

Respected Sir/Madam,

I am writing to formally record my objection to the acquisition of my land bearing Survey No. [Number], located in [Village/Locality], under Section 11 of the RFCTLARR Act, 2013.

My objections are based on the following grounds:
1. The proposed acquisition does not serve a legitimate public purpose as defined in the Act.
2. The Social Impact Assessment (SIA) has not been adequately conducted or publicized.
3. The land is multi-crop irrigated land and acquiring it threatens food security.
4. [Add other specific grounds here]

I request you to grant me a personal hearing as per Section 15 of the Act before submitting any report to the government.

Yours faithfully,
[Name]
[Address]
[Mobile Number]`,
  },
  {
    title: "Compensation Enhancement Request",
    description: "Template for requesting higher compensation based on market rates",
    content: `To,
The Land Acquisition Authority,
[Competent Authority],

Subject: Application for enhancement of compensation award for land at [Location]

Sir/Madam,

Ref: Award No. [Number] dated [Date] regarding acquisition of land at Survey No. [Number].

I, the undersigned, am the owner of the acquired land. I am accepting the compensation awarded under protest, as I believe the market value determined is significantly lower than the prevailing rates.

I request a reference to the Land Acquisition, Rehabilitation and Resettlement Authority under Section 64 of the Act for enhancement of compensation on the following grounds:
1. Recent sale deeds in the vicinity show a market rate of Rs. [Amount]/acre.
2. The classification of land adopted for valuation is incorrect.
3. The solatium and multipliers have not been correctly applied.

Enclosed are the copies of sale deeds and valuation reports supporting my claim.

Yours faithfully,
[Name]
[Contact Details]`,
  },
];

export default function Resources() {
  const [calcData, setCalcData] = useState({
    area: "",
    unit: "sqft",
    marketRate: "",
    locationType: "urban",
    assetsValue: "0"
  });

  const [calcResult, setCalcResult] = useState<{
    marketValue: number,
    factorAmount: number,
    solatium: number,
    totalCompensation: number
  } | null>(null);

  const handleDownloadTemplate = (template: typeof templates[0]) => {
    const blob = new Blob([template.content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const calculateCompensation = () => {
    const area = parseFloat(calcData.area);
    const rate = parseFloat(calcData.marketRate);
    const assets = parseFloat(calcData.assetsValue);

    if (isNaN(area) || isNaN(rate)) return;

    // 1. Determine Market Value
    let areaInSqFt = area;
    if (calcData.unit === 'acre') areaInSqFt = area * 43560;
    if (calcData.unit === 'hectare') areaInSqFt = area * 107639;
    if (calcData.unit === 'sqm') areaInSqFt = area * 10.764;

    const baseMarketValue = areaInSqFt * rate;

    // 2. Apply Multiplication Factor (1x Urban, 2x Rural as per Act base rule)
    const factor = calcData.locationType === 'rural' ? 2 : 1;
    const factorAmount = baseMarketValue * factor;

    // 3. Add Assets
    const valueWithAssets = factorAmount + (isNaN(assets) ? 0 : assets);

    // 4. Solatium (100% of the total compensation so far)
    const solatium = valueWithAssets;

    // Total
    const total = valueWithAssets + solatium;

    setCalcResult({
      marketValue: baseMarketValue,
      factorAmount: factorAmount,
      solatium: solatium,
      totalCompensation: total
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1 container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Legal Resources</h1>
          <p className="text-muted-foreground">
            Official government acts, guides, and templates to help you understand your rights.
          </p>
        </div>

        <Tabs defaultValue="guides" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 gap-2">
            <TabsTrigger value="guides" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Acts & Guides
            </TabsTrigger>
            <TabsTrigger value="faqs" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="calculator" className="gap-2">
              <Calculator className="h-4 w-4" />
              Calculator
            </TabsTrigger>
          </TabsList>

          {/* Guides Tab */}
          <TabsContent value="guides">
            <div className="grid md:grid-cols-2 gap-6">
              {legalGuides.map((guide, index) => (
                <Card key={index} className="shadow-soft hover:shadow-medium transition-all group cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">{guide.category}</Badge>
                      <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors mt-2">
                      {guide.title}
                    </CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full gap-2" onClick={() => window.open(guide.url, '_blank')}>
                      View Official Document
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Important Notice */}
            <Card className="mt-6 border-warning/50 bg-warning/5">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Disclaimer</h4>
                    <p className="text-sm text-muted-foreground">
                      Links provided direct to official government websites (legislative.gov.in, morth.nic.in, etc.).
                      We are not responsible for content changes on external sites.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Common questions about land acquisition and your rights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                    <h4 className="font-semibold mb-2 flex items-start gap-2">
                      <span className="text-primary">Q:</span>
                      {faq.question}
                    </h4>
                    <p className="text-muted-foreground pl-6">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Templates
                </CardTitle>
                <CardDescription>
                  Downloadable templates for legal correspondence. Click download to get the file.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {templates.map((template, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{template.title}</p>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDownloadTemplate(template)} title="Download Template">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculator Tab - Implemented */}
          <TabsContent value="calculator">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Estimate Compensation
                  </CardTitle>
                  <CardDescription>
                    Provide property details to estimate compensation as per LARR Act, 2013 rules.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Total Area</Label>
                      <Input
                        placeholder="Ex: 1200"
                        type="number"
                        value={calcData.area}
                        onChange={(e) => setCalcData({ ...calcData, area: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select value={calcData.unit} onValueChange={(val) => setCalcData({ ...calcData, unit: val })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sqft">Sq. Ft</SelectItem>
                          <SelectItem value="sqm">Sq. Meter</SelectItem>
                          <SelectItem value="acre">Acre</SelectItem>
                          <SelectItem value="hectare">Hectare</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Market Rate (per sq.ft)</Label>
                    <Input
                      placeholder="Ex: 4500 (Guideline Value)"
                      type="number"
                      value={calcData.marketRate}
                      onChange={(e) => setCalcData({ ...calcData, marketRate: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Enter the government guideline value or avg. registered value.</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Location Type</Label>
                    <Select value={calcData.locationType} onValueChange={(val) => setCalcData({ ...calcData, locationType: val })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urban">Urban (Factor 1.0)</SelectItem>
                        <SelectItem value="rural">Rural (Factor 2.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Value of Structures / Trees (Optional)</Label>
                    <Input
                      placeholder="Ex: 500000"
                      type="number"
                      value={calcData.assetsValue}
                      onChange={(e) => setCalcData({ ...calcData, assetsValue: e.target.value })}
                    />
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Button className="w-full" onClick={calculateCompensation}>Calculate Estimate</Button>
                    <Button variant="outline" size="icon" onClick={() => {
                      setCalcData({ area: "", unit: "sqft", marketRate: "", locationType: "urban", assetsValue: "0" });
                      setCalcResult(null);
                    }}><RefreshCw className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>

              {/* Result Card */}
              <Card className="shadow-soft bg-muted/20">
                <CardHeader>
                  <CardTitle>Calculation Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {!calcResult ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                      <Calculator className="h-12 w-12 mb-4 opacity-50" />
                      <p>Enter details to see breakdown</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Market Value (MV)</span>
                        <span className="font-medium">₹ {calcResult.marketValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Factor ({calcData.locationType === 'rural' ? '2x' : '1x'})</span>
                        <span className="font-medium">₹ {calcResult.factorAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Assets Value</span>
                        <span className="font-medium">₹ {parseFloat(calcData.assetsValue || "0").toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Solatium (100%)</span>
                          <span className="text-xs text-muted-foreground">100% of (MV x Factor + Assets)</span>
                        </div>
                        <span className="font-medium text-emerald-600">+ ₹ {calcResult.solatium.toLocaleString()}</span>
                      </div>

                      <div className="mt-6 p-4 bg-primary/10 rounded-lg flex justify-between items-center">
                        <span className="font-bold text-lg text-primary">Total Est. Compensation</span>
                        <span className="font-bold text-xl text-primary">₹ {calcResult.totalCompensation.toLocaleString()}</span>
                      </div>

                      <div className="text-xs text-muted-foreground mt-4">
                        * This is an estimate based on LARR Act 2013 provisions. Actual compensation may vary based on specific state amendments and assessments.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
