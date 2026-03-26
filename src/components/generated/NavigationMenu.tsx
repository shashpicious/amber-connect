import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ChevronLeft, ChevronRight, ArrowRight, ChevronDown, Eye } from 'lucide-react';
interface NavigationMenuProps {
  initialMode?: 'light' | 'dark';
}
export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  initialMode = 'light'
}) => {
  console.log('NavigationMenu rendering...');
  const [activeTab, setActiveTab] = useState('Listings');
  const [isDarkMode, setIsDarkMode] = useState(initialMode === 'dark');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeNavigation, setActiveNavigation] = useState('Listings');
  const [currentPage, setCurrentPage] = useState(1);
  // campaignsPage state removed - now using calendar view
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
  const [listingsSortField, setListingsSortField] = useState<string>('');
  const [listingsSortDir, setListingsSortDir] = useState<'asc' | 'desc'>('asc');
  const [reviewsPage, setReviewsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const itemsPerPage = 10;
  const [settingsTab, setSettingsTab] = useState('Brand Identity');
  const [brandColor, setBrandColor] = useState('#015A57');
  const [redirectionLink, setRedirectionLink] = useState('');
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const [processingAnimationData, setProcessingAnimationData] = useState<any>(null);
  const [isScrambling, setIsScrambling] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editingAccountDetails, setEditingAccountDetails] = useState(false);
  const [editingAddressInfo, setEditingAddressInfo] = useState(false);
  const [teamsSearchQuery, setTeamsSearchQuery] = useState('');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamModalMember, setTeamModalMember] = useState<{ name: string; email: string; role: string } | null>(null);
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>(initialMode === 'dark' ? 'dark' : 'light');
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  // Set default tab to 'Bookings' when navigating to Bookings page
  useEffect(() => {
    if (activeNavigation === 'Bookings') {
      // Only set to 'Bookings' if currently on a different page's tab
      // This allows users to switch between 'Bookings' and 'Prequalified Leads' while on Bookings page
      if (activeTab !== 'Bookings' && activeTab !== 'Prequalified Bookings') {
        setActiveTab('Bookings');
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

  // Close profile menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

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
    { bg: 'rgba(255, 213, 179, 1)', text: 'rgba(154, 72, 10, 1)' },
    { bg: 'rgba(187, 247, 208, 1)', text: 'rgba(22, 101, 52, 1)' },
  ];
  const getAvatarColors = (index: number) => avatarColors[index % avatarColors.length];

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
    name: 'Insights',
    icon: '/assets/icon-insights.svg'
  }, {
    name: 'Listings',
    icon: '/assets/icon-listings.svg'
  }, {
    name: 'Bookings',
    icon: '/assets/icon-bookings.svg'
  }, {
    name: 'Invoices',
    icon: '/assets/icon-invoices.svg'
  }, {
    name: 'Reviews',
    icon: '/assets/icon-reviews.svg'
  }, {
    name: 'Campaigns',
    icon: '/assets/icon-campaigns.svg'
  }] as any[];
  const systemItems = [] as any[];
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
    { invoiceNumber: 'INV-2025-0379', invoiceDate: '03/04/2025', totalAmount: '$75.00', balance: '$75.00', dueDate: '03/04/2025', status: 'Paid' },
    { invoiceNumber: 'INV-2025-0570', invoiceDate: '03/04/2025', totalAmount: '$90.00', balance: '$150.00', dueDate: '03/04/2025', status: 'Overdue' },
    { invoiceNumber: 'INV-2025-0380', invoiceDate: '03/04/2025', totalAmount: '$125.00', balance: '$200.00', dueDate: '03/04/2025', status: 'Paid' },
    { invoiceNumber: 'INV-2025-0381', invoiceDate: '03/04/2025', totalAmount: '$45.00', balance: '$300.00', dueDate: '03/04/2025', status: 'Overdue' },
    { invoiceNumber: 'INV-2025-0382', invoiceDate: '03/04/2025', totalAmount: '$200.00', balance: '$450.00', dueDate: '03/04/2025', status: 'Overdue' },
    { invoiceNumber: 'INV-2025-0383', invoiceDate: '03/04/2025', totalAmount: '$60.00', balance: '$600.00', dueDate: '03/04/2025', status: 'Paid' },
    { invoiceNumber: 'INV-2025-0384', invoiceDate: '03/04/2025', totalAmount: '$50.00', balance: '$750.00', dueDate: '03/04/2025', status: 'Paid' },
    { invoiceNumber: 'INV-2025-0385', invoiceDate: '03/04/2025', totalAmount: '$30.00', balance: '$1000.00', dueDate: '03/04/2025', status: 'Overdue' },
    { invoiceNumber: 'INV-2025-0386', invoiceDate: '03/04/2025', totalAmount: '$110.00', balance: '$1200.00', dueDate: '03/04/2025', status: 'Paid' },
    { invoiceNumber: 'INV-2025-0387', invoiceDate: '03/04/2025', totalAmount: '$85.00', balance: '$1500.00', dueDate: '03/04/2025', status: 'Overdue' },
    { invoiceNumber: 'INV-2025-0388', invoiceDate: '03/04/2025', totalAmount: '$150.00', balance: '$1800.00', dueDate: '03/04/2025', status: 'Paid' },
    { invoiceNumber: 'INV-2025-0389', invoiceDate: '03/04/2025', totalAmount: '$95.00', balance: '$2000.00', dueDate: '03/04/2025', status: 'Paid' },
    { invoiceNumber: 'INV-2025-0390', invoiceDate: '03/04/2025', totalAmount: '$40.00', balance: '$2200.00', dueDate: '03/04/2025', status: 'Overdue' },
    { invoiceNumber: 'INV-2025-0391', invoiceDate: '03/04/2025', totalAmount: '$70.00', balance: '$2500.00', dueDate: '03/04/2025', status: 'Paid' },
    { invoiceNumber: 'INV-2025-0392', invoiceDate: '03/04/2025', totalAmount: '$55.00', balance: '$2800.00', dueDate: '03/04/2025', status: 'Overdue' },
    { invoiceNumber: 'INV-2025-0393', invoiceDate: '03/04/2025', totalAmount: '$120.00', balance: '$3000.00', dueDate: '03/04/2025', status: 'Paid' },
    { invoiceNumber: 'INV-2025-0394', invoiceDate: '03/04/2025', totalAmount: '$65.00', balance: '$3200.00', dueDate: '03/04/2025', status: 'Paid' },
    { invoiceNumber: 'INV-2025-0395', invoiceDate: '03/04/2025', totalAmount: '$80.00', balance: '$3500.00', dueDate: '03/04/2025', status: 'Overdue' },
    { invoiceNumber: 'INV-2025-0396', invoiceDate: '03/04/2025', totalAmount: '$100.00', balance: '$3800.00', dueDate: '03/04/2025', status: 'Paid' },
    { invoiceNumber: 'INV-2025-0397', invoiceDate: '03/04/2025', totalAmount: '$35.00', balance: '$4000.00', dueDate: '03/04/2025', status: 'Overdue' },
  ] as any[];

  // Reviews data
  const reviewsData = [
    { listing: 'Urbanest Tower Bridge, London 1', review: 'The surrounding and general culture of this place is amazing and inclusive which is why you really feel more like an extended family rather than just a regular student accommodation.', rating: 5, studentName: 'Patrick John', source: 'Google', date: '03/04/2025' },
    { listing: 'Chapter Spitalfields, London', review: 'Great location near the city centre with excellent transport links. The staff were always helpful and the communal areas were well maintained.', rating: 3, studentName: 'Sarah Mitchell', source: 'Facebook', date: '02/28/2025' },
    { listing: 'iQ Shoreditch, London', review: 'Modern facilities and a vibrant community. The rooftop terrace is a highlight. Only downside is the noise from the street on weekends.', rating: 4, studentName: 'James Chen', source: 'Ambassador', date: '02/15/2025' },
    { listing: 'Unite Students, Manchester', review: 'Decent value for money but the kitchen appliances could use an upgrade. The location is perfect for university though.', rating: 2, studentName: 'Emily Watson', source: 'Google', date: '03/01/2025' },
    { listing: 'Vita Student, Edinburgh', review: 'Absolutely loved my stay here. The gym and cinema room were fantastic perks. Would highly recommend to any incoming student.', rating: 5, studentName: 'Liam O\'Brien', source: 'Google', date: '01/22/2025' },
    { listing: 'CRM Students, Bristol', review: 'The room was spacious and clean. Internet speed was consistently good which was important for my coursework. Friendly neighbours too.', rating: 4, studentName: 'Aisha Patel', source: 'Facebook', date: '02/10/2025' },
    { listing: 'Collegiate AC, Birmingham', review: 'Mixed experience overall. The building itself is nice but maintenance requests took too long to resolve. Management could be more responsive.', rating: 3, studentName: 'Tom Richards', source: 'Ambassador', date: '03/08/2025' },
    { listing: 'Fresh Student Living, Leeds', review: 'Perfect for first year students. Made so many friends in the common areas. The weekly events organised by staff were a great touch.', rating: 5, studentName: 'Maria Gonzalez', source: 'Google', date: '01/30/2025' },
    { listing: 'Nido Student, Glasgow', review: 'The heating system was unreliable during winter months which was frustrating. Otherwise the flat was well designed and comfortable.', rating: 2, studentName: 'David Kim', source: 'Facebook', date: '02/05/2025' },
    { listing: 'Liberty Living, Nottingham', review: 'Excellent security and a real sense of community. The study rooms were always available when I needed them. Great value.', rating: 4, studentName: 'Rachel Adams', source: 'Google', date: '03/12/2025' },
    { listing: 'Urbanest Tower Bridge, London 1', review: 'Second year here and still loving it. The management team genuinely cares about residents. Laundry facilities are top notch.', rating: 5, studentName: 'Oliver Brown', source: 'Ambassador', date: '02/20/2025' },
    { listing: 'Chapter Spitalfields, London', review: 'A bit pricey compared to alternatives but the quality justifies it. The en-suite bathroom and weekly cleaning service are worth it.', rating: 4, studentName: 'Sophie Turner', source: 'Google', date: '01/15/2025' },
    { listing: 'iQ Shoreditch, London', review: 'Parking was a nightmare and the bike storage was always full. The flat itself was lovely though and I enjoyed living there.', rating: 3, studentName: 'Hassan Ali', source: 'Facebook', date: '03/05/2025' },
    { listing: 'Unite Students, Manchester', review: 'The welcome week activities helped me settle in quickly. Staff remembered my name which made it feel like home from day one.', rating: 5, studentName: 'Jessica Lee', source: 'Ambassador', date: '02/25/2025' },
    { listing: 'Vita Student, Edinburgh', review: 'Beautiful views from the upper floors. The all-inclusive bills made budgeting so much easier. Would definitely book again.', rating: 4, studentName: 'Nathan Clarke', source: 'Google', date: '01/28/2025' },
    { listing: 'CRM Students, Bristol', review: 'Had some issues with noisy neighbours but the RA handled it professionally. The location near the harbour is unbeatable.', rating: 3, studentName: 'Priya Sharma', source: 'Facebook', date: '03/10/2025' },
    { listing: 'Collegiate AC, Birmingham', review: 'The move-in process was seamless and well organised. Furniture quality is good and the mattress was surprisingly comfortable.', rating: 4, studentName: 'Daniel Wright', source: 'Google', date: '02/18/2025' },
    { listing: 'Fresh Student Living, Leeds', review: 'Wifi kept dropping during peak hours which was annoying for online lectures. Everything else about the accommodation was solid.', rating: 2, studentName: 'Chloe Martin', source: 'Ambassador', date: '01/20/2025' },
    { listing: 'Nido Student, Glasgow', review: 'Loved the modern design and the communal kitchen was huge. Met some of my best friends in the shared spaces here.', rating: 5, studentName: 'Ryan Taylor', source: 'Google', date: '03/02/2025' },
    { listing: 'Liberty Living, Nottingham', review: 'Good for the price point. Nothing fancy but everything works and the location is convenient for campus and the city centre.', rating: 3, studentName: 'Emma Wilson', source: 'Facebook', date: '02/12/2025' },
    { listing: 'Urbanest Tower Bridge, London 1', review: 'The concierge service is a nice premium touch. Package deliveries were always handled smoothly. Felt very safe living here.', rating: 5, studentName: 'Alex Thompson', source: 'Google', date: '01/25/2025' },
    { listing: 'Chapter Spitalfields, London', review: 'Fire alarms went off too frequently which was disruptive. Apart from that the accommodation exceeded my expectations.', rating: 3, studentName: 'Megan Davis', source: 'Ambassador', date: '03/15/2025' },
    { listing: 'iQ Shoreditch, London', review: 'The courtyard garden was a lovely surprise. Perfect for studying outdoors in warmer months. Staff organised great BBQ events.', rating: 4, studentName: 'Chris Evans', source: 'Google', date: '02/08/2025' },
    { listing: 'Unite Students, Manchester', review: 'Checkout process was stressful with unexpected charges. The living experience itself was fine but the admin side needs work.', rating: 2, studentName: 'Laura Hughes', source: 'Facebook', date: '01/18/2025' },
    { listing: 'Vita Student, Edinburgh', review: 'Premium student living at its finest. The private dining room booking system was a unique feature I really appreciated.', rating: 5, studentName: 'Ben Cooper', source: 'Ambassador', date: '03/07/2025' },
  ] as any[];

  // Bookings data
  const bookingsData = [
    { amberId: '48489984989', bookingId: '8W88994743', listing: 'Urbanest Tower Bridge, London 1', studentName: 'Patrick John', status: 'Cancelled', moveInDate: '03/04/2025', tenure: '42 Weeks' },
    { amberId: '48489984990', bookingId: '8W88994744', listing: 'Chapter Spitalfields, London', studentName: 'Sarah Mitchell', status: 'Confirmed', moveInDate: '03/10/2025', tenure: '36 Weeks' },
    { amberId: '48489984991', bookingId: '8W88994745', listing: 'iQ Shoreditch, London', studentName: 'James Chen', status: 'Processing', moveInDate: '04/01/2025', tenure: '52 Weeks' },
    { amberId: '48489984992', bookingId: '8W88994746', listing: 'Unite Students, Manchester', studentName: 'Emily Watson', status: 'Cancelled', moveInDate: '03/15/2025', tenure: '42 Weeks' },
    { amberId: '48489984993', bookingId: '8W88994747', listing: 'Vita Student, Edinburgh', studentName: 'Liam O\'Brien', status: 'Confirmed', moveInDate: '03/20/2025', tenure: '48 Weeks' },
    { amberId: '48489984994', bookingId: '8W88994748', listing: 'CRM Students, Bristol', studentName: 'Aisha Patel', status: 'Processing', moveInDate: '04/05/2025', tenure: '36 Weeks' },
    { amberId: '48489984995', bookingId: '8W88994749', listing: 'Collegiate AC, Birmingham', studentName: 'Tom Richards', status: 'Cancelled', moveInDate: '03/08/2025', tenure: '42 Weeks' },
    { amberId: '48489984996', bookingId: '8W88994750', listing: 'Fresh Student Living, Leeds', studentName: 'Maria Gonzalez', status: 'Confirmed', moveInDate: '03/25/2025', tenure: '52 Weeks' },
    { amberId: '48489984997', bookingId: '8W88994751', listing: 'Nido Student, Glasgow', studentName: 'David Kim', status: 'Cancelled', moveInDate: '03/12/2025', tenure: '36 Weeks' },
    { amberId: '48489984998', bookingId: '8W88994752', listing: 'Liberty Living, Nottingham', studentName: 'Rachel Adams', status: 'Confirmed', moveInDate: '04/10/2025', tenure: '48 Weeks' },
    { amberId: '48489984999', bookingId: '8W88994753', listing: 'Urbanest Tower Bridge, London 1', studentName: 'Oliver Brown', status: 'Processing', moveInDate: '03/18/2025', tenure: '42 Weeks' },
    { amberId: '48489985000', bookingId: '8W88994754', listing: 'Chapter Spitalfields, London', studentName: 'Sophie Turner', status: 'Cancelled', moveInDate: '03/22/2025', tenure: '36 Weeks' },
    { amberId: '48489985001', bookingId: '8W88994755', listing: 'iQ Shoreditch, London', studentName: 'Hassan Ali', status: 'Confirmed', moveInDate: '04/15/2025', tenure: '52 Weeks' },
    { amberId: '48489985002', bookingId: '8W88994756', listing: 'Unite Students, Manchester', studentName: 'Jessica Lee', status: 'Processing', moveInDate: '03/28/2025', tenure: '42 Weeks' },
    { amberId: '48489985003', bookingId: '8W88994757', listing: 'Vita Student, Edinburgh', studentName: 'Nathan Clarke', status: 'Confirmed', moveInDate: '04/02/2025', tenure: '48 Weeks' },
    { amberId: '48489985004', bookingId: '8W88994758', listing: 'CRM Students, Bristol', studentName: 'Priya Sharma', status: 'Cancelled', moveInDate: '03/05/2025', tenure: '36 Weeks' },
    { amberId: '48489985005', bookingId: '8W88994759', listing: 'Collegiate AC, Birmingham', studentName: 'Daniel Wright', status: 'Confirmed', moveInDate: '04/08/2025', tenure: '42 Weeks' },
    { amberId: '48489985006', bookingId: '8W88994760', listing: 'Fresh Student Living, Leeds', studentName: 'Chloe Martin', status: 'Processing', moveInDate: '03/30/2025', tenure: '52 Weeks' },
    { amberId: '48489985007', bookingId: '8W88994761', listing: 'Nido Student, Glasgow', studentName: 'Ryan Taylor', status: 'Cancelled', moveInDate: '03/14/2025', tenure: '36 Weeks' },
    { amberId: '48489985008', bookingId: '8W88994762', listing: 'Liberty Living, Nottingham', studentName: 'Emma Wilson', status: 'Confirmed', moveInDate: '04/12/2025', tenure: '48 Weeks' },
    { amberId: '48489985009', bookingId: '8W88994763', listing: 'Urbanest Tower Bridge, London 1', studentName: 'Alex Thompson', status: 'Processing', moveInDate: '03/16/2025', tenure: '42 Weeks' },
    { amberId: '48489985010', bookingId: '8W88994764', listing: 'Chapter Spitalfields, London', studentName: 'Megan Davis', status: 'Confirmed', moveInDate: '04/18/2025', tenure: '36 Weeks' },
    { amberId: '48489985011', bookingId: '8W88994765', listing: 'iQ Shoreditch, London', studentName: 'Chris Evans', status: 'Cancelled', moveInDate: '03/09/2025', tenure: '52 Weeks' },
    { amberId: '48489985012', bookingId: '8W88994766', listing: 'Unite Students, Manchester', studentName: 'Laura Hughes', status: 'Processing', moveInDate: '04/20/2025', tenure: '42 Weeks' },
    { amberId: '48489985013', bookingId: '8W88994767', listing: 'Vita Student, Edinburgh', studentName: 'Ben Cooper', status: 'Confirmed', moveInDate: '03/26/2025', tenure: '48 Weeks' },
  ] as any[];

  // Campaigns calendar state
  const [campaignCalendarMonth, setCampaignCalendarMonth] = useState(9); // October (0-indexed)
  const [campaignCalendarYear, setCampaignCalendarYear] = useState(2024);
  const [campaignCityFilter, setCampaignCityFilter] = useState('London');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(new Date(2024, 9, 22)); // Oct 22

  const campaignCities = ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Dublin'];

  // Campaign calendar events — per-day events with time (Untitled UI style)
  interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    time: string;
    color: 'blue' | 'orange' | 'pink' | 'green' | 'purple' | 'brand' | 'yellow' | 'indigo' | 'grey';
    dot?: boolean;
  }

  const campaignCalendarEvents: CalendarEvent[] = [
    { id: '1', title: 'Targeted Reach', date: new Date(2024, 9, 1), time: '9:00 am', color: 'blue' },
    { id: '2', title: 'Property of the Day', date: new Date(2024, 9, 1), time: '2:00 pm', color: 'orange' },
    { id: '3', title: 'Amber Exclusive', date: new Date(2024, 9, 3), time: '10:00 am', color: 'purple' },
    { id: '4', title: 'UCAS Result', date: new Date(2024, 9, 3), time: '3:00 pm', color: 'grey' },
    { id: '5', title: 'Property of the Day', date: new Date(2024, 9, 8), time: '9:00 am', color: 'orange' },
    { id: '6', title: 'Social Media Kit', date: new Date(2024, 9, 8), time: '11:30 am', color: 'pink' },
    { id: '7', title: 'Amber Exclusive', date: new Date(2024, 9, 8), time: '2:00 pm', color: 'purple' },
    { id: '8', title: 'Design sync', date: new Date(2024, 9, 8), time: '4:00 pm', color: 'green' },
    { id: '9', title: 'Social Media Kit', date: new Date(2024, 9, 14), time: '10:00 am', color: 'blue' },
    { id: '10', title: 'Amber Exclusive', date: new Date(2024, 9, 15), time: '2:30 pm', color: 'purple' },
    { id: '11', title: 'Property of the Day', date: new Date(2024, 9, 21), time: '9:00 am', color: 'orange' },
    { id: '12', title: 'Deep work', date: new Date(2024, 9, 22), time: '2:30 pm', color: 'blue' },
    { id: '13', title: 'One-on-one w/...', date: new Date(2024, 9, 22), time: '3:30 pm', color: 'pink' },
    { id: '14', title: 'Campaign review', date: new Date(2024, 9, 22), time: '4:00 pm', color: 'green' },
    { id: '15', title: 'Lunch with Oli...', date: new Date(2024, 9, 23), time: '5:30 pm', color: 'green', dot: true },
    { id: '16', title: 'Friday standup', date: new Date(2024, 9, 24), time: '2:30 pm', color: 'grey' },
    { id: '17', title: 'Olivia x Riley', date: new Date(2024, 9, 24), time: '3:30 pm', color: 'pink' },
    { id: '18', title: 'Product demo', date: new Date(2024, 9, 24), time: '7:00 pm', color: 'purple' },
    { id: '19', title: 'House inspec...', date: new Date(2024, 9, 25), time: '4:30 pm', color: 'yellow' },
    { id: '20', title: "Ava's engag...", date: new Date(2024, 9, 26), time: '6:30 pm', color: 'pink', dot: true },
    { id: '21', title: 'Monday stan...', date: new Date(2024, 9, 27), time: '2:30 pm', color: 'grey' },
    { id: '22', title: 'Content plan...', date: new Date(2024, 9, 27), time: '4:30 pm', color: 'green' },
    { id: '23', title: 'Product demo', date: new Date(2024, 9, 28), time: '4:00 pm', color: 'purple' },
    { id: '24', title: 'Catch up w/...', date: new Date(2024, 9, 28), time: '8:00 pm', color: 'orange' },
  ];

  // Multi-day campaigns (spanning bars)
  interface CalendarCampaign {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    color: 'blue' | 'orange' | 'pink' | 'green' | 'purple' | 'brand' | 'yellow' | 'indigo' | 'grey';
  }

  const calendarCampaigns: CalendarCampaign[] = [
    { id: 'c1', title: 'Targeted Reach', startDate: new Date(2024, 8, 29), endDate: new Date(2024, 9, 2), color: 'blue' },
    { id: 'c2', title: 'Property of the Day', startDate: new Date(2024, 9, 1), endDate: new Date(2024, 9, 4), color: 'orange' },
    { id: 'c3', title: 'Amber Exclusive', startDate: new Date(2024, 8, 30), endDate: new Date(2024, 9, 5), color: 'purple' },
    { id: 'c4', title: 'Property of the Day', startDate: new Date(2024, 9, 8), endDate: new Date(2024, 9, 11), color: 'orange' },
    { id: 'c5', title: 'Social Media Kit', startDate: new Date(2024, 9, 8), endDate: new Date(2024, 9, 10), color: 'pink' },
    { id: 'c6', title: 'Amber Exclusive', startDate: new Date(2024, 9, 8), endDate: new Date(2024, 9, 12), color: 'purple' },
    { id: 'c7', title: 'Social Media Kit', startDate: new Date(2024, 9, 13), endDate: new Date(2024, 9, 16), color: 'blue' },
    { id: 'c8', title: 'Amber Exclusive', startDate: new Date(2024, 9, 20), endDate: new Date(2024, 9, 26), color: 'purple' },
    { id: 'c9', title: 'Property of the day', startDate: new Date(2024, 9, 22), endDate: new Date(2024, 9, 25), color: 'blue' },
    { id: 'c10', title: 'Property of the Day', startDate: new Date(2024, 9, 27), endDate: new Date(2024, 9, 30), color: 'orange' },
  ];

  // Get campaigns that overlap with a given week
  const getCampaignsForWeek = (weekDays: { day: number; isCurrentMonth: boolean; date: Date }[]) => {
    const weekStart = new Date(weekDays[0].date.getFullYear(), weekDays[0].date.getMonth(), weekDays[0].date.getDate());
    const weekEnd = new Date(weekDays[6].date.getFullYear(), weekDays[6].date.getMonth(), weekDays[6].date.getDate());

    const result: { campaign: CalendarCampaign; startCol: number; endCol: number }[] = [];
    calendarCampaigns.forEach(campaign => {
      const cStart = new Date(campaign.startDate.getFullYear(), campaign.startDate.getMonth(), campaign.startDate.getDate());
      const cEnd = new Date(campaign.endDate.getFullYear(), campaign.endDate.getMonth(), campaign.endDate.getDate());

      if (cEnd < weekStart || cStart > weekEnd) return;

      let startCol = 0;
      let endCol = 6;

      for (let i = 0; i < 7; i++) {
        const d = new Date(weekDays[i].date.getFullYear(), weekDays[i].date.getMonth(), weekDays[i].date.getDate());
        if (d.getTime() === cStart.getTime() || (i === 0 && cStart < weekStart)) {
          startCol = i;
        }
      }
      for (let i = 6; i >= 0; i--) {
        const d = new Date(weekDays[i].date.getFullYear(), weekDays[i].date.getMonth(), weekDays[i].date.getDate());
        if (d.getTime() === cEnd.getTime() || (i === 6 && cEnd > weekEnd)) {
          endCol = i;
        }
      }

      // Recalculate properly
      startCol = -1;
      endCol = -1;
      for (let i = 0; i < 7; i++) {
        const d = new Date(weekDays[i].date.getFullYear(), weekDays[i].date.getMonth(), weekDays[i].date.getDate());
        if (d >= cStart && d <= cEnd) {
          if (startCol === -1) startCol = i;
          endCol = i;
        }
      }
      if (startCol !== -1) {
        result.push({ campaign, startCol, endCol });
      }
    });
    return result;
  };

  // Assign rows to spanning campaigns (avoid overlaps)
  const layoutCampaignRows = (campaigns: { campaign: CalendarCampaign; startCol: number; endCol: number }[]) => {
    const rows: { campaign: CalendarCampaign; startCol: number; endCol: number; row: number }[] = [];
    campaigns.forEach(c => {
      let row = 0;
      while (true) {
        const conflict = rows.some(r => r.row === row && !(c.endCol < r.startCol || c.startCol > r.endCol));
        if (!conflict) break;
        row++;
      }
      rows.push({ ...c, row });
    });
    return rows;
  };

  // Campaign type list for sidebar
  const campaignTypes = [
    { name: 'Property of the day', duration: '3 Days', icon: '✅', iconColor: '#22c55e' },
    { name: "Student's Choice", duration: '30 Days', icon: '✅', iconColor: '#22c55e' },
    { name: 'Tik Tok Video', duration: '1 Day', icon: '🎵', iconColor: '#000' },
    { name: 'WhatsApp Campaign', duration: '1 Day', icon: '💬', iconColor: '#25d366' },
  ];

  // Calendar helper functions
  const calendarMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const calendarMonthShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const getCalendarDays = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    // Untitled UI starts on Monday
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      days.push({ day: d, isCurrentMonth: false, date: new Date(year, month - 1, d) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }
    const remaining = Math.ceil(days.length / 7) * 7 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return campaignCalendarEvents.filter(event => {
      return event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear();
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const navigateCalendarMonth = (direction: number) => {
    let newMonth = campaignCalendarMonth + direction;
    let newYear = campaignCalendarYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setCampaignCalendarMonth(newMonth);
    setCampaignCalendarYear(newYear);
  };

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  // Navigate based on view mode
  const navigateCalendar = (direction: number) => {
    if (calendarViewMode === 'month') {
      navigateCalendarMonth(direction);
    } else if (calendarViewMode === 'week') {
      const newDate = new Date(calendarSelectedDate);
      newDate.setDate(newDate.getDate() + direction * 7);
      setCalendarSelectedDate(newDate);
      setCampaignCalendarMonth(newDate.getMonth());
      setCampaignCalendarYear(newDate.getFullYear());
    } else {
      const newDate = new Date(calendarSelectedDate);
      newDate.setDate(newDate.getDate() + direction);
      setCalendarSelectedDate(newDate);
      setCampaignCalendarMonth(newDate.getMonth());
      setCampaignCalendarYear(newDate.getFullYear());
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCampaignCalendarMonth(today.getMonth());
    setCampaignCalendarYear(today.getFullYear());
    setCalendarSelectedDate(today);
  };

  // Get the week (Mon-Sun) containing the selected date
  const getWeekDays = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday start
    const monday = new Date(d);
    monday.setDate(d.getDate() + diff);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dd = new Date(monday);
      dd.setDate(monday.getDate() + i);
      days.push(dd);
    }
    return days;
  };

  // Parse time string to hour number for positioning in week/day views
  const parseTimeToHour = (time: string): number => {
    const match = time.match(/(\d+):(\d+)\s*(am|pm)/i);
    if (!match) return 12;
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const period = match[3].toLowerCase();
    if (period === 'pm' && h !== 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    return h + m / 60;
  };

  // Hours array for week/day time grid
  const calendarHours = Array.from({ length: 14 }, (_, i) => i + 7); // 7am to 8pm

  // Get header subtitle based on view
  const getCalendarSubtitle = () => {
    if (calendarViewMode === 'month') {
      return `1 ${calendarMonthNames[campaignCalendarMonth].slice(0, 3)} ${campaignCalendarYear} – ${new Date(campaignCalendarYear, campaignCalendarMonth + 1, 0).getDate()} ${calendarMonthNames[campaignCalendarMonth].slice(0, 3)} ${campaignCalendarYear}`;
    } else if (calendarViewMode === 'week') {
      const weekDays = getWeekDays(calendarSelectedDate);
      const start = weekDays[0];
      const end = weekDays[6];
      return `${start.getDate()} ${calendarMonthNames[start.getMonth()].slice(0, 3)} ${start.getFullYear()} – ${end.getDate()} ${calendarMonthNames[end.getMonth()].slice(0, 3)} ${end.getFullYear()}`;
    } else {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return dayNames[calendarSelectedDate.getDay()];
    }
  };

  const formatHour = (h: number) => {
    if (h === 0) return '12 am';
    if (h < 12) return `${h} am`;
    if (h === 12) return '12 pm';
    return `${h - 12} pm`;
  };

  // Event color tokens via CSS variables (themeable light/dark)
  const getEventColorStyles = (color: string) => {
    const c = ['blue','orange','pink','green','purple','brand','yellow','indigo','grey'].includes(color) ? color : 'blue';
    return {
      bg: `var(--event-${c}-bg)`,
      border: `var(--event-${c}-border)`,
      text: `var(--event-${c}-text)`,
      time: `var(--event-${c}-time)`,
    };
  };
  
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
  
  // Campaigns pagination removed - now using calendar view

  // Filter Listings data
  const filteredListingsData = listingsData.filter((item: any) => {
    if (listingsSearchQuery && !item.invoiceNumber.toLowerCase().includes(listingsSearchQuery.toLowerCase())) return false;
    if (listingsProviderFilter && item.status !== listingsProviderFilter) return false;
    return true;
  });

  // Sort listings data
  const sortedListingsData = [...filteredListingsData].sort((a: any, b: any) => {
    if (!listingsSortField) return 0;
    let valA = a[listingsSortField];
    let valB = b[listingsSortField];
    if (listingsSortField === 'totalAmount' || listingsSortField === 'balance') {
      valA = parseFloat(valA.replace(/[^0-9.]/g, ''));
      valB = parseFloat(valB.replace(/[^0-9.]/g, ''));
    }
    if (valA < valB) return listingsSortDir === 'asc' ? -1 : 1;
    if (valA > valB) return listingsSortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleListingsSort = (field: string) => {
    if (listingsSortField === field) {
      setListingsSortDir(listingsSortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setListingsSortField(field);
      setListingsSortDir('asc');
    }
    setListingsPage(1);
  };

  // Listings pagination logic
  const listingsTotalItems = sortedListingsData.length;
  const listingsTotalPages = Math.ceil(listingsTotalItems / itemsPerPage);
  const listingsStartIndex = (listingsPage - 1) * itemsPerPage;
  const listingsEndIndex = listingsStartIndex + itemsPerPage;
  const currentListingsData = sortedListingsData.slice(listingsStartIndex, listingsEndIndex);
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
  const listingsProviders = Array.from(new Set(listingsData.map((d: any) => d.status)));

  // Reviews pagination logic
  const reviewsTotalItems = reviewsData.length;
  const reviewsTotalPages = Math.ceil(reviewsTotalItems / itemsPerPage);
  const reviewsStartIndex = (reviewsPage - 1) * itemsPerPage;
  const reviewsEndIndex = reviewsStartIndex + itemsPerPage;
  const currentReviewsData = reviewsData.slice(reviewsStartIndex, reviewsEndIndex);
  const reviewsStartItem = reviewsStartIndex + 1;
  const reviewsEndItem = Math.min(reviewsEndIndex, reviewsTotalItems);
  const handleReviewsPrevious = () => { if (reviewsPage > 1) setReviewsPage(reviewsPage - 1); };
  const handleReviewsNext = () => { if (reviewsPage < reviewsTotalPages) setReviewsPage(reviewsPage + 1); };
  const handleReviewsPageClick = (page: number) => { if (page !== -1) setReviewsPage(page); };
  const getReviewsPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 4;
    if (reviewsTotalPages <= maxVisible) { for (let i = 1; i <= reviewsTotalPages; i++) pages.push(i); }
    else {
      if (reviewsPage <= 2) { for (let i = 1; i <= 3; i++) pages.push(i); pages.push(-1); pages.push(reviewsTotalPages); }
      else if (reviewsPage >= reviewsTotalPages - 1) { pages.push(1); pages.push(-1); for (let i = reviewsTotalPages - 2; i <= reviewsTotalPages; i++) pages.push(i); }
      else { pages.push(1); pages.push(-1); pages.push(reviewsPage - 1); pages.push(reviewsPage); pages.push(reviewsPage + 1); pages.push(-1); pages.push(reviewsTotalPages); }
    }
    return pages;
  };

  // Bookings pagination logic
  const bookingsTotalItems = bookingsData.length;
  const bookingsTotalPages = Math.ceil(bookingsTotalItems / itemsPerPage);
  const bookingsStartIndex = (bookingsPage - 1) * itemsPerPage;
  const bookingsEndIndex = bookingsStartIndex + itemsPerPage;
  const currentBookingsData = bookingsData.slice(bookingsStartIndex, bookingsEndIndex);
  const bookingsStartItem = bookingsStartIndex + 1;
  const bookingsEndItem = Math.min(bookingsEndIndex, bookingsTotalItems);
  const handleBookingsPrevious = () => { if (bookingsPage > 1) setBookingsPage(bookingsPage - 1); };
  const handleBookingsNext = () => { if (bookingsPage < bookingsTotalPages) setBookingsPage(bookingsPage + 1); };
  const handleBookingsPageClick = (page: number) => { if (page !== -1) setBookingsPage(page); };
  const getBookingsPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 4;
    if (bookingsTotalPages <= maxVisible) { for (let i = 1; i <= bookingsTotalPages; i++) pages.push(i); }
    else {
      if (bookingsPage <= 2) { for (let i = 1; i <= 3; i++) pages.push(i); pages.push(-1); pages.push(bookingsTotalPages); }
      else if (bookingsPage >= bookingsTotalPages - 1) { pages.push(1); pages.push(-1); for (let i = bookingsTotalPages - 2; i <= bookingsTotalPages; i++) pages.push(i); }
      else { pages.push(1); pages.push(-1); pages.push(bookingsPage - 1); pages.push(bookingsPage); pages.push(bookingsPage + 1); pages.push(-1); pages.push(bookingsTotalPages); }
    }
    return pages;
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      i < count
        ? <img key={i} src="/assets/star group.svg" alt="★" style={{ width: '16px', height: '16px' }} />
        : <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.border} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
    ));
  };

  const getStatusBadge = (status: string) => {
    let bgColor = 'rgba(227, 146, 25, 0.1)';
    let textColor = 'rgba(217, 119, 6, 1)';
    if (status === 'Booked' || status === 'Paid' || status === 'Active' || status === 'Confirmed') {
      bgColor = 'rgba(22, 163, 74, 0.1)';
      textColor = 'rgba(22, 163, 74, 1)';
    } else if (status === 'Not Booked' || status === 'Unpaid' || status === 'Inactive' || status === 'Overdue' || status === 'Cancelled') {
      bgColor = 'rgba(224, 52, 52, 0.1)';
      textColor = 'rgba(220, 38, 38, 1)';
    } else if (status === 'Partially_paid' || status === 'Processing') {
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
                src="/assets/AmberConnect.png"
                alt="Amber Connect Logo"
                style={{ width: '150px', height: 'auto' }}
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
                    height: '16px',
                    objectFit: 'contain',
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
          <div
            onClick={() => setShowProfileMenu(prev => !prev)}
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '8px',
            padding: '8px',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: showProfileMenu
              ? (isDarkMode ? 'rgba(39, 39, 42, 1)' : 'rgba(244, 244, 245, 1)')
              : 'transparent',
            transition: 'background-color 0.15s ease'
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

      {/* Profile Menu Popup */}
      <AnimatePresence>
        {showProfileMenu && (
          <motion.div
            ref={profileMenuRef}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              bottom: '60px',
              left: '8px',
              width: '240px',
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'white',
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)',
              zIndex: 100,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '12px',
              backgroundColor: isDarkMode ? 'rgba(39, 39, 42, 1)' : 'rgba(245, 245, 245, 1)',
              borderBottom: `1px solid ${colors.border}`,
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                <img src="/assets/profile-shashpicious.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '20px' }}>shashpicious</div>
                <div style={{ fontSize: '12px', fontWeight: 300, color: colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '16px' }}>png.shashi@gmail.com</div>
              </div>
            </div>

            {/* Top Menu Items */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => { setShowProfileMenu(false); setActiveNavigation('AccountDetails'); }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5.5" r="2.5" stroke={colors.textPrimary} strokeWidth="1.3" />
                  <path d="M2.5 13.5C2.5 11.015 5.015 9 8 9s5.5 2.015 5.5 4.5" stroke={colors.textPrimary} strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Account Details</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => { setShowProfileMenu(false); setActiveNavigation('Teams'); }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="5.5" cy="5" r="2" stroke={colors.textPrimary} strokeWidth="1.3" />
                  <circle cx="10.5" cy="5" r="2" stroke={colors.textPrimary} strokeWidth="1.3" />
                  <path d="M1 13.5c0-2.209 2.015-4 4.5-4M15 13.5c0-2.209-2.015-4-4.5-4M8 13.5c0-2.209 1.119-4 2.5-4" stroke={colors.textPrimary} strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Teams</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M9 2h5v5M14 2L8 8M6.5 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9.5" stroke={colors.textPrimary} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Visit amber student</span>
              </div>
            </div>

            {/* Separator */}
            <div style={{ height: '1px', backgroundColor: colors.border }} />

            {/* Bottom Menu Items */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="#EF4444" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Log Out</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="3" stroke={colors.textPrimary} strokeWidth="1.3" />
                    <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke={colors.textPrimary} strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Theme</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: isDarkMode ? 'rgba(39, 39, 42, 1)' : 'rgba(245, 245, 245, 1)',
                  borderRadius: '10px',
                  padding: '3px',
                  gap: '1px'
                }}>
                  {/* Light */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsDarkMode(false); setThemePreference('light'); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '28px', height: '24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      backgroundColor: themePreference === 'light' ? (isDarkMode ? 'rgba(10,10,10,1)' : 'white') : 'transparent',
                      boxShadow: themePreference === 'light' ? '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="3" stroke={colors.textPrimary} strokeWidth="1.4" />
                      <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.05 1.05M11.55 11.55l1.05 1.05M3.4 12.6l1.05-1.05M11.55 4.45l1.05-1.05" stroke={colors.textPrimary} strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </button>
                  {/* Dark */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsDarkMode(true); setThemePreference('dark'); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '28px', height: '24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      backgroundColor: themePreference === 'dark' ? (isDarkMode ? 'rgba(10,10,10,1)' : 'white') : 'transparent',
                      boxShadow: themePreference === 'dark' ? '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M13.5 9.5A6 6 0 016.5 2.5a6.5 6.5 0 107 7z" stroke={colors.textPrimary} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {/* System */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setThemePreference('system'); setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '28px', height: '24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      backgroundColor: themePreference === 'system' ? (isDarkMode ? 'rgba(10,10,10,1)' : 'white') : 'transparent',
                      boxShadow: themePreference === 'system' ? '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <rect x="1.5" y="2" width="13" height="9" rx="1.5" stroke={colors.textPrimary} strokeWidth="1.4" />
                      <path d="M5.5 14h5M8 11v3" stroke={colors.textPrimary} strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          minWidth: 0
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

            {/* Listings Stats Banner */}
            <div style={{
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'stretch',
              backgroundColor: colors.bg,
              borderBottom: `1px solid ${colors.border}`,
            }}>
              {/* Stat 1: Total Amount Pending */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>Total Amount Pending</span>
                  <span style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', lineHeight: '28px' }}>$33,474</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>-3.2%</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 6L6 14M6 14H11M6 14V9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ height: '4px', borderRadius: '1.5px', backgroundColor: '#9333ea', width: '100%' }} />
              </div>

              {/* Divider 1 */}
              <div style={{ width: '1px', alignSelf: 'stretch', borderLeft: `1px dashed ${colors.border}`, margin: '0 24px' }} />

              {/* Stat 2: Total Invoices Pending */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>Total Invoices Pending</span>
                  <span style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', lineHeight: '28px' }}>12</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>-6.4%</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 6L6 14M6 14H11M6 14V9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ height: '4px', borderRadius: '1.5px', backgroundColor: '#22d3ee', width: '100%' }} />
              </div>

              {/* Divider 2 */}
              <div style={{ width: '1px', alignSelf: 'stretch', borderLeft: `1px dashed ${colors.border}`, margin: '0 24px' }} />

              {/* Stat 3: Total Amount Overdue */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>Total Amount Overdue</span>
                  <span style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', lineHeight: '28px' }}>$3,474</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>+0.8%</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 14L14 6M14 6H9M14 6V11" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ height: '4px', borderRadius: '1.5px', backgroundColor: '#9333ea', width: '100%' }} />
              </div>

              {/* Divider 3 */}
              <div style={{ width: '1px', alignSelf: 'stretch', borderLeft: `1px dashed ${colors.border}`, margin: '0 24px' }} />

              {/* Stat 4: Total Invoices Overdue */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>Total Invoices Overdue</span>
                  <span style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', lineHeight: '28px' }}>08</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>-3.2%</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 6L6 14M6 14H11M6 14V9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ height: '4px', borderRadius: '1.5px', backgroundColor: '#22d3ee', width: '100%' }} />
              </div>
            </div>

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
                  placeholder="Invoice Number"
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
                    <option value="">Invoice Date</option>
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
                    <option value="">Due Date</option>
                  </select>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '16px', pointerEvents: 'none' }} />
                </div>
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
                      minWidth: '130px'
                    }}
                  >
                    <option value="">Status</option>
                    {listingsProviders.map((p: any) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
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
                      <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Invoice Number</th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}`, cursor: 'pointer' }} onClick={() => handleListingsSort('invoiceDate')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Invoice Date <svg width="12" height="12" viewBox="0 0 13.5 12.1667" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 8.75L10.0833 11.4167M10.0833 11.4167L7.41667 8.75M10.0833 11.4167V0.75M0.75 3.41667L3.41667 0.75M3.41667 0.75L6.08333 3.41667M3.41667 0.75V11.4167" stroke={colors.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span></th>
                      <th style={{ padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}`, cursor: 'pointer' }} onClick={() => handleListingsSort('totalAmount')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Total Amount <svg width="12" height="12" viewBox="0 0 13.5 12.1667" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 8.75L10.0833 11.4167M10.0833 11.4167L7.41667 8.75M10.0833 11.4167V0.75M0.75 3.41667L3.41667 0.75M3.41667 0.75L6.08333 3.41667M3.41667 0.75V11.4167" stroke={colors.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span></th>
                      <th style={{ padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}`, cursor: 'pointer' }} onClick={() => handleListingsSort('balance')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Balance <svg width="12" height="12" viewBox="0 0 13.5 12.1667" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 8.75L10.0833 11.4167M10.0833 11.4167L7.41667 8.75M10.0833 11.4167V0.75M0.75 3.41667L3.41667 0.75M3.41667 0.75L6.08333 3.41667M3.41667 0.75V11.4167" stroke={colors.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span></th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}`, cursor: 'pointer' }} onClick={() => handleListingsSort('dueDate')}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Due Date <svg width="12" height="12" viewBox="0 0 13.5 12.1667" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 8.75L10.0833 11.4167M10.0833 11.4167L7.41667 8.75M10.0833 11.4167V0.75M0.75 3.41667L3.41667 0.75M3.41667 0.75L6.08333 3.41667M3.41667 0.75V11.4167" stroke={colors.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span></th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Status</th>
                      <th style={{ width: '140px', padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Actions</th>
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
                        <td style={{ padding: '0 16px', fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif' }}>{item.invoiceNumber}</td>
                        <td style={{ padding: '8px 8px', fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist Mono"' }}>{item.invoiceDate}</td>
                        <td style={{ padding: '0 8px', fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif', textAlign: 'center' }}>{item.totalAmount}</td>
                        <td style={{ padding: '0 8px', fontSize: '14px', fontWeight: 400, color: colors.textPrimary, fontFamily: '"Geist", sans-serif', textAlign: 'center' }}>{item.balance}</td>
                        <td style={{ padding: '8px 8px', fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist Mono"' }}>{item.dueDate}</td>
                        <td style={{ padding: '0 8px' }}>{getStatusBadge(item.status)}</td>
                        <td style={{ padding: '0 8px', textAlign: 'center' }}>
                          <button
                            onClick={() => { playClickSound(); }}
                            style={{
                              padding: '4px 12px',
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
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            Download
                          </button>
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
        ) : activeNavigation === 'Invoices' ? (
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
                  }}>Invoices</span>
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
        ) : activeNavigation === 'Campaigns' ? (
          <>
            <PageSection pageKey="Campaigns">
            {/* Campaigns Calendar — Untitled UI */}
            <div className="flex flex-1 overflow-hidden min-w-0 max-w-full font-sans antialiased h-full">
              {/* Left: Calendar */}
              <div className="flex flex-1 flex-col overflow-hidden bg-background min-w-0">
                {/* Header bar */}
                <div className="flex items-center justify-between h-14 px-6 border-b border-border shrink-0">
                  {/* Left: Page title with city dropdown */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-semibold text-foreground tracking-tight">Campaigns in</span>
                    <Select value={campaignCityFilter} onValueChange={(value) => setCampaignCityFilter(value)}>
                      <SelectTrigger className="border-none shadow-none text-lg font-semibold text-blue-600 gap-1 px-1 h-auto focus-visible:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignCities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Right: month + controls */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground" style={{ fontFamily: '"Geist Mono", monospace' }}>
                      {calendarMonthNames[campaignCalendarMonth]} {campaignCalendarYear}
                    </span>
                    {/* Nav: < Today > */}
                    <div className="flex">
                      <Button variant="outline" size="icon" onClick={() => navigateCalendar(-1)} className="rounded-r-none">
                        <ChevronLeft className="size-5" />
                      </Button>
                      <Button variant="outline" onClick={goToToday} className="rounded-none border-x-0 px-4 font-semibold">
                        Today
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => navigateCalendar(1)} className="rounded-l-none">
                        <ChevronRight className="size-5" />
                      </Button>
                    </div>

                    {/* View mode dropdown */}
                    <Select value={calendarViewMode} onValueChange={(value: 'month' | 'week' | 'day') => setCalendarViewMode(value)}>
                      <SelectTrigger className="w-[140px] font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Month view</SelectItem>
                        <SelectItem value="week">Week view</SelectItem>
                        <SelectItem value="day">Day view</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      className="rounded-[10px] font-medium text-sm text-white tracking-[-0.084px] border border-white/12 shadow-[0px_1px_2px_0px_rgba(14,18,27,0.24),0px_0px_0px_1px_var(--cta-primary-ring)] hover:brightness-110"
                      style={{ backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 100%), linear-gradient(90deg, var(--cta-primary) 0%, var(--cta-primary) 100%)' }}
                    >
                      <Plus className="size-5" />
                      Add event
                    </Button>
                  </div>
                </div>

                {/* ========== MONTH VIEW ========== */}
                {calendarViewMode === 'month' && (
                  <>
                    <div className="grid grid-cols-7 border-b border-border shrink-0 bg-muted">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                        <div key={day} className="py-2.5 text-xs font-medium text-muted-foreground text-center uppercase tracking-widest" style={{
                          borderRight: i < 6 ? '1px solid var(--color-border)' : 'none',
                          fontFamily: '"Geist Mono", monospace'
                        }}>{day}</div>
                      ))}
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      {(() => {
                        const allDays = getCalendarDays(campaignCalendarMonth, campaignCalendarYear);
                        const totalWeeks = Math.ceil(allDays.length / 7);
                        return Array.from({ length: totalWeeks }).map((_, weekIndex) => {
                          const weekDays = allDays.slice(weekIndex * 7, (weekIndex + 1) * 7);
                          return (
                            <div key={weekIndex} className="grid grid-cols-7 border-b border-border flex-1 min-h-0">
                              {weekDays.map((dayInfo, colIdx) => {
                                const today = isToday(dayInfo.date);
                                const dayEvents = getEventsForDate(dayInfo.date);
                                const maxShow = 3;
                                const visibleEvents = dayEvents.slice(0, maxShow);
                                const moreCount = dayEvents.length - maxShow;
                                return (
                                  <div key={colIdx} onClick={() => { setCalendarSelectedDate(dayInfo.date); setCalendarViewMode('day'); }} className="flex flex-col cursor-pointer overflow-hidden min-w-0 p-1 bg-background" style={{
                                    borderRight: colIdx < 6 ? '1px solid var(--color-border)' : 'none'
                                  }}>
                                    {/* Day number */}
                                    <div className="px-1 pt-0.5 pb-1.5 flex justify-start">
                                      {today ? (
                                        <span className="text-sm font-semibold text-primary-foreground bg-primary rounded-full w-7 h-7 flex items-center justify-center" style={{ fontFamily: '"Geist Mono", monospace' }}>{dayInfo.day}</span>
                                      ) : (
                                        <span className={`text-sm w-7 h-7 flex items-center justify-center ${dayInfo.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/50'}`} style={{ fontFamily: '"Geist Mono", monospace' }}>{dayInfo.day}</span>
                                      )}
                                    </div>
                                    {/* Events */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, width: '100%', minWidth: 0 }}>
                                      {visibleEvents.map((evt) => {
                                        const cs = getEventColorStyles(evt.color);
                                        return (
                                          <div key={evt.id} style={{
                                            display: 'flex', alignItems: 'center',
                                            background: cs.bg,
                                            border: `1px solid ${cs.border}`,
                                            borderRadius: '6px',
                                            padding: '4px 8px',
                                            overflow: 'hidden', gap: '2px',
                                            width: '100%', boxSizing: 'border-box'
                                          }}>
                                            {evt.dot && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cs.text, flexShrink: 0, marginRight: '2px' }} />}
                                            <span style={{
                                              fontSize: '12px', fontWeight: 600, color: cs.text,
                                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                              lineHeight: '18px', flex: 1, minWidth: 0
                                            }}>{evt.title}</span>
                                            <span style={{
                                              fontSize: '12px', fontWeight: 400, color: cs.time,
                                              whiteSpace: 'nowrap', flexShrink: 0,
                                              lineHeight: '18px'
                                            }}>{evt.time}</span>
                                          </div>
                                        );
                                      })}
                                      {moreCount > 0 && (
                                        <span className="text-xs font-medium text-muted-foreground cursor-pointer pl-1">{moreCount} more...</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </>
                )}

                {/* ========== WEEK VIEW ========== */}
                {calendarViewMode === 'week' && (() => {
                  const weekDays = getWeekDays(calendarSelectedDate);
                  const dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                  return (
                    <>
                      {/* Day column headers with dates */}
                      <div className="grid border-b border-border bg-muted" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
                        <div className="border-r border-border" />
                        {weekDays.map((d, i) => {
                          const today = isToday(d);
                          return (
                            <div key={i} onClick={() => { setCalendarSelectedDate(d); setCalendarViewMode('day'); }} className="py-2.5 text-center cursor-pointer" style={{
                              borderRight: i < 6 ? '1px solid var(--color-border)' : 'none'
                            }}>
                              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide" style={{ fontFamily: '"Geist Mono", monospace' }}>
                                {dayNamesShort[i]}
                              </span>
                              {' '}
                              {today ? (
                                <span className="text-sm font-semibold text-primary-foreground bg-primary rounded-full w-[26px] h-[26px] inline-flex items-center justify-center" style={{ fontFamily: '"Geist Mono", monospace' }}>{d.getDate()}</span>
                              ) : (
                                <span className="text-sm font-medium text-foreground" style={{ fontFamily: '"Geist Mono", monospace' }}>{d.getDate()}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Time grid */}
                      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                        {calendarHours.map(hour => (
                          <div key={hour} className="grid min-h-16 border-b border-border/50" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
                            {/* Time label */}
                            <div className="pt-1 pr-2 text-right text-xs text-muted-foreground border-r border-border">{formatHour(hour)}</div>

                            {/* 7 day columns */}
                            {weekDays.map((d, colIdx) => {
                              const dayEvents = getEventsForDate(d);
                              const hourEvents = dayEvents.filter(evt => {
                                const h = parseTimeToHour(evt.time);
                                return Math.floor(h) === hour;
                              });
                              return (
                                <div key={colIdx} className="p-0.5 relative" style={{
                                  borderRight: colIdx < 6 ? '1px solid var(--color-border)' : 'none'
                                }}>
                                  {hourEvents.map(evt => {
                                    const cs = getEventColorStyles(evt.color);
                                    return (
                                      <div key={evt.id} style={{
                                        background: cs.bg, border: `1px solid ${cs.border}`,
                                        borderRadius: '6px', padding: '6px 8px',
                                        marginBottom: '4px', cursor: 'pointer',
                                        minHeight: '44px', position: 'relative'
                                      }}>
                                        {evt.dot && <span style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', borderRadius: '50%', background: cs.text }} />}
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: cs.text, lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{evt.title}</div>
                                        <div style={{ fontSize: '12px', fontWeight: 400, color: cs.time, lineHeight: '18px' }}>{evt.time}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        ))}

                        {/* Current time indicator */}
                        {(() => {
                          const now = new Date();
                          const currentHour = now.getHours() + now.getMinutes() / 60;
                          if (currentHour >= calendarHours[0] && currentHour <= calendarHours[calendarHours.length - 1] + 1) {
                            const topPx = (currentHour - calendarHours[0]) * 64;
                            const todayIdx = weekDays.findIndex(d => isToday(d));
                            if (todayIdx >= 0) {
                              return (
                                <div className="absolute h-0.5 bg-ring z-5 pointer-events-none" style={{ top: `${topPx}px`, left: '60px', right: 0 }}>
                                  <div className="absolute -left-[5px] -top-1 w-2.5 h-2.5 rounded-full bg-ring" />
                                  {/* Time label */}
                                  <span className="absolute -left-[58px] -top-2 text-xs text-ring font-medium w-[50px] text-right">
                                    {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase().replace(' ', ' ')}
                                  </span>
                                </div>
                              );
                            }
                          }
                          return null;
                        })()}
                      </div>
                    </>
                  );
                })()}

                {/* ========== DAY VIEW ========== */}
                {calendarViewMode === 'day' && (() => {
                  const dayEvents = getEventsForDate(calendarSelectedDate);
                  return (
                    <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                      {calendarHours.map(hour => (
                        <div key={hour} className="grid min-h-[72px] border-b border-border/50" style={{ gridTemplateColumns: '60px 1fr' }}>
                          <div className="pt-1 pr-2 text-right text-xs text-muted-foreground border-r border-border">{formatHour(hour)}</div>
                          <div style={{ padding: '2px 8px', position: 'relative' }}>
                            {dayEvents.filter(evt => Math.floor(parseTimeToHour(evt.time)) === hour).map(evt => {
                              const cs = getEventColorStyles(evt.color);
                              return (
                                <div key={evt.id} style={{
                                  background: cs.bg, border: `1px solid ${cs.border}`,
                                  borderRadius: '6px', padding: '10px 14px',
                                  marginBottom: '4px', cursor: 'pointer',
                                  minHeight: '60px', position: 'relative'
                                }}>
                                  {evt.dot && <span style={{ position: 'absolute', top: '10px', right: '12px', width: '7px', height: '7px', borderRadius: '50%', background: cs.text }} />}
                                  <div style={{ fontSize: '14px', fontWeight: 600, color: cs.text, lineHeight: '20px' }}>{evt.title}</div>
                                  <div style={{ fontSize: '13px', fontWeight: 400, color: cs.time, lineHeight: '20px' }}>{evt.time}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {/* Current time indicator */}
                      {isToday(calendarSelectedDate) && (() => {
                        const now = new Date();
                        const currentHour = now.getHours() + now.getMinutes() / 60;
                        if (currentHour >= calendarHours[0] && currentHour <= calendarHours[calendarHours.length - 1] + 1) {
                          const topPx = (currentHour - calendarHours[0]) * 72;
                          return (
                            <div className="absolute h-0.5 bg-ring z-5 pointer-events-none" style={{ top: `${topPx}px`, left: '60px', right: 0 }}>
                              <div className="absolute -left-[5px] -top-1 w-2.5 h-2.5 rounded-full bg-ring" />
                              <span className="absolute -left-[58px] -top-2 text-xs text-ring font-medium w-[50px] text-right">
                                {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  );
                })()}
              </div>

              {/* Right Sidebar */}
              <div className="w-[280px] border-l border-border flex flex-col bg-background shrink-0 overflow-hidden">
                {/* Total Balance Card */}
                <div className="m-4 p-5 pb-[18px] rounded-xl relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--card-balance-from) 0%, var(--card-balance-to) 100%)', border: '1px solid var(--card-balance-border)' }}>
                  <div className="absolute top-3.5 right-3.5 w-11 h-11 rounded-full flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, var(--card-gold-from) 0%, var(--card-gold-to) 100%)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity="0.3"/>
                      <circle cx="12" cy="12" r="6" fill="#fff" fillOpacity="0.5"/>
                    </svg>
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">Total Balance</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ background: 'linear-gradient(135deg, var(--card-gold-from), var(--card-gold-to))' }} />
                    <span className="text-3xl font-bold text-foreground tracking-tight leading-[38px]" style={{ fontFamily: '"Geist Mono", monospace' }}>121,345</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">Last activity 26/09/24</p>
                  <Button variant="outline" className="font-semibold">
                    <Eye className="size-4" />
                    See Details
                  </Button>
                </div>

                {/* Launch Campaigns Card */}
                <div className="mx-4 mb-4 p-6 rounded-xl text-white relative overflow-hidden flex-1" style={{ background: 'linear-gradient(135deg, var(--card-campaign-from) 0%, var(--card-campaign-mid) 40%, var(--card-campaign-to) 100%)' }}>
                  <svg className="absolute top-[18px] right-[18px] opacity-40" width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
                  </svg>
                  <h3 className="text-xl font-bold leading-7 mb-2 max-w-[200px] tracking-tight">Launch campaigns, promote your property</h3>
                  <p className="text-sm opacity-80 leading-5 mb-5 max-w-[220px]">Drive bookings and boost visibility with tailored campaign launches.</p>
                  <Button
                    className="group rounded-[10px] font-medium text-sm text-white tracking-[-0.084px] border border-white/12 shadow-[0px_1px_2px_0px_rgba(14,18,27,0.24),0px_0px_0px_1px_var(--cta-primary-ring)] hover:brightness-110"
                    style={{ backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 100%), linear-gradient(90deg, var(--cta-primary) 0%, var(--cta-primary) 100%)' }}
                  >
                    Request to book
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>

                  <div style={{
                    marginTop: '24px', background: 'rgba(255,255,255,0.12)',
                    borderRadius: '12px', padding: '8px 12px',
                    border: '1px solid rgba(255,255,255,0.12)'
                  }}>
                    {campaignTypes.map((ct, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '10px 4px',
                        borderBottom: i < campaignTypes.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                      }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: 'rgba(255,255,255,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px', flexShrink: 0
                        }}>{ct.icon}</div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px' }}>{ct.name}</div>
                          <div style={{ fontSize: '12px', opacity: 0.6, lineHeight: '18px' }}>{ct.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </PageSection>
          </>
        ) : activeNavigation === 'Reviews' ? (
          <>
            {/* Reviews Header */}
            <header style={{
              height: '56px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{ width: '20px' }} alt="back" />
                <div style={{ height: '20px', borderLeft: `1px solid ${colors.border}` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist Mono"', textTransform: 'uppercase' }}>Dashboard</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/42fc4aca-b2d6-4358-bd46-3ec69e3c9773.svg" style={{ width: '14px' }} />
                  <span style={{ fontSize: '14px', color: colors.textPrimary, fontFamily: '"Geist Mono"', textTransform: 'uppercase' }}>Reviews</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                  border: `1px solid ${colors.border}`, borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white', cursor: 'pointer'
                }}>
                  <img src={isDarkMode ? "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/a7aea9d4-4862-4777-a667-d1f47c0a09a6.svg" : "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/515ca86f-0c62-489e-ac2f-446ec51a901e.svg"} style={{ width: '20px' }} />
                  <span style={{ color: isDarkMode ? 'white' : 'rgba(10, 10, 10, 1)', fontSize: '14px', fontWeight: 500 }}>Export</span>
                </button>
              </div>
            </header>

            <PageSection pageKey="Reviews">
            {/* Reviews Stats Banner */}
            <div style={{
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'stretch',
              backgroundColor: colors.bg,
              borderBottom: `1px solid ${colors.border}`,
            }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>Average Rating</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src="/assets/star.svg" alt="star" style={{ width: '20px', height: '20px' }} />
                    <span style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', lineHeight: '28px' }}>4.7</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>-3.2%</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 6L6 14M6 14H11M6 14V9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ height: '4px', borderRadius: '1.5px', backgroundColor: '#9333ea', width: '100%' }} />
              </div>

              <div style={{ width: '1px', alignSelf: 'stretch', borderLeft: `1px dashed ${colors.border}`, margin: '0 24px' }} />

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>Total Ratings</span>
                  <span style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', lineHeight: '28px' }}>25</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>-6.4%</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 6L6 14M6 14H11M6 14V9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ height: '4px', borderRadius: '1.5px', backgroundColor: '#22d3ee', width: '100%' }} />
              </div>

              <div style={{ flex: 3 }} />
            </div>

            {/* Reviews Filter Bar */}
            <div style={{
              height: '68px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: colors.bg,
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
                  placeholder="Search Reviews"
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
                <select style={{
                  padding: '6px 32px 6px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white', color: colors.textPrimary,
                  fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif', cursor: 'pointer',
                  appearance: 'none', outline: 'none', minWidth: '100px'
                }}>
                  <option value="">City</option>
                  <option value="London">London</option>
                </select>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '16px', pointerEvents: 'none' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <select style={{
                  padding: '6px 32px 6px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white', color: colors.textPrimary,
                  fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif', cursor: 'pointer',
                  appearance: 'none', outline: 'none', minWidth: '100px'
                }}>
                  <option value="">Date</option>
                </select>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '16px', pointerEvents: 'none' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <select style={{
                  padding: '6px 32px 6px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white', color: colors.textPrimary,
                  fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif', cursor: 'pointer',
                  appearance: 'none', outline: 'none', minWidth: '100px'
                }}>
                  <option value="">Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '16px', pointerEvents: 'none' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <select style={{
                  padding: '6px 32px 6px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white', color: colors.textPrimary,
                  fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif', cursor: 'pointer',
                  appearance: 'none', outline: 'none', minWidth: '100px'
                }}>
                  <option value="">Source</option>
                  <option value="Google">Google</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Ambassador">Ambassador</option>
                </select>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '16px', pointerEvents: 'none' }} />
              </div>
              </div>
            </div>

            {/* Reviews Table */}
            <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{
                    backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
                    borderBottom: `1px solid ${colors.border}`
                  }}>
                    <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '13px', color: colors.textSecondary, fontFamily: '"Geist Mono"', fontWeight: 500, width: '18%' }}>LISTING</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: colors.textSecondary, fontFamily: '"Geist Mono"', fontWeight: 500, width: '32%' }}>REVIEWS</th>
                    <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: '13px', color: colors.textSecondary, fontFamily: '"Geist Mono"', fontWeight: 500, width: '14%' }}>RATING</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: colors.textSecondary, fontFamily: '"Geist Mono"', fontWeight: 500, width: '14%' }}>STUDENT NAME</th>
                    <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: '13px', color: colors.textSecondary, fontFamily: '"Geist Mono"', fontWeight: 500, width: '10%' }}>SOURCE</th>
                    <th style={{ textAlign: 'right', padding: '12px 24px', fontSize: '13px', color: colors.textSecondary, fontFamily: '"Geist Mono"', fontWeight: 500, width: '12%' }}>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReviewsData.map((review: any, i: number) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.03, ease: [0.4, 0, 0.2, 1] }}
                      style={{ borderBottom: `1px solid ${colors.border}` }}
                    >
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif', verticalAlign: 'top' }}>{review.listing}</td>
                      <td style={{ padding: '16px 8px', fontSize: '13px', fontWeight: 400, color: colors.textSecondary, fontFamily: '"Geist", sans-serif', lineHeight: '1.5', verticalAlign: 'top', fontStyle: 'italic' }}>{review.review}</td>
                      <td style={{ padding: '16px 8px', textAlign: 'center', verticalAlign: 'top' }}>
                        <div style={{ display: 'inline-flex', gap: '2px' }}>{renderStars(review.rating)}</div>
                      </td>
                      <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif', verticalAlign: 'top' }}>{review.studentName}</td>
                      <td style={{ padding: '16px 8px', fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif', textAlign: 'center', verticalAlign: 'top' }}>{review.source}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist Mono"', textAlign: 'right', verticalAlign: 'top' }}>{review.date}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Reviews Pagination Footer */}
            <footer style={{
              height: '68px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderTop: `1px solid ${colors.border}`, marginTop: 'auto', backgroundColor: colors.bg
            }}>
              <span style={{ fontSize: '14px', color: colors.textSecondary }}>Showing {reviewsStartItem} to {reviewsEndItem} of {reviewsTotalItems} entries</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={handleReviewsPrevious} disabled={reviewsPage === 1} style={{
                  padding: '6px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px', background: 'transparent',
                  cursor: reviewsPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: reviewsPage === 1 ? 0.5 : 1
                }}>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/01c076b6-3528-475d-af10-7b71b96e0863.svg" style={{ width: '16px' }} />
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 500 }}>Previous</span>
                </button>
                {getReviewsPageNumbers().map(page => (
                  <button key={page} onClick={() => handleReviewsPageClick(page)} style={{
                    width: '28px', height: '28px',
                    border: page === reviewsPage ? (isDarkMode ? '1px solid rgba(115, 115, 115, 1)' : `1px solid ${colors.accent}`) : 'none',
                    borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                    backgroundColor: page === reviewsPage ? (isDarkMode ? 'rgba(82, 82, 91, 1)' : 'rgba(237, 243, 255, 1)') : 'transparent',
                    color: page === reviewsPage ? (isDarkMode ? '#FFFFFF' : colors.accent) : colors.textPrimary
                  }}>{page === -1 ? '...' : page}</button>
                ))}
                <button onClick={handleReviewsNext} disabled={reviewsPage === reviewsTotalPages} style={{
                  padding: '6px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px', background: 'transparent',
                  cursor: reviewsPage === reviewsTotalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: reviewsPage === reviewsTotalPages ? 0.5 : 1
                }}>
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 500 }}>Next</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/607c4c87-4637-410f-bdea-5d4899aac524.svg" style={{ width: '16px' }} />
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
        ) : activeNavigation === 'Insights' ? (
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
                  }}>Insights</span>
                </div>
              </div>
            </header>

            <PageSection pageKey="Insights">
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
        ) : activeNavigation === 'Bookings' ? (
          <>
            {/* Bookings Header */}
            <header style={{
              height: '56px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{ width: '20px' }} alt="back" />
                <div style={{ height: '20px', borderLeft: `1px solid ${colors.border}` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist Mono"', textTransform: 'uppercase' }}>Dashboard</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/42fc4aca-b2d6-4358-bd46-3ec69e3c9773.svg" style={{ width: '14px' }} />
                  <span style={{ fontSize: '14px', color: colors.textPrimary, fontFamily: '"Geist Mono"', textTransform: 'uppercase' }}>Bookings</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                  border: `1px solid ${colors.border}`, borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white', cursor: 'pointer'
                }}>
                  <img src={isDarkMode ? "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/a7aea9d4-4862-4777-a667-d1f47c0a09a6.svg" : "https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/515ca86f-0c62-489e-ac2f-446ec51a901e.svg"} style={{ width: '20px' }} />
                  <span style={{ color: isDarkMode ? 'white' : 'rgba(10, 10, 10, 1)', fontSize: '14px', fontWeight: 500 }}>Export</span>
                </button>
              </div>
            </header>

            {/* Bookings Stats Banner */}
            <div style={{
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'stretch',
              backgroundColor: colors.bg,
              borderBottom: `1px solid ${colors.border}`,
            }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>Total Bookings</span>
                  <span style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', lineHeight: '28px' }}>4,849</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>+12.5%</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 14L14 6M14 6H9M14 6V11" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ height: '4px', borderRadius: '1.5px', backgroundColor: '#9333ea', width: '100%' }} />
              </div>
              <div style={{ width: '1px', alignSelf: 'stretch', borderLeft: `1px dashed ${colors.border}`, margin: '0 24px' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>Processing</span>
                  <span style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', lineHeight: '28px' }}>574</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>-3.2%</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 6L6 14M6 14H11M6 14V9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ height: '4px', borderRadius: '1.5px', backgroundColor: '#22d3ee', width: '100%' }} />
              </div>
              <div style={{ width: '1px', alignSelf: 'stretch', borderLeft: `1px dashed ${colors.border}`, margin: '0 24px' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>Invoiced</span>
                  <span style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', lineHeight: '28px' }}>243</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>+0.8%</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 14L14 6M14 6H9M14 6V11" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ height: '4px', borderRadius: '1.5px', backgroundColor: '#9333ea', width: '100%' }} />
              </div>
              <div style={{ width: '1px', alignSelf: 'stretch', borderLeft: `1px dashed ${colors.border}`, margin: '0 24px' }} />
              <div style={{ flex: 1 }} />
            </div>


            {/* Bookings Filter / Search Bar */}
            <div style={{
              height: '68px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: colors.bg
            }}>
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
                  placeholder="Booking ID"
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
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <select style={{
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
                  }}>
                    <option value="">Status</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '16px', pointerEvents: 'none' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <select style={{
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
                  }}>
                    <option value="">Move In Date</option>
                  </select>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '16px', pointerEvents: 'none' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <select style={{
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
                  }}>
                    <option value="">Tenure</option>
                  </select>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '16px', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`bookings-${bookingsPage}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ flex: 1, overflowX: 'auto', minHeight: 0 }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead>
                    <tr style={{
                      backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
                      borderBottom: `1px solid ${colors.border}`,
                      height: '42px'
                    }}>
                      <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Amber ID</th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Booking ID</th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Listing</th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Student Name</th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Status</th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Move In Date</th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Tenure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBookingsData.map((item: any, idx: number) => (
                      <motion.tr
                        key={`booking-${bookingsStartIndex + idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.03, ease: [0.4, 0, 0.2, 1] }}
                        style={{ borderBottom: `1px solid ${colors.border}`, height: '56px', backgroundColor: colors.bg }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = isDarkMode ? 'rgba(23, 23, 23, 0.6)' : 'rgba(250, 250, 250, 0.7)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.bg; }}
                      >
                        <td style={{ padding: '0 16px', fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist Mono"' }}>{item.amberId}</td>
                        <td style={{ padding: '0 8px', fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist Mono"' }}>{item.bookingId}</td>
                        <td style={{ padding: '0 8px', fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif' }}>{item.listing}</td>
                        <td style={{ padding: '0 8px', fontSize: '14px', color: colors.textPrimary, fontFamily: '"Geist", sans-serif' }}>{item.studentName}</td>
                        <td style={{ padding: '0 8px' }}>{getStatusBadge(item.status)}</td>
                        <td style={{ padding: '0 8px', fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist Mono"' }}>{item.moveInDate}</td>
                        <td style={{ padding: '0 8px', fontSize: '14px', color: colors.textPrimary, fontFamily: '"Geist", sans-serif' }}>{item.tenure}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </AnimatePresence>

            {/* Bookings Pagination Footer */}
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
                Showing {bookingsStartItem} to {bookingsEndItem} of {bookingsTotalItems} entries
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={handleBookingsPrevious} disabled={bookingsPage === 1} style={{
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: 'transparent',
                  cursor: bookingsPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: bookingsPage === 1 ? 0.5 : 1
                }}>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/01c076b6-3528-475d-af10-7b71b96e0863.svg" style={{ width: '16px' }} />
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 500 }}>Previous</span>
                </button>
                {getBookingsPageNumbers().map((page, i) => (
                  <button key={`bp-${page}-${i}`} onClick={() => handleBookingsPageClick(page)} style={{
                    width: '28px',
                    height: '28px',
                    border: page === bookingsPage ? (isDarkMode ? '1px solid rgba(115, 115, 115, 1)' : `1px solid ${colors.accent}`) : 'none',
                    borderRadius: '8px',
                    cursor: page === -1 ? 'default' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    backgroundColor: page === bookingsPage ? (isDarkMode ? 'rgba(82, 82, 91, 1)' : 'rgba(237, 243, 255, 1)') : 'transparent',
                    color: page === bookingsPage ? (isDarkMode ? '#FFFFFF' : colors.accent) : colors.textPrimary
                  }}>
                    {page === -1 ? '...' : page}
                  </button>
                ))}
                <button onClick={handleBookingsNext} disabled={bookingsPage === bookingsTotalPages} style={{
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: 'transparent',
                  cursor: bookingsPage === bookingsTotalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: bookingsPage === bookingsTotalPages ? 0.5 : 1
                }}>
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 500 }}>Next</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/607c4c87-4637-410f-bdea-5d4899aac524.svg" style={{ width: '16px' }} />
                </button>
              </div>
            </footer>
          </>
        ) : activeNavigation === 'AccountDetails' ? (
          <>
            {/* Account Details Header */}
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
                  width: '20px',
                  cursor: 'pointer'
                }} alt="back" onClick={() => setActiveNavigation('Listings')} />
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
                  }}>Account Details</span>
                </div>
              </div>
            </header>

            {/* Account Details Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: '40px'
            }}>
              {/* Account Details Card */}
              <div style={{
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {/* Card Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)'
                }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: colors.textPrimary,
                    lineHeight: '24px'
                  }}>Account Details</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {editingAccountDetails ? (
                      <>
                        <button onClick={() => setEditingAccountDetails(false)} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          border: `1px solid ${colors.border}`,
                          borderRadius: '8px',
                          background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                          cursor: 'pointer',
                          boxShadow: '0px 1px 2px rgba(0,0,0,0.05)'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 3h4v4H3V3zm0 6h4v4H3V9zm6-6h4v4H9V3zm0 6h4v4H9V9z" stroke={colors.textPrimary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <rect x="3" y="2" width="10" height="12" rx="1" stroke={colors.textPrimary} strokeWidth="1.2"/>
                            <path d="M6 5h4M6 8h4" stroke={colors.textPrimary} strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary }}>Save</span>
                        </button>
                        <button onClick={() => setEditingAccountDetails(false)} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          border: '1px solid #dc2626',
                          borderRadius: '8px',
                          background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                          cursor: 'pointer',
                          boxShadow: '0px 1px 2px rgba(0,0,0,0.05)'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4l8 8M12 4l-8 8" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: '#dc2626' }}>Cancel</span>
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setEditingAccountDetails(true)} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                        cursor: 'pointer',
                        boxShadow: '0px 1px 2px rgba(0,0,0,0.05)'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M11.333 1.333a1.886 1.886 0 0 1 2.667 0 1.886 1.886 0 0 1 0 2.667l-8.667 8.667L2 13.333l.667-3.333 8.666-8.667z" stroke={colors.textPrimary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary }}>Edit</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* Profile Avatar */}
                  <div style={{ position: 'relative', display: 'inline-flex', width: 'fit-content' }}>
                    <div style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '999px',
                      border: '2px solid rgba(147, 197, 253, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white'
                    }}>
                      <img
                        src="/assets/profile-avatar.png"
                        alt="Profile"
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '999px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    {/* Edit badge on avatar */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '999px',
                      backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                      border: `1px solid ${colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M11.333 1.333a1.886 1.886 0 0 1 2.667 0 1.886 1.886 0 0 1 0 2.667l-8.667 8.667L2 13.333l.667-3.333 8.666-8.667z" stroke={colors.textPrimary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Form Fields Row */}
                  <div style={{
                    display: 'flex',
                    gap: '44px',
                    alignItems: 'center',
                    width: '100%'
                  }}>
                    {/* Account Name */}
                    <div style={{ flex: 1, minWidth: '258px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Account Name</span>
                      </div>
                      <input
                        type="text"
                        defaultValue="Anmol Education"
                        readOnly={!editingAccountDetails}
                        style={{
                          height: '40px',
                          padding: '6px 12px',
                          border: `1px solid ${editingAccountDetails ? '#a3a3a3' : colors.border}`,
                          borderRadius: '8px',
                          backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                          boxShadow: editingAccountDetails ? '0px 0px 0px 3px rgba(161, 161, 170, 0.5)' : '0px 1px 2px rgba(0,0,0,0.05)',
                          fontSize: '14px',
                          color: colors.textPrimary,
                          lineHeight: '20px',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    {/* Account Email Address */}
                    <div style={{ flex: 1, minWidth: '258px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Account Email Address</span>
                      </div>
                      <input
                        type="email"
                        defaultValue="arthur@alignui.com"
                        readOnly={!editingAccountDetails}
                        style={{
                          height: '40px',
                          padding: '6px 12px',
                          border: `1px solid ${editingAccountDetails ? '#a3a3a3' : colors.border}`,
                          borderRadius: '8px',
                          backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                          boxShadow: editingAccountDetails ? '0px 0px 0px 3px rgba(161, 161, 170, 0.5)' : '0px 1px 2px rgba(0,0,0,0.05)',
                          fontSize: '14px',
                          color: colors.textPrimary,
                          lineHeight: '20px',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    {/* Phone Number */}
                    <div style={{ flex: 1, minWidth: '258px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Phone Number</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        width: '100%',
                        borderRadius: '8px',
                        border: `1px solid ${editingAccountDetails ? '#a3a3a3' : colors.border}`,
                        boxShadow: editingAccountDetails ? '0px 0px 0px 3px rgba(161, 161, 170, 0.5)' : '0px 1px 2px rgba(0,0,0,0.05)',
                        overflow: 'hidden'
                      }}>
                        {/* Country Code */}
                        <div style={{
                          height: '40px',
                          padding: '6px 12px',
                          borderRight: `1px solid ${editingAccountDetails ? '#a3a3a3' : colors.border}`,
                          backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer'
                        }}>
                          <img src="http://localhost:3845/assets/c7e4f7ed00a446953b564ef3562af52f24a0c4ae.svg" alt="US" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                          <span style={{ fontSize: '14px', color: colors.textPrimary }}>+1</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6l4 4 4-4" stroke={colors.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        {/* Phone Input */}
                        <input
                          type="tel"
                          defaultValue="(555) 000-0000"
                          readOnly={!editingAccountDetails}
                          placeholder="(555) 000-0000"
                          style={{
                            flex: 1,
                            height: '40px',
                            padding: '6px 12px',
                            border: 'none',
                            backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                            fontSize: '14px',
                            color: editingAccountDetails ? colors.textPrimary : colors.textMuted,
                            lineHeight: '20px',
                            outline: 'none',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information Card */}
              <div style={{
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {/* Card Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)'
                }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: colors.textPrimary,
                    lineHeight: '24px'
                  }}>Address Information</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {editingAddressInfo ? (
                      <>
                        <button onClick={() => setEditingAddressInfo(false)} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          border: `1px solid ${colors.border}`,
                          borderRadius: '8px',
                          background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                          cursor: 'pointer',
                          boxShadow: '0px 1px 2px rgba(0,0,0,0.05)'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="3" y="2" width="10" height="12" rx="1" stroke={colors.textPrimary} strokeWidth="1.2"/>
                            <path d="M6 5h4M6 8h4" stroke={colors.textPrimary} strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary }}>Save</span>
                        </button>
                        <button onClick={() => setEditingAddressInfo(false)} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          border: '1px solid #dc2626',
                          borderRadius: '8px',
                          background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                          cursor: 'pointer',
                          boxShadow: '0px 1px 2px rgba(0,0,0,0.05)'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4l8 8M12 4l-8 8" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: '#dc2626' }}>Cancel</span>
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setEditingAddressInfo(true)} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '8px',
                        background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                        cursor: 'pointer',
                        boxShadow: '0px 1px 2px rgba(0,0,0,0.05)'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M11.333 1.333a1.886 1.886 0 0 1 2.667 0 1.886 1.886 0 0 1 0 2.667l-8.667 8.667L2 13.333l.667-3.333 8.666-8.667z" stroke={colors.textPrimary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary }}>Edit</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* Address Textarea */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Address</span>
                    </div>
                    <textarea
                      defaultValue="B202 - Rose Garden"
                      readOnly={!editingAddressInfo}
                      style={{
                        minHeight: '94px',
                        padding: '6px 14px',
                        border: `1px solid ${editingAddressInfo ? '#a3a3a3' : colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                        boxShadow: editingAddressInfo ? '0px 0px 0px 3px rgba(161, 161, 170, 0.5)' : '0px 1px 2px rgba(0,0,0,0.05)',
                        resize: 'vertical' as const,
                        fontSize: '14px',
                        color: colors.textMuted,
                        lineHeight: '20px',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  {/* Zip, City, State, Country Row */}
                  <div style={{
                    display: 'flex',
                    gap: '44px',
                    alignItems: 'center',
                    width: '100%'
                  }}>
                    {/* Zip Code */}
                    <div style={{ flex: 1, minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Zip Code</span>
                      </div>
                      <input
                        type="text"
                        defaultValue="411014"
                        readOnly={!editingAddressInfo}
                        style={{
                          height: '40px',
                          padding: '6px 12px',
                          border: `1px solid ${editingAddressInfo ? '#a3a3a3' : colors.border}`,
                          borderRadius: '8px',
                          backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                          boxShadow: editingAddressInfo ? '0px 0px 0px 3px rgba(161, 161, 170, 0.5)' : '0px 1px 2px rgba(0,0,0,0.05)',
                          fontSize: '14px',
                          color: colors.textPrimary,
                          lineHeight: '20px',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    {/* City */}
                    <div style={{ flex: 1, minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>City</span>
                      </div>
                      <div style={{
                        height: '36px',
                        padding: '4px 12px',
                        border: `1px solid ${editingAddressInfo ? '#a3a3a3' : colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                        boxShadow: editingAddressInfo ? '0px 0px 0px 3px rgba(161, 161, 170, 0.5)' : '0px 1px 2px rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}>
                        <span style={{ fontSize: '14px', color: colors.textMuted, lineHeight: '20px' }}>Pune</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6l4 4 4-4" stroke={colors.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* State */}
                    <div style={{ flex: 1, minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>State</span>
                      </div>
                      <div style={{
                        height: '36px',
                        padding: '4px 12px',
                        border: `1px solid ${editingAddressInfo ? '#a3a3a3' : colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                        boxShadow: editingAddressInfo ? '0px 0px 0px 3px rgba(161, 161, 170, 0.5)' : '0px 1px 2px rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}>
                        <span style={{ fontSize: '14px', color: colors.textMuted, lineHeight: '20px' }}>Maharashtra</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6l4 4 4-4" stroke={colors.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* Country */}
                    <div style={{ flex: 1, minWidth: '0', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Country</span>
                      </div>
                      <div style={{
                        height: '36px',
                        padding: '4px 12px',
                        border: `1px solid ${editingAddressInfo ? '#a3a3a3' : colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                        boxShadow: editingAddressInfo ? '0px 0px 0px 3px rgba(161, 161, 170, 0.5)' : '0px 1px 2px rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}>
                        <span style={{ fontSize: '14px', color: colors.textMuted, lineHeight: '20px' }}>India</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6l4 4 4-4" stroke={colors.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : activeNavigation === 'Teams' ? (
          <>
            {/* Teams Header */}
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
                  width: '20px',
                  cursor: 'pointer'
                }} alt="back" onClick={() => setActiveNavigation('Listings')} />
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
                  }}>Teams</span>
                </div>
              </div>
              <button onClick={() => { setTeamModalMember({ name: '', email: '', role: 'Admin' }); setShowTeamModal(true); }} style={{
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
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Add Member
              </button>
            </header>

            {/* Teams Content */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white'
            }}>
              {/* Search Bar */}
              <div style={{ padding: '12px 16px' }}>
                <div style={{
                  width: '320px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0 8px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.bg,
                  boxShadow: '0px 1px 2px 0px rgba(10, 13, 20, 0.03)'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    value={teamsSearchQuery}
                    onChange={(e) => setTeamsSearchQuery(e.target.value)}
                    placeholder="Search by name or email"
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
              </div>

              {/* Teams Table */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{
                      backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
                      borderBottom: `1px solid ${colors.border}`,
                      height: '42px'
                    }}>
                      <th style={{ padding: '0 16px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Partners</th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Status</th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Role</th>
                      <th style={{ width: '140px', padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}` }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Franklin Bennett', email: 'franklit@shadcnstudio.com', status: 'Pending', role: 'Admin', initial: 'F' },
                      { name: 'Emily Carter', email: 'emily.carter@shadcnstudio.com', status: 'Pending', role: 'Admin', initial: 'E' },
                      { name: 'Henry Smith', email: 'henry.smith@shadcnstudio.com', status: 'Not Booked', role: 'Admin', initial: 'H' },
                      { name: 'Grace Lee', email: 'grace.lee@shadcnstudio.com', status: 'Active', role: 'Admin', initial: 'G' },
                    ]
                      .filter(member => {
                        if (!teamsSearchQuery) return true;
                        const q = teamsSearchQuery.toLowerCase();
                        return member.name.toLowerCase().includes(q) || member.email.toLowerCase().includes(q);
                      })
                      .map((member, idx) => (
                      <motion.tr
                        key={`team-${idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.03, ease: [0.4, 0, 0.2, 1] }}
                        style={{ borderBottom: `1px solid ${colors.border}`, height: '56px', backgroundColor: colors.bg }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = isDarkMode ? 'rgba(23, 23, 23, 0.6)' : 'rgba(250, 250, 250, 0.7)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.bg; }}
                      >
                        <td style={{ padding: '0 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: getAvatarColors(idx).bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <span style={{
                                color: getAvatarColors(idx).text,
                                fontSize: '14px',
                                fontWeight: 500
                              }}>{member.initial}</span>
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif' }}>{member.name}</div>
                              <div style={{ fontSize: '13px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0 8px' }}>{getStatusBadge(member.status)}</td>
                        <td style={{ padding: '0 8px', fontSize: '14px', color: colors.textPrimary, fontFamily: '"Geist", sans-serif' }}>{member.role}</td>
                        <td style={{ padding: '0 8px', textAlign: 'center' }}>
                          <button
                            onClick={() => { playClickSound(); setTeamModalMember({ name: member.name, email: member.email, role: member.role }); setShowTeamModal(true); }}
                            style={{
                              padding: '4px 12px',
                              border: `1px solid ${colors.border}`,
                              borderRadius: '6px',
                              background: 'transparent',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 500,
                              color: colors.textPrimary,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                              <path d="M11.333 1.333a1.886 1.886 0 0 1 2.667 0 1.886 1.886 0 0 1 0 2.667l-8.667 8.667L2 13.333l.667-3.333 8.666-8.667z" stroke={colors.textPrimary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Edit Details
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </main>

      {/* Team Member Modal */}
      <AnimatePresence>
        {showTeamModal && teamModalMember && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTeamModal(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: 200
              }}
            />
            {/* Modal */}
            <div style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 201,
              pointerEvents: 'none'
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  width: '400px',
                  backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'white',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '16px',
                  boxShadow: '0px 16px 32px -12px rgba(14, 18, 27, 0.1)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  pointerEvents: 'auto'
                }}
              >
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
                borderBottom: `1px solid ${colors.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c0-2.21 1.79-4 4-4s4 1.79 4 4M4 20c0-2.76 3.58-5 8-5s8 2.24 8 5" stroke={colors.textPrimary} strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="8" r="4" stroke={colors.textPrimary} strokeWidth="1.5"/>
                  </svg>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>
                    {teamModalMember.name ? 'Edit User' : 'Add Member'}
                  </span>
                </div>
                <button onClick={() => setShowTeamModal(false)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                  cursor: 'pointer',
                  boxShadow: '0px 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke={colors.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Full Name</span>
                  </div>
                  <input
                    type="text"
                    defaultValue={teamModalMember.name}
                    placeholder="Enter full name"
                    style={{
                      height: '36px',
                      padding: '4px 12px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                      boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                      fontSize: '14px',
                      color: colors.textPrimary,
                      lineHeight: '20px',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Email */}
                <div style={{ display: 'flex', flexDirection: 'column', opacity: teamModalMember.name ? 0.5 : 1 }}>
                  <div style={{ padding: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Email</span>
                  </div>
                  <input
                    type="email"
                    defaultValue={teamModalMember.email}
                    placeholder="Enter email"
                    readOnly={!!teamModalMember.name}
                    style={{
                      height: '36px',
                      padding: '4px 12px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                      boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                      fontSize: '14px',
                      color: colors.textPrimary,
                      lineHeight: '20px',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Role */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Role</span>
                  </div>
                  <div style={{
                    height: '36px',
                    padding: '4px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                    boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '14px', color: colors.textPrimary, lineHeight: '20px' }}>{teamModalMember.role || 'Admin'}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ cursor: 'pointer' }}>
                      <path d="M4 4l8 8M12 4l-8 8" stroke={colors.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                borderTop: `1px solid ${colors.border}`
              }}>
                {/* Remove user button */}
                <button onClick={() => setShowTeamModal(false)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  border: '1px solid #dc2626',
                  borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                  cursor: 'pointer',
                  boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#dc2626', lineHeight: '20px' }}>Remove user</span>
                </button>

                {/* Update button */}
                <button onClick={() => setShowTeamModal(false)} style={{
                  flex: 1,
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '6px 20px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  background: 'linear-gradient(rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(90deg, rgb(12, 99, 248) 0%, rgb(12, 99, 248) 100%)',
                  boxShadow: '0px 1px 2px 0px rgba(14, 18, 27, 0.24), 0px 0px 0px 1px #1b6df8',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  {teamModalMember.name ? 'Update' : 'Add Member'}
                </button>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

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