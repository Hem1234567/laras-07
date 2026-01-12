import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Scale, 
  BookOpen, 
  Download, 
  ExternalLink,
  Gavel,
  HelpCircle,
  Calculator,
  AlertTriangle
} from "lucide-react";

const legalGuides = [
  {
    title: "Understanding the Land Acquisition Act, 2013",
    description: "A comprehensive guide to the Right to Fair Compensation and Transparency in Land Acquisition Act",
    category: "Act & Rules",
    readTime: "15 min read",
  },
  {
    title: "Your Rights as a Land Owner",
    description: "Know your legal rights when your land is being acquired for infrastructure projects",
    category: "Rights Guide",
    readTime: "10 min read",
  },
  {
    title: "Compensation Calculation Guide",
    description: "How compensation is calculated and factors that affect the final amount",
    category: "Compensation",
    readTime: "12 min read",
  },
  {
    title: "Objection Filing Process",
    description: "Step-by-step guide to file objections during land acquisition proceedings",
    category: "Procedure",
    readTime: "8 min read",
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
    format: "DOCX",
  },
  {
    title: "Compensation Enhancement Request",
    description: "Template for requesting higher compensation based on market rates",
    format: "DOCX",
  },
  {
    title: "RTI Application for Project Details",
    description: "RTI format to obtain project documents from implementing agency",
    format: "PDF",
  },
  {
    title: "Legal Notice for Procedure Violation",
    description: "Template for sending legal notice when proper procedure isn't followed",
    format: "DOCX",
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Legal Resources</h1>
          <p className="text-muted-foreground">
            Guides, templates, and FAQs to help you understand your rights and navigate land acquisition.
          </p>
        </div>

        <Tabs defaultValue="guides" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 gap-2">
            <TabsTrigger value="guides" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Guides
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
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {guide.title}
                    </CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full gap-2">
                      Read Guide
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
                      The information provided here is for educational purposes only and should not be considered as legal advice. 
                      Please consult with a qualified legal professional for advice specific to your situation.
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
                  Ready-to-use legal templates for various stages of land acquisition
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
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Compensation Calculator
                </CardTitle>
                <CardDescription>
                  Estimate potential compensation based on current market rates and legal provisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're building a comprehensive compensation calculator that will help you estimate 
                    fair compensation based on the 2013 Act provisions, market rates, and state-specific guidelines.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="mt-8 bg-primary text-primary-foreground shadow-medium">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Gavel className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Need Legal Assistance?</h3>
                  <p className="text-primary-foreground/80">
                    Connect with verified property lawyers in your area
                  </p>
                </div>
              </div>
              <Button variant="glass" size="lg">
                Find a Lawyer
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
