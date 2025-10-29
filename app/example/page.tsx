"use client";

import {
  InvoiceHistory,
  type InvoiceItem,
} from "@/app/example/invoice-history";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
} from "@/components/animate-ui/primitives/base/progress";
import Stepper, { Step } from "@/components/ui/stepper";

export default function InvoiceHistoryExamplePage() {
  // Sample invoice data showcasing different statuses and scenarios
  const sampleInvoices: InvoiceItem[] = [
    {
      id: "inv_001",
      date: "2025-01-15",
      amount: "$99.00",
      status: "paid",
      description: "Pro plan — January 2025",
      invoiceUrl: "https://example.com/invoices/inv_001.pdf",
    },
    {
      id: "inv_002",
      date: "2024-12-15",
      amount: "$99.00",
      status: "paid",
      description: "Pro plan — December 2024",
      invoiceUrl: "https://example.com/invoices/inv_002.pdf",
    },
    {
      id: "inv_003",
      date: "2024-11-15",
      amount: "$99.00",
      status: "paid",
      description: "Pro plan — November 2024",
      invoiceUrl: "https://example.com/invoices/inv_003.pdf",
    },
    {
      id: "inv_004",
      date: "2024-10-15",
      amount: "$49.00",
      status: "refunded",
      description: "Basic plan — October 2024 (upgraded to Pro)",
    },
    {
      id: "inv_005",
      date: "2024-09-15",
      amount: "$199.00",
      status: "paid",
      description: "Enterprise plan — September 2024",
      invoiceUrl: "https://example.com/invoices/inv_005.pdf",
    },
    {
      id: "inv_006",
      date: "2024-08-15",
      amount: "$99.00",
      status: "open",
      description: "Pro plan — August 2024 (payment pending)",
    },
    {
      id: "inv_007",
      date: "2024-07-15",
      amount: "$99.00",
      status: "void",
      description: "Pro plan — July 2024 (cancelled)",
    },
  ];

  const handleDownload = (invoiceId: string) => {
    console.log(`Downloading invoice: ${invoiceId}`);
    // In a real application, this would trigger the actual download
    alert(`Downloading invoice ${invoiceId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Component Showcase
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive example showcasing the BillingSDK Invoice History
            component and AnimateUI Progress component with various features and
            animations.
          </p>
        </div>

        <Separator />

        {/* Stepper Component Example */}
        <Card>
          <CardHeader>
            <CardTitle>Animated Stepper Component</CardTitle>
            <CardDescription>
              A multi-step form component with smooth animations, step
              indicators, and navigation controls.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Stepper
              initialStep={1}
              onStepChange={(step) => console.log(`Step changed to: ${step}`)}
              onFinalStepCompleted={() => console.log("All steps completed!")}
              backButtonText="Previous"
              nextButtonText="Next"
            >
              <Step>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    Step 1: Personal Information
                  </h3>
                  <p className="text-muted-foreground">
                    Please provide your basic personal information to get
                    started.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>
              </Step>

              <Step>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    Step 2: Project Details
                  </h3>
                  <p className="text-muted-foreground">
                    Tell us about your painting project requirements.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Room Type
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select room type</option>
                        <option value="bedroom">Bedroom</option>
                        <option value="living-room">Living Room</option>
                        <option value="kitchen">Kitchen</option>
                        <option value="bathroom">Bathroom</option>
                        <option value="office">Office</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Paint Quality
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="quality"
                            value="good"
                            className="mr-2"
                          />
                          Good Quality - Budget friendly
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="quality"
                            value="better"
                            className="mr-2"
                          />
                          Better Quality - Mid-range
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="quality"
                            value="best"
                            className="mr-2"
                          />
                          Best Quality - Premium
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Project Description
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Describe your painting project..."
                      />
                    </div>
                  </div>
                </div>
              </Step>

              <Step>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    Step 3: Review & Confirm
                  </h3>
                  <p className="text-muted-foreground">
                    Please review your information and confirm your submission.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>John Doe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>john.doe@example.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Room Type:</span>
                      <span>Living Room</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Paint Quality:</span>
                      <span>Better Quality</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Estimated Cost:</span>
                      <span className="text-green-600 font-semibold">
                        $450 - $650
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" id="terms" className="mt-1" />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground"
                    >
                      I agree to the terms and conditions and understand that
                      this is an estimate.
                    </label>
                  </div>
                </div>
              </Step>
            </Stepper>
          </CardContent>
        </Card>

        {/* Component Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Component Overview</CardTitle>
            <CardDescription>
              The Invoice History component displays past invoices and payment
              receipts with status indicators and download actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Badge className="bg-emerald-600 text-emerald-50 border-emerald-700/40 mb-2">
                  Paid
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Successfully processed payments
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Badge variant="secondary" className="mb-2">
                  Refunded
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Refunded transactions
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Badge variant="outline" className="mb-2">
                  Open
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Pending payments
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Badge variant="outline" className="mb-2">
                  Void
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Cancelled invoices
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AnimateUI Progress Component Examples */}
        <Card>
          <CardHeader>
            <CardTitle>AnimateUI Progress Component</CardTitle>
            <CardDescription>
              Animated progress bars with smooth transitions and counting
              numbers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Progress Examples */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Basic Progress Examples</h4>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Progress value={75}>
                    <ProgressLabel>Invoice Processing</ProgressLabel>
                    <ProgressTrack>
                      <ProgressIndicator />
                    </ProgressTrack>
                    <ProgressValue />
                  </Progress>
                </div>

                <div className="space-y-2">
                  <Progress value={100}>
                    <ProgressLabel>Payment Status</ProgressLabel>
                    <ProgressTrack>
                      <ProgressIndicator />
                    </ProgressTrack>
                    <ProgressValue />
                  </Progress>
                </div>

                <div className="space-y-2">
                  <Progress value={45}>
                    <ProgressLabel>Subscription Renewal</ProgressLabel>
                    <ProgressTrack>
                      <ProgressIndicator />
                    </ProgressTrack>
                    <ProgressValue />
                  </Progress>
                </div>
              </div>
            </div>

            {/* Custom Styled Progress */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Custom Styled Progress</h4>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Progress value={82}>
                    <ProgressLabel>Monthly Revenue Target</ProgressLabel>
                    <ProgressTrack className="bg-blue-100 h-3">
                      <ProgressIndicator className="bg-linear-to-r from-blue-500 to-blue-600" />
                    </ProgressTrack>
                    <ProgressValue />
                  </Progress>
                </div>

                <div className="space-y-2">
                  <Progress value={95}>
                    <ProgressLabel>Customer Satisfaction</ProgressLabel>
                    <ProgressTrack className="bg-green-100 h-4">
                      <ProgressIndicator className="bg-linear-to-r from-green-500 to-green-600" />
                    </ProgressTrack>
                    <ProgressValue />
                  </Progress>
                </div>
              </div>
            </div>

            {/* Progress with Different Values */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Various Progress States</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Progress value={25}>
                    <ProgressLabel>Low Progress (25%)</ProgressLabel>
                    <ProgressTrack>
                      <ProgressIndicator />
                    </ProgressTrack>
                    <ProgressValue />
                  </Progress>
                </div>

                <div className="space-y-2">
                  <Progress value={60}>
                    <ProgressLabel>Medium Progress (60%)</ProgressLabel>
                    <ProgressTrack>
                      <ProgressIndicator />
                    </ProgressTrack>
                    <ProgressValue />
                  </Progress>
                </div>

                <div className="space-y-2">
                  <Progress value={85}>
                    <ProgressLabel>High Progress (85%)</ProgressLabel>
                    <ProgressTrack>
                      <ProgressIndicator />
                    </ProgressTrack>
                    <ProgressValue />
                  </Progress>
                </div>

                <div className="space-y-2">
                  <Progress value={100}>
                    <ProgressLabel>Complete (100%)</ProgressLabel>
                    <ProgressTrack>
                      <ProgressIndicator />
                    </ProgressTrack>
                    <ProgressValue />
                  </Progress>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Invoice History Component */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Invoice History</h2>
          <InvoiceHistory
            invoices={sampleInvoices}
            onDownload={handleDownload}
            title="Billing History"
            description="Your complete invoice and payment history with download options."
          />
        </div>

        {/* Empty State Example */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Empty State</h2>
          <InvoiceHistory
            invoices={[]}
            title="No Invoices Yet"
            description="When you have invoices, they will appear here."
          />
        </div>

        {/* Custom Styling Example */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Custom Styling</h2>
          <InvoiceHistory
            invoices={sampleInvoices.slice(0, 3)}
            className="border-2 border-blue-200 bg-blue-50/50"
            title="Custom Styled History"
            description="Example with custom styling applied."
          />
        </div>

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
            <CardDescription>
              How to implement both the Invoice History and AnimateUI Progress
              components in your application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">1. Import the components:</h4>
              <code className="text-sm">
                {`import { InvoiceHistory, type InvoiceItem } from '@/components/billingsdk/invoice-history';
import { 
  Progress, 
  ProgressTrack, 
  ProgressIndicator, 
  ProgressLabel, 
  ProgressValue 
} from '@/components/animate-ui/primitives/base/progress';`}
              </code>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                2. Define your invoice data:
              </h4>
              <code className="text-sm">
                {`const invoices: InvoiceItem[] = [
  { 
    id: 'inv_001', 
    date: '2025-01-15', 
    amount: '$99.00', 
    status: 'paid', 
    description: 'Pro plan — January 2025', 
    invoiceUrl: 'https://example.com/invoices/inv_001.pdf' 
  }
];`}
              </code>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                3. Use the Invoice History component:
              </h4>
              <code className="text-sm">
                {`<InvoiceHistory 
  invoices={invoices}
  onDownload={(invoiceId) => console.log('Download:', invoiceId)}
  title="Your Invoices"
  description="Download your past invoices and receipts."
/>`}
              </code>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                4. Use the Progress component:
              </h4>
              <code className="text-sm">
                {`<Progress value={75}>
  <ProgressLabel>Processing Status</ProgressLabel>
  <ProgressTrack>
    <ProgressIndicator />
  </ProgressTrack>
  <ProgressValue />
</Progress>`}
              </code>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                5. Use the Stepper component:
              </h4>
              <code className="text-sm">
                {`import Stepper, { Step } from '@/components/ui/stepper';

<Stepper
  initialStep={1}
  onStepChange={(step) => console.log('Step:', step)}
  onFinalStepCompleted={() => console.log('Completed!')}
>
  <Step>
    <div>Step 1 content</div>
  </Step>
  <Step>
    <div>Step 2 content</div>
  </Step>
</Stepper>`}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
