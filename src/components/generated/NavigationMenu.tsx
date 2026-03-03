import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
interface NavigationMenuProps {
  initialMode?: 'light' | 'dark';
}
export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  initialMode = 'light'
}) => {
  console.log('NavigationMenu rendering...');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isDarkMode, setIsDarkMode] = useState(initialMode === 'dark');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeNavigation, setActiveNavigation] = useState('Dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const [campaignsPage, setCampaignsPage] = useState(1);
  const [commissionsPage, setCommissionsPage] = useState(1);
  const [subPartnersPage, setSubPartnersPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [bookingTypeFilter, setBookingTypeFilter] = useState('');
  const [subPartnersStatusFilter, setSubPartnersStatusFilter] = useState('');
  const [subPartnersBookingTypeFilter, setSubPartnersBookingTypeFilter] = useState('');
  const [listingsPage, setListingsPage] = useState(1);
  const [listingsSearchQuery, setListingsSearchQuery] = useState('');
  const [listingsProviderFilter, setListingsProviderFilter] = useState('');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const itemsPerPage = 10;
  const [settingsTab, setSettingsTab] = useState('Brand Identity');
  const [brandColor, setBrandColor] = useState('#015A57');
  const [redirectionLink, setRedirectionLink] = useState('');
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const [processingAnimationData, setProcessingAnimationData] = useState<any>(null);
  const [isScrambling, setIsScrambling] = useState(false);

  // Text scramble effect
  useEffect(() => {
    if (!isScrambling) return;

    const chars = '!<>-_\\/[]{}—=+*^?#________';
    // Only target profile name and email elements
    const elements = document.querySelectorAll('[data-scramble="profile"]');
    const textElements: Array<{ element: HTMLElement; originalText: string; currentText: string }> = [];

    // Collect all text elements
    elements.forEach((el) => {
      const element = el as HTMLElement;
      if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
        const text = element.textContent || '';
        if (text.trim().length > 0) {
          textElements.push({
            element,
            originalText: text,
            currentText: text
          });
        }
      }
    });

    const startTime = performance.now();
    const duration = 1200; // 1.2 seconds for ultra smooth animation

    const scramble = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // Ease-in-out cubic for ultra smooth motion
      const easeInOutCubic = (t: number) => {
        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      
      const progress = easeInOutCubic(rawProgress);
      
      textElements.forEach((item) => {
        const revealCount = Math.floor(progress * item.originalText.length);
        
        let scrambledText = '';
        for (let i = 0; i < item.originalText.length; i++) {
          if (i < revealCount) {
            scrambledText += item.originalText[i];
          } else if (item.originalText[i] === ' ') {
            scrambledText += ' ';
          } else {
            const randomChar = chars[Math.floor(Math.random() * chars.length)];
            scrambledText += randomChar;
          }
        }
        
        item.element.textContent = scrambledText;
      });

      if (rawProgress < 1) {
        requestAnimationFrame(scramble);
      } else {
        // Restore original text
        textElements.forEach((item) => {
          item.element.textContent = item.originalText;
        });
        setIsScrambling(false);
      }
    };

    requestAnimationFrame(scramble);
  }, [isScrambling]);

  useEffect(() => {
    clickAudioRef.current = new Audio('https://storage.googleapis.com/storage.magicpath.ai/global-assets/click-soft-01.mp3');
  }, []);

  // Set default tab to 'Leads' when navigating to Leads page
  useEffect(() => {
    if (activeNavigation === 'Leads') {
      // Only set to 'Leads' if currently on a different page's tab (like 'Dashboard')
      // This allows users to switch between 'Leads' and 'Prequalified Leads' while on Leads page
      if (activeTab !== 'Leads' && activeTab !== 'Prequalified Leads') {
        setActiveTab('Leads');
      }
    }
  }, [activeNavigation]);

  // Load the Lottie animation JSON
  useEffect(() => {
    fetch('/processing.json')
      .then(res => res.json())
      .then(data => setProcessingAnimationData(data))
      .catch(err => console.error('Failed to load processing animation:', err));
  }, []);

  // Function to modify Lottie animation colors for dark mode
  const getProcessedAnimationData = () => {
    if (!processingAnimationData) {
      return null;
    }
    
    if (!isDarkMode) {
      return processingAnimationData;
    }
    
    // Deep clone the animation data
    const modifiedData = JSON.parse(JSON.stringify(processingAnimationData));
    
    // Convert hex #E7E7E7 to RGB normalized: [0.906, 0.906, 0.906, 1]
    const darkModeColor = [231 / 255, 231 / 255, 231 / 255, 1];
    
    // Recursively modify color values in the animation data
    const modifyColors = (obj: any): void => {
      if (Array.isArray(obj)) {
        obj.forEach(item => modifyColors(item));
      } else if (obj && typeof obj === 'object') {
        // Check for stroke and fill color properties
        // Lottie format: {"ty":"st","c":{"a":0,"k":[r,g,b,a]}} or {"ty":"fl","c":{"a":0,"k":[r,g,b,a]}}
        if (obj.c && obj.c.k && Array.isArray(obj.c.k) && obj.c.k.length >= 3) {
          const [r, g, b] = obj.c.k;
          // Only modify black/dark colors (r, g, b < 0.1)
          if (r < 0.1 && g < 0.1 && b < 0.1) {
            obj.c.k = darkModeColor;
          }
        }
        // Recursively process nested objects
        Object.keys(obj).forEach(key => {
          modifyColors(obj[key]);
        });
      }
    };
    
    modifyColors(modifiedData);
    return modifiedData;
  };

  const playClickSound = () => {
    let audio = clickAudioRef.current;
    if (!audio) {
      audio = new Audio('https://storage.googleapis.com/storage.magicpath.ai/global-assets/click-soft-01.mp3');
      audio.volume = 10;
      clickAudioRef.current = audio;
    }
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Ignore autoplay or interaction errors
    });
  };
  const PageSection: React.FC<{ children: React.ReactNode; pageKey: string }> = ({
    children,
    pageKey
  }) => (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {children}
    </motion.div>
  );
  const colors = {
    bg: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'rgba(255, 255, 255, 1)',
    sidebarBg: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
    border: isDarkMode ? 'rgba(39, 39, 42, 1)' : 'rgba(229, 229, 229, 1)',
    textPrimary: isDarkMode ? 'rgba(250, 250, 250, 1)' : 'rgba(10, 10, 10, 1)',
    textSecondary: isDarkMode ? 'rgba(163, 163, 163, 1)' : 'rgba(115, 115, 115, 1)',
    textMuted: isDarkMode ? 'rgba(115, 115, 115, 1)' : 'rgba(119, 119, 119, 1)',
    cardBg: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(255, 255, 255, 1)',
    inputBg: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'rgba(255, 255, 255, 1)',
    accent: 'rgba(37, 99, 235, 1)',
    white: 'rgba(255, 255, 255, 1)'
  };
  
  const avatarColors = [
    { bg: 'rgba(192, 219, 255, 1)', text: 'rgba(18, 55, 104, 1)' },
    { bg: 'rgba(218, 192, 255, 1)', text: 'rgba(62, 26, 117, 1)' },
  ];
  const getAvatarColors = (index: number) => avatarColors[index % 2];

  // Helper function to get icon filter based on selection and theme
  const getIconFilter = (isSelected: boolean) => {
    if (!isSelected) {
      if (isDarkMode) {
        return 'grayscale(100%) brightness(1.4) invert(0.15)';
      }
      return 'grayscale(100%) brightness(0.6)';
    }
    if (isDarkMode) {
      return 'brightness(0) saturate(100%) invert(100%)';
    } else {
      // #1B86FF for light mode (RGB: 27, 134, 255)
      return 'brightness(0) saturate(100%) invert(11%) sepia(100%) saturate(7498%) hue-rotate(210deg) brightness(100%) contrast(100%)';
    }
  };
  const navItems = [{
    name: 'Dashboard',
    icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/9ddcdba4-23a5-4ca7-8298-dd38d3af6175.svg'
  }, {
    name: 'Leads',
    icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/b180e1ef-0a90-4d54-8be8-d7485798bba5.svg'
  }, {
    name: 'Commissions',
    icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/d24c3c5c-cbef-4075-8479-4c40bb721d85.svg'
  }, {
    name: 'Listings',
    icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/4de30599-d28c-4a8b-beed-5dbd6da722c6.svg'
  }, {
    name: 'Sub-Partners',
    icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/2440581a-feec-4524-ba16-2b366210db1e.svg'
  }, {
    name: 'Campaigns / Events',
    icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/9635bf66-6b5b-4455-a16d-fd2b88a43b84.svg'
  }] as any[];
  const systemItems = [{
    name: 'Integrations',
    icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/985caacd-ac60-4865-a417-6f78e69a71c0.svg'
  }, {
    name: 'Support',
    icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/2728d541-9f29-4526-922c-5e8e6ed3b5eb.svg'
  }, {
    name: 'Settings',
    icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/52a7ff51-763c-4056-836e-c413b166618b.svg'
  }] as any[];
  const leadsData = [{
    name: 'Jack alfredo',
    email: 'Jackal@shadcnstudio.com',
    initial: 'R',
    color: 'rgba(202, 192, 255, 1)',
    textColor: 'rgba(53, 26, 117, 1)',
    status: 'Contacted',
    city: 'London',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/ecc02272-7491-4bce-ba22-5da993789664.svg',
    intake: 'Jan – Mar',
    partner: 'IDP Education',
    created: '03/04/2025'
  }, {
    name: 'Maria Gonzalez',
    email: 'maria.g@shadcnstudio.com',
    initial: 'E',
    color: 'rgba(192, 234, 255, 1)',
    textColor: 'rgba(18, 75, 104, 1)',
    status: 'Contacted',
    city: 'London',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/cd703298-257a-4b1a-81d1-37f85e7bb5fe.svg',
    intake: 'Jan – Mar',
    partner: 'Vindy Consultancy',
    created: '03/04/2025'
  }, {
    name: 'John Doe',
    email: 'john.doe@shadcnstudio.com',
    initial: 'A',
    color: 'rgba(192, 213, 255, 1)',
    textColor: 'rgba(18, 35, 104, 1)',
    status: 'Not Booked',
    city: 'Coffs Harbour',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jan – Mar',
    partner: 'IDP Education',
    created: '03/04/2025'
  }, {
    name: 'Emily Carter',
    email: 'emily.carter@shadcnstudio.com',
    initial: 'J',
    color: 'rgba(235, 235, 235, 1)',
    textColor: 'rgba(23, 23, 23, 1)',
    status: 'Booked',
    city: 'Cork',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Jan – Mar',
    partner: 'ABC Overseas',
    created: '03/04/2025'
  }, {
    name: 'David Lee',
    email: 'david.lee@shadcnstudio.com',
    initial: 'N',
    color: 'rgba(255, 192, 197, 1)',
    textColor: 'rgba(104, 18, 25, 1)',
    status: 'Booked',
    city: 'Cork',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/3a12afc1-7712-4c0b-a0c3-7b2a7143a688.svg',
    intake: 'Jan – Mar',
    partner: 'ABC Overseas',
    created: '03/04/2025'
  }, {
    name: 'Sarah Johnson',
    email: 'sarah.j@shadcnstudio.com',
    initial: 'S',
    color: 'rgba(255, 223, 186, 1)',
    textColor: 'rgba(120, 53, 15, 1)',
    status: 'Contacted',
    city: 'Sydney',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Apr – Jun',
    partner: 'IDP Education',
    created: '04/05/2025'
  }, {
    name: 'Michael Chen',
    email: 'michael.chen@shadcnstudio.com',
    initial: 'M',
    color: 'rgba(186, 255, 201, 1)',
    textColor: 'rgba(20, 83, 45, 1)',
    status: 'Not Booked',
    city: 'Melbourne',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Apr – Jun',
    partner: 'Vindy Consultancy',
    created: '04/06/2025'
  }, {
    name: 'Lisa Anderson',
    email: 'lisa.a@shadcnstudio.com',
    initial: 'L',
    color: 'rgba(255, 186, 240, 1)',
    textColor: 'rgba(120, 15, 80, 1)',
    status: 'Booked',
    city: 'Dublin',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Jul – Sep',
    partner: 'ABC Overseas',
    created: '04/07/2025'
  }, {
    name: 'Robert Taylor',
    email: 'robert.t@shadcnstudio.com',
    initial: 'R',
    color: 'rgba(192, 255, 234, 1)',
    textColor: 'rgba(18, 104, 75, 1)',
    status: 'Contacted',
    city: 'Brisbane',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'IDP Education',
    created: '04/08/2025'
  }, {
    name: 'Jennifer Brown',
    email: 'jennifer.b@shadcnstudio.com',
    initial: 'J',
    color: 'rgba(234, 192, 255, 1)',
    textColor: 'rgba(75, 18, 104, 1)',
    status: 'Booked',
    city: 'Perth',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'Vindy Consultancy',
    created: '04/09/2025'
  }, {
    name: 'James Wilson',
    email: 'james.w@shadcnstudio.com',
    initial: 'J',
    color: 'rgba(255, 234, 192, 1)',
    textColor: 'rgba(104, 75, 18, 1)',
    status: 'Not Booked',
    city: 'Adelaide',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'ABC Overseas',
    created: '04/10/2025'
  }, {
    name: 'Patricia Martinez',
    email: 'patricia.m@shadcnstudio.com',
    initial: 'P',
    color: 'rgba(192, 213, 255, 1)',
    textColor: 'rgba(18, 35, 104, 1)',
    status: 'Contacted',
    city: 'London',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/ecc02272-7491-4bce-ba22-5da993789664.svg',
    intake: 'Jan – Mar',
    partner: 'IDP Education',
    created: '04/11/2025'
  }, {
    name: 'William Davis',
    email: 'william.d@shadcnstudio.com',
    initial: 'W',
    color: 'rgba(255, 192, 197, 1)',
    textColor: 'rgba(104, 18, 25, 1)',
    status: 'Booked',
    city: 'Cork',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'Vindy Consultancy',
    created: '04/12/2025'
  }, {
    name: 'Linda Garcia',
    email: 'linda.g@shadcnstudio.com',
    initial: 'L',
    color: 'rgba(202, 192, 255, 1)',
    textColor: 'rgba(53, 26, 117, 1)',
    status: 'Not Booked',
    city: 'Sydney',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'ABC Overseas',
    created: '04/13/2025'
  }, {
    name: 'Richard Rodriguez',
    email: 'richard.r@shadcnstudio.com',
    initial: 'R',
    color: 'rgba(192, 234, 255, 1)',
    textColor: 'rgba(18, 75, 104, 1)',
    status: 'Contacted',
    city: 'Melbourne',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'IDP Education',
    created: '04/14/2025'
  }, {
    name: 'Susan Miller',
    email: 'susan.m@shadcnstudio.com',
    initial: 'S',
    color: 'rgba(235, 235, 235, 1)',
    textColor: 'rgba(23, 23, 23, 1)',
    status: 'Booked',
    city: 'Brisbane',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jan – Mar',
    partner: 'Vindy Consultancy',
    created: '04/15/2025'
  }, {
    name: 'Joseph Moore',
    email: 'joseph.m@shadcnstudio.com',
    initial: 'J',
    color: 'rgba(255, 223, 186, 1)',
    textColor: 'rgba(120, 53, 15, 1)',
    status: 'Not Booked',
    city: 'Dublin',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'ABC Overseas',
    created: '04/16/2025'
  }, {
    name: 'Jessica Jackson',
    email: 'jessica.j@shadcnstudio.com',
    initial: 'J',
    color: 'rgba(186, 255, 201, 1)',
    textColor: 'rgba(20, 83, 45, 1)',
    status: 'Contacted',
    city: 'Perth',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'IDP Education',
    created: '04/17/2025'
  }, {
    name: 'Thomas White',
    email: 'thomas.w@shadcnstudio.com',
    initial: 'T',
    color: 'rgba(255, 186, 240, 1)',
    textColor: 'rgba(120, 15, 80, 1)',
    status: 'Booked',
    city: 'Adelaide',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'Vindy Consultancy',
    created: '04/18/2025'
  }, {
    name: 'Karen Harris',
    email: 'karen.h@shadcnstudio.com',
    initial: 'K',
    color: 'rgba(192, 255, 234, 1)',
    textColor: 'rgba(18, 104, 75, 1)',
    status: 'Not Booked',
    city: 'London',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/ecc02272-7491-4bce-ba22-5da993789664.svg',
    intake: 'Jan – Mar',
    partner: 'ABC Overseas',
    created: '04/19/2025'
  }, {
    name: 'Christopher Clark',
    email: 'christopher.c@shadcnstudio.com',
    initial: 'C',
    color: 'rgba(234, 192, 255, 1)',
    textColor: 'rgba(75, 18, 104, 1)',
    status: 'Contacted',
    city: 'Cork',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'IDP Education',
    created: '04/20/2025'
  }, {
    name: 'Nancy Lewis',
    email: 'nancy.l@shadcnstudio.com',
    initial: 'N',
    color: 'rgba(255, 234, 192, 1)',
    textColor: 'rgba(104, 75, 18, 1)',
    status: 'Booked',
    city: 'Sydney',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'Vindy Consultancy',
    created: '04/21/2025'
  }, {
    name: 'Daniel Walker',
    email: 'daniel.w@shadcnstudio.com',
    initial: 'D',
    color: 'rgba(192, 213, 255, 1)',
    textColor: 'rgba(18, 35, 104, 1)',
    status: 'Not Booked',
    city: 'Melbourne',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'ABC Overseas',
    created: '04/22/2025'
  }, {
    name: 'Betty Hall',
    email: 'betty.h@shadcnstudio.com',
    initial: 'B',
    color: 'rgba(255, 192, 197, 1)',
    textColor: 'rgba(104, 18, 25, 1)',
    status: 'Contacted',
    city: 'Brisbane',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jan – Mar',
    partner: 'IDP Education',
    created: '04/23/2025'
  }, {
    name: 'Matthew Allen',
    email: 'matthew.a@shadcnstudio.com',
    initial: 'M',
    color: 'rgba(202, 192, 255, 1)',
    textColor: 'rgba(53, 26, 117, 1)',
    status: 'Booked',
    city: 'Dublin',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'Vindy Consultancy',
    created: '04/24/2025'
  }, {
    name: 'Dorothy Young',
    email: 'dorothy.y@shadcnstudio.com',
    initial: 'D',
    color: 'rgba(192, 234, 255, 1)',
    textColor: 'rgba(18, 75, 104, 1)',
    status: 'Not Booked',
    city: 'Perth',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'ABC Overseas',
    created: '04/25/2025'
  }, {
    name: 'Kevin King',
    email: 'kevin.k@shadcnstudio.com',
    initial: 'K',
    color: 'rgba(255, 192, 234, 1)',
    textColor: 'rgba(104, 18, 75, 1)',
    status: 'Contacted',
    city: 'Adelaide',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'IDP Education',
    created: '04/26/2025'
  }, {
    name: 'Michelle Wright',
    email: 'michelle.w@shadcnstudio.com',
    initial: 'M',
    color: 'rgba(192, 255, 213, 1)',
    textColor: 'rgba(18, 104, 45, 1)',
    status: 'Booked',
    city: 'London',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/ecc02272-7491-4bce-ba22-5da993789664.svg',
    intake: 'Jan – Mar',
    partner: 'Vindy Consultancy',
    created: '04/27/2025'
  }, {
    name: 'Ryan Lopez',
    email: 'ryan.l@shadcnstudio.com',
    initial: 'R',
    color: 'rgba(255, 213, 192, 1)',
    textColor: 'rgba(104, 45, 18, 1)',
    status: 'Not Booked',
    city: 'Cork',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'ABC Overseas',
    created: '04/28/2025'
  }, {
    name: 'Amanda Hill',
    email: 'amanda.h@shadcnstudio.com',
    initial: 'A',
    color: 'rgba(213, 192, 255, 1)',
    textColor: 'rgba(45, 18, 104, 1)',
    status: 'Contacted',
    city: 'Sydney',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'IDP Education',
    created: '04/29/2025'
  }, {
    name: 'Brian Scott',
    email: 'brian.s@shadcnstudio.com',
    initial: 'B',
    color: 'rgba(255, 234, 201, 1)',
    textColor: 'rgba(104, 75, 30, 1)',
    status: 'Booked',
    city: 'Melbourne',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'Vindy Consultancy',
    created: '04/30/2025'
  }, {
    name: 'Stephanie Green',
    email: 'stephanie.g@shadcnstudio.com',
    initial: 'S',
    color: 'rgba(201, 255, 234, 1)',
    textColor: 'rgba(30, 104, 75, 1)',
    status: 'Not Booked',
    city: 'Brisbane',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jan – Mar',
    partner: 'ABC Overseas',
    created: '05/01/2025'
  }, {
    name: 'Jason Adams',
    email: 'jason.a@shadcnstudio.com',
    initial: 'J',
    color: 'rgba(234, 201, 255, 1)',
    textColor: 'rgba(75, 30, 104, 1)',
    status: 'Contacted',
    city: 'Dublin',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'IDP Education',
    created: '05/02/2025'
  }, {
    name: 'Rebecca Baker',
    email: 'rebecca.b@shadcnstudio.com',
    initial: 'R',
    color: 'rgba(255, 201, 213, 1)',
    textColor: 'rgba(104, 30, 45, 1)',
    status: 'Booked',
    city: 'Perth',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'Vindy Consultancy',
    created: '05/03/2025'
  }, {
    name: 'Eric Nelson',
    email: 'eric.n@shadcnstudio.com',
    initial: 'E',
    color: 'rgba(201, 234, 255, 1)',
    textColor: 'rgba(30, 75, 104, 1)',
    status: 'Not Booked',
    city: 'Adelaide',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'ABC Overseas',
    created: '05/04/2025'
  }, {
    name: 'Nicole Carter',
    email: 'nicole.c@shadcnstudio.com',
    initial: 'N',
    color: 'rgba(255, 201, 192, 1)',
    textColor: 'rgba(104, 30, 18, 1)',
    status: 'Contacted',
    city: 'London',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/ecc02272-7491-4bce-ba22-5da993789664.svg',
    intake: 'Jan – Mar',
    partner: 'IDP Education',
    created: '05/05/2025'
  }, {
    name: 'Mark Mitchell',
    email: 'mark.m@shadcnstudio.com',
    initial: 'M',
    color: 'rgba(192, 255, 201, 1)',
    textColor: 'rgba(18, 104, 30, 1)',
    status: 'Booked',
    city: 'Cork',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'Vindy Consultancy',
    created: '05/06/2025'
  }, {
    name: 'Samantha Perez',
    email: 'samantha.p@shadcnstudio.com',
    initial: 'S',
    color: 'rgba(255, 234, 192, 1)',
    textColor: 'rgba(104, 75, 18, 1)',
    status: 'Not Booked',
    city: 'Sydney',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'ABC Overseas',
    created: '05/07/2025'
  }, {
    name: 'Andrew Roberts',
    email: 'andrew.r@shadcnstudio.com',
    initial: 'A',
    color: 'rgba(234, 192, 255, 1)',
    textColor: 'rgba(75, 18, 104, 1)',
    status: 'Contacted',
    city: 'Melbourne',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'IDP Education',
    created: '05/08/2025'
  }, {
    name: 'Laura Turner',
    email: 'laura.t@shadcnstudio.com',
    initial: 'L',
    color: 'rgba(255, 192, 234, 1)',
    textColor: 'rgba(104, 18, 75, 1)',
    status: 'Booked',
    city: 'Brisbane',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jan – Mar',
    partner: 'Vindy Consultancy',
    created: '05/09/2025'
  }, {
    name: 'Justin Phillips',
    email: 'justin.p@shadcnstudio.com',
    initial: 'J',
    color: 'rgba(192, 234, 255, 1)',
    textColor: 'rgba(18, 75, 104, 1)',
    status: 'Not Booked',
    city: 'Dublin',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'ABC Overseas',
    created: '05/10/2025'
  }, {
    name: 'Heather Campbell',
    email: 'heather.c@shadcnstudio.com',
    initial: 'H',
    color: 'rgba(255, 213, 192, 1)',
    textColor: 'rgba(104, 45, 18, 1)',
    status: 'Contacted',
    city: 'Perth',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'IDP Education',
    created: '05/11/2025'
  }, {
    name: 'Tyler Parker',
    email: 'tyler.p@shadcnstudio.com',
    initial: 'T',
    color: 'rgba(213, 255, 192, 1)',
    textColor: 'rgba(45, 104, 18, 1)',
    status: 'Booked',
    city: 'Adelaide',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'Vindy Consultancy',
    created: '05/12/2025'
  }, {
    name: 'Melissa Evans',
    email: 'melissa.e@shadcnstudio.com',
    initial: 'M',
    color: 'rgba(255, 192, 201, 1)',
    textColor: 'rgba(104, 18, 30, 1)',
    status: 'Not Booked',
    city: 'London',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/ecc02272-7491-4bce-ba22-5da993789664.svg',
    intake: 'Jan – Mar',
    partner: 'ABC Overseas',
    created: '05/13/2025'
  }, {
    name: 'Brandon Edwards',
    email: 'brandon.e@shadcnstudio.com',
    initial: 'B',
    color: 'rgba(234, 255, 192, 1)',
    textColor: 'rgba(75, 104, 18, 1)',
    status: 'Contacted',
    city: 'Cork',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'IDP Education',
    created: '05/14/2025'
  }, {
    name: 'Rachel Collins',
    email: 'rachel.c@shadcnstudio.com',
    initial: 'R',
    color: 'rgba(192, 255, 234, 1)',
    textColor: 'rgba(18, 104, 75, 1)',
    status: 'Booked',
    city: 'Sydney',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'Vindy Consultancy',
    created: '05/15/2025'
  }, {
    name: 'Jonathan Stewart',
    email: 'jonathan.s@shadcnstudio.com',
    initial: 'J',
    color: 'rgba(255, 234, 213, 1)',
    textColor: 'rgba(104, 75, 45, 1)',
    status: 'Not Booked',
    city: 'Melbourne',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'ABC Overseas',
    created: '05/16/2025'
  }, {
    name: 'Kimberly Sanchez',
    email: 'kimberly.s@shadcnstudio.com',
    initial: 'K',
    color: 'rgba(213, 192, 255, 1)',
    textColor: 'rgba(45, 18, 104, 1)',
    status: 'Contacted',
    city: 'Brisbane',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jan – Mar',
    partner: 'IDP Education',
    created: '05/17/2025'
  }, {
    name: 'Derek Morris',
    email: 'derek.m@shadcnstudio.com',
    initial: 'D',
    color: 'rgba(255, 201, 234, 1)',
    textColor: 'rgba(104, 30, 75, 1)',
    status: 'Booked',
    city: 'Dublin',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'Vindy Consultancy',
    created: '05/18/2025'
  }, {
    name: 'Angela Rogers',
    email: 'angela.r@shadcnstudio.com',
    initial: 'A',
    color: 'rgba(201, 255, 192, 1)',
    textColor: 'rgba(30, 104, 18, 1)',
    status: 'Not Booked',
    city: 'Perth',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'ABC Overseas',
    created: '05/19/2025'
  }, {
    name: 'Sean Reed',
    email: 'sean.r@shadcnstudio.com',
    initial: 'S',
    color: 'rgba(234, 201, 255, 1)',
    textColor: 'rgba(75, 30, 104, 1)',
    status: 'Contacted',
    city: 'Adelaide',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'IDP Education',
    created: '05/20/2025'
  }, {
    name: 'Christina Cook',
    email: 'christina.c@shadcnstudio.com',
    initial: 'C',
    color: 'rgba(255, 192, 213, 1)',
    textColor: 'rgba(104, 18, 45, 1)',
    status: 'Booked',
    city: 'London',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/ecc02272-7491-4bce-ba22-5da993789664.svg',
    intake: 'Jan – Mar',
    partner: 'Vindy Consultancy',
    created: '05/21/2025'
  }, {
    name: 'Nathan Morgan',
    email: 'nathan.m@shadcnstudio.com',
    initial: 'N',
    color: 'rgba(192, 234, 213, 1)',
    textColor: 'rgba(18, 75, 45, 1)',
    status: 'Not Booked',
    city: 'Cork',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'ABC Overseas',
    created: '05/22/2025'
  }, {
    name: 'Michelle Bell',
    email: 'michelle.b@shadcnstudio.com',
    initial: 'M',
    color: 'rgba(255, 213, 234, 1)',
    textColor: 'rgba(104, 45, 75, 1)',
    status: 'Contacted',
    city: 'Sydney',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'IDP Education',
    created: '05/23/2025'
  }, {
    name: 'Adam Murphy',
    email: 'adam.m@shadcnstudio.com',
    initial: 'A',
    color: 'rgba(213, 255, 234, 1)',
    textColor: 'rgba(45, 104, 75, 1)',
    status: 'Booked',
    city: 'Melbourne',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'Vindy Consultancy',
    created: '05/24/2025'
  }, {
    name: 'Brittany Bailey',
    email: 'brittany.b@shadcnstudio.com',
    initial: 'B',
    color: 'rgba(255, 234, 201, 1)',
    textColor: 'rgba(104, 75, 30, 1)',
    status: 'Not Booked',
    city: 'Brisbane',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jan – Mar',
    partner: 'ABC Overseas',
    created: '05/25/2025'
  }, {
    name: 'Gregory Foster',
    email: 'gregory.f@shadcnstudio.com',
    initial: 'G',
    color: 'rgba(192, 219, 255, 1)',
    textColor: 'rgba(18, 55, 104, 1)',
    status: 'Contacted',
    city: 'Dublin',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'IDP Education',
    created: '05/26/2025'
  }, {
    name: 'Victoria Hughes',
    email: 'victoria.h@shadcnstudio.com',
    initial: 'V',
    color: 'rgba(218, 192, 255, 1)',
    textColor: 'rgba(62, 26, 117, 1)',
    status: 'Booked',
    city: 'Perth',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'Vindy Consultancy',
    created: '05/27/2025'
  }, {
    name: 'Harold Price',
    email: 'harold.p@shadcnstudio.com',
    initial: 'H',
    color: 'rgba(192, 213, 255, 1)',
    textColor: 'rgba(18, 35, 104, 1)',
    status: 'Not Booked',
    city: 'Adelaide',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'ABC Overseas',
    created: '05/28/2025'
  }, {
    name: 'Olivia Bennett',
    email: 'olivia.b@shadcnstudio.com',
    initial: 'O',
    color: 'rgba(235, 235, 235, 1)',
    textColor: 'rgba(23, 23, 23, 1)',
    status: 'Contacted',
    city: 'London',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/ecc02272-7491-4bce-ba22-5da993789664.svg',
    intake: 'Jan – Mar',
    partner: 'IDP Education',
    created: '05/29/2025'
  }, {
    name: 'Frank Coleman',
    email: 'frank.c@shadcnstudio.com',
    initial: 'F',
    color: 'rgba(255, 192, 197, 1)',
    textColor: 'rgba(104, 18, 25, 1)',
    status: 'Booked',
    city: 'Cork',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'Vindy Consultancy',
    created: '05/30/2025'
  }, {
    name: 'Sophia Jenkins',
    email: 'sophia.j@shadcnstudio.com',
    initial: 'S',
    color: 'rgba(255, 223, 186, 1)',
    textColor: 'rgba(120, 53, 15, 1)',
    status: 'Not Booked',
    city: 'Sydney',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'ABC Overseas',
    created: '05/31/2025'
  }, {
    name: 'Walter Perry',
    email: 'walter.p@shadcnstudio.com',
    initial: 'W',
    color: 'rgba(186, 255, 201, 1)',
    textColor: 'rgba(20, 83, 45, 1)',
    status: 'Contacted',
    city: 'Melbourne',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'IDP Education',
    created: '06/01/2025'
  }, {
    name: 'Isabella Powell',
    email: 'isabella.p@shadcnstudio.com',
    initial: 'I',
    color: 'rgba(255, 186, 240, 1)',
    textColor: 'rgba(120, 15, 80, 1)',
    status: 'Booked',
    city: 'Brisbane',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jan – Mar',
    partner: 'Vindy Consultancy',
    created: '06/02/2025'
  }, {
    name: 'Henry Long',
    email: 'henry.l@shadcnstudio.com',
    initial: 'H',
    color: 'rgba(192, 255, 234, 1)',
    textColor: 'rgba(18, 104, 75, 1)',
    status: 'Not Booked',
    city: 'Dublin',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'ABC Overseas',
    created: '06/03/2025'
  }, {
    name: 'Charlotte Patterson',
    email: 'charlotte.p@shadcnstudio.com',
    initial: 'C',
    color: 'rgba(234, 192, 255, 1)',
    textColor: 'rgba(75, 18, 104, 1)',
    status: 'Contacted',
    city: 'Perth',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'IDP Education',
    created: '06/04/2025'
  }, {
    name: 'Albert Hughes',
    email: 'albert.h@shadcnstudio.com',
    initial: 'A',
    color: 'rgba(255, 234, 192, 1)',
    textColor: 'rgba(104, 75, 18, 1)',
    status: 'Booked',
    city: 'Adelaide',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Oct – Dec',
    partner: 'Vindy Consultancy',
    created: '06/05/2025'
  }, {
    name: 'Amelia Flores',
    email: 'amelia.f@shadcnstudio.com',
    initial: 'A',
    color: 'rgba(192, 213, 255, 1)',
    textColor: 'rgba(18, 35, 104, 1)',
    status: 'Not Booked',
    city: 'London',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/ecc02272-7491-4bce-ba22-5da993789664.svg',
    intake: 'Jan – Mar',
    partner: 'ABC Overseas',
    created: '06/06/2025'
  }, {
    name: 'Roy Washington',
    email: 'roy.w@shadcnstudio.com',
    initial: 'R',
    color: 'rgba(255, 192, 197, 1)',
    textColor: 'rgba(104, 18, 25, 1)',
    status: 'Contacted',
    city: 'Cork',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/512916cb-9479-4866-80be-157231ec900f.svg',
    intake: 'Apr – Jun',
    partner: 'IDP Education',
    created: '06/07/2025'
  }, {
    name: 'Mia Butler',
    email: 'mia.b@shadcnstudio.com',
    initial: 'M',
    color: 'rgba(202, 192, 255, 1)',
    textColor: 'rgba(53, 26, 117, 1)',
    status: 'Booked',
    city: 'Sydney',
    countryIcon: 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/aac1bf7b-3bcc-41e0-9673-f2f5833a76fa.svg',
    intake: 'Jul – Sep',
    partner: 'Vindy Consultancy',
    created: '06/08/2025'
  }] as any[];
  
  // Listings data
  const listingsData = [
    { propertyName: 'Connectld1', providerName: 'A & o Hostels', type: 'Student Accommodation' },
    { propertyName: '360 King Street, Melbourne', providerName: 'Asset Living', type: 'Student Accommodation' },
    { propertyName: 'HMO Slash Pricing', providerName: 'True Student', type: 'Independent House' },
    { propertyName: 'Mapbox_Bamio', providerName: 'City Block', type: 'Student Accommodation' },
    { propertyName: 'Riverside Apartments, Leeds', providerName: 'Park Place', type: 'Independent House' },
    { propertyName: 'Victoria Point Studios', providerName: 'Neighborhood Living', type: 'Independent House' },
    { propertyName: 'Inventory Check Complete', providerName: 'Community Stays', type: 'Independent House' },
    { propertyName: 'Sydney CBD Accommodation', providerName: 'Shopping District Co.', type: 'Student Accommodation' },
    { propertyName: 'Canary Wharf Residency', providerName: 'Community Stays', type: 'Private Housing' },
    { propertyName: "King's Cross Studios", providerName: 'City Park Residences', type: 'University Dormitories' },
    { propertyName: 'Operation Campus Living', providerName: 'Cultural Hub', type: 'Shared Flats' },
    { propertyName: 'Mayfair Student Living', providerName: 'True Student', type: 'Student Accommodation' },
    { propertyName: '15 Oxford Street Residences', providerName: 'Asset Living', type: 'Independent House' },
    { propertyName: 'Central Park Residences', providerName: 'A & o Hostels', type: 'Student Accommodation' },
    { propertyName: 'Brunswick House', providerName: 'City Block', type: 'Shared Flats' },
    { propertyName: 'Victoria Gardens', providerName: 'Park Place', type: 'Private Housing' },
    { propertyName: 'East End Flats', providerName: 'Community Stays', type: 'Independent House' },
    { propertyName: 'Manchester Metropolitan Hub', providerName: 'Neighborhood Living', type: 'University Dormitories' },
    { propertyName: 'Nottingham Student Hub', providerName: 'Shopping District Co.', type: 'Student Accommodation' },
    { propertyName: 'Sheffield Central Living', providerName: 'City Park Residences', type: 'Independent House' },
  ] as any[];

  // Campaigns/Events data
  const campaignsData = [
    {
      name: 'nikhil test',
      email: 'nikhil.panse98@gmail.com',
      status: 'Active',
      role: 'Event',
      initial: 'N',
      color: 'rgba(202, 192, 255, 1)',
      textColor: 'rgba(53, 26, 117, 1)'
    },
    {
      name: 'Summer Campaign 2025',
      email: 'campaign@amberstudent.com',
      status: 'Active',
      role: 'Campaign',
      initial: 'S',
      color: 'rgba(192, 234, 255, 1)',
      textColor: 'rgba(18, 75, 104, 1)'
    },
    {
      name: 'University Fair London',
      email: 'fair@amberstudent.com',
      status: 'Active',
      role: 'Event',
      initial: 'U',
      color: 'rgba(192, 213, 255, 1)',
      textColor: 'rgba(18, 35, 104, 1)'
    },
    {
      name: 'Winter Intake Drive',
      email: 'winter@amberstudent.com',
      status: 'Inactive',
      role: 'Campaign',
      initial: 'W',
      color: 'rgba(235, 235, 235, 1)',
      textColor: 'rgba(23, 23, 23, 1)'
    },
    {
      name: 'Study Abroad Expo',
      email: 'expo@amberstudent.com',
      status: 'Active',
      role: 'Event',
      initial: 'S',
      color: 'rgba(255, 213, 234, 1)',
      textColor: 'rgba(104, 45, 75, 1)'
    },
    {
      name: 'Scholarship Program',
      email: 'scholarship@amberstudent.com',
      status: 'Active',
      role: 'Campaign',
      initial: 'S',
      color: 'rgba(213, 255, 234, 1)',
      textColor: 'rgba(45, 104, 75, 1)'
    },
    {
      name: 'Virtual Open House',
      email: 'virtual@amberstudent.com',
      status: 'Active',
      role: 'Event',
      initial: 'V',
      color: 'rgba(255, 234, 201, 1)',
      textColor: 'rgba(104, 75, 30, 1)'
    },
    {
      name: 'Spring Enrollment',
      email: 'spring@amberstudent.com',
      status: 'Inactive',
      role: 'Campaign',
      initial: 'S',
      color: 'rgba(234, 213, 255, 1)',
      textColor: 'rgba(75, 45, 104, 1)'
    },
    {
      name: 'Career Guidance Workshop',
      email: 'workshop@amberstudent.com',
      status: 'Active',
      role: 'Event',
      initial: 'C',
      color: 'rgba(213, 234, 255, 1)',
      textColor: 'rgba(45, 75, 104, 1)'
    },
    {
      name: 'Partner Meetup',
      email: 'partner@amberstudent.com',
      status: 'Active',
      role: 'Event',
      initial: 'P',
      color: 'rgba(255, 213, 213, 1)',
      textColor: 'rgba(104, 45, 45, 1)'
    },
    {
      name: 'Graduate Program Launch',
      email: 'graduate@amberstudent.com',
      status: 'Active',
      role: 'Campaign',
      initial: 'G',
      color: 'rgba(234, 255, 213, 1)',
      textColor: 'rgba(75, 104, 45, 1)'
    },
    {
      name: 'Alumni Networking',
      email: 'alumni@amberstudent.com',
      status: 'Inactive',
      role: 'Event',
      initial: 'A',
      color: 'rgba(255, 234, 213, 1)',
      textColor: 'rgba(104, 75, 45, 1)'
    },
    {
      name: 'International Student Day',
      email: 'isd@amberstudent.com',
      status: 'Active',
      role: 'Event',
      initial: 'I',
      color: 'rgba(213, 255, 255, 1)',
      textColor: 'rgba(45, 104, 104, 1)'
    },
    {
      name: 'Early Bird Discount',
      email: 'earlybird@amberstudent.com',
      status: 'Active',
      role: 'Campaign',
      initial: 'E',
      color: 'rgba(255, 255, 213, 1)',
      textColor: 'rgba(104, 104, 45, 1)'
    },
    {
      name: 'Campus Tour Series',
      email: 'tour@amberstudent.com',
      status: 'Active',
      role: 'Event',
      initial: 'C',
      color: 'rgba(234, 234, 255, 1)',
      textColor: 'rgba(75, 75, 104, 1)'
    },
    {
      name: 'Application Deadline Reminder',
      email: 'deadline@amberstudent.com',
      status: 'Active',
      role: 'Campaign',
      initial: 'A',
      color: 'rgba(255, 213, 255, 1)',
      textColor: 'rgba(104, 45, 104, 1)'
    },
    {
      name: 'Student Success Stories',
      email: 'stories@amberstudent.com',
      status: 'Active',
      role: 'Campaign',
      initial: 'S',
      color: 'rgba(213, 255, 213, 1)',
      textColor: 'rgba(45, 104, 45, 1)'
    },
    {
      name: 'Visa Assistance Workshop',
      email: 'visa@amberstudent.com',
      status: 'Active',
      role: 'Event',
      initial: 'V',
      color: 'rgba(255, 234, 234, 1)',
      textColor: 'rgba(104, 75, 75, 1)'
    },
    {
      name: 'Housing Fair',
      email: 'housing@amberstudent.com',
      status: 'Inactive',
      role: 'Event',
      initial: 'H',
      color: 'rgba(234, 255, 234, 1)',
      textColor: 'rgba(75, 104, 75, 1)'
    },
    {
      name: 'Referral Bonus Campaign',
      email: 'referral@amberstudent.com',
      status: 'Active',
      role: 'Campaign',
      initial: 'R',
      color: 'rgba(255, 255, 234, 1)',
      textColor: 'rgba(104, 104, 75, 1)'
    },
    {
      name: 'Test Prep Seminar',
      email: 'testprep@amberstudent.com',
      status: 'Active',
      role: 'Event',
      initial: 'T',
      color: 'rgba(234, 234, 234, 1)',
      textColor: 'rgba(75, 75, 75, 1)'
    }
  ] as any[];
  
  // Commissions data
  const commissionsData = [
    {
      poNumber: '378',
      bookingType: 'Advance',
      date: '04 Nov 25',
      status: 'Partially_paid',
      amount: 'USD 50.0',
      amountDue: 'USD 12.5'
    },
    {
      poNumber: '377',
      bookingType: 'Booking',
      date: '04 Nov 25',
      status: 'Partially_paid',
      amount: 'USD 94.0',
      amountDue: 'USD 4.0'
    },
    {
      poNumber: '376',
      bookingType: 'Advance',
      date: '03 Nov 25',
      status: 'Paid',
      amount: 'USD 75.0',
      amountDue: 'USD 0.0'
    },
    {
      poNumber: '375',
      bookingType: 'Booking',
      date: '02 Nov 25',
      status: 'Partially_paid',
      amount: 'USD 120.0',
      amountDue: 'USD 30.0'
    },
    {
      poNumber: '374',
      bookingType: 'Advance',
      date: '01 Nov 25',
      status: 'Unpaid',
      amount: 'USD 45.0',
      amountDue: 'USD 45.0'
    },
    {
      poNumber: '373',
      bookingType: 'Booking',
      date: '31 Oct 25',
      status: 'Paid',
      amount: 'USD 88.0',
      amountDue: 'USD 0.0'
    },
    {
      poNumber: '372',
      bookingType: 'Advance',
      date: '30 Oct 25',
      status: 'Partially_paid',
      amount: 'USD 60.0',
      amountDue: 'USD 15.0'
    },
    {
      poNumber: '371',
      bookingType: 'Booking',
      date: '29 Oct 25',
      status: 'Unpaid',
      amount: 'USD 110.0',
      amountDue: 'USD 110.0'
    },
    {
      poNumber: '370',
      bookingType: 'Advance',
      date: '28 Oct 25',
      status: 'Paid',
      amount: 'USD 55.0',
      amountDue: 'USD 0.0'
    },
    {
      poNumber: '369',
      bookingType: 'Booking',
      date: '27 Oct 25',
      status: 'Partially_paid',
      amount: 'USD 95.0',
      amountDue: 'USD 20.0'
    },
    {
      poNumber: '368',
      bookingType: 'Advance',
      date: '26 Oct 25',
      status: 'Unpaid',
      amount: 'USD 40.0',
      amountDue: 'USD 40.0'
    },
    {
      poNumber: '367',
      bookingType: 'Booking',
      date: '25 Oct 25',
      status: 'Paid',
      amount: 'USD 130.0',
      amountDue: 'USD 0.0'
    },
    {
      poNumber: '366',
      bookingType: 'Advance',
      date: '24 Oct 25',
      status: 'Partially_paid',
      amount: 'USD 70.0',
      amountDue: 'USD 10.0'
    },
    {
      poNumber: '365',
      bookingType: 'Booking',
      date: '23 Oct 25',
      status: 'Unpaid',
      amount: 'USD 100.0',
      amountDue: 'USD 100.0'
    },
    {
      poNumber: '364',
      bookingType: 'Advance',
      date: '22 Oct 25',
      status: 'Paid',
      amount: 'USD 65.0',
      amountDue: 'USD 0.0'
    },
    {
      poNumber: '363',
      bookingType: 'Booking',
      date: '21 Oct 25',
      status: 'Partially_paid',
      amount: 'USD 85.0',
      amountDue: 'USD 25.0'
    },
    {
      poNumber: '362',
      bookingType: 'Advance',
      date: '20 Oct 25',
      status: 'Unpaid',
      amount: 'USD 50.0',
      amountDue: 'USD 50.0'
    },
    {
      poNumber: '361',
      bookingType: 'Booking',
      date: '19 Oct 25',
      status: 'Paid',
      amount: 'USD 105.0',
      amountDue: 'USD 0.0'
    },
    {
      poNumber: '360',
      bookingType: 'Advance',
      date: '18 Oct 25',
      status: 'Partially_paid',
      amount: 'USD 80.0',
      amountDue: 'USD 18.0'
    },
    {
      poNumber: '359',
      bookingType: 'Booking',
      date: '17 Oct 25',
      status: 'Unpaid',
      amount: 'USD 90.0',
      amountDue: 'USD 90.0'
    }
  ] as any[];
  
  // Sub-Partners data (same structure as commissions)
  const subPartnersData = [
    {
      poNumber: '378',
      bookingType: 'Advance',
      date: '04 Nov 25',
      status: 'Partially_paid',
      amount: 'USD 50.0',
      amountDue: 'USD 12.5'
    },
    {
      poNumber: '377',
      bookingType: 'Booking',
      date: '04 Nov 25',
      status: 'Partially_paid',
      amount: 'USD 94.0',
      amountDue: 'USD 4.0'
    },
    {
      poNumber: '376',
      bookingType: 'Advance',
      date: '03 Nov 25',
      status: 'Paid',
      amount: 'USD 75.0',
      amountDue: 'USD 0.0'
    },
    {
      poNumber: '375',
      bookingType: 'Booking',
      date: '02 Nov 25',
      status: 'Partially_paid',
      amount: 'USD 120.0',
      amountDue: 'USD 30.0'
    },
    {
      poNumber: '374',
      bookingType: 'Advance',
      date: '01 Nov 25',
      status: 'Unpaid',
      amount: 'USD 45.0',
      amountDue: 'USD 45.0'
    },
    {
      poNumber: '373',
      bookingType: 'Booking',
      date: '31 Oct 25',
      status: 'Paid',
      amount: 'USD 88.0',
      amountDue: 'USD 0.0'
    },
    {
      poNumber: '372',
      bookingType: 'Advance',
      date: '30 Oct 25',
      status: 'Partially_paid',
      amount: 'USD 60.0',
      amountDue: 'USD 15.0'
    },
    {
      poNumber: '371',
      bookingType: 'Booking',
      date: '29 Oct 25',
      status: 'Unpaid',
      amount: 'USD 110.0',
      amountDue: 'USD 110.0'
    },
    {
      poNumber: '370',
      bookingType: 'Advance',
      date: '28 Oct 25',
      status: 'Paid',
      amount: 'USD 55.0',
      amountDue: 'USD 0.0'
    },
    {
      poNumber: '369',
      bookingType: 'Booking',
      date: '27 Oct 25',
      status: 'Partially_paid',
      amount: 'USD 95.0',
      amountDue: 'USD 20.0'
    },
    {
      poNumber: '368',
      bookingType: 'Advance',
      date: '26 Oct 25',
      status: 'Unpaid',
      amount: 'USD 40.0',
      amountDue: 'USD 40.0'
    },
    {
      poNumber: '367',
      bookingType: 'Booking',
      date: '25 Oct 25',
      status: 'Paid',
      amount: 'USD 130.0',
      amountDue: 'USD 0.0'
    },
    {
      poNumber: '366',
      bookingType: 'Advance',
      date: '24 Oct 25',
      status: 'Partially_paid',
      amount: 'USD 70.0',
      amountDue: 'USD 10.0'
    },
    {
      poNumber: '365',
      bookingType: 'Booking',
      date: '23 Oct 25',
      status: 'Unpaid',
      amount: 'USD 100.0',
      amountDue: 'USD 100.0'
    },
    {
      poNumber: '364',
      bookingType: 'Advance',
      date: '22 Oct 25',
      status: 'Paid',
      amount: 'USD 65.0',
      amountDue: 'USD 0.0'
    },
    {
      poNumber: '363',
      bookingType: 'Booking',
      date: '21 Oct 25',
      status: 'Partially_paid',
      amount: 'USD 85.0',
      amountDue: 'USD 25.0'
    },
    {
      poNumber: '362',
      bookingType: 'Advance',
      date: '20 Oct 25',
      status: 'Unpaid',
      amount: 'USD 50.0',
      amountDue: 'USD 50.0'
    },
    {
      poNumber: '361',
      bookingType: 'Booking',
      date: '19 Oct 25',
      status: 'Paid',
      amount: 'USD 105.0',
      amountDue: 'USD 0.0'
    },
    {
      poNumber: '360',
      bookingType: 'Advance',
      date: '18 Oct 25',
      status: 'Partially_paid',
      amount: 'USD 80.0',
      amountDue: 'USD 18.0'
    },
    {
      poNumber: '359',
      bookingType: 'Booking',
      date: '17 Oct 25',
      status: 'Unpaid',
      amount: 'USD 90.0',
      amountDue: 'USD 90.0'
    }
  ] as any[];
  
  // Filter commissions data
  const filteredCommissionsData = commissionsData.filter(commission => {
    if (statusFilter && commission.status !== statusFilter) return false;
    if (bookingTypeFilter && commission.bookingType !== bookingTypeFilter) return false;
    return true;
  });
  
  // Filter Sub-Partners data
  const filteredSubPartnersData = subPartnersData.filter(item => {
    if (subPartnersStatusFilter && item.status !== subPartnersStatusFilter) return false;
    if (subPartnersBookingTypeFilter && item.bookingType !== subPartnersBookingTypeFilter) return false;
    return true;
  });
  
  // Filter leads data based on search query
  const filteredLeadsData = leadsData.filter((lead: any) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.city.toLowerCase().includes(query) ||
        lead.partner.toLowerCase().includes(query) ||
        lead.status.toLowerCase().includes(query)
      );
    }
    return true;
  });
  
  // Pagination logic
  const totalItems = filteredLeadsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeadsData = filteredLeadsData.slice(startIndex, endIndex);
  const startItem = startIndex + 1;
  const endItem = Math.min(endIndex, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 4;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 1) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 1; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    return pages;
  };
  
  // Commissions pagination logic
  const commissionsTotalItems = filteredCommissionsData.length;
  const commissionsTotalPages = Math.ceil(commissionsTotalItems / itemsPerPage);
  const commissionsStartIndex = (commissionsPage - 1) * itemsPerPage;
  const commissionsEndIndex = commissionsStartIndex + itemsPerPage;
  const currentCommissionsData = filteredCommissionsData.slice(commissionsStartIndex, commissionsEndIndex);
  const commissionsStartItem = commissionsStartIndex + 1;
  const commissionsEndItem = Math.min(commissionsEndIndex, commissionsTotalItems);

  const handleCommissionsPrevious = () => {
    if (commissionsPage > 1) {
      setCommissionsPage(commissionsPage - 1);
    }
  };

  const handleCommissionsNext = () => {
    if (commissionsPage < commissionsTotalPages) {
      setCommissionsPage(commissionsPage + 1);
    }
  };

  const handleCommissionsPageClick = (page: number) => {
    if (page !== -1) {
      setCommissionsPage(page);
    }
  };

  const getCommissionsPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 4;
    
    if (commissionsTotalPages <= maxVisible) {
      for (let i = 1; i <= commissionsTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (commissionsPage <= 2) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(commissionsTotalPages);
      } else if (commissionsPage >= commissionsTotalPages - 1) {
        pages.push(1);
        pages.push(-1);
        for (let i = commissionsTotalPages - 2; i <= commissionsTotalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        pages.push(commissionsPage - 1);
        pages.push(commissionsPage);
        pages.push(commissionsPage + 1);
        pages.push(-1);
        pages.push(commissionsTotalPages);
      }
    }
    return pages;
  };
  
  // Sub-Partners pagination logic
  const subPartnersTotalItems = filteredSubPartnersData.length;
  const subPartnersTotalPages = Math.ceil(subPartnersTotalItems / itemsPerPage);
  const subPartnersStartIndex = (subPartnersPage - 1) * itemsPerPage;
  const subPartnersEndIndex = subPartnersStartIndex + itemsPerPage;
  const currentSubPartnersData = filteredSubPartnersData.slice(subPartnersStartIndex, subPartnersEndIndex);
  const subPartnersStartItem = subPartnersStartIndex + 1;
  const subPartnersEndItem = Math.min(subPartnersEndIndex, subPartnersTotalItems);

  const handleSubPartnersPrevious = () => {
    if (subPartnersPage > 1) {
      setSubPartnersPage(subPartnersPage - 1);
    }
  };

  const handleSubPartnersNext = () => {
    if (subPartnersPage < subPartnersTotalPages) {
      setSubPartnersPage(subPartnersPage + 1);
    }
  };

  const handleSubPartnersPageClick = (page: number) => {
    if (page !== -1) {
      setSubPartnersPage(page);
    }
  };

  const getSubPartnersPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 4;
    
    if (subPartnersTotalPages <= maxVisible) {
      for (let i = 1; i <= subPartnersTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (subPartnersPage <= 2) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(subPartnersTotalPages);
      } else if (subPartnersPage >= subPartnersTotalPages - 1) {
        pages.push(1);
        pages.push(-1);
        for (let i = subPartnersTotalPages - 2; i <= subPartnersTotalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        pages.push(subPartnersPage - 1);
        pages.push(subPartnersPage);
        pages.push(subPartnersPage + 1);
        pages.push(-1);
        pages.push(subPartnersTotalPages);
      }
    }
    return pages;
  };
  
  // Campaigns pagination logic
  const campaignsTotalItems = campaignsData.length;
  const campaignsTotalPages = Math.ceil(campaignsTotalItems / itemsPerPage);
  const campaignsStartIndex = (campaignsPage - 1) * itemsPerPage;
  const campaignsEndIndex = campaignsStartIndex + itemsPerPage;
  const currentCampaignsData = campaignsData.slice(campaignsStartIndex, campaignsEndIndex);
  const campaignsStartItem = campaignsStartIndex + 1;
  const campaignsEndItem = Math.min(campaignsEndIndex, campaignsTotalItems);

  const handleCampaignsPrevious = () => {
    if (campaignsPage > 1) {
      setCampaignsPage(campaignsPage - 1);
    }
  };

  const handleCampaignsNext = () => {
    if (campaignsPage < campaignsTotalPages) {
      setCampaignsPage(campaignsPage + 1);
    }
  };

  const handleCampaignsPageClick = (page: number) => {
    if (page !== -1) {
      setCampaignsPage(page);
    }
  };

  const getCampaignsPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 4;
    
    if (campaignsTotalPages <= maxVisible) {
      for (let i = 1; i <= campaignsTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (campaignsPage <= 2) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(campaignsTotalPages);
      } else if (campaignsPage >= campaignsTotalPages - 1) {
        pages.push(1);
        pages.push(-1);
        for (let i = campaignsTotalPages - 2; i <= campaignsTotalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        pages.push(campaignsPage - 1);
        pages.push(campaignsPage);
        pages.push(campaignsPage + 1);
        pages.push(-1);
        pages.push(campaignsTotalPages);
      }
    }
    return pages;
  };

  // Filter Listings data
  const filteredListingsData = listingsData.filter((item: any) => {
    if (listingsSearchQuery && !item.propertyName.toLowerCase().includes(listingsSearchQuery.toLowerCase())) return false;
    if (listingsProviderFilter && item.providerName !== listingsProviderFilter) return false;
    return true;
  });

  // Listings pagination logic
  const listingsTotalItems = filteredListingsData.length;
  const listingsTotalPages = Math.ceil(listingsTotalItems / itemsPerPage);
  const listingsStartIndex = (listingsPage - 1) * itemsPerPage;
  const listingsEndIndex = listingsStartIndex + itemsPerPage;
  const currentListingsData = filteredListingsData.slice(listingsStartIndex, listingsEndIndex);
  const listingsStartItem = listingsStartIndex + 1;
  const listingsEndItem = Math.min(listingsEndIndex, listingsTotalItems);

  const handleListingsPrevious = () => {
    if (listingsPage > 1) setListingsPage(listingsPage - 1);
  };
  const handleListingsNext = () => {
    if (listingsPage < listingsTotalPages) setListingsPage(listingsPage + 1);
  };
  const handleListingsPageClick = (page: number) => {
    if (page !== -1) setListingsPage(page);
  };
  const getListingsPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 4;
    if (listingsTotalPages <= maxVisible) {
      for (let i = 1; i <= listingsTotalPages; i++) pages.push(i);
    } else {
      if (listingsPage <= 2) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push(-1);
        pages.push(listingsTotalPages);
      } else if (listingsPage >= listingsTotalPages - 1) {
        pages.push(1);
        pages.push(-1);
        for (let i = listingsTotalPages - 2; i <= listingsTotalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        pages.push(listingsPage - 1);
        pages.push(listingsPage);
        pages.push(listingsPage + 1);
        pages.push(-1);
        pages.push(listingsTotalPages);
      }
    }
    return pages;
  };
  const listingsProviders = Array.from(new Set(listingsData.map((d: any) => d.providerName)));

  const getStatusBadge = (status: string) => {
    let bgColor = 'rgba(227, 146, 25, 0.1)';
    let textColor = 'rgba(217, 119, 6, 1)';
    if (status === 'Booked' || status === 'Paid' || status === 'Active') {
      bgColor = 'rgba(22, 163, 74, 0.1)';
      textColor = 'rgba(22, 163, 74, 1)';
    } else if (status === 'Not Booked' || status === 'Unpaid' || status === 'Inactive') {
      bgColor = 'rgba(224, 52, 52, 0.1)';
      textColor = 'rgba(220, 38, 38, 1)';
    } else if (status === 'Partially_paid') {
      bgColor = 'rgba(227, 146, 25, 0.1)';
      textColor = 'rgba(217, 119, 6, 1)';
    }
    return <div style={{
      display: 'inline-flex',
      padding: '2px 6px',
      backgroundColor: bgColor,
      borderRadius: '6px',
      alignItems: 'center'
    }}>
        <span style={{
        color: textColor,
        fontSize: '12px',
        fontFamily: '"Geist Mono", sans-serif',
        fontWeight: 500,
        textTransform: 'uppercase'
      }}>{status}</span>
      </div>;
  };
  return <div style={{
    display: 'flex',
    width: '100%',
    height: '100vh',
    backgroundColor: colors.bg,
    overflow: 'hidden',
    position: 'relative'
  }}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 68 : 256 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
        height: '100%',
        backgroundColor: colors.sidebarBg,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden'
      }}>
        <header style={{
        height: '56px',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        borderBottom: `1px solid ${colors.border}`,
        flexShrink: 0
      }}>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={isDarkMode ? "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/a37d54b8-199b-45da-a0df-bb52b93313f4.svg" : "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/0ae077f3-aa72-4d4b-8e69-1f00db96b9a1.svg"}
                alt="Logo"
                style={{ width: '110px' }}
              />
            )}
          </AnimatePresence>
          <button style={{
          background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          padding: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }} onClick={() => setIsCollapsed(!isCollapsed)}>
            <motion.svg
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={isDarkMode ? 'rgba(250, 250, 250, 1)' : 'rgba(10, 10, 10, 1)'}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </motion.svg>
          </button>
        </header>

        <div style={{
        flex: 1,
        padding: '16px 8px',
        overflowY: 'auto'
      }}>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          position: 'relative'
        }}>
            {navItems.map(item => <motion.button
              key={item.name}
              onClick={() => {
                playClickSound();
                setActiveNavigation(item.name);
              }}
              whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 2 }}
              whileTap={{ scale: 0.98 }}
              title={isCollapsed ? item.name : undefined}
              style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '8px',
            padding: isCollapsed ? '8px' : '8px 12px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                borderWidth: '0px',
            borderStyle: 'solid',
            borderColor: colors.border,
            width: '100%',
            textAlign: 'left'
              }}
              animate={{
                backgroundColor: activeNavigation === item.name ? isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white' : 'transparent',
                boxShadow: activeNavigation === item.name ? '0px 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                borderWidth: activeNavigation === item.name ? '1px' : '0px'
              }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
                <motion.img
                  src={item.icon}
                  style={{
                    width: '16px',
                    flexShrink: 0
                  }}
                  alt={item.name}
                  animate={{
                    opacity: activeNavigation === item.name ? 1 : (isDarkMode ? 0.85 : 0.6),
                    filter: getIconFilter(activeNavigation === item.name)
                  }}
                  transition={{
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                />
                {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: '"Geist", sans-serif',
              whiteSpace: 'nowrap',
              color: activeNavigation === item.name ? isDarkMode ? colors.white : 'rgba(10, 10, 10, 1)' : colors.textMuted
                  }}
                >
                  {item.name}
                </motion.span>
                )}
              </motion.button>)}
          </div>

          {!isCollapsed && (
          <div style={{
          marginTop: '24px',
          paddingLeft: '12px',
          marginBottom: '8px'
        }}>
            <span style={{
            fontSize: '12px',
            fontWeight: 500,
            color: colors.textSecondary,
            letterSpacing: '0.5px',
            opacity: 0.7
          }}>SYSTEM</span>
          </div>
          )}
          {isCollapsed && <div style={{ marginTop: '16px', height: '1px', background: colors.border, margin: '16px 8px 8px' }} />}

          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
            {systemItems.map(item => <motion.button
              key={item.name}
              onClick={() => {
                playClickSound();
                setActiveNavigation(item.name);
              }}
              whileHover={{ scale: 1.02, x: isCollapsed ? 0 : 2 }}
              whileTap={{ scale: 0.98 }}
              title={isCollapsed ? item.name : undefined}
              style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '8px',
            padding: isCollapsed ? '8px' : '8px 12px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                borderWidth: '0px',
            borderStyle: 'solid',
            borderColor: colors.border,
            width: '100%',
            textAlign: 'left'
              }}
              animate={{
                backgroundColor: activeNavigation === item.name ? isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white' : 'transparent',
                boxShadow: activeNavigation === item.name ? '0px 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                borderWidth: activeNavigation === item.name ? '1px' : '0px'
              }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
                <motion.img
                  src={item.icon}
                  style={{
                    width: '16px',
                    flexShrink: 0
                  }}
                  alt={item.name}
                  animate={{
                    opacity: activeNavigation === item.name ? 1 : (isDarkMode ? 0.85 : 0.6),
                    filter: getIconFilter(activeNavigation === item.name)
                  }}
                  transition={{
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                />
                {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: '"Geist", sans-serif',
              whiteSpace: 'nowrap',
              color: activeNavigation === item.name ? isDarkMode ? colors.white : 'rgba(10, 10, 10, 1)' : colors.textMuted
                  }}
                >
                  {item.name}
                </motion.span>
                )}
              </motion.button>)}
          </div>
        </div>

        <footer style={{
        padding: '8px',
        flexShrink: 0
      }}>
          {!isCollapsed && (<>
          {/* Theme Toggle */}
          <div style={{ padding: '8px' }}>
            <div style={{
              display: 'flex',
              background: isDarkMode ? 'rgba(39, 39, 42, 1)' : 'rgba(244, 244, 245, 1)',
              borderRadius: '8px',
              padding: '3px',
              gap: '2px',
              position: 'relative'
            }}>
              {/* Animated sliding background */}
              <motion.div
                layout
                layoutId="theme-toggle-bg"
                initial={false}
                animate={{
                  x: isDarkMode ? '100%' : '0%',
                  scale: 1
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  mass: 1,
                  velocity: 0
                }}
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: '3px',
                  width: 'calc(50% - 4px)',
                  height: 'calc(100% - 6px)',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                  borderRadius: '6px',
                  boxShadow: isDarkMode 
                    ? '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.3)' 
                    : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.06)',
                  pointerEvents: 'none'
                }}
              />
              
              <motion.button
                onClick={() => {
                  playClickSound();
                  setIsScrambling(true);
                  setIsDarkMode(false);
                }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.08 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 17
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: 'transparent',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <motion.svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  animate={{
                    stroke: !isDarkMode ? 'rgba(10, 10, 10, 1)' : 'rgba(163, 163, 163, 1)',
                    rotate: !isDarkMode ? 0 : -25,
                    scale: !isDarkMode ? 1.1 : 0.85
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 18,
                    mass: 0.8
                  }}
                >
                  <circle cx="12" cy="12" r="4" />
                  <motion.g
                    animate={{
                      opacity: !isDarkMode ? 1 : 0.5
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: 'easeInOut'
                    }}
                  >
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </motion.g>
                </motion.svg>
              </motion.button>
              
              <motion.button
                onClick={() => {
                  playClickSound();
                  setIsScrambling(true);
                  setIsDarkMode(true);
                }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.08 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 17
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: 'transparent',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <motion.svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  animate={{
                    stroke: isDarkMode ? 'rgba(250, 250, 250, 1)' : 'rgba(163, 163, 163, 1)',
                    rotate: isDarkMode ? 0 : 25,
                    scale: isDarkMode ? 1.1 : 0.85
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 18,
                    mass: 0.8
                  }}
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </motion.svg>
              </motion.button>
            </div>
          </div>

          {/* Separator */}
          <div style={{
            height: '1px',
            background: colors.border,
            margin: '4px 8px'
          }} />
          </>)}

          {/* User Info */}
          <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: '8px',
          padding: '8px',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
            <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            overflow: 'hidden',
            flexShrink: 0
          }}>
              <img src="/assets/profile-shashpicious.jpg" style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }} alt="shashpicious Avatar" />
            </div>
            {!isCollapsed && (
            <>
            <div style={{
            flex: 1,
            overflow: 'hidden'
          }}>
              <div data-scramble="profile" style={{
              color: colors.textPrimary,
              fontSize: '14px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>shashpicious</div>
              <div data-scramble="profile" style={{
              color: colors.textSecondary,
              fontSize: '12px',
              fontWeight: 300,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>png.shashi@gmail.com</div>
            </div>
            <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/125d49d8-142b-42e6-9e68-672689aeaf70.svg" style={{
            width: '16px',
            flexShrink: 0,
            filter: isDarkMode ? 'grayscale(100%) brightness(1.4) invert(0.15)' : 'none'
          }} />
            </>
            )}
          </div>
        </footer>
      </motion.aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {activeNavigation === 'Listings' ? (
          <>
            {/* Listings Header */}
            <header style={{
              height: '56px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{ width: '20px' }} alt="back" />
                <div style={{ height: '16px', borderLeft: `1px solid ${colors.border}` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist Mono"', textTransform: 'uppercase' }}>Dashboard</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/42fc4aca-b2d6-4358-bd46-3ec69e3c9773.svg" style={{ width: '14px' }} alt=">" />
                  <span style={{ fontSize: '14px', color: colors.textPrimary, fontFamily: '"Geist Mono"', textTransform: 'uppercase' }}>Listings</span>
                </div>
              </div>
            </header>

            {/* Listings Filter / Search Bar */}
            <div style={{
              height: '68px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: colors.bg
            }}>
              {/* Search Input */}
              <div style={{
                width: '320px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 8px',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                backgroundColor: colors.bg,
                boxShadow: '0px 1px 2px 0px rgba(10, 13, 20, 0.03)'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={listingsSearchQuery}
                  onChange={(e) => { setListingsSearchQuery(e.target.value); setListingsPage(1); }}
                  placeholder="Property Name"
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    color: colors.textPrimary,
                    backgroundColor: 'transparent',
                    fontFamily: '"Geist", sans-serif'
                  }}
                />
                <div style={{
                  padding: '2px 6px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: colors.textSecondary,
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.48px',
                  textTransform: 'uppercase'
                }}>⌘K</div>
              </div>

              {/* Filter Dropdowns */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <select
                    value={listingsProviderFilter}
                    onChange={(e) => { setListingsProviderFilter(e.target.value); setListingsPage(1); }}
                    style={{
                      padding: '6px 32px 6px 12px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                      color: colors.textPrimary,
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: '"Geist", sans-serif',
                      cursor: 'pointer',
                      appearance: 'none',
                      outline: 'none',
                      minWidth: '140px'
                    }}
                  >
                    <option value="">Provider Name</option>
                    {listingsProviders.map((p: any) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '16px', pointerEvents: 'none' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <select
                    style={{
                      padding: '6px 32px 6px 12px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                      color: colors.textPrimary,
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: '"Geist", sans-serif',
                      cursor: 'pointer',
                      appearance: 'none',
                      outline: 'none',
                      minWidth: '130px'
                    }}
                  >
                    <option value="">Regions (10)</option>
                  </select>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '16px', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            {/* Listings Table */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`listings-${listingsPage}-${listingsSearchQuery}-${listingsProviderFilter}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ flex: 1, overflowX: 'auto' }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead>
                    <tr style={{
                      backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
                      borderBottom: `1px solid ${colors.border}`,
                      height: '42px'
                    }}>
                      <th style={{ width: '49px', padding: '0 8px', textAlign: 'center', borderBottom: `1px solid ${colors.border}` }}>
                        <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: colors.accent }} />
                      </th>
                      <th style={{ width: '368px', padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Property Name</th>
                      <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Provider Name</th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Type</th>
                      <th style={{ width: '140px', padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentListingsData.map((item: any, idx: number) => (
                      <motion.tr
                        key={`listing-${listingsStartIndex + idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.03, ease: [0.4, 0, 0.2, 1] }}
                        style={{ borderBottom: `1px solid ${colors.border}`, height: '56px', backgroundColor: colors.bg }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = isDarkMode ? 'rgba(23, 23, 23, 0.6)' : 'rgba(250, 250, 250, 0.7)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.bg; }}
                      >
                        <td style={{ padding: '0 8px', textAlign: 'center' }}>
                          <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: colors.accent }} />
                        </td>
                        <td style={{ padding: '0 8px' }}>
                          <button
                            onClick={() => playClickSound()}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 500,
                              color: colors.accent,
                              fontFamily: '"Geist", sans-serif',
                              textAlign: 'left',
                              maxWidth: '350px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >{item.propertyName}</button>
                        </td>
                        <td style={{ padding: '0 16px', fontSize: '14px', fontWeight: 400, color: colors.textPrimary, fontFamily: '"Geist", sans-serif' }}>{item.providerName}</td>
                        <td style={{ padding: '0 8px', fontSize: '14px', fontWeight: 400, color: colors.textPrimary, fontFamily: '"Geist", sans-serif' }}>{item.type}</td>
                        <td style={{ padding: '0 8px', textAlign: 'center' }}>
                          <button
                            onClick={() => { playClickSound(); setSelectedListing(item); }}
                            style={{
                              padding: '4px 8px',
                              border: `1px solid ${colors.border}`,
                              borderRadius: '8px',
                              backgroundColor: isDarkMode ? 'rgba(39, 39, 42, 1)' : 'rgba(245, 245, 245, 1)',
                              color: colors.textPrimary,
                              fontSize: '12px',
                              fontWeight: 500,
                              fontFamily: '"Geist", sans-serif',
                              cursor: 'pointer',
                              height: '26px',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >See Details</button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </AnimatePresence>

            {/* Listings Pagination Footer */}
            <footer style={{
              height: '68px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: `1px solid ${colors.border}`,
              marginTop: 'auto',
              backgroundColor: colors.bg
            }}>
              <span style={{ fontSize: '14px', color: colors.textSecondary }}>
                Showing {listingsStartItem} to {listingsEndItem} of {listingsTotalItems} entries
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={handleListingsPrevious} disabled={listingsPage === 1} style={{
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: 'transparent',
                  cursor: listingsPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: listingsPage === 1 ? 0.5 : 1
                }}>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/01c076b6-3528-475d-af10-7b71b96e0863.svg" style={{ width: '16px' }} />
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 500 }}>Previous</span>
                </button>
                {getListingsPageNumbers().map((page, i) => (
                  <button key={`lp-${page}-${i}`} onClick={() => handleListingsPageClick(page)} style={{
                    width: '28px',
                    height: '28px',
                    border: page === listingsPage ? (isDarkMode ? '1px solid rgba(115, 115, 115, 1)' : `1px solid ${colors.accent}`) : 'none',
                    borderRadius: '8px',
                    cursor: page === -1 ? 'default' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    backgroundColor: page === listingsPage ? (isDarkMode ? 'rgba(82, 82, 91, 1)' : 'rgba(237, 243, 255, 1)') : 'transparent',
                    color: page === listingsPage ? (isDarkMode ? '#FFFFFF' : colors.accent) : colors.textPrimary
                  }}>
                    {page === -1 ? '...' : page}
                  </button>
                ))}
                <button onClick={handleListingsNext} disabled={listingsPage === listingsTotalPages} style={{
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: 'transparent',
                  cursor: listingsPage === listingsTotalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: listingsPage === listingsTotalPages ? 0.5 : 1
                }}>
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 500 }}>Next</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/607c4c87-4637-410f-bdea-5d4899aac524.svg" style={{ width: '16px' }} />
                </button>
              </div>
            </footer>
          </>
        ) : activeNavigation === 'Commissions' ? (
          <>
            {/* Commissions Header */}
            <header style={{
              height: '56px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
                  width: '20px'
                }} alt="back" />
                <div style={{
                  height: '16px',
                  borderLeft: `1px solid ${colors.border}`
                }} />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                    fontFamily: '"Geist Mono"',
                    textTransform: 'uppercase'
                  }}>Dashboard</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/42fc4aca-b2d6-4358-bd46-3ec69e3c9773.svg" style={{
                    width: '14px'
                  }} />
                  <span style={{
                    fontSize: '14px',
                    color: colors.textPrimary,
                    fontFamily: '"Geist Mono"',
                    textTransform: 'uppercase'
                  }}>Commissions</span>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                  cursor: 'pointer'
                }}>
                  <img src={isDarkMode ? "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/a7aea9d4-4862-4777-a667-d1f47c0a09a6.svg" : "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/515ca86f-0c62-489e-ac2f-446ec51a901e.svg"} style={{
                    width: '20px'
                  }} />
                  <span style={{
                    color: isDarkMode ? 'white' : 'rgba(10, 10, 10, 1)',
                    fontSize: '14px',
                    fontWeight: 500
                  }}>Export</span>
                </button>
              </div>
            </header>

            {/* Filters */}
            <div style={{
              padding: '16px 24px',
              backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderBottom: `1px solid ${colors.border}`
            }}>
              {/* Status Filter */}
              <div style={{
                position: 'relative'
              }}>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCommissionsPage(1);
                  }}
                  style={{
                    padding: '6px 32px 6px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    cursor: 'pointer',
                    appearance: 'none',
                    outline: 'none',
                    minWidth: '120px'
                  }}
                >
                  <option value="">Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Partially_paid">Partially_paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{
            position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
            pointerEvents: 'none'
          }} />
              </div>

              {/* Booking Type Filter */}
            <div style={{
                position: 'relative'
              }}>
                <select
                  value={bookingTypeFilter}
                  onChange={(e) => {
                    setBookingTypeFilter(e.target.value);
                    setCommissionsPage(1);
                  }}
                  style={{
                    padding: '6px 32px 6px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                    color: colors.textPrimary,
                    fontSize: '14px',
                    cursor: 'pointer',
                    appearance: 'none',
                    outline: 'none',
                    minWidth: '140px'
                  }}
                >
                  <option value="">Booking Type</option>
                  <option value="Advance">Advance</option>
                  <option value="Booking">Booking</option>
                </select>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  pointerEvents: 'none'
                }} />
              </div>
            </div>

            {/* Commissions Table */}
            <AnimatePresence mode="wait">
              <motion.div
                key={commissionsPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                }}
                style={{
                  flex: 1,
                  overflow: 'auto',
                  borderTop: `1px solid ${colors.border}`
                }}
              >
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
                      borderBottom: `1px solid ${colors.border}`
                    }}>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 24px',
                        fontSize: '13px',
                        color: colors.textSecondary,
                        fontFamily: '"Geist Mono"',
                        fontWeight: 500
                      }}>PO NUMBER</th>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 8px',
                        fontSize: '13px',
                        color: colors.textSecondary,
                        fontFamily: '"Geist Mono"',
                        fontWeight: 500
                      }}>BOOKING TYPE</th>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 8px',
                        fontSize: '13px',
                        color: colors.textSecondary,
                        fontFamily: '"Geist Mono"',
                        fontWeight: 500
                      }}>DATE</th>
                      <th style={{
                        textAlign: 'left',
                        padding: '12px 8px',
                        fontSize: '13px',
                        color: colors.textSecondary,
                        fontFamily: '"Geist Mono"',
                        fontWeight: 500
                      }}>STATUS</th>
                      <th style={{
                        textAlign: 'right',
                        padding: '12px 8px',
                        fontSize: '13px',
                        color: colors.textSecondary,
                        fontFamily: '"Geist Mono"',
                        fontWeight: 500
                      }}>AMOUNT</th>
                      <th style={{
                        textAlign: 'right',
                        padding: '12px 8px',
                        fontSize: '13px',
                        color: colors.textSecondary,
                        fontFamily: '"Geist Mono"',
                        fontWeight: 500
                      }}>AMOUNT DUE</th>
                      <th style={{
                        textAlign: 'right',
                        padding: '12px 24px',
                        fontSize: '13px',
                        color: colors.textSecondary,
                        fontFamily: '"Geist Mono"',
                        fontWeight: 500
                      }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCommissionsData.map((commission, i) => <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.03,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      style={{
                        borderBottom: `1px solid ${colors.border}`
                      }}
                    >
                      <td style={{
                        padding: '8px 24px',
                        fontSize: '14px',
              fontWeight: 500,
                        color: colors.textPrimary
                      }}>{commission.poNumber}</td>
                      <td style={{
                        padding: '8px 8px',
                        fontSize: '14px',
                        color: colors.textPrimary
                      }}>{commission.bookingType}</td>
                      <td style={{
                        padding: '8px 8px',
                        fontSize: '14px',
              color: colors.textPrimary,
                        fontFamily: '"Geist Mono"'
                      }}>{commission.date}</td>
                      <td style={{
                        padding: '8px 8px'
                      }}>{getStatusBadge(commission.status)}</td>
                      <td style={{
                        padding: '8px 8px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: colors.textPrimary,
                        fontFamily: '"Geist Mono"'
                      }}>{commission.amount}</td>
                      <td style={{
                        padding: '8px 8px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: colors.textPrimary,
                        fontFamily: '"Geist Mono"'
                      }}>{commission.amountDue}</td>
                      <td style={{
                        padding: '8px 24px',
                        textAlign: 'right'
                      }}>
                        <button style={{
                          padding: '4px 12px',
                          border: `1px solid ${colors.accent}`,
                          borderRadius: '6px',
                          background: 'transparent',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: colors.accent
                        }}>See Details</button>
                      </td>
                    </motion.tr>)}
                  </tbody>
                </table>
              </motion.div>
            </AnimatePresence>

            {/* Commissions Pagination Footer */}
            <footer style={{
              height: '68px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: `1px solid ${colors.border}`,
              marginTop: 'auto',
              backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'rgba(255, 255, 255, 1)'
            }}>
              <span style={{
                fontSize: '14px',
                color: colors.textSecondary
              }}>Showing {commissionsStartItem} to {commissionsEndItem} of {commissionsTotalItems} entries</span>
              <div style={{
                display: 'flex',
              gap: '4px'
            }}>
                <button onClick={handleCommissionsPrevious} disabled={commissionsPage === 1} style={{
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: 'transparent',
                  cursor: commissionsPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: commissionsPage === 1 ? 0.5 : 1
                }}>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/01c076b6-3528-475d-af10-7b71b96e0863.svg" style={{
                    width: '16px'
                  }} />
                  <span style={{
                    color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: 500
                  }}>Previous</span>
                </button>
                {getCommissionsPageNumbers().map(page => <button key={page} onClick={() => handleCommissionsPageClick(page)} style={{
                  width: '28px',
                  height: '28px',
                  border: page === commissionsPage ? (isDarkMode ? '1px solid rgba(115, 115, 115, 1)' : `1px solid ${colors.accent}`) : 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
              fontWeight: 500,
                  backgroundColor: page === commissionsPage ? (isDarkMode ? 'rgba(82, 82, 91, 1)' : 'rgba(237, 243, 255, 1)') : 'transparent',
                  color: page === commissionsPage ? (isDarkMode ? '#FFFFFF' : colors.accent) : colors.textPrimary
                }}>
                  {page === -1 ? '...' : page}
                </button>)}
                <button onClick={handleCommissionsNext} disabled={commissionsPage === commissionsTotalPages} style={{
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: 'transparent',
                  cursor: commissionsPage === commissionsTotalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: commissionsPage === commissionsTotalPages ? 0.5 : 1
                }}>
                  <span style={{
              color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: 500
                  }}>Next</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/607c4c87-4637-410f-bdea-5d4899aac524.svg" style={{
                    width: '16px'
                  }} />
                </button>
              </div>
            </footer>
          </>
        ) : activeNavigation === 'Campaigns / Events' ? (
          <>
            {/* Campaigns/Events Header */}
            <header style={{
              height: '56px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
                  width: '20px'
                }} alt="back" />
                <div style={{
                  height: '16px',
                  borderLeft: `1px solid ${colors.border}`
                }} />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '14px',
              color: colors.textSecondary,
                    fontFamily: '"Geist Mono"',
                    textTransform: 'uppercase'
                  }}>Dashboard</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/42fc4aca-b2d6-4358-bd46-3ec69e3c9773.svg" style={{
                    width: '14px'
                  }} />
                  <span style={{
                    fontSize: '14px',
                    color: colors.textPrimary,
                    fontFamily: '"Geist Mono"',
                    textTransform: 'uppercase'
                  }}>Campaigns / Events</span>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
              <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
              cursor: 'pointer'
            }}>
                  <img src={isDarkMode ? "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/a7aea9d4-4862-4777-a667-d1f47c0a09a6.svg" : "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/515ca86f-0c62-489e-ac2f-446ec51a901e.svg"} style={{
                    width: '20px'
                  }} />
                  <span style={{
                    color: isDarkMode ? 'white' : 'rgba(10, 10, 10, 1)',
                    fontSize: '14px',
                    fontWeight: 500
                  }}>Export</span>
                </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '10px',
                  background: 'rgba(12, 99, 248, 1)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
                }}>Add Campaign</button>
              </div>
            </header>

            <PageSection pageKey="Campaigns / Events">
            {/* Campaigns/Events Table */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              borderTop: `1px solid ${colors.border}`
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
                    borderBottom: `1px solid ${colors.border}`
                  }}>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px 24px',
                      fontSize: '13px',
                      color: colors.textSecondary,
                      fontFamily: '"Geist Mono"',
                      fontWeight: 500
                    }}>NAME</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px 8px',
                      fontSize: '13px',
                      color: colors.textSecondary,
                      fontFamily: '"Geist Mono"',
                      fontWeight: 500
                    }}>STATUS</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      fontSize: '13px',
                      color: colors.textSecondary,
                      fontFamily: '"Geist Mono"',
                      fontWeight: 500
                    }}>EMAIL</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px 8px',
                      fontSize: '13px',
                      color: colors.textSecondary,
                      fontFamily: '"Geist Mono"',
                      fontWeight: 500
                    }}>ROLE</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px 8px',
                      fontSize: '13px',
                      color: colors.textSecondary,
                      fontFamily: '"Geist Mono"',
                      fontWeight: 500
                    }}>SHARING LINK</th>
                    <th style={{
                      textAlign: 'right',
                      padding: '12px 24px',
                      fontSize: '13px',
                      color: colors.textSecondary,
                      fontFamily: '"Geist Mono"',
                      fontWeight: 500
                    }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCampaignsData.map((campaign, i) => <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.03,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    style={{
                      borderBottom: `1px solid ${colors.border}`
                    }}
                  >
                    <td style={{
                      padding: '8px 24px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: getAvatarColors(i).bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{
                            color: getAvatarColors(i).text,
                            fontSize: '14px',
                            fontWeight: 500
                          }}>{campaign.initial}</span>
                        </div>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: colors.textPrimary
                        }}>{campaign.name}</span>
                      </div>
                    </td>
                    <td style={{
                      padding: '8px 8px'
                    }}>{getStatusBadge(campaign.status)}</td>
                    <td style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      color: colors.textPrimary
                    }}>{campaign.email}</td>
                    <td style={{
                      padding: '8px 8px',
                      fontSize: '14px',
                      color: colors.textPrimary
                    }}>{campaign.role}</td>
                    <td style={{
                      padding: '8px 8px'
                    }}>
                      <button style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        backgroundColor: 'transparent',
                        color: 'rgba(12, 99, 248, 1)',
                        border: '1px solid rgba(12, 99, 248, 1)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        Refer
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="rgba(12, 99, 248, 1)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </td>
                    <td style={{
                      padding: '8px 24px',
                      textAlign: 'right'
                    }}>
                      <button style={{
                        padding: '4px 12px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '6px',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: colors.textPrimary
                      }}>Edit Details</button>
                    </td>
                  </motion.tr>)}
                </tbody>
              </table>
            </div>

            {/* Campaigns/Events Pagination Footer */}
            <footer style={{
              height: '68px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: `1px solid ${colors.border}`,
              marginTop: 'auto',
              backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'rgba(255, 255, 255, 1)'
            }}>
              <span style={{
                fontSize: '14px',
                color: colors.textSecondary
              }}>Showing {campaignsStartItem} to {campaignsEndItem} of {campaignsTotalItems} entries</span>
              <div style={{
                display: 'flex',
              gap: '4px'
            }}>
                <button onClick={handleCampaignsPrevious} disabled={campaignsPage === 1} style={{
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: 'transparent',
                  cursor: campaignsPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: campaignsPage === 1 ? 0.5 : 1
                }}>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/01c076b6-3528-475d-af10-7b71b96e0863.svg" style={{
                    width: '16px'
                  }} />
                  <span style={{
                    color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: 500
                  }}>Previous</span>
                </button>
                {getCampaignsPageNumbers().map(page => <button key={page} onClick={() => handleCampaignsPageClick(page)} style={{
                  width: '28px',
                  height: '28px',
                  border: page === campaignsPage ? (isDarkMode ? '1px solid rgba(115, 115, 115, 1)' : `1px solid ${colors.accent}`) : 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: page === campaignsPage ? (isDarkMode ? 'rgba(82, 82, 91, 1)' : 'rgba(237, 243, 255, 1)') : 'transparent',
                  color: page === campaignsPage ? (isDarkMode ? '#FFFFFF' : colors.accent) : colors.textPrimary
                }}>
                  {page === -1 ? '...' : page}
                </button>)}
                <button onClick={handleCampaignsNext} disabled={campaignsPage === campaignsTotalPages} style={{
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: 'transparent',
                  cursor: campaignsPage === campaignsTotalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: campaignsPage === campaignsTotalPages ? 0.5 : 1
                }}>
                  <span style={{
                    color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: 500
                  }}>Next</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/607c4c87-4637-410f-bdea-5d4899aac524.svg" style={{
                width: '16px'
              }} />
              </button>
              </div>
            </footer>
            </PageSection>
          </>
        ) : activeNavigation === 'Sub-Partners' ? (
          <>
            {/* Sub-Partners Header */}
            <header style={{
              height: '56px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
                  width: '20px'
                }} alt="back" />
                <div style={{
                  height: '16px',
                  borderLeft: `1px solid ${colors.border}`
                }} />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                    fontFamily: '"Geist Mono"',
                    textTransform: 'uppercase'
                  }}>Dashboard</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/42fc4aca-b2d6-4358-bd46-3ec69e3c9773.svg" style={{
                    width: '14px'
                  }} />
                  <span style={{
                    fontSize: '14px',
                    color: colors.textPrimary,
                    fontFamily: '"Geist Mono"',
                    textTransform: 'uppercase'
                  }}>Sub-Partners</span>
            </div>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
                gap: '16px'
              }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
          cursor: 'pointer'
        }}>
                  <img src={isDarkMode ? "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/a7aea9d4-4862-4777-a667-d1f47c0a09a6.svg" : "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/515ca86f-0c62-489e-ac2f-446ec51a901e.svg"} style={{
                    width: '20px'
                  }} />
                  <span style={{
                    color: isDarkMode ? 'white' : 'rgba(10, 10, 10, 1)',
                    fontSize: '14px',
                    fontWeight: 500
                  }}>Export</span>
                </button>
              </div>
            </header>

            <PageSection pageKey="Sub-Partners">
            {/* Sub-Partners Table */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              borderTop: `1px solid ${colors.border}`
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
                    borderBottom: `1px solid ${colors.border}`
                  }}>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px 24px',
                      fontSize: '13px',
                      color: colors.textSecondary,
                      fontFamily: '"Geist Mono"',
                      fontWeight: 500
                    }}>NAME</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px 8px',
                      fontSize: '13px',
                      color: colors.textSecondary,
                      fontFamily: '"Geist Mono"',
                      fontWeight: 500
                    }}>STATUS</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px 8px',
                      fontSize: '13px',
                      color: colors.textSecondary,
                      fontFamily: '"Geist Mono"',
                      fontWeight: 500
                    }}>ROLE</th>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px 8px',
                      fontSize: '13px',
                      color: colors.textSecondary,
                      fontFamily: '"Geist Mono"',
                      fontWeight: 500
                    }}>SHARING LINK</th>
                    <th style={{
                      textAlign: 'right',
                      padding: '12px 24px',
                      fontSize: '13px',
                      color: colors.textSecondary,
                      fontFamily: '"Geist Mono"',
                      fontWeight: 500
                    }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCampaignsData.map((campaign, i) => <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.03,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    style={{
                      borderBottom: `1px solid ${colors.border}`
                    }}
                  >
                    <td style={{
                      padding: '8px 24px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
        }}>
            <div style={{
            width: '32px',
            height: '32px',
                          borderRadius: '50%',
                          backgroundColor: getAvatarColors(i).bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{
                            color: getAvatarColors(i).text,
                            fontSize: '14px',
                            fontWeight: 500
                          }}>{campaign.initial}</span>
            </div>
            <div style={{
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: colors.textPrimary
                          }}>{campaign.name}</span>
                          <span style={{
                            fontSize: '14px',
                            color: colors.textSecondary
                          }}>{campaign.email}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{
                      padding: '8px 8px'
                    }}>{getStatusBadge(campaign.status)}</td>
                    <td style={{
                      padding: '8px 8px',
                      fontSize: '14px',
                      color: colors.textPrimary
                    }}>{campaign.role}</td>
                    <td style={{
                      padding: '8px 8px'
                    }}>
                      <button style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        backgroundColor: 'transparent',
                        color: 'rgba(12, 99, 248, 1)',
                        border: '1px solid rgba(12, 99, 248, 1)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        Refer
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="rgba(12, 99, 248, 1)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </td>
                    <td style={{
                      padding: '8px 24px',
                      textAlign: 'right'
                    }}>
                      <button style={{
                        padding: '4px 12px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '6px',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: colors.textPrimary
                      }}>Edit Details</button>
                    </td>
                  </motion.tr>)}
                </tbody>
              </table>
            </div>

            {/* Sub-Partners Pagination Footer */}
            <footer style={{
              height: '68px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: `1px solid ${colors.border}`,
              marginTop: 'auto',
              backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'rgba(255, 255, 255, 1)'
            }}>
              <span style={{
                fontSize: '14px',
                color: colors.textSecondary
              }}>Showing {campaignsStartItem} to {campaignsEndItem} of {campaignsTotalItems} entries</span>
              <div style={{
                display: 'flex',
                gap: '4px'
              }}>
                <button onClick={handleCampaignsPrevious} disabled={campaignsPage === 1} style={{
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: 'transparent',
                  cursor: campaignsPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: campaignsPage === 1 ? 0.5 : 1
                }}>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/01c076b6-3528-475d-af10-7b71b96e0863.svg" style={{
                    width: '16px'
                  }} />
                  <span style={{
              color: colors.textPrimary,
              fontSize: '14px',
              fontWeight: 500
                  }}>Previous</span>
                </button>
                {getCampaignsPageNumbers().map(page => <button key={page} onClick={() => handleCampaignsPageClick(page)} style={{
                  width: '28px',
                  height: '28px',
                  border: page === campaignsPage ? (isDarkMode ? '1px solid rgba(115, 115, 115, 1)' : `1px solid ${colors.accent}`) : 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: page === campaignsPage ? (isDarkMode ? 'rgba(82, 82, 91, 1)' : 'rgba(237, 243, 255, 1)') : 'transparent',
                  color: page === campaignsPage ? (isDarkMode ? '#FFFFFF' : colors.accent) : colors.textPrimary
                }}>
                  {page === -1 ? '...' : page}
                </button>)}
                <button onClick={handleCampaignsNext} disabled={campaignsPage === campaignsTotalPages} style={{
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: 'transparent',
                  cursor: campaignsPage === campaignsTotalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: campaignsPage === campaignsTotalPages ? 0.5 : 1
                }}>
                  <span style={{
                    color: colors.textPrimary,
                    fontSize: '14px',
                    fontWeight: 500
                  }}>Next</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/607c4c87-4637-410f-bdea-5d4899aac524.svg" style={{
                    width: '16px'
                  }} />
                </button>
              </div>
            </footer>
            </PageSection>
          </>
        ) : activeNavigation === 'Support' ? (
          <>
            {/* Support Header */}
            <header style={{
              height: '56px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
          }}>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
                  width: '20px'
                }} alt="back" />
              <div style={{
                  height: '16px',
                  borderLeft: `1px solid ${colors.border}`
                }} />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '14px',
              color: colors.textSecondary,
                    fontFamily: '"Geist Mono"',
                    textTransform: 'uppercase'
                  }}>Dashboard</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/42fc4aca-b2d6-4358-bd46-3ec69e3c9773.svg" style={{
                    width: '14px'
                  }} />
                  <span style={{
                    fontSize: '14px',
              color: colors.textPrimary,
                    fontFamily: '"Geist Mono"',
                    textTransform: 'uppercase'
                  }}>Support</span>
            </div>
              </div>
            </header>

            {/* Support Content */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
              padding: '24px'
            }}>
              {/* Amber Representative Details */}
              <div style={{
                marginBottom: '32px'
              }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.accent,
                  marginBottom: '16px',
                  fontFamily: '"Geist", sans-serif'
                }}>Amber Representative Details</h2>
                <div style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: isDarkMode ? 'rgba(38, 38, 38, 1)' : 'rgba(245, 245, 245, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${colors.border}`
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke={colors.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.41003 22C3.41003 18.13 7.26003 15 12 15C16.74 15 20.59 18.13 20.59 22" stroke={colors.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.66667 2.66667H13.3333C14.0667 2.66667 14.6667 3.26667 14.6667 4V12C14.6667 12.7333 14.0667 13.3333 13.3333 13.3333H2.66667C1.93333 13.3333 1.33333 12.7333 1.33333 12V4C1.33333 3.26667 1.93333 2.66667 2.66667 2.66667Z" stroke={colors.textSecondary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14.6667 4L8 8.66667L1.33333 4" stroke={colors.textSecondary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{
              fontSize: '14px',
                          color: colors.textPrimary,
              fontWeight: 500
                        }}>shreyansh.t@amberstudent.com</span>
                      </div>
              <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.6667 11.3867V13.3333C14.6667 13.6869 14.5262 14.0261 14.2761 14.2761C14.0261 14.5262 13.6869 14.6667 13.3333 14.6667H2.66667C2.31305 14.6667 1.97391 14.5262 1.72386 14.2761C1.47381 14.0261 1.33333 13.6869 1.33333 13.3333V2.66667C1.33333 2.31305 1.47381 1.97391 1.72386 1.72386C1.97391 1.47381 2.31305 1.33333 2.66667 1.33333H5.33333" stroke={colors.textSecondary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11.3333 1.33333H14.6667V4.66667" stroke={colors.textSecondary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 8L14.6667 1.33333" stroke={colors.textSecondary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{
                          fontSize: '14px',
                          color: colors.textPrimary,
                          fontWeight: 500
                        }}>+919876543210</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Central Helpline Details */}
              <div>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.accent,
                  marginBottom: '16px',
                  fontFamily: '"Geist", sans-serif'
                }}>Central Helpline Details</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px'
                }}>
                  {/* Call Us Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      padding: '24px',
                      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? 'rgba(38, 38, 38, 1)' : 'rgba(237, 243, 255, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2126 21.3528 21.3992C21.1482 21.5857 20.9071 21.7261 20.644 21.8114C20.3809 21.8967 20.1018 21.9251 19.826 21.895C16.7429 21.5812 13.7459 20.5459 11.05 18.86C8.61383 17.4047 6.45341 15.5202 4.68 13.3C2.86282 11.0024 1.57475 8.35267 0.9 5.5C0.868437 5.22779 0.895592 4.95195 0.979485 4.69119C1.06338 4.43043 1.20212 4.191 1.38721 3.98882C1.57231 3.78664 1.79952 3.62624 2.05411 3.51831C2.3087 3.41038 2.58496 3.35746 2.86 3.363H5.86C6.42335 3.37879 6.96171 3.61361 7.36383 4.02179C7.76596 4.42997 7.99991 4.98139 8.02 5.545C8.04928 6.30726 8.23718 7.05642 8.57 7.745C8.74019 8.09754 8.81952 8.48626 8.80082 8.876C8.78212 9.26574 8.66588 9.64405 8.463 9.975L7.09 11.975C8.51437 14.3871 10.4956 16.3683 12.9076 17.7926L14.9076 16.4196C15.2385 16.2167 15.6168 16.1005 16.0066 16.0818C16.3963 16.0631 16.7851 16.1424 17.1376 16.3126C17.8262 16.6454 18.5754 16.8333 19.3376 16.8626C19.9012 16.8827 20.4526 17.1166 20.8608 17.5188C21.269 17.9209 21.5038 18.4593 21.52 19.023L22 16.92Z" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: colors.textPrimary,
                      margin: 0,
                      fontFamily: '"Geist", sans-serif'
                    }}>Call Us</h3>
              <p style={{
                      fontSize: '14px',
              color: colors.textSecondary,
                      margin: 0,
              fontFamily: '"Geist", sans-serif'
                    }}>+44 7723497306</p>
                  </motion.div>

                  {/* Email Us Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      padding: '24px',
                      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? 'rgba(38, 38, 38, 1)' : 'rgba(237, 243, 255, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="L22 6L12 13L2 6" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
            </div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: colors.textPrimary,
                      margin: 0,
                      fontFamily: '"Geist", sans-serif'
                    }}>Email Us</h3>
                    <p style={{
                      fontSize: '14px',
                      color: colors.textSecondary,
                      margin: 0,
                      fontFamily: '"Geist", sans-serif'
                    }}>contact@amberstudent.com</p>
                  </motion.div>

                  {/* Whatsapp Chat Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      padding: '24px',
                      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? 'rgba(38, 38, 38, 1)' : 'rgba(237, 243, 255, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382C17.007 14.29 15.544 13.912 15.15 13.82C14.757 13.728 14.5 13.682 14.243 14.146C13.986 14.61 13.2 15.58 12.986 15.81C12.772 16.04 12.558 16.086 12.094 15.994C11.63 15.902 10.258 15.57 8.6 14.054C7.3 12.89 6.472 11.536 6.258 11.072C6.044 10.608 6.272 10.326 6.5 10.098C6.7 9.898 6.954 9.59 7.182 9.33C7.41 9.07 7.502 8.86 7.64 8.624C7.778 8.388 7.824 8.198 7.916 7.962C8.008 7.726 7.96 7.534 7.868 7.388C7.776 7.242 7.182 5.78 6.914 5.084C6.646 4.388 6.378 4.48 6.194 4.468C6.01 4.456 5.78 4.456 5.55 4.456C5.32 4.456 5.018 4.526 4.716 4.666C4.414 4.806 4.022 5.016 3.686 5.318C3.35 5.62 2.66 6.334 2.66 7.798C2.66 9.262 3.542 10.67 3.686 10.906C3.83 11.142 5.192 13.912 7.64 15.17C8.794 15.77 9.626 16.084 10.458 16.35C11.516 16.688 12.488 16.654 13.23 16.542C14.052 16.414 15.738 15.81 16.082 15.15C16.426 14.49 16.426 13.876 16.334 13.682C16.242 13.488 16.15 13.534 15.962 13.442C15.774 13.35 14.812 12.972 14.578 12.88C14.344 12.788 14.158 12.742 13.97 12.93C13.782 13.118 13.288 13.63 13.1 13.818C12.912 14.006 12.724 14.052 12.536 13.96C12.348 13.868 11.63 13.63 10.78 12.88C10.164 12.344 9.686 11.704 9.498 11.516C9.31 11.328 9.122 11.282 8.98 11.142C8.838 11.002 8.838 10.856 8.93 10.71C9.022 10.564 9.218 10.188 9.356 9.952C9.494 9.716 9.54 9.526 9.632 9.334C9.724 9.142 9.68 8.95 9.588 8.804C9.496 8.658 8.716 7.196 8.716 6.5C8.716 5.804 8.716 5.292 8.578 5.146C8.44 5 8.302 5 8.164 5H7.916C7.732 5 7.456 5.05 7.226 5.19C7.05 5.298 6.9 5.444 6.786 5.618" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 2C6.477 2 2 6.477 2 12C2 13.582 2.375 15.08 3.04 16.4L2 22L7.6 20.96C8.92 21.625 10.418 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: colors.textPrimary,
                      margin: 0,
                      fontFamily: '"Geist", sans-serif'
                    }}>Whatsapp Chat</h3>
                    <p style={{
                      fontSize: '14px',
                      color: colors.textSecondary,
                      margin: 0,
                      fontFamily: '"Geist", sans-serif'
                    }}>Chat on whatsapp</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </>
        ) : activeNavigation === 'Settings' ? (
          <>
            {/* Settings Header */}
            <header style={{
              height: '56px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
                  width: '20px'
                }} alt="back" />
                <div style={{
                  height: '16px',
                  borderLeft: `1px solid ${colors.border}`
                }} />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                    fontFamily: '"Geist Mono"',
                    textTransform: 'uppercase'
                  }}>Dashboard</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/42fc4aca-b2d6-4358-bd46-3ec69e3c9773.svg" style={{
                    width: '14px'
                  }} />
                  <span style={{
                    fontSize: '14px',
                    color: colors.textPrimary,
                    fontFamily: '"Geist Mono"',
                    textTransform: 'uppercase'
                  }}>Settings</span>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
              <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '32px',
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
              cursor: 'pointer'
            }}>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
                    width: '20px'
              }} />
              </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                  cursor: 'pointer'
                }}>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/515ca86f-0c62-489e-ac2f-446ec51a901e.svg" style={{
                    width: '20px'
                  }} />
                  <span style={{
                    color: isDarkMode ? 'white' : 'rgba(10, 10, 10, 1)',
                    fontSize: '14px',
                    fontWeight: 500
                  }}>Save Draft</span>
                </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'rgba(12, 99, 248, 1)',
                  color: 'white',
                  cursor: 'pointer',
                  boxShadow: '0px 1px 2px rgba(14, 18, 27, 0.24)'
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 500
                  }}>Publish</span>
                </button>
            </div>
            </header>

            {/* Settings Top Tabs */}
            <div style={{
              height: '50px',
              padding: '0 8px',
              display: 'flex',
              alignItems: 'center',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white'
            }}>
              {['General', 'Branding', 'Domain', 'Integrations'].map(tab => (
                <button
                  key={tab}
                  onClick={() => {}}
                  style={{
                    padding: '6px 12px',
                    margin: '0 4px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    backgroundColor: tab === 'Branding' ? isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white' : 'transparent',
                    color: tab === 'Branding' ? colors.textPrimary : colors.textSecondary,
                    boxShadow: tab === 'Branding' ? '0px 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  {tab}
                </button>
              ))}
          </div>

            {/* Settings Content */}
          <div style={{
              flex: 1,
              display: 'flex',
              overflow: 'hidden'
            }}>
              {/* Left Form Section */}
              <div style={{
                width: '482px',
                padding: '28px 16px 16px',
                backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                overflowY: 'auto',
                borderRight: `1px solid ${colors.border}`
              }}>
                {/* Sub Tabs */}
                <div style={{
                  marginBottom: '28px',
                  display: 'flex',
                  gap: '4px',
                  backgroundColor: isDarkMode ? 'rgba(38, 38, 38, 1)' : 'rgba(245, 245, 245, 1)',
                  padding: '4px',
                  borderRadius: '10px'
                }}>
                  {['Brand Identity', 'Typography'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => {
                        playClickSound();
                        setSettingsTab(tab);
                      }}
                      style={{
                        flex: 1,
                        padding: '4px 8px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        backgroundColor: settingsTab === tab ? isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white' : 'transparent',
                        color: settingsTab === tab ? colors.textPrimary : colors.textSecondary,
                        boxShadow: settingsTab === tab ? '0px 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Brand Color */}
                <div style={{
                  marginBottom: '24px'
                }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: colors.textPrimary
                  }}>Brand Color</label>
                  <div style={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)'
                  }}>
                    <div style={{
                      padding: '16px',
                      backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
                          padding: '8px 10px',
                          border: `1px solid ${colors.border}`,
                          borderRadius: '10px',
                          backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white'
        }}>
            <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            backgroundColor: brandColor
                          }} />
                          <input
                            type="text"
                            value={brandColor}
                            onChange={(e) => setBrandColor(e.target.value)}
                            style={{
                              flex: 1,
                              border: 'none',
                              outline: 'none',
                              background: 'transparent',
                              fontSize: '14px',
                              fontFamily: '"Geist Mono", sans-serif',
                              color: colors.textSecondary
                            }}
                          />
                        </div>
                        <button style={{
                          width: '40px',
                          height: '34px',
                          border: `1px solid ${colors.border}`,
                          borderRadius: '6px',
                          backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0px 1px 3px rgba(14, 18, 27, 0.12)'
                        }}>
                          <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
            width: '16px'
          }} />
                        </button>
                        <button style={{
                          width: '40px',
                          height: '34px',
                          border: `1px solid ${colors.border}`,
                          borderRadius: '6px',
                          backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0px 1px 3px rgba(14, 18, 27, 0.12)'
                        }}>
                          <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
                            width: '16px'
                          }} />
                        </button>
                        <button style={{
                          width: '40px',
                          height: '34px',
                          border: `1px solid ${colors.border}`,
                          borderRadius: '6px',
                          backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0px 1px 3px rgba(14, 18, 27, 0.12)'
                        }}>
                          <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
                            width: '16px'
                          }} />
                        </button>
          </div>
                    </div>
                  </div>
                </div>

                {/* Upload Logo */}
            <div style={{
                  marginBottom: '24px'
                }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: colors.textPrimary
                  }}>Upload Logo</label>
              <div style={{
                    border: `2px dashed ${colors.border}`,
                    borderRadius: '12px',
                    padding: '24px 32px',
                    backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 500,
              color: colors.textPrimary,
                      textAlign: 'center'
                    }}>
                      Drop files here, <span style={{ color: '#0369a1' }}>browse files</span> or import from:
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '12px'
                    }}>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 16px 6px 6px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '96px',
                        backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                        cursor: 'pointer',
                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.03)'
                      }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '96px',
                          backgroundColor: 'rgba(255, 236, 192, 1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
                            width: '18px'
                          }} />
                        </div>
                        <span style={{
              fontSize: '14px',
                          color: colors.textPrimary
                        }}>My Device</span>
                      </button>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 16px 6px 6px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '96px',
                        backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                        cursor: 'pointer',
                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.03)'
                      }}>
              <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '96px',
                          backgroundColor: 'rgba(242, 242, 242, 1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
                            width: '24px'
                          }} />
            </div>
                        <span style={{
                          fontSize: '14px',
                          color: colors.textPrimary
                        }}>Google Drive</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Redirection Link */}
                <div style={{
                  marginBottom: '24px'
                }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: colors.textPrimary
                  }}>Redirection link</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)'
                  }}>
                    <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
            width: '16px'
          }} />
                    <input
                      type="text"
                      placeholder="Enter redirection link"
                      value={redirectionLink}
                      onChange={(e) => setRedirectionLink(e.target.value)}
                      style={{
      flex: 1,
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '14px',
                        color: colors.textSecondary
                      }}
                    />
          </div>
                </div>

                {/* Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingLeft: '16px'
                }}>
                  <button style={{
                    padding: '6px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    opacity: 0
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: colors.textPrimary
                    }}>Cancel</span>
                  </button>
                  <button style={{
                    padding: '6px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? 'rgba(38, 38, 38, 1)' : 'rgba(245, 245, 245, 1)',
                    cursor: 'pointer'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: '"Geist Mono", sans-serif',
                      color: colors.textPrimary
                    }}>SAVE CHANGES</span>
                  </button>
                </div>
              </div>

              {/* Right Preview Section */}
              <div style={{
      flex: 1,
                backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'rgba(250, 250, 250, 1)',
      display: 'flex',
      flexDirection: 'column',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '16px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: `1px solid ${colors.border}`
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: colors.textPrimary,
                      marginBottom: '4px'
                    }}>LIVE PREVIEW</h3>
                    <p style={{
                      fontSize: '14px',
                      color: colors.textSecondary
                    }}>This is how your product will appear.</p>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    backgroundColor: isDarkMode ? 'rgba(38, 38, 38, 1)' : 'rgba(245, 245, 245, 1)',
                    padding: '4px',
                    borderRadius: '10px'
                  }}>
                    <button style={{
                      padding: '4px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                      color: colors.textPrimary,
                      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'
                    }}>
                      Desktop
                    </button>
                    <button style={{
                      padding: '4px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      backgroundColor: 'transparent',
                      color: colors.textSecondary
                    }}>
                      Mobile
                    </button>
                  </div>
                </div>
                <div style={{
                  flex: 1,
                  padding: '24px',
                  overflow: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: '654px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    {/* Browser Mockup */}
                    <div style={{
                      height: '24px',
                      backgroundColor: 'rgba(245, 245, 245, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 9px',
                      gap: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '4px'
                      }}>
                        <div style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 95, 87, 1)'
                        }} />
                        <div style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 189, 46, 1)'
                        }} />
                        <div style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(40, 200, 65, 1)'
                        }} />
                      </div>
                      <div style={{
                        flex: 1,
                        height: '15px',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        margin: '0 auto',
                        maxWidth: '182px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 4px',
                        gap: '4px'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: colors.textSecondary
                        }} />
                        <span style={{
                          fontSize: '10px',
                          color: colors.textSecondary
                        }}>gatech.com</span>
                      </div>
                    </div>
                    {/* Preview Content Placeholder */}
                    <div style={{
                      minHeight: '500px',
                      backgroundColor: 'white',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '20px'
                    }}>
                      <div style={{
                        width: '100%',
                        height: '235px',
                        backgroundColor: brandColor,
                        borderRadius: '8px'
                      }} />
                      <div style={{
                        width: '100%',
                        maxWidth: '581px'
                      }}>
                        <h2 style={{
                          fontSize: '15px',
                          fontWeight: 500,
                          color: colors.textPrimary,
                          marginBottom: '20px'
                        }}>Popular Accommodations Near University</h2>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '12px'
                        }}>
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} style={{
                              border: `1px solid ${colors.border}`,
                              borderRadius: '8px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                height: '91px',
                                backgroundColor: colors.border
                              }} />
                              <div style={{
                                padding: '8px'
                              }}>
                                <div style={{
                                  height: '10px',
                                  backgroundColor: colors.border,
                                  marginBottom: '8px',
                                  borderRadius: '4px'
                                }} />
                                <div style={{
                                  height: '10px',
                                  backgroundColor: colors.border,
                                  width: '60%',
                                  borderRadius: '4px'
                                }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : activeNavigation === 'Integrations' ? (
          <>
            {/* Integrations Header */}
            <header style={{
              height: '56px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{ width: '20px' }} alt="back" />
                <div style={{ height: '16px', borderLeft: `1px solid ${colors.border}` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist Mono"', textTransform: 'uppercase' }}>Dashboard</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/42fc4aca-b2d6-4358-bd46-3ec69e3c9773.svg" style={{ width: '14px' }} alt=">" />
                  <span style={{ fontSize: '14px', color: colors.textPrimary, fontFamily: '"Geist Mono"', textTransform: 'uppercase' }}>Integrations</span>
                </div>
              </div>
            </header>

            {/* Integrations Content */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '48px 24px', overflowY: 'auto', backgroundColor: colors.bg }}>
              <div style={{ width: '100%', maxWidth: '585px' }}>

                {/* Page title */}
                <motion.div
                  key="int-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  style={{ marginBottom: '20px' }}
                >
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: isDarkMode ? colors.textPrimary : 'rgba(23, 23, 23, 1)', fontFamily: '"Inter", sans-serif', letterSpacing: '-0.176px' }}>All Apps</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 400, color: isDarkMode ? colors.textSecondary : 'rgba(92, 92, 92, 1)', fontFamily: '"Inter", sans-serif', letterSpacing: '-0.084px' }}>Discover the available integrations.</p>
                </motion.div>

                {/* Top divider */}
                <motion.div
                  key="int-divider-top"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
                  style={{ height: '1px', backgroundColor: isDarkMode ? colors.border : 'rgba(235, 235, 235, 1)', marginBottom: '20px' }}
                />

                {/* Integration rows */}
                {[
                  {
                    title: 'Widget Integrations',
                    description: 'Integrate amberstudent widget',
                    icon: (
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="2" y="2" width="28" height="28" rx="5" fill="#D83B01"/>
                        <path d="M8 8H6v12l6-3 5 3V8H8z" fill="white"/>
                        <rect x="18" y="11" width="7" height="2" rx="1" fill="rgba(255,255,255,0.75)"/>
                        <rect x="18" y="15" width="5" height="2" rx="1" fill="rgba(255,255,255,0.75)"/>
                        <rect x="18" y="19" width="6" height="2" rx="1" fill="rgba(255,255,255,0.75)"/>
                      </svg>
                    )
                  },
                  {
                    title: 'Inventories API',
                    description: 'Get a list of filtered amenities',
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect x="2" y="11" width="6" height="6" rx="3" fill="#E01E5A"/>
                        <rect x="11" y="11" width="6" height="6" rx="3" fill="#36C5F0"/>
                        <rect x="2" y="20" width="6" height="6" rx="3" fill="#2EB67D"/>
                        <rect x="11" y="20" width="6" height="6" rx="3" fill="#ECB22E"/>
                        <rect x="2" y="2" width="6" height="6" rx="3" fill="#ECB22E"/>
                        <rect x="11" y="2" width="6" height="6" rx="3" fill="#E01E5A"/>
                        <rect x="20" y="11" width="6" height="6" rx="3" fill="#2EB67D"/>
                        <rect x="20" y="2" width="6" height="6" rx="3" fill="#36C5F0"/>
                      </svg>
                    )
                  },
                  {
                    title: 'Leads API',
                    description: 'Create new leads and details of existing leads',
                    icon: (
                      <svg width="30" height="28" viewBox="0 0 30 28" fill="none">
                        <circle cx="15" cy="7" r="6" fill="#F06A6A"/>
                        <circle cx="6" cy="22" r="6" fill="#F06A6A"/>
                        <circle cx="24" cy="22" r="6" fill="#F06A6A"/>
                      </svg>
                    )
                  },
                  {
                    title: 'Branding And Marketing Assets',
                    description: 'Repository of amber branding assets',
                    icon: (
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="2" y="2" width="28" height="28" rx="6" fill="#2D8CFF"/>
                        <rect x="4" y="10" width="15" height="12" rx="3" fill="white"/>
                        <path d="M21 13.5l7-4v13l-7-4V13.5z" fill="white"/>
                      </svg>
                    )
                  }
                ].map((item, idx) => (
                  <React.Fragment key={item.title}>
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.1 + idx * 0.08, ease: [0.4, 0, 0.2, 1] }}
                      style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
                    >
                      {/* Brand icon */}
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        border: `1px solid ${isDarkMode ? colors.border : 'rgba(235, 235, 235, 1)'}`,
                        boxShadow: '0px 1px 2px 0px rgba(10, 13, 20, 0.03)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isDarkMode ? colors.cardBg : 'white',
                        flexShrink: 0
                      }}>
                        {item.icon}
                      </div>

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: isDarkMode ? colors.textPrimary : 'rgba(23, 23, 23, 1)', fontFamily: '"Inter", sans-serif', letterSpacing: '-0.176px' }}>{item.title}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 400, color: isDarkMode ? colors.textSecondary : 'rgba(92, 92, 92, 1)', fontFamily: '"Inter", sans-serif', letterSpacing: '-0.084px' }}>{item.description}</p>
                      </div>

                      {/* Manage button */}
                      <button
                        onClick={() => playClickSound()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '8px',
                          border: `1px solid ${isDarkMode ? colors.border : 'rgba(235, 235, 235, 1)'}`,
                          borderRadius: '8px',
                          backgroundColor: isDarkMode ? colors.cardBg : 'white',
                          cursor: 'pointer',
                          boxShadow: '0px 1px 2px 0px rgba(10, 13, 20, 0.03)',
                          flexShrink: 0
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: 500, color: isDarkMode ? colors.textSecondary : 'rgba(92, 92, 92, 1)', fontFamily: '"Inter", sans-serif', letterSpacing: '-0.084px' }}>Manage</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? colors.textSecondary : 'rgba(92, 92, 92, 1)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                    </motion.div>

                    {/* Divider between items */}
                    {idx < 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.15 + idx * 0.08, ease: [0.4, 0, 0.2, 1] }}
                        style={{ height: '1px', backgroundColor: isDarkMode ? colors.border : 'rgba(235, 235, 235, 1)', margin: '20px 0' }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        ) : activeNavigation === 'Dashboard' ? (
          <>
            {/* Dashboard Header */}
            <header style={{
              height: '56px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
                  width: '20px'
                }} alt="back" />
                <div style={{
                  height: '16px',
                  borderLeft: `1px solid ${colors.border}`
                }} />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: colors.textPrimary,
                    fontFamily: '"Geist Mono"',
                    textTransform: 'uppercase'
                  }}>Dashboard</span>
                </div>
              </div>
            </header>

            <PageSection pageKey="Dashboard">
              {/* Empty State */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
                padding: '48px'
              }}>
                <div style={{
                  width: '200px',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {processingAnimationData ? (
                    <Lottie
                      animationData={getProcessedAnimationData()}
                      loop={true}
                      autoplay={true}
                      style={{
                        width: '200px',
                        height: '200px'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '200px',
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.textSecondary
                    }}>
                      Loading...
                    </div>
                  )}
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: colors.textPrimary,
                    fontFamily: '"Geist", sans-serif'
                  }}>Metabase getting embedded soon</span>
                  <span style={{
                    fontSize: '14px',
                    color: colors.textSecondary,
                    fontFamily: '"Geist", sans-serif'
                  }}>Your analytics dashboard will appear here</span>
                </div>
              </div>
            </PageSection>
          </>
        ) : (
          <>
        <header style={{
        height: '56px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
            <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{
            width: '20px'
          }} alt="back" />
            <div style={{
            height: '16px',
            borderLeft: `1px solid ${colors.border}`
          }} />
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
              <span style={{
              fontSize: '14px',
              color: colors.textSecondary,
              fontFamily: '"Geist Mono"',
              textTransform: 'uppercase'
            }}>Dashboard</span>
              <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/42fc4aca-b2d6-4358-bd46-3ec69e3c9773.svg" style={{
              width: '14px'
            }} />
              <span style={{
              fontSize: '14px',
              color: colors.textPrimary,
              fontFamily: '"Geist Mono"',
              textTransform: 'uppercase'
            }}>Leads</span>
            </div>
          </div>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
            <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
            cursor: 'pointer'
          }}>
              <img src={isDarkMode ? "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/a7aea9d4-4862-4777-a667-d1f47c0a09a6.svg" : "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/515ca86f-0c62-489e-ac2f-446ec51a901e.svg"} style={{
              width: '20px'
            }} />
              <span style={{
              color: isDarkMode ? 'white' : 'rgba(10, 10, 10, 1)',
              fontSize: '14px',
              fontWeight: 500
            }}>Export</span>
            </button>
            <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '10px',
            background: 'rgba(12, 99, 248, 1)',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0px 1px 2px rgba(14, 18, 27, 0.24)'
          }}>
              <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bcf98e1d-f1ab-46ff-85dc-5337065d7d9e.svg" style={{
              width: '20px'
            }} />
              <span style={{
              fontSize: '14px',
              fontWeight: 500
            }}>Add Lead</span>
            </button>
          </div>
        </header>

        <div style={{
        padding: '16px 24px',
        backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
          <div style={{
          display: 'flex',
          gap: '4px',
          backgroundColor: isDarkMode ? 'rgba(38, 38, 38, 1)' : 'rgba(245, 245, 245, 1)',
          padding: '4px',
          borderRadius: '10px',
          position: 'relative'
        }}>
            {['Leads', 'Prequalified Leads'].map(tab => <motion.button
              key={tab}
              onClick={() => {
                playClickSound();
                setActiveTab(tab);
              }}
              style={{
            padding: '4px 12px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            backgroundColor: activeTab === tab ? isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white' : 'transparent',
            color: activeTab === tab ? colors.textPrimary : colors.textSecondary,
                boxShadow: activeTab === tab ? '0px 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                position: 'relative',
                zIndex: activeTab === tab ? 1 : 0
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
                {tab}
              </motion.button>)}
          </div>

          <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
            <div style={{
            position: 'relative',
            width: '320px'
          }}>
              <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/372af438-08ee-41de-93d0-dc709e656e7e.svg" style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px'
            }} />
              <input type="text" placeholder="Search Leads" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} style={{
              width: '100%',
              padding: '6px 40px 6px 32px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
              color: colors.textPrimary,
              outline: 'none',
              fontSize: '14px'
            }} />
              <div style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '2px 6px',
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              fontSize: '12px',
              color: colors.textSecondary
            }}>⌘K</div>
            </div>

            <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
            cursor: 'pointer'
          }}>
              <span style={{
              color: colors.textPrimary,
              fontSize: '14px',
              fontWeight: 500
            }}>Last 7 days</span>
              <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{
              width: '20px'
            }} />
            </button>

            <button onClick={() => setShowFilters(true)} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
            cursor: 'pointer'
          }}>
              <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/2f5b48f5-f24e-4c38-8924-edfe149b9b1d.svg" style={{
              width: '20px'
            }} />
              <span style={{
              color: colors.textPrimary,
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: '"Geist Mono"'
            }}>FILTERS</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{
        flex: 1,
        overflow: 'auto',
        borderTop: `1px solid ${colors.border}`
            }}
          >
          <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
            <thead>
              <tr style={{
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
              borderBottom: `1px solid ${colors.border}`
            }}>
                <th style={{
                textAlign: 'left',
                padding: '12px 24px',
                fontSize: '13px',
                color: colors.textSecondary,
                fontFamily: '"Geist Mono"',
                fontWeight: 500
              }}>LEAD</th>
                <th style={{
                textAlign: 'left',
                padding: '12px 8px',
                fontSize: '13px',
                color: colors.textSecondary,
                fontFamily: '"Geist Mono"',
                fontWeight: 500
              }}>STATUS</th>
                <th style={{
                textAlign: 'left',
                padding: '12px 16px',
                fontSize: '13px',
                color: colors.textSecondary,
                fontFamily: '"Geist Mono"',
                fontWeight: 500
              }}>DESTINATION CITY</th>
                <th style={{
                textAlign: 'left',
                padding: '12px 8px',
                fontSize: '13px',
                color: colors.textSecondary,
                fontFamily: '"Geist Mono"',
                fontWeight: 500
              }}>INTAKE</th>
                <th style={{
                textAlign: 'left',
                padding: '12px 8px',
                fontSize: '13px',
                color: colors.textSecondary,
                fontFamily: '"Geist Mono"',
                fontWeight: 500
              }}>SUB-PARTNER</th>
                <th style={{
                textAlign: 'right',
                padding: '12px 24px',
                fontSize: '13px',
                color: colors.textSecondary,
                fontFamily: '"Geist Mono"',
                fontWeight: 500
              }}>CREATED ON</th>
              </tr>
            </thead>
            <tbody>
              {currentLeadsData.map((lead, i) => <motion.tr
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.03,
                  ease: [0.4, 0, 0.2, 1]
                }}
                style={{
              borderBottom: `1px solid ${colors.border}`
                }}
              >
                  <td style={{
                padding: '8px 24px'
              }}>
                    <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                      <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: getAvatarColors(i).bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                        <span style={{
                      color: getAvatarColors(i).text,
                      fontSize: '14px',
                      fontWeight: 500
                    }}>{lead.initial}</span>
                      </div>
                      <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                        <span style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: colors.textPrimary
                    }}>{lead.name}</span>
                        <span style={{
                      fontSize: '14px',
                      color: colors.textSecondary
                    }}>{lead.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{
                padding: '8px 8px'
              }}>{getStatusBadge(lead.status)}</td>
                  <td style={{
                padding: '8px 16px'
              }}>
                    <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                      <img src={lead.countryIcon} style={{
                    width: '20px'
                  }} />
                      <span style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: colors.textPrimary
                  }}>{lead.city}</span>
                    </div>
                  </td>
                  <td style={{
                padding: '8px 8px'
              }}>
                    <div style={{
                  fontSize: '14px',
                  color: colors.textPrimary,
                  border: `1px solid transparent`,
                  padding: '4px 0'
                }}>{lead.intake}</div>
                  </td>
                  <td style={{
                padding: '8px 8px'
              }}>
                    <div style={{
                  fontSize: '14px',
                  color: colors.textPrimary
                }}>{lead.partner}</div>
                  </td>
                  <td style={{
                padding: '8px 24px',
                textAlign: 'right',
                fontSize: '14px',
                color: colors.textSecondary,
                fontFamily: '"Geist Mono"'
              }}>{lead.created}</td>
                </motion.tr>)}
            </tbody>
          </table>
          </motion.div>
        </AnimatePresence>

        <footer style={{
        height: '68px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: `1px solid ${colors.border}`
      }}>
          <span style={{
          fontSize: '14px',
          color: colors.textSecondary
        }}>Showing {startItem} to {endItem} of {totalItems} entries</span>
          <div style={{
          display: 'flex',
          gap: '4px'
        }}>
            <button onClick={handlePrevious} disabled={currentPage === 1} style={{
            padding: '6px 12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            background: 'transparent',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: currentPage === 1 ? 0.5 : 1
          }}>
              <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/01c076b6-3528-475d-af10-7b71b96e0863.svg" style={{
              width: '16px'
            }} />
              <span style={{
              color: colors.textPrimary,
              fontSize: '14px',
              fontWeight: 500
            }}>Previous</span>
            </button>
            {getPageNumbers().map(page => <button key={page} onClick={() => handlePageClick(page)} style={{
            width: '28px',
            height: '28px',
            border: page === currentPage ? (isDarkMode ? '1px solid rgba(115, 115, 115, 1)' : `1px solid ${colors.accent}`) : 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            backgroundColor: page === currentPage ? (isDarkMode ? 'rgba(82, 82, 91, 1)' : 'rgba(237, 243, 255, 1)') : 'transparent',
            color: page === currentPage ? (isDarkMode ? '#FFFFFF' : colors.accent) : colors.textPrimary
          }}>
                {page}
              </button>)}
            <button onClick={handleNext} disabled={currentPage === totalPages} style={{
            padding: '6px 12px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            background: 'transparent',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: currentPage === totalPages ? 0.5 : 1
          }}>
              <span style={{
              color: colors.textPrimary,
              fontSize: '14px',
              fontWeight: 500
            }}>Next</span>
              <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/607c4c87-4637-410f-bdea-5d4899aac524.svg" style={{
              width: '16px'
            }} />
            </button>
          </div>
        </footer>

        {/* Filter Overlay */}
        {showFilters && <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100
      }}>
            <div style={{
          width: '577px',
          backgroundColor: colors.bg,
          borderRadius: '16px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
              <div style={{
            padding: '16px 24px',
            backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
            borderBottom: `1px solid ${colors.border}`,
            fontSize: '20px',
            fontWeight: 600,
            color: colors.textPrimary
          }}>
                Filters
              </div>
              <div style={{
            padding: '24px'
          }}>
                <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
                  <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: colors.textSecondary,
                fontFamily: '"Geist Mono"'
              }}>STATUS</span>
                  <div style={{
                flex: 1,
                height: '1px',
                backgroundColor: colors.border
              }} />
                </div>
                
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '24px'
            }}>
                  {[{
                label: 'ENGAGED',
                color: 'rgba(22, 163, 74, 0.1)',
                text: 'rgba(22, 163, 74, 1)'
              }, {
                label: 'CANCELLED',
                color: 'rgba(224, 52, 52, 0.1)',
                text: 'rgba(220, 38, 38, 1)'
              }, {
                label: 'REPEAT USERS',
                color: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(244, 244, 245, 0.6)',
                text: colors.textPrimary
              }, {
                label: 'NOT BOOKED',
                color: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(244, 244, 245, 0.6)',
                text: colors.textPrimary
              }, {
                label: 'FOLLOW-UP LATER',
                color: 'rgba(227, 146, 25, 0.1)',
                text: 'rgba(217, 119, 6, 1)'
              }, {
                label: 'CONTACTED',
                color: 'rgba(22, 163, 74, 0.1)',
                text: 'rgba(22, 163, 74, 1)'
              }, {
                label: 'NON-RESPONSIVE',
                color: 'rgba(2, 132, 199, 0.1)',
                text: 'rgba(2, 132, 199, 1)'
              }].map((status, idx) => <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                      <input type="checkbox" style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: `1px solid ${colors.border}`
                }} />
                      <div style={{
                  padding: '2px 6px',
                  borderRadius: '6px',
                  backgroundColor: status.color,
                  fontSize: '12px',
                  color: status.text,
                  fontWeight: 500,
                  fontFamily: '"Geist Mono"'
                }}>{status.label}</div>
                    </div>)}
                </div>

                <div style={{
              marginTop: '24px'
            }}>
                  <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                    <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: colors.textSecondary,
                  fontFamily: '"Geist Mono"'
                }}>DESTINATION COUNTRY</span>
                    <div style={{
                  flex: 1,
                  height: '1px',
                  backgroundColor: colors.border
                }} />
                  </div>
                  <div style={{
                padding: '8px 12px',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: colors.textSecondary,
                fontSize: '14px'
              }}>
                    Select Destination Country
                    <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/3480791f-e6f4-49eb-932d-ba59b86eb57f.svg" style={{
                  width: '16px'
                }} />
                  </div>
                </div>
              </div>
              <div style={{
            padding: '16px 24px',
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px'
          }}>
                <button onClick={() => setShowFilters(false)} style={{
              padding: '8px 16px',
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              background: 'transparent',
              color: colors.textPrimary,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}>Cancel</button>
                <button onClick={() => setShowFilters(false)} style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: '10px',
              background: 'rgba(12, 99, 248, 1)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: '0px 1px 2px rgba(14, 18, 27, 0.24)'
            }}>Apply filters</button>
              </div>
            </div>
          </div>}
          </>
        )}
      </main>

      {/* Listing Detail Side Drawer */}
      <AnimatePresence>
        {selectedListing && (
          <>
            {/* Backdrop */}
            <motion.div
              key="listing-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => setSelectedListing(null)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                zIndex: 40
              }}
            />

            {/* Drawer Panel */}
            <motion.div
              key="listing-drawer-panel"
              initial={{ x: '100%', opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.6 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: 'fixed',
                top: '16px',
                right: '16px',
                bottom: '16px',
                width: '480px',
                backgroundColor: colors.bg,
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0px 0px 0px 1px rgba(51,51,51,0.04), 0px 1px 1px 0.5px rgba(51,51,51,0.04), 0px 6px 6px -3px rgba(51,51,51,0.04), 0px 24px 24px -12px rgba(51,51,51,0.04), 0px 48px 48px -24px rgba(51,51,51,0.04)',
                borderRadius: '20px',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px',
                borderBottom: `1px solid ${colors.border}`,
                backgroundColor: colors.bg,
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                flexShrink: 0
              }}>
                {/* Left: Title + meta */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Property name row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Chevron Left */}
                    <button
                      onClick={() => {
                        const idx = filteredListingsData.indexOf(selectedListing);
                        if (idx > 0) setSelectedListing(filteredListingsData[idx - 1]);
                      }}
                      style={{
                        width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        background: colors.bg,
                        cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: '0px 1px 2px rgba(0,0,0,0.05)'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <span style={{ fontSize: '18px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedListing.propertyName}
                    </span>
                    {/* Chevron Right */}
                    <button
                      onClick={() => {
                        const idx = filteredListingsData.indexOf(selectedListing);
                        if (idx < filteredListingsData.length - 1) setSelectedListing(filteredListingsData[idx + 1]);
                      }}
                      style={{
                        width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        background: colors.bg,
                        cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: '0px 1px 2px rgba(0,0,0,0.05)'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                  {/* Meta: location + type */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span style={{ fontSize: '14px', fontWeight: 400, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>London, England, United Kingdom</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                      <span style={{ fontSize: '14px', fontWeight: 400, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>{selectedListing.type}</span>
                    </div>
                  </div>
                </div>

                {/* Right: badge + close + deactivate */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch', flexShrink: 0, gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Active badge */}
                    <div style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'rgba(22, 163, 74, 0.1)',
                      display: 'inline-flex', alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(22, 163, 74, 1)', fontFamily: '"Geist", sans-serif', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Active</span>
                    </div>
                    {/* Close */}
                    <button
                      onClick={() => setSelectedListing(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', color: colors.textPrimary }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                  {/* Deactivate button */}
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    background: colors.bg,
                    cursor: 'pointer',
                    boxShadow: '0px 1px 2px rgba(0,0,0,0.05)'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif' }}>Deactivate</span>
                  </button>
                </div>
              </div>

              {/* Scrollable content */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {/* COMMON AREA */}
                <div style={{ padding: '6px 20px', backgroundColor: colors.sidebarBg }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist Mono", sans-serif', textTransform: 'uppercase', letterSpacing: '0.48px' }}>Common Area</span>
                </div>
                <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.bg }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', fontWeight: 400, color: colors.textPrimary, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.084px' }}>Area Size</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>– –</span>
                  </div>
                </div>

                {/* ROOM 1 */}
                <div style={{ padding: '6px 20px', backgroundColor: colors.sidebarBg }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist Mono", sans-serif', textTransform: 'uppercase', letterSpacing: '0.48px' }}>Room 1</span>
                </div>
                <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.bg, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[['Bathroom', 'NO'], ['Private Room', 'NO']].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: 400, color: colors.textPrimary, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.084px' }}>{label}</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* BILLS INCLUDED */}
                <div style={{ padding: '6px 20px', backgroundColor: colors.sidebarBg }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist Mono", sans-serif', textTransform: 'uppercase', letterSpacing: '0.48px' }}>Bills Included</span>
                </div>
                <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.bg, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[['Internet or wifi', 'NO'], ['Water', 'NO'], ['Electricity', 'NO'], ['Gas', 'NO']].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: 400, color: colors.textPrimary, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.084px' }}>{label}</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* PRICE & AVAILABILITY */}
                <div style={{ padding: '6px 20px', backgroundColor: colors.sidebarBg }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist Mono", sans-serif', textTransform: 'uppercase', letterSpacing: '0.48px' }}>Price & Availability</span>
                </div>
                <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.bg, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[['Deposit', '$65'], ['Lease Duration', 'NO'], ['Available From', '02/7/2025'], ['Price', '£500/weekly']].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: 400, color: colors.textPrimary, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.084px' }}>{label}</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist Mono", sans-serif' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>;
};