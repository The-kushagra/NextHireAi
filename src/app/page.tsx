import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { 
  Sparkles, 
  BriefcaseBusiness, 
  Users, 
  Trophy, 
  Github, 
  Linkedin, 
  Instagram, 
  Mail 
} from "lucide-react";
import { LandingNavbar } from "@/components/landing-navbar";

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      
      <LandingNavbar userId={userId} />

      <main className="flex-1">
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-12 overflow-hidden">
          <div className="container px-6 text-center space-y-12 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-muted-foreground text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-1000">
              <Sparkles className="size-4" />
              <span>Next-Gen Hiring Experience</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.1]">
              AI-Powered Recruitment, <br className="hidden md:block" /> Reimagined
            </h1>
            
            <p className="mx-auto max-w-2xl text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
              Skip the manual screening. Our advanced AI analyzes resumes and identifies your perfect match in seconds. Professional, fast, and intelligent.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Button asChild size="lg" className="w-full sm:w-auto text-lg h-14 px-10">
                <Link href="/jobs">Find Jobs Now</Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-10">
                <Link href="/dashboard">Post a Job Position</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-card/50 relative border-y border-border">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Resume Analysis",
                  description: "Extract professional data from PDFs automatically using our high-precision parsing engine.",
                  icon: Sparkles
                },
                {
                  title: "Smart Matching",
                  description: "Our vector-based matching system finds candidates who actually share your required tech stack.",
                  icon: BriefcaseBusiness
                },
                {
                  title: "Applicant Ranking",
                  description: "AI-generated scores and feedback help you focus on the top 1% of talent immediately.",
                  icon: Trophy
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-lg border border-border bg-card transition-colors hover:border-primary">
                  <div className="size-14 rounded-lg bg-muted flex items-center justify-center border border-border mb-6 transition-colors">
                    <feature.icon className="size-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="stats" className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="text-5xl md:text-6xl font-black text-white mb-2">10+</div>
                <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">Active Jobs</div>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-black text-white mb-2">98%</div>
                <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">AI Accuracy</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-5xl md:text-6xl font-black text-white mb-2">Instant</div>
                <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">Matching</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0B0F19] border-t border-border px-8 py-16 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link className="flex items-center gap-2 group" href="/">
              <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-white border border-border">
                <BriefcaseBusiness className="size-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white group-hover:text-foreground transition-colors">
                NextHire
              </span>
            </Link>
            <p className="text-[#94A3B8] font-medium leading-relaxed max-w-xs">
              AI-Powered Recruitment, Reimagined. Built for the modern talent acquisition era.
            </p>
            <div className="pt-4">
              <p className="text-[#94A3B8] text-sm font-semibold">
                © 2025 NextHire. Built by Kushagra Gupta.
              </p>
            </div>
          </div>

          {/* Links Column */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-white font-black uppercase tracking-widest text-xs">Product</h4>
              <ul className="space-y-4">
                <li><Link href="#features" className="text-[#94A3B8] hover:text-white transition-colors font-medium">Features</Link></li>
                <li><Link href="/jobs" className="text-[#94A3B8] hover:text-white transition-colors font-medium">Jobs Marketplace</Link></li>
                <li><Link href="/dashboard" className="text-[#94A3B8] hover:text-white transition-colors font-medium">Dashboard</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-white font-black uppercase tracking-widest text-xs">Connect</h4>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:kushagragupta96855@gmail.com" className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors font-medium">
                    <Mail className="size-4" />
                    <span>Email Us</span>
                  </a>
                </li>
                <li>
                  <a href="https://github.com/The-kushagra" className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors font-medium">
                    <Github className="size-4" />
                    <span>GitHub</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Column */}
          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-widest text-xs">Social Presence</h4>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Linkedin, url: "https://www.linkedin.com/in/kushagra-gupta-9a5bb3260" },
                { icon: Instagram, url: "https://www.instagram.com/the_kushagraa/" },
                { icon: Github, url: "https://github.com/The-kushagra" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-12 rounded-lg bg-card border border-border flex items-center justify-center text-white hover:bg-muted hover:border-white/20 transition-all duration-300"
                >
                  <social.icon className="size-5" />
                </a>
              ))}
            </div>
            <div className="pt-2">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Primary Contact</p>
               <p className="text-white font-bold">kushagragupta96855@gmail.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
