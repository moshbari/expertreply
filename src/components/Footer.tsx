import { Github, Twitter, Linkedin, MessageCircle } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: MessageCircle, href: "#", label: "Discord" },
  ];

  return (
    <footer className="bg-muted/50 border-t py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  aria-label={link.label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Built with ❤️ using Lovable & ChatGPT API
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;