import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    Github,
  } from "lucide-react";
  
  const Footer = () => {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-white pt-10 dark:bg-gray-800 text-black dark:text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-10">
            {/* Brand Section */}
            <div className="space-y-4">
              <a className="text-2xl font-bold block mb-4">
                Edu<span className="text-primary">Manage</span>
              </a>
              <p className="text-sm opacity-80 mb-6">
                Empowering education through a revolutionary MERN stack platform.
              </p>
              <div className="flex gap-4">
                {["#", "#", "#", "#", "#"].map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    className="hover:text-primary transition-colors"
                  >
                    {index === 0 && <Facebook className="w-5 h-5" />}
                    {index === 1 && <Twitter className="w-5 h-5" />}
                    {index === 2 && <Instagram className="w-5 h-5" />}
                    {index === 3 && <Linkedin className="w-5 h-5" />}
                    {index === 4 && <Github className="w-5 h-5" />}
                  </a>
                ))}
              </div>
            </div>
  
            {/* Quick Links */}
            <div>
              <h6 className="footer-title text-lg mb-4">Quick Links</h6>
              <div className="flex flex-col gap-2">
                {["About Us", "All Classes", "Teach on EduManage", "Contact Us"].map(
                  (text, index) => (
                    <a
                      key={index}
                      className="link link-hover hover:text-primary transition-colors"
                    >
                      {text}
                    </a>
                  )
                )}
              </div>
            </div>
  
            {/* Contact Info */}
            <div>
              <h6 className="footer-title text-lg mb-4">Contact Us</h6>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>123 Edu Street, Knowledge City, 56789</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <a
                    href="tel:+1234567890"
                    className="hover:text-primary transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a
                    href="mailto:support@edumanage.com"
                    className="hover:text-primary transition-colors"
                  >
                    support@edumanage.com
                  </a>
                </div>
              </div>
            </div>
  
            {/* Newsletter Section */}
            <div>
              <h6 className="footer-title text-lg mb-4">Newsletter</h6>
              <p className="text-sm mb-4">
                Stay informed with EduManage updates and tips.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-3"
              >
                <div className="join w-full">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered join-item w-full dark:bg-gray-700"
                    required
                  />
                  <button className="btn bg-primary join-item hover:bg-primary/90 text-white">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs opacity-70">
                  By subscribing, you agree to our Privacy Policy.
                </p>
              </form>
            </div>
          </div>
  
          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="p-6 text-center text-sm">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-4">
                  <a className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                  <a className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                  <a className="hover:text-primary transition-colors">
                    Cookie Policy
                  </a>
                </div>
                <p>
                  © {currentYear}{" "}
                  <span className="text-primary font-medium">EduManage</span>.
                  All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Stats Bar */}
        <div className="bg-primary text-white">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                ["5+", "Users Enrolled"],
                ["5+", "Classes Created"],
                ["3+", "Collaborative Partners"],
                ["2+", "Instructors Active"],
              ].map(([value, label], index) => (
                <div key={index}>
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-sm opacity-90">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  