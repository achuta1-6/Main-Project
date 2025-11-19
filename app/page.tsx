import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Smartphone, Zap, Users, TrendingUp, Lock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold text-primary">Finovo</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6">
            Modern Banking
            <span className="text-primary block">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Experience the future of banking with Finovo. Secure, fast, and intelligent financial management powered by
            AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-lg px-8 py-6">
                Open Your Account
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                Sign In to Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Finovo?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for the modern world with cutting-edge security and intelligent features
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Shield className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Bank-Grade Security</CardTitle>
              <CardDescription>
                Your money and data are protected with military-grade encryption and multi-factor authentication
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Smartphone className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Mobile First</CardTitle>
              <CardDescription>
                Designed for your smartphone with an intuitive interface that makes banking effortless
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Zap className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Instant Transfers</CardTitle>
              <CardDescription>
                Send money instantly to friends, family, or businesses with just a few taps
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Users className="w-12 h-12 text-primary mb-4" />
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                Get personalized financial advice and instant support from our intelligent AI assistant
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Smart Insights</CardTitle>
              <CardDescription>
                Track your spending, set budgets, and get insights to help you reach your financial goals
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Lock className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Privacy First</CardTitle>
              <CardDescription>
                We never sell your data. Your financial information stays private and secure
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have already made the switch to smarter banking
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Open Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">F</span>
              </div>
              <span className="text-lg font-bold text-primary">Finovo</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Finovo. All rights reserved. FDIC Insured.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
