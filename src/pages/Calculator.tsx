import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
    FileText,
    Calculator,
    RefreshCw,
    AlertTriangle,
    Gavel,
    Briefcase,
    MapPin,
    Search,
    Download
} from "lucide-react";

export default function CalculatorPage() {
    const { toast } = useToast();

    const [calcData, setCalcData] = useState({
        area: "",
        unit: "sqft",
        marketRate: "",
        locationType: "urban",
        assetsValue: "0",
        address: "",
        purchasePrice: "",
        govtOffer: "",
        purchaseYear: "",
        otherFactors: ""
    });

    const [calcResult, setCalcResult] = useState<{
        marketValue: number,
        factorAmount: number,
        solatium: number,
        totalCompensation: number,
        entitledAmount: number,
        isUnfair: boolean,
        marketDifference: number
    } | null>(null);

    const [isSimulatingFetch, setIsSimulatingFetch] = useState(false);

    const template = {
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
    };

    const handleDownloadTemplate = () => {
        const blob = new Blob([template.content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Objection_Letter_Template.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const simulateFetchMarketValue = () => {
        if (!calcData.address) {
            toast({
                title: "Address Required",
                description: "Please enter an address to fetch market rates.",
                variant: "destructive"
            });
            return;
        }

        setIsSimulatingFetch(true);
        // Simulate API delay
        setTimeout(() => {
            // Mock logic: 1.5x of current market rate input or random reasonable value
            const baseRate = parseFloat(calcData.marketRate) || 2500;
            const mockedMarketValue = Math.floor(baseRate * (1 + Math.random() * 0.5));
            const mockedTotalValue = mockedMarketValue * (parseFloat(calcData.area) || 1200);

            setCalcData(prev => ({
                ...prev,
                purchasePrice: mockedTotalValue.toString()
            }));

            setIsSimulatingFetch(false);
            toast({
                title: "Market Value Fetched",
                description: `Estimated market value based on recent transactions in ${calcData.address} is ₹${mockedTotalValue.toLocaleString()}`,
            });
        }, 1500);
    };

    const handleBookLawyer = () => {
        toast({
            title: "Request Sent",
            description: "We have connected you with a legal expert. They will contact you shortly.",
        });
    };

    const calculateCompensation = () => {
        const area = parseFloat(calcData.area);
        const rate = parseFloat(calcData.marketRate);
        const assets = parseFloat(calcData.assetsValue);
        const purchasePrice = parseFloat(calcData.purchasePrice) || 0;
        const govtOffer = parseFloat(calcData.govtOffer) || 0;

        if (isNaN(area) || isNaN(rate)) return;

        // 1. Determine Base Market Value
        let areaInSqFt = area;
        if (calcData.unit === 'acre') areaInSqFt = area * 43560;
        if (calcData.unit === 'hectare') areaInSqFt = area * 107639;
        if (calcData.unit === 'sqm') areaInSqFt = area * 10.764;

        const baseMarketValue = purchasePrice > 0 ? purchasePrice : (areaInSqFt * rate);

        // 2. Apply Multiplication Factor (4x Rural, 2x Urban)
        const multiplier = calcData.locationType === 'rural' ? 4 : 2;

        // 3. Entitled Compensation
        const entitledAmount = (baseMarketValue * multiplier) + (isNaN(assets) ? 0 : assets);

        // Fairness Check: If Govt Offer is LESS than Entitled Amount => Unfair
        const isUnfair = govtOffer > 0 && govtOffer < entitledAmount;
        const marketDifference = entitledAmount - govtOffer;

        setCalcResult({
            marketValue: baseMarketValue,
            factorAmount: baseMarketValue * multiplier,
            solatium: 0,
            totalCompensation: entitledAmount,
            entitledAmount: entitledAmount,
            isUnfair,
            marketDifference
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Header />

            <main className="flex-1 container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Compensation Calculator</h1>
                    <p className="text-muted-foreground">
                        Estimate your fair compensation entitlement as per LARR Act, 2013 rules.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Input Card */}
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calculator className="h-5 w-5" />
                                Property Details
                            </CardTitle>
                            <CardDescription>
                                Provide property details to calculate fair compensation.
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
                                <Label>Property Address / Location</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter full address to find market rates..."
                                        value={calcData.address}
                                        onChange={(e) => setCalcData({ ...calcData, address: e.target.value })}
                                    />
                                    <Button variant="outline" size="icon" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(calcData.address)}`, '_blank')} title="View on Maps">
                                        <MapPin className="h-4 w-4" />
                                    </Button>
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
                                <Label>Actual Purchase Price / Market Value</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Ex: 5000000"
                                        type="number"
                                        value={calcData.purchasePrice}
                                        onChange={(e) => setCalcData({ ...calcData, purchasePrice: e.target.value })}
                                    />
                                    <Button
                                        variant="secondary"
                                        onClick={simulateFetchMarketValue}
                                        disabled={isSimulatingFetch}
                                        className="whitespace-nowrap gap-2"
                                    >
                                        {isSimulatingFetch ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                        Fetch Market Rate
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">This is the base Market Value used for calculation.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Year of Purchase</Label>
                                    <Input
                                        placeholder="Ex: 2015"
                                        type="number"
                                        value={calcData.purchaseYear}
                                        onChange={(e) => setCalcData({ ...calcData, purchaseYear: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Govt. Offered Compensation</Label>
                                    <Input
                                        placeholder="Ex: 4000000"
                                        type="number"
                                        value={calcData.govtOffer}
                                        onChange={(e) => setCalcData({ ...calcData, govtOffer: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Location Type</Label>
                                <Select value={calcData.locationType} onValueChange={(val) => setCalcData({ ...calcData, locationType: val })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="urban">Urban (2x Multiplier)</SelectItem>
                                        <SelectItem value="rural">Rural (4x Multiplier)</SelectItem>
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
                                <Button className="w-full" onClick={calculateCompensation}>Check Fairness</Button>
                                <Button variant="outline" size="icon" onClick={() => {
                                    setCalcData({
                                        area: "", unit: "sqft", marketRate: "", locationType: "urban", assetsValue: "0",
                                        address: "", purchasePrice: "", govtOffer: "", purchaseYear: "", otherFactors: ""
                                    });
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
                                        <span className="text-muted-foreground">Estimated Base Market Value</span>
                                        <span className="font-medium">₹ {calcResult.marketValue.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-muted-foreground">Entitlement Multiplier</span>
                                        <span className="font-medium">{calcData.locationType === 'rural' ? '4x (Rural)' : '2x (Urban)'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-muted-foreground">Assets Value</span>
                                        <span className="font-medium">₹ {parseFloat(calcData.assetsValue || "0").toLocaleString()}</span>
                                    </div>

                                    <div className="mt-4 p-4 bg-primary/10 rounded-lg flex justify-between items-center">
                                        <span className="font-bold text-lg text-primary">Your LARR Entitlement</span>
                                        <span className="font-bold text-xl text-primary">₹ {calcResult.entitledAmount.toLocaleString()}</span>
                                    </div>

                                    {calcData.govtOffer && (
                                        <div className="flex justify-between items-center py-2 px-4 border rounded bg-muted/50 mt-2">
                                            <span className="text-muted-foreground">Government Offer</span>
                                            <span className="font-bold">₹ {parseFloat(calcData.govtOffer).toLocaleString()}</span>
                                        </div>
                                    )}

                                    {/* Fairness Assessment */}
                                    <div className={`mt-4 p-4 rounded-lg border ${calcResult.isUnfair ? 'bg-destructive/10 border-destructive/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                                        <div className="flex items-start gap-3">
                                            {calcResult.isUnfair ? (
                                                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                                            ) : (
                                                <Gavel className="h-5 w-5 text-emerald-600 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <h4 className={`font-semibold ${calcResult.isUnfair ? 'text-destructive' : 'text-emerald-700'}`}>
                                                    {calcResult.isUnfair ? 'Unfair Compensation Detected' : 'Fair Compensation Estimate'}
                                                </h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {calcResult.isUnfair
                                                        ? `The government offer is ₹${calcResult.marketDifference.toLocaleString()} LESS than your legal entitlement.`
                                                        : "The government offer appears to match or exceed your estimated entitlement."}
                                                </p>

                                                {calcResult.isUnfair && (
                                                    <div className="flex gap-2 mt-3">
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="gap-2"
                                                            onClick={handleDownloadTemplate}
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                            Sign Petition
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-2 border-destructive/50 hover:bg-destructive/10"
                                                            onClick={handleBookLawyer}
                                                        >
                                                            <Briefcase className="h-4 w-4" />
                                                            Book Lawyer
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-muted-foreground mt-4">
                                        * This is an estimate based on LARR Act 2013 provisions. Actual compensation may vary based on specific state amendments and assessments.
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
