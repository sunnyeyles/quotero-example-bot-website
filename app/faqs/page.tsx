"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: "Getting Started",
      faqs: [
        {
          question: "How do I create my first quote?",
          answer:
            "Creating your first quote is easy! Simply log into your account, click 'New Quote' in the dashboard, and follow our step-by-step wizard. You can choose from our pre-built templates or start from scratch.",
        },
        {
          question: "Do I need to install any software?",
          answer:
            "No installation required! Quotero is a web-based application that works in any modern browser. You can also download our mobile app for iOS and Android for on-the-go quote management.",
        },
        {
          question: "How long does it take to set up my account?",
          answer:
            "Account setup takes less than 5 minutes. Simply sign up, verify your email, and you're ready to start creating quotes immediately.",
        },
        {
          question: "Can I import my existing quotes?",
          answer:
            "Yes! We support importing quotes from CSV files, Excel spreadsheets, and most popular quote management systems. Our support team can help with the migration process.",
        },
      ],
    },
    {
      title: "Features & Functionality",
      faqs: [
        {
          question: "What templates are available?",
          answer:
            "We offer over 50 professional templates across various industries including consulting, construction, retail, services, and more. Professional and Enterprise plans include access to premium templates and custom branding options.",
        },
        {
          question: "Can I customize my quotes?",
          answer:
            "Absolutely! You can customize everything from colors and fonts to your company logo and contact information. Enterprise customers can create completely custom templates.",
        },
        {
          question: "How do I track quote status?",
          answer:
            "Our dashboard provides real-time tracking of all your quotes. You can see which quotes are pending, accepted, or declined, and set up automated follow-up reminders.",
        },
        {
          question: "Can I collaborate with my team?",
          answer:
            "Yes! Professional and Enterprise plans include team collaboration features. You can assign quotes to team members, add comments, and track who made changes.",
        },
        {
          question: "Do you offer API access?",
          answer:
            "Yes, Professional and Enterprise plans include API access. This allows you to integrate Quotero with your existing business systems and workflows.",
        },
      ],
    },
    {
      title: "Billing & Plans",
      faqs: [
        {
          question: "What's included in the free trial?",
          answer:
            "The free trial includes full access to all Starter plan features for 14 days. No credit card required to start your trial.",
        },
        {
          question: "Can I change my plan anytime?",
          answer:
            "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
        },
        {
          question: "Do you offer annual billing discounts?",
          answer:
            "Yes! Save 20% when you pay annually. This discount is automatically applied at checkout for all plans.",
        },
        {
          question: "What happens if I exceed my plan limits?",
          answer:
            "If you exceed your plan limits, we'll notify you and offer options to upgrade. Your account will continue to work normally during this grace period.",
        },
        {
          question: "Can I cancel anytime?",
          answer:
            "Absolutely. You can cancel your subscription at any time from your account settings. No cancellation fees or long-term commitments.",
        },
      ],
    },
    {
      title: "Security & Data",
      faqs: [
        {
          question: "How secure is my data?",
          answer:
            "We use enterprise-grade security including SSL encryption, secure data centers, and regular security audits. Your data is protected with the same level of security used by major financial institutions.",
        },
        {
          question: "Can I export my data?",
          answer:
            "Yes, you can export all your quotes, customer data, and reports at any time. We provide multiple export formats including PDF, CSV, and Excel.",
        },
        {
          question: "Where is my data stored?",
          answer:
            "Your data is stored in secure, SOC 2 compliant data centers with 99.9% uptime guarantee. We use multiple geographic locations for redundancy and disaster recovery.",
        },
        {
          question: "Do you backup my data?",
          answer:
            "Yes, we perform automated daily backups of all customer data. These backups are encrypted and stored in multiple secure locations.",
        },
      ],
    },
    {
      title: "Support & Training",
      faqs: [
        {
          question: "What support options are available?",
          answer:
            "Starter plans include email support, Professional plans get priority support, and Enterprise customers receive 24/7 phone support with a dedicated account manager.",
        },
        {
          question: "Do you offer training sessions?",
          answer:
            "Yes! We offer free onboarding sessions for all new customers and advanced training workshops for Enterprise customers. All sessions are recorded for future reference.",
        },
        {
          question: "Is there a knowledge base?",
          answer:
            "Yes, we maintain a comprehensive knowledge base with step-by-step guides, video tutorials, and best practices. It's available 24/7 to all customers.",
        },
        {
          question: "Can I request new features?",
          answer:
            "Absolutely! We love customer feedback and regularly implement feature requests. Enterprise customers can request custom features and integrations.",
        },
      ],
    },
  ];

  const allFaqs = faqCategories.flatMap((category) =>
    category.faqs.map((faq) => ({
      ...faq,
      category: category.title,
    }))
  );

  const filteredFaqs = allFaqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find answers to common questions about Quotero. Can't find what
              you're looking for? Contact our support team.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchTerm ? (
            // Search Results
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Search Results ({filteredFaqs.length})
              </h2>
              <div className="space-y-6">
                {filteredFaqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm text-blue-600 font-medium mb-2">
                            {faq.category}
                          </div>
                          <CardTitle className="text-lg mb-3">
                            {faq.question}
                          </CardTitle>
                          <CardDescription>{faq.answer}</CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredFaqs.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms or browse our categories
                      below.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Category-based FAQ
            <div className="space-y-16">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    {category.title}
                  </h2>
                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => {
                      const globalIndex =
                        faqCategories
                          .slice(0, categoryIndex)
                          .reduce((acc, cat) => acc + cat.faqs.length, 0) +
                        faqIndex;
                      const isOpen = openItems.includes(globalIndex);

                      return (
                        <Card key={faqIndex}>
                          <Button
                            variant="ghost"
                            onClick={() => toggleItem(globalIndex)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 pr-4">
                              {faq.question}
                            </h3>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            )}
                          </Button>
                          {isOpen && (
                            <CardContent className="px-6 pb-4">
                              <CardDescription>{faq.answer}</CardDescription>
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our support team is here to help you succeed with Quotero.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="text-center p-8">
                <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">Email Support</CardTitle>
                <CardDescription className="mb-4">
                  Get help via email within 24 hours
                </CardDescription>
                <a
                  href="mailto:support@quotero.com"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  support@quotero.com
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">?</span>
                </div>
                <CardTitle className="text-xl mb-2">Knowledge Base</CardTitle>
                <CardDescription className="mb-4">
                  Browse our comprehensive help center
                </CardDescription>
                <a
                  href="/help"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Visit Help Center
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
