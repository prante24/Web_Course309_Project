import  { useState } from 'react';
import { Award, Globe, Users } from 'lucide-react';

const PartnersSection = () => {
  const [hoveredPartner, setHoveredPartner] = useState(null);

  const partners = [
    {
      logo: 'https://i.postimg.cc/2SmVrPg6/google-for-education-logo.webp',
      name: 'Google for Education',
      description: 'Providing cloud-based learning tools and infrastructure to enhance virtual classroom experiences',
      color: 'bg-blue-50'
    },
    {
      logo: 'https://i.postimg.cc/jSZdKCzg/qzpmwx-C7-400x400.jpg',
      name: 'Microsoft Education',
      description: 'Collaborating on digital skills development and Office 365 integration for seamless coursework management',
      color: 'bg-indigo-50'
    },
    {
      logo: 'https://i.postimg.cc/J05Cqdx6/Thumbnail-508fa1.webp',
      name: 'Coursera',
      description: 'Co-developing specialized certification programs recognized by top universities and companies',
      color: 'bg-green-50'
    },
    {
      logo: 'https://i.postimg.cc/4xdR6P9P/logo-IBM-Skills-Build.jpg',
      name: 'IBM SkillsBuild',
      description: 'Offering AI and cloud computing curriculum with hands-on industry projects',
      color: 'bg-purple-50'
    },
    {
      logo: 'https://i.postimg.cc/4yZrmQGz/images.png',
      name: 'TED-Ed',
      description: 'Curating inspirational educational content and masterclasses from world-renowned experts',
      color: 'bg-red-50'
    },
    {
      logo: 'https://i.postimg.cc/nVYyNgKT/linkedin-learning-logo-clipart-rz5ja.jpg',
      name: 'LinkedIn Learning',
      description: 'Providing career development pathways and industry-recognized skill assessments',
      color: 'bg-orange-50'
    }
  ];

  return (
    <section className="py-10 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            Our Strategic Partners
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-400">
            Collaborating with global leaders to deliver world-class educational experiences and 
            industry-relevant learning opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className={`
                ${partner.color} dark:bg-gray-800
                rounded-xl p-6 shadow-lg 
                transform transition-all duration-300
                ${hoveredPartner === index 
                  ? 'scale-105 shadow-2xl' 
                  : 'scale-100 shadow-md'}
              `}
              onMouseEnter={() => setHoveredPartner(index)}
              onMouseLeave={() => setHoveredPartner(null)}
            >
              <div className="flex items-center mb-4">
                <img 
                  src={partner.logo}
                  alt={partner.name}
                  className={`
                    h-16 w-16 object-contain mr-4 
                    transition-all duration-300
                    ${hoveredPartner === index 
                      ? 'transform rotate-6 scale-110' 
                      : 'rotate-0 scale-100'}
                  `}
                />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {partner.name}
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400">
                {partner.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-md">
            <div className="flex items-center space-x-2">
              <Award className="text-primary h-5 w-5" />
              <Globe className="text-primary h-5 w-5" />
              <Users className="text-primary h-5 w-5" />
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                Trusted by educational institutions worldwide
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;