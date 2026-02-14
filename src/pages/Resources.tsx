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
import { DATA_SOURCES, SourceCategory } from "@/data/external_sources";
import {
  FileText,
  Scale,
  BookOpen,
  Download,
  ExternalLink,
  Gavel,
  HelpCircle,
  Briefcase,
  Search,
  Database,
  Globe,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...new Set(DATA_SOURCES.map(s => s.category))];
  const filteredSources = selectedCategory === "All"
    ? DATA_SOURCES
    : DATA_SOURCES.filter(s => s.category === selectedCategory);

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



  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1 container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Legal Resources & Data</h1>
          <p className="text-muted-foreground">
            Official government acts, guides, tools, and direct access to 30+ infrastructure data portals.
          </p>
        </div>

        <Tabs defaultValue="directory" className="space-y-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className="min-w-max">
              <TabsTrigger value="directory" className="gap-2">
                <Database className="h-4 w-4" />
                Data Directory (30+)
              </TabsTrigger>
              <TabsTrigger value="guides" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Acts & Guides
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-2">
                <FileText className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="faqs" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQs
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Data Directory Tab (New) */}
          <TabsContent value="directory">
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    National & State Data Links
                  </CardTitle>
                  <CardDescription>
                    Direct links to official sources for projects, gazettes, and land records.
                  </CardDescription>
                  <div className="pt-4">
                    <Label className="mb-2 block">Filter by Category</Label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <Badge
                          key={cat as string}
                          variant={selectedCategory === cat ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(cat as string)}
                        >
                          {cat as string}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSources.map((source, idx) => (
                      <div key={idx} className="flex flex-col justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{source.name}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{source.description}</p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full gap-2 text-xs" onClick={() => window.open(source.url, '_blank')}>
                          Visit Portal <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
            <Card className="mt-6 border-warning/50 bg-warning/5">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Disclaimer</h4>
                    <p className="text-sm text-muted-foreground">
                      Links provided direct to official government websites. We are not responsible for content changes on external sites.
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



        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
