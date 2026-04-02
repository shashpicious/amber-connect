import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, ChevronLeft, ChevronRight, ChevronDown, ChevronsUpDown, DollarSign, Hand, ExternalLink, PieChart, Building2, Tag, ReceiptText, Star, CalendarRange, Download, ArrowUpDown, TrendingDown, TrendingUp, Calendar, CircleUser, Users, LogOut, Sun, Moon, Monitor, Palette, X, PanelLeft, FileInput } from 'lucide-react';

/** Figma 5165:52512 — raster badge art (exported PNGs in /public/assets) */
const SUB_PLAN_BASIC = '/assets/subscription-plan-basic.png';
const SUB_PLAN_SILVER = '/assets/subscription-plan-silver.png';
const SUB_PLAN_GOLD = '/assets/subscription-plan-gold.png';
/** Light/box-shadow/default/xs */
const SUB_BADGE_SHADOW_XS = '0px 1px 2px 0px rgba(0, 0, 0, 0.05)';

interface NavigationMenuProps {
  initialMode?: 'light' | 'dark';
}
export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  initialMode = 'light'
}) => {
  console.log('NavigationMenu rendering...');
  const [activeTab, setActiveTab] = useState('Listings');
  const [isDarkMode, setIsDarkMode] = useState(initialMode === 'dark');

  // Sync dark mode state to document root class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeNavigation, setActiveNavigation] = useState('Listings');
  const mainNavBeforeProfilePageRef = useRef<string>('Listings');
  const [currentPage, setCurrentPage] = useState(1);
  // campaignsPage state removed - now using calendar view
  const [invoicesPage, setInvoicesPage] = useState(1);
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('');
  const [invoiceAgeBucket, setInvoiceAgeBucket] = useState('');
  const [invoiceSortKey, setInvoiceSortKey] = useState<'invoiceDate' | 'total' | 'balance' | 'dueDate' | ''>('');
  const [invoiceSortDir, setInvoiceSortDir] = useState<'asc' | 'desc'>('asc');
  const [listingsSortKey, setListingsSortKey] = useState<'property' | 'status' | 'price' | ''>('');
  const [listingsSortDir, setListingsSortDir] = useState<'asc' | 'desc'>('asc');
  const [reviewsSortKey, setReviewsSortKey] = useState<'listing' | 'rating' | 'studentName' | 'source' | 'date' | ''>('');
  const [reviewsSortDir, setReviewsSortDir] = useState<'asc' | 'desc'>('asc');
  const [bookingsSortKey, setBookingsSortKey] = useState<'studentName' | 'listing' | 'status' | 'moveInDate' | 'tenure' | ''>('');
  const [bookingsSortDir, setBookingsSortDir] = useState<'asc' | 'desc'>('asc');
  const [teamsSortKey, setTeamsSortKey] = useState<'name' | 'status' | 'role' | ''>('');
  const [teamsSortDir, setTeamsSortDir] = useState<'asc' | 'desc'>('asc');
  const [subPartnersPage, setSubPartnersPage] = useState(1);
  const [subPartnersStatusFilter, setSubPartnersStatusFilter] = useState('');
  const [subPartnersBookingTypeFilter, setSubPartnersBookingTypeFilter] = useState('');
  const [listingsPage, setListingsPage] = useState(1);
  const [listingsSearchQuery, setListingsSearchQuery] = useState('');
  const [listingsCityFilter, setListingsCityFilter] = useState('');
  const [listingsStatusFilter, setListingsStatusFilter] = useState('');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsDateOpen, setReviewsDateOpen] = useState(false);
  const [reviewsDate, setReviewsDate] = useState<Date | undefined>(undefined);
  const [bookingsPage, setBookingsPage] = useState(1);
  const itemsPerPage = 10;
  const listingsItemsPerPage = 7;
  const [settingsTab, setSettingsTab] = useState('Brand Identity');
  const [brandColor, setBrandColor] = useState('#015A57');
  const [redirectionLink, setRedirectionLink] = useState('');
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const [processingAnimationData, setProcessingAnimationData] = useState<any>(null);
  const [isScrambling, setIsScrambling] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoiceDetailTab, setInvoiceDetailTab] = useState<'booking' | 'student' | 'invoices'>('booking');
  const [editingAccountDetails, setEditingAccountDetails] = useState(false);
  const [editingAddressInfo, setEditingAddressInfo] = useState(false);
  const [teamsSearchQuery, setTeamsSearchQuery] = useState('');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamModalMember, setTeamModalMember] = useState<{ name: string; email: string; role: string } | null>(null);
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>(initialMode === 'dark' ? 'dark' : 'light');
  const [searchFocused, setSearchFocused] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const listingsSearchRef = useRef<HTMLInputElement>(null);
  const invoiceSearchRef = useRef<HTMLInputElement>(null);
  const reviewsSearchRef = useRef<HTMLInputElement>(null);
  const bookingsSearchRef = useRef<HTMLInputElement>(null);
  const teamsSearchRef = useRef<HTMLInputElement>(null);

  // ⌘K shortcut — focus the search input on the active page
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const refMap: Record<string, React.RefObject<HTMLInputElement | null>> = {
          Listings: listingsSearchRef,
          Invoices: invoiceSearchRef,
          Reviews: reviewsSearchRef,
          Bookings: bookingsSearchRef,
          Teams: teamsSearchRef,
        };
        refMap[activeNavigation]?.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeNavigation]);

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
        minHeight: 0,
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
    accentBlue: '#2563eb',
    paginationBlue: '#1a6cf8',
    paginationBlueBg: '#edf3ff',
    white: 'rgba(255, 255, 255, 1)',
    sidebarForeground: isDarkMode ? 'rgba(250, 250, 250, 1)' : '#404040'
  };
  
  const avatarColors = [
    { bg: 'rgba(192, 219, 255, 1)', text: 'rgba(18, 55, 104, 1)' },
    { bg: 'rgba(218, 192, 255, 1)', text: 'rgba(62, 26, 117, 1)' },
    { bg: 'rgba(255, 213, 179, 1)', text: 'rgba(154, 72, 10, 1)' },
    { bg: 'rgba(187, 247, 208, 1)', text: 'rgba(22, 101, 52, 1)' },
  ];
  const getAvatarColors = (index: number) => avatarColors[index % avatarColors.length];

  const navItems = [{
    name: 'Insights',
    iconKey: 'insights' as const
  }, {
    name: 'Listings',
    iconKey: 'listings' as const
  }, {
    name: 'Bookings',
    iconKey: 'bookings' as const
  }, {
    name: 'Invoices',
    iconKey: 'invoices' as const
  }, {
    name: 'Reviews',
    iconKey: 'reviews' as const
  }, {
    name: 'Campaigns',
    iconKey: 'campaigns' as const
  }] as const;

  const renderSidebarNavIcon = (iconKey: typeof navItems[number]['iconKey'], selected: boolean) => {
    const inactive = isDarkMode ? 'rgba(163, 163, 163, 0.95)' : '#737373';
    const activeColor = selected ? (isDarkMode ? colors.white : colors.accentBlue) : inactive;
    const common = { size: 16, strokeWidth: 1.75, color: activeColor, absoluteStrokeWidth: true as const };
    switch (iconKey) {
      case 'insights':
        return <PieChart {...common} />;
      case 'listings':
        return <Building2 {...common} />;
      case 'bookings':
        return <Tag {...common} />;
      case 'invoices':
        return <ReceiptText {...common} />;
      case 'reviews':
        return <Star {...common} />;
      case 'campaigns':
        return <CalendarRange {...common} />;
      default:
        return null;
    }
  };
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
  
  // Listings — property table
  const listingsData = (() => {
    const properties = [
      { title: 'Chapter Spitalfields, London', address: 'Folgate St, Spitalfields', city: 'London', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop' },
      { title: 'Urbanest Tower Bridge, London', address: 'Tooley St, London', city: 'London', image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&h=250&fit=crop' },
      { title: 'iQ Shoreditch, London', address: 'Adler St, Whitechapel', city: 'London', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop' },
      { title: 'Unite Students Stratford One', address: 'High St, Stratford', city: 'London', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop' },
      { title: 'Scape Shoreditch, London', address: 'Bethnal Green Rd', city: 'London', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop' },
      { title: 'Vita Student Lewisham', address: 'Thurston Rd, Lewisham', city: 'London', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop' },
      { title: 'Chapter Kings Cross, London', address: 'Pentonville Rd, London', city: 'London', image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&h=250&fit=crop' },
      { title: 'iQ Will Wyatt Court, London', address: 'Miles St, Vauxhall', city: 'London', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop' },
      { title: 'Fresh Student Living, Manchester', address: 'Great Marlborough St', city: 'Manchester', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop' },
      { title: 'Unite Students, Manchester', address: 'Oxford Rd, Manchester', city: 'Manchester', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop' },
      { title: 'Vita Student, Edinburgh', address: 'Fountainbridge, Edinburgh', city: 'Edinburgh', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop' },
      { title: 'Collegiate AC, Birmingham', address: 'Bagot St, Birmingham', city: 'Birmingham', image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&h=250&fit=crop' },
      { title: 'CRM Students, Bristol', address: 'Redcliffe Way, Bristol', city: 'Bristol', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop' },
      { title: 'Nido Student, Glasgow', address: 'Bell St, Glasgow', city: 'Glasgow', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop' },
      { title: 'Liberty Living, Nottingham', address: 'Goldsmith St, Nottingham', city: 'Nottingham', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop' },
      { title: 'Chapter Highbury, London', address: 'Holloway Rd, London', city: 'London', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop' },
      { title: 'Scape Wembley, London', address: 'Olympic Way, Wembley', city: 'London', image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&h=250&fit=crop' },
      { title: 'iQ Hammersmith, London', address: 'Fulham Palace Rd', city: 'London', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop' },
      { title: 'Student Roost, Leeds', address: 'Merrion Way, Leeds', city: 'Leeds', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop' },
      { title: 'Prestige Student Living, Liverpool', address: 'Dale St, Liverpool', city: 'Liverpool', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop' },
      { title: 'Scape Mile End, London', address: 'Mile End Rd, London', city: 'London', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=250&fit=crop' },
      { title: 'Chapter Portobello, London', address: 'Ladbroke Grove, London', city: 'London', image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&h=250&fit=crop' },
      { title: 'Unite Students, Bristol', address: 'Nelson St, Bristol', city: 'Bristol', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop' },
      { title: 'Vita Student, Manchester', address: 'First St, Manchester', city: 'Manchester', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop' },
      { title: 'iQ Bankside, London', address: 'Sumner St, Southwark', city: 'London', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop' },
    ];
    const statuses = ['Active', 'Active', 'Active', 'Inactive', 'Active', 'Pending', 'Active', 'Inactive'];
    const prices = [150, 175, 189, 200, 215, 225, 245, 265, 280, 300, 320, 350];
    const units = ['week', 'week', 'week', 'month'];
    return properties.map((p, i) => ({
      ...p,
      propertyName: p.title,
      listingStatus: statuses[i % statuses.length],
      priceAmount: prices[i % prices.length],
      priceUnit: units[i % units.length],
      type: i % 3 === 0 ? 'Private halls' : i % 3 === 1 ? 'Student housing' : 'Shared apartment'
    }));
  })() as any[];

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

  const figmaCampaignCoin = 'https://www.figma.com/api/mcp/asset/db907827-b538-4e12-b984-f693a7bcd663';
  const figmaCampaignPackIllustration = 'https://www.figma.com/api/mcp/asset/fe87c282-86c1-42e7-866f-30847ff73d73';
  const figmaCampaignStarsBg = 'https://www.figma.com/api/mcp/asset/a0926ad6-be6f-4467-8433-4623ec262cd0';
  const figmaCampaignShimmer = 'https://www.figma.com/api/mcp/asset/46ea4bda-48bd-4791-bac6-2497aaf36aed';
  const figmaCampaignStarStroke = 'https://www.figma.com/api/mcp/asset/7b830475-09e9-470e-b053-b88415f3bb22';
  const figmaCampaignDashedLine = 'https://www.figma.com/api/mcp/asset/53089c38-1a50-48b3-a7f6-4b9716591704';

  // Campaign calendar events — per-day events with time (Untitled UI style)
  interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    time: string;
    color: 'blue' | 'orange' | 'pink' | 'green' | 'purple' | 'brand' | 'yellow' | 'indigo' | 'grey';
    dot?: boolean;
  }

  const campaignCalendarEvents: CalendarEvent[] = useMemo(() => {
    const y = campaignCalendarYear;
    const m = campaignCalendarMonth;
    const dim = new Date(y, m + 1, 0).getDate();
    const d = (day: number, title: string, time: string, color: CalendarEvent['color'], id: string, dot?: boolean): CalendarEvent | null => {
      if (day < 1 || day > dim) return null;
      return { id, title, date: new Date(y, m, day), time, color, dot };
    };
    return [
      d(1, 'Targeted Reach', '9:00 AM', 'blue', 'ca1'),
      d(1, 'Property of the Day', '2:00 PM', 'orange', 'ca2'),
      d(2, 'Marketing site design', '11:00 AM', 'blue', 'ca3'),
      d(2, 'UCAS push', '3:30 PM', 'purple', 'ca4'),
      d(3, 'Amber Exclusive', '10:00 AM', 'purple', 'ca5'),
      d(3, 'Student webinar', '4:00 PM', 'green', 'ca6'),
      d(4, 'Friday standup', '9:00 AM', 'grey', 'ca7'),
      d(4, 'Accountant', '1:45 PM', 'orange', 'ca8'),
      d(5, 'Social burst', '10:30 AM', 'pink', 'ca9'),
      d(6, 'TikTok kit', '9:15 AM', 'pink', 'ca10'),
      d(6, 'WhatsApp blast', '2:00 PM', 'green', 'ca11'),
      d(7, 'Brand refresh', '11:45 AM', 'indigo', 'ca12'),
      d(8, 'Property of the Day', '9:00 AM', 'orange', 'ca13'),
      d(8, 'Social Media Kit', '11:30 AM', 'pink', 'ca14'),
      d(8, 'Amber Exclusive', '2:00 PM', 'purple', 'ca15'),
      d(8, 'Design sync', '4:00 PM', 'green', 'ca16'),
      d(9, 'Morning sync', '8:30 AM', 'grey', 'ca17'),
      d(9, 'Marketing site design', '2:30 PM', 'blue', 'ca18'),
      d(10, 'Accountant', '1:45 PM', 'orange', 'ca19'),
      d(11, 'Launch review', '10:00 AM', 'yellow', 'ca20'),
      d(12, 'Student Choice push', '9:00 AM', 'brand', 'ca21'),
      d(13, 'Weekly report', '3:00 PM', 'grey', 'ca22'),
      d(14, 'Social Media Kit', '10:00 AM', 'blue', 'ca23'),
      d(14, 'Creative QA', '2:15 PM', 'pink', 'ca24'),
      d(15, 'Amber Exclusive', '2:30 PM', 'purple', 'ca25'),
      d(15, 'Partner call', '5:00 PM', 'green', 'ca26'),
      d(16, 'Property spotlight', '9:30 AM', 'orange', 'ca27'),
      d(17, 'Email drip', '11:00 AM', 'indigo', 'ca28'),
      d(18, 'Budget review', '1:00 PM', 'yellow', 'ca29'),
      d(19, 'Influencer slot', '10:45 AM', 'pink', 'ca30'),
      d(20, 'Multi-city push', '9:00 AM', 'blue', 'ca31'),
      d(21, 'Property of the Day', '9:00 AM', 'orange', 'ca32'),
      d(21, 'Retention call', '4:30 PM', 'purple', 'ca33'),
      d(22, 'Deep work', '2:30 PM', 'blue', 'ca34'),
      d(22, 'One-on-one', '3:30 PM', 'pink', 'ca35'),
      d(22, 'Campaign review', '4:00 PM', 'green', 'ca36'),
      d(23, 'Lunch briefing', '12:30 PM', 'green', 'ca37', true),
      d(24, 'Friday standup', '9:00 AM', 'grey', 'ca38'),
      d(24, 'Product demo', '7:00 PM', 'purple', 'ca39'),
      d(25, 'House inspection slot', '4:30 PM', 'yellow', 'ca40'),
      d(26, 'Engagement push', '6:30 PM', 'pink', 'ca41', true),
      d(27, 'Monday standup', '9:30 AM', 'grey', 'ca42'),
      d(27, 'Content plan', '4:30 PM', 'green', 'ca43'),
      d(28, 'Re-targeting', '11:15 AM', 'blue', 'ca44'),
      d(29, 'Weekend flash', '8:00 AM', 'orange', 'ca45'),
      d(30, 'Close month', '3:00 PM', 'purple', 'ca46'),
      d(31, 'Wrap party slot', '5:00 PM', 'pink', 'ca47'),
    ].filter((e): e is CalendarEvent => e !== null);
  }, [campaignCalendarYear, campaignCalendarMonth]);

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

  const navigateCalendar = (direction: number) => {
    navigateCalendarMonth(direction);
  };

  const goToToday = () => {
    const today = new Date();
    setCampaignCalendarMonth(today.getMonth());
    setCampaignCalendarYear(today.getFullYear());
  };

  /** Demo status chip per day — deterministic “random” like Figma variety */
  const campaignDayStatusLabels = ['Live', 'Scheduled', 'Paused', 'Draft', 'Ending soon'] as const;
  const getCampaignDayStatus = (
    date: Date,
    isCurrentMonth: boolean
  ): (typeof campaignDayStatusLabels)[number] | null => {
    if (!isCurrentMonth) return null;
    const n = date.getFullYear() * 367 + date.getMonth() * 31 + date.getDate();
    if (n % 5 === 0) return null;
    return campaignDayStatusLabels[n % campaignDayStatusLabels.length];
  };
  const campaignDayStatusClass = (label: (typeof campaignDayStatusLabels)[number]) => {
    switch (label) {
      case 'Live':
        return 'bg-chart-2/20 text-chart-2';
      case 'Scheduled':
        return 'bg-primary/15 text-primary';
      case 'Paused':
        return 'bg-chart-5/25 text-chart-5';
      case 'Draft':
        return 'bg-muted text-muted-foreground';
      case 'Ending soon':
        return 'bg-destructive/15 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Event color tokens — theme-aware for light/dark mode
  const getEventColorStyles = (color: string) => {
    if (color === 'grey') {
      return {
        bg: 'var(--muted)',
        border: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(23,23,23,0.2)',
        text: 'var(--foreground)',
        time: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(23,23,23,0.6)'
      };
    }
    const palette: Record<string, { bg: string; border: string; text: string }> = {
      orange:  { bg: 'rgba(227,146,25,0.15)', border: 'rgba(217,119,6,0.4)', text: isDarkMode ? '#f59e0b' : '#d97706' },
      blue:    { bg: 'rgba(2,132,199,0.15)', border: 'rgba(2,132,199,0.4)', text: isDarkMode ? '#38bdf8' : '#0284c7' },
      green:   { bg: 'rgba(22,163,74,0.15)', border: 'rgba(22,163,74,0.4)', text: isDarkMode ? '#4ade80' : '#16a34a' },
      pink:    { bg: 'rgba(224,52,52,0.15)', border: 'rgba(224,52,52,0.4)', text: isDarkMode ? '#f87171' : '#dc2626' },
      purple:  { bg: 'rgba(147,51,234,0.15)', border: 'rgba(147,51,234,0.4)', text: isDarkMode ? '#c084fc' : '#9333ea' },
      indigo:  { bg: 'rgba(79,70,229,0.15)', border: 'rgba(79,70,229,0.4)', text: isDarkMode ? '#a5b4fc' : '#4f46e5' },
      brand:   { bg: 'rgba(12,99,248,0.15)', border: 'rgba(12,99,248,0.4)', text: isDarkMode ? '#60a5fa' : '#0c63f8' },
      yellow:  { bg: 'rgba(202,138,4,0.15)', border: 'rgba(202,138,4,0.4)', text: isDarkMode ? '#fbbf24' : '#ca8a04' },
    };
    const c = palette[color] || palette.blue;
    return { bg: c.bg, border: c.border, text: c.text, time: c.text };
  };
  
  // Invoices (demo) — 123 rows, 25/page to match Figma; age buckets match Invoice Age cards
  const invoicesItemsPerPage = 25;
  const invoicesData = React.useMemo(() => {
    const buckets = ['current', '1-15', '16-30', '31-45', 'gt45'] as const;
    const baseNums = [379, 570, 380, 381, 382, 383, 384, 385];
    return Array.from({ length: 123 }, (_, i) => {
      const num = baseNums[i % baseNums.length] + Math.floor(i / baseNums.length);
      const overdue = i % 4 === 0;
      return {
        invoiceNumber: String(num),
        invoiceDate: '03/04/2025',
        total: '$75.00',
        balance: overdue ? '$75.00' : '$0.00',
        dueDate: '04/03/2025',
        status: overdue ? 'Overdue' : 'Paid',
        ageBucket: buckets[i % buckets.length],
      };
    });
  }, []);

  const filteredInvoicesData = invoicesData.filter((row: any) => {
    if (invoiceSearchQuery) {
      const q = invoiceSearchQuery.toLowerCase();
      if (!String(row.invoiceNumber).toLowerCase().includes(q)) return false;
    }
    if (invoiceStatusFilter && row.status !== invoiceStatusFilter) return false;
    if (invoiceAgeBucket && row.ageBucket !== invoiceAgeBucket) return false;
    return true;
  });

  const sortedInvoicesData = React.useMemo(() => {
    if (!invoiceSortKey) return filteredInvoicesData;
    return [...filteredInvoicesData].sort((a: any, b: any) => {
      let aVal = a[invoiceSortKey];
      let bVal = b[invoiceSortKey];
      // Parse currency strings like "$1,234.00"
      if (typeof aVal === 'string' && aVal.startsWith('$')) {
        aVal = parseFloat(aVal.replace(/[$,]/g, ''));
        bVal = parseFloat(bVal.replace(/[$,]/g, ''));
      }
      // Parse date strings like "12/10/2024"
      if (invoiceSortKey === 'invoiceDate' || invoiceSortKey === 'dueDate') {
        const [aD, aM, aY] = String(aVal).split('/').map(Number);
        const [bD, bM, bY] = String(bVal).split('/').map(Number);
        aVal = new Date(aY, aM - 1, aD).getTime();
        bVal = new Date(bY, bM - 1, bD).getTime();
      }
      if (aVal < bVal) return invoiceSortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return invoiceSortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredInvoicesData, invoiceSortKey, invoiceSortDir]);

  const toggleInvoiceSort = (key: typeof invoiceSortKey) => {
    if (invoiceSortKey === key) {
      setInvoiceSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setInvoiceSortKey(key);
      setInvoiceSortDir('asc');
    }
    setInvoicesPage(1);
  };

  const toggleListingsSort = (key: typeof listingsSortKey) => {
    if (listingsSortKey === key) { setListingsSortDir(prev => prev === 'asc' ? 'desc' : 'asc'); }
    else { setListingsSortKey(key); setListingsSortDir('asc'); }
    setListingsPage(1);
  };

  const toggleReviewsSort = (key: typeof reviewsSortKey) => {
    if (reviewsSortKey === key) { setReviewsSortDir(prev => prev === 'asc' ? 'desc' : 'asc'); }
    else { setReviewsSortKey(key); setReviewsSortDir('asc'); }
    setReviewsPage(1);
  };

  const toggleBookingsSort = (key: typeof bookingsSortKey) => {
    if (bookingsSortKey === key) { setBookingsSortDir(prev => prev === 'asc' ? 'desc' : 'asc'); }
    else { setBookingsSortKey(key); setBookingsSortDir('asc'); }
    setBookingsPage(1);
  };

  const toggleTeamsSort = (key: typeof teamsSortKey) => {
    if (teamsSortKey === key) { setTeamsSortDir(prev => prev === 'asc' ? 'desc' : 'asc'); }
    else { setTeamsSortKey(key); setTeamsSortDir('asc'); }
  };

  const invoicesTotalItems = sortedInvoicesData.length;
  const invoicesTotalPages = Math.ceil(invoicesTotalItems / invoicesItemsPerPage) || 1;
  const invoicesStartIndex = (invoicesPage - 1) * invoicesItemsPerPage;
  const invoicesEndIndex = invoicesStartIndex + invoicesItemsPerPage;
  const currentInvoicesData = sortedInvoicesData.slice(invoicesStartIndex, invoicesEndIndex);
  const invoicesStartItem = invoicesTotalItems === 0 ? 0 : invoicesStartIndex + 1;
  const invoicesEndItem = Math.min(invoicesEndIndex, invoicesTotalItems);

  const handleInvoicesPrevious = () => {
    if (invoicesPage > 1) setInvoicesPage(invoicesPage - 1);
  };

  const handleInvoicesNext = () => {
    if (invoicesPage < invoicesTotalPages) setInvoicesPage(invoicesPage + 1);
  };

  const handleInvoicesPageClick = (page: number) => {
    if (page !== -1) setInvoicesPage(page);
  };

  const getInvoicesPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 4;
    if (invoicesTotalPages <= maxVisible) {
      for (let i = 1; i <= invoicesTotalPages; i++) pages.push(i);
    } else {
      if (invoicesPage <= 2) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push(-1);
        pages.push(invoicesTotalPages);
      } else if (invoicesPage >= invoicesTotalPages - 1) {
        pages.push(1);
        pages.push(-1);
        for (let i = invoicesTotalPages - 2; i <= invoicesTotalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        pages.push(invoicesPage - 1);
        pages.push(invoicesPage);
        pages.push(invoicesPage + 1);
        pages.push(-1);
        pages.push(invoicesTotalPages);
      }
    }
    return pages;
  };

  const subPartnersData = [] as any[];
  const filteredSubPartnersData = subPartnersData.filter((item: any) => {
    if (subPartnersStatusFilter && item.status !== subPartnersStatusFilter) return false;
    if (subPartnersBookingTypeFilter && item.bookingType !== subPartnersBookingTypeFilter) return false;
    return true;
  });

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
    const q = listingsSearchQuery.trim().toLowerCase();
    if (q && !item.title.toLowerCase().includes(q) && !item.address.toLowerCase().includes(q)) return false;
    if (listingsCityFilter && item.city !== listingsCityFilter) return false;
    if (listingsStatusFilter && item.listingStatus !== listingsStatusFilter) return false;
    return true;
  });

  const sortedListingsData = React.useMemo(() => {
    if (!listingsSortKey) return filteredListingsData;
    return [...filteredListingsData].sort((a: any, b: any) => {
      let cmp = 0;
      if (listingsSortKey === 'property') cmp = a.title.localeCompare(b.title);
      else if (listingsSortKey === 'status') cmp = a.listingStatus.localeCompare(b.listingStatus);
      else if (listingsSortKey === 'price') cmp = a.priceAmount - b.priceAmount;
      return listingsSortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredListingsData, listingsSortKey, listingsSortDir]);

  // Listings pagination logic
  const listingsTotalItems = sortedListingsData.length;
  const listingsTotalPages = Math.max(1, Math.ceil(listingsTotalItems / listingsItemsPerPage));
  const listingsStartIndex = (listingsPage - 1) * listingsItemsPerPage;
  const listingsEndIndex = listingsStartIndex + listingsItemsPerPage;
  const currentListingsData = sortedListingsData.slice(listingsStartIndex, listingsEndIndex);

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
  const listingsCityOptions = Array.from(new Set(listingsData.map((d: any) => d.city))).sort();
  const listingsStatusOptions = Array.from(new Set(listingsData.map((d: any) => d.listingStatus))).sort();

  // Reviews sort + pagination logic
  const sortedReviewsData = React.useMemo(() => {
    if (!reviewsSortKey) return reviewsData;
    return [...reviewsData].sort((a: any, b: any) => {
      let cmp = 0;
      if (reviewsSortKey === 'listing') cmp = a.listing.localeCompare(b.listing);
      else if (reviewsSortKey === 'rating') cmp = a.rating - b.rating;
      else if (reviewsSortKey === 'studentName') cmp = a.studentName.localeCompare(b.studentName);
      else if (reviewsSortKey === 'source') cmp = a.source.localeCompare(b.source);
      else if (reviewsSortKey === 'date') { const da = new Date(a.date), db = new Date(b.date); cmp = da.getTime() - db.getTime(); }
      return reviewsSortDir === 'asc' ? cmp : -cmp;
    });
  }, [reviewsData, reviewsSortKey, reviewsSortDir]);
  const reviewsTotalItems = sortedReviewsData.length;
  const reviewsTotalPages = Math.ceil(reviewsTotalItems / itemsPerPage);
  const reviewsStartIndex = (reviewsPage - 1) * itemsPerPage;
  const reviewsEndIndex = reviewsStartIndex + itemsPerPage;
  const currentReviewsData = sortedReviewsData.slice(reviewsStartIndex, reviewsEndIndex);
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

  // Bookings sort + pagination logic
  const sortedBookingsData = React.useMemo(() => {
    if (!bookingsSortKey) return bookingsData;
    return [...bookingsData].sort((a: any, b: any) => {
      let cmp = 0;
      if (bookingsSortKey === 'studentName') cmp = a.studentName.localeCompare(b.studentName);
      else if (bookingsSortKey === 'listing') cmp = a.listing.localeCompare(b.listing);
      else if (bookingsSortKey === 'status') cmp = a.status.localeCompare(b.status);
      else if (bookingsSortKey === 'moveInDate') { const da = new Date(a.moveInDate), db = new Date(b.moveInDate); cmp = da.getTime() - db.getTime(); }
      else if (bookingsSortKey === 'tenure') cmp = parseInt(a.tenure) - parseInt(b.tenure);
      return bookingsSortDir === 'asc' ? cmp : -cmp;
    });
  }, [bookingsData, bookingsSortKey, bookingsSortDir]);
  const bookingsTotalItems = sortedBookingsData.length;
  const bookingsTotalPages = Math.ceil(bookingsTotalItems / itemsPerPage);
  const bookingsStartIndex = (bookingsPage - 1) * itemsPerPage;
  const bookingsEndIndex = bookingsStartIndex + itemsPerPage;
  const currentBookingsData = sortedBookingsData.slice(bookingsStartIndex, bookingsEndIndex);
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
    maxHeight: '100vh',
    backgroundColor: colors.bg,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 0
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
        overflow: 'hidden',
        willChange: 'width'
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
                src={isDarkMode ? '/assets/amber-connect-logo-dark.svg' : '/assets/amber-connect-logo.svg'}
                alt="Amber Connect"
                style={{ height: '28px', width: 'auto', userSelect: 'none' }}
              />
            )}
          </AnimatePresence>
          <button
            type="button"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              background: isDarkMode ? 'rgba(10, 10, 10, 1)' : colors.white,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'
            }}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <motion.span
              animate={{ scaleX: isCollapsed ? -1 : 1 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              style={{ display: 'inline-flex', transformOrigin: '50% 50%' }}
            >
              <PanelLeft size={16} color={isDarkMode ? 'rgba(250, 250, 250, 1)' : 'rgba(10, 10, 10, 1)'} strokeWidth={2} />
            </motion.span>
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
                backgroundColor: activeNavigation === item.name
                  ? (isDarkMode ? 'rgba(10, 10, 10, 1)' : colors.white)
                  : 'transparent',
                boxShadow: activeNavigation === item.name
                  ? (isDarkMode
                    ? '0px 1px 3px rgba(0, 0, 0, 0.35), 0px 1px 2px -1px rgba(0, 0, 0, 0.25)'
                    : '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1)')
                  : 'none',
                borderWidth: activeNavigation === item.name ? '1px' : '0px'
              }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
                <span style={{
                  display: 'flex',
                  flexShrink: 0,
                  width: '16px',
                  height: '16px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: activeNavigation === item.name ? 1 : (isDarkMode ? 0.85 : 0.65)
                }}>
                  {renderSidebarNavIcon(item.iconKey, activeNavigation === item.name)}
                </span>
                {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: '"Geist", sans-serif',
              whiteSpace: 'nowrap',
              color: activeNavigation === item.name
                    ? (isDarkMode ? colors.white : colors.accentBlue)
                    : colors.textMuted
                  }}
                >
                  {item.name}
                </motion.span>
                )}
              </motion.button>)}
          </div>

        </div>

        <footer style={{ flexShrink: 0 }}>
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

          </>)}

          {/* User Info — Figma sidebar footer: exactly 68px */}
          <div
            onClick={() => setShowProfileMenu(prev => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowProfileMenu(prev => !prev); } }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '8px',
              padding: '16px',
              height: '68px',
              boxSizing: 'border-box',
              borderTop: `1px solid ${colors.border}`,
              cursor: 'pointer',
              backgroundColor: showProfileMenu
                ? (isDarkMode ? 'rgba(39, 39, 42, 1)' : 'rgba(244, 244, 245, 1)')
                : 'transparent',
              transition: 'background-color 0.15s ease',
              width: '100%'
            }}
          >
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
              }} alt="" />
            </div>
            {!isCollapsed && (
              <>
                <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
                  <div style={{
                    color: colors.sidebarForeground,
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: '"Geist", sans-serif',
                    lineHeight: '20px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>Anmol Education</div>
                  <div style={{
                    color: colors.textSecondary,
                    fontSize: '12px',
                    fontWeight: 300,
                    fontFamily: '"Geist", sans-serif',
                    lineHeight: '16px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>arthur@alignui.com</div>
                </div>
                <ChevronsUpDown size={16} color={colors.textSecondary} strokeWidth={1.5} style={{ flexShrink: 0 }} aria-hidden />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              bottom: '16px',
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
            {/* Header — muted bg */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '12px',
              backgroundColor: isDarkMode ? 'rgba(39, 39, 42, 1)' : 'rgba(245, 245, 245, 1)',
              borderBottom: `1px solid ${colors.border}`,
              boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)'
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                <img src="/assets/profile-shashpicious.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: colors.sidebarForeground, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '20px', fontFamily: '"Geist", sans-serif' }}>Anmol Education</div>
                <div style={{ fontSize: '12px', fontWeight: 300, color: colors.sidebarForeground, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '16px', fontFamily: '"Geist", sans-serif' }}>arthur@alignui.com</div>
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Top group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => { setShowProfileMenu(false); if (activeNavigation !== 'AccountDetails' && activeNavigation !== 'Teams') { mainNavBeforeProfilePageRef.current = activeNavigation; } setActiveNavigation('AccountDetails'); }}>
                  <CircleUser size={16} color={colors.sidebarForeground} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', fontWeight: 400, color: colors.sidebarForeground, lineHeight: '20px', fontFamily: '"Geist", sans-serif' }}>Account Details</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => { setShowProfileMenu(false); if (activeNavigation !== 'AccountDetails' && activeNavigation !== 'Teams') { mainNavBeforeProfilePageRef.current = activeNavigation; } setActiveNavigation('Teams'); }}>
                  <Users size={16} color={colors.sidebarForeground} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', fontWeight: 400, color: colors.sidebarForeground, lineHeight: '20px', fontFamily: '"Geist", sans-serif' }}>Teams</span>
                </div>
                <a href="https://amberstudent.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src="https://www.figma.com/api/mcp/asset/62208580-3f48-4920-88ac-2fdfd8824b74" alt="" style={{ width: '16px', height: '16px', flexShrink: 0, filter: isDarkMode ? 'invert(1) brightness(2)' : 'none' }} />
                    <span style={{ fontSize: '14px', fontWeight: 400, color: colors.sidebarForeground, lineHeight: '20px', fontFamily: '"Geist", sans-serif' }}>Visit amber student</span>
                  </div>
                  <ExternalLink size={16} color={colors.sidebarForeground} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                </a>
              </div>

              {/* Separator */}
              <div style={{ height: '1px', backgroundColor: colors.border }} />

              {/* Bottom group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <LogOut size={16} color="#dc2626" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', fontWeight: 400, color: '#dc2626', lineHeight: '20px', fontFamily: '"Geist", sans-serif' }}>Log Out</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Palette size={16} color={colors.sidebarForeground} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', fontWeight: 400, color: colors.sidebarForeground, lineHeight: '20px', fontFamily: '"Geist", sans-serif' }}>Theme</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isDarkMode ? 'rgba(39, 39, 42, 1)' : 'rgba(245, 245, 245, 1)',
                    borderRadius: '10px',
                    padding: '3px'
                  }}>
                    {/* Light */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsDarkMode(false); setThemePreference('light'); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '4px 8px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                        backgroundColor: themePreference === 'light' ? (isDarkMode ? 'rgba(10,10,10,1)' : 'white') : 'transparent',
                        boxShadow: themePreference === 'light' ? '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      <Sun size={16} color={colors.sidebarForeground} strokeWidth={1.5} />
                    </button>
                    {/* Dark */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsDarkMode(true); setThemePreference('dark'); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '4px 8px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                        backgroundColor: themePreference === 'dark' ? (isDarkMode ? 'rgba(10,10,10,1)' : 'white') : 'transparent',
                        boxShadow: themePreference === 'dark' ? '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      <Moon size={16} color={colors.sidebarForeground} strokeWidth={1.5} />
                    </button>
                    {/* System */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setThemePreference('system'); setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '4px 8px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                        backgroundColor: themePreference === 'system' ? (isDarkMode ? 'rgba(10,10,10,1)' : 'white') : 'transparent',
                        boxShadow: themePreference === 'system' ? '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      <Monitor size={16} color={colors.sidebarForeground} strokeWidth={1.5} />
                    </button>
                  </div>
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
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          minWidth: 0,
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {activeNavigation === 'Listings' ? (
          <>
            {/* Listings — top bar (Figma: home + LISTINGS + Export) */}
            <header style={{
              height: '56px',
              padding: '8px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ cursor: 'pointer' }} onClick={() => setActiveNavigation('Insights')}>
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <div style={{ height: '16px', borderLeft: `1px solid ${colors.border}` }} />
                <span style={{ fontSize: '14px', color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Listings</span>
              </div>
              <button
                type="button"
                onClick={() => { playClickSound(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                  cursor: 'pointer'
                }}
              >
                <img src={isDarkMode ? 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/a7aea9d4-4862-4777-a667-d1f47c0a09a6.svg' : 'https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/515ca86f-0c62-489e-ac2f-446ec51a901e.svg'} style={{ width: '20px' }} alt="" />
                <span style={{ color: isDarkMode ? 'white' : 'rgba(10, 10, 10, 1)', fontSize: '14px', fontWeight: 500, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.084px' }}>Export</span>
              </button>
            </header>

            {/* Toolbar: search + City + Status */}
            <div style={{
              minHeight: '68px',
              padding: '16px 16px 16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: colors.bg,
              flexWrap: 'wrap'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '320px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 8px 6px 8px',
                border: searchFocused ? `1px solid ${colors.accent}` : `1px solid ${colors.border}`,
                borderRadius: '8px',
                backgroundColor: colors.inputBg,
                boxShadow: searchFocused ? `0px 0px 0px 1px ${colors.accent}` : '0px 1px 2px 0px rgba(10, 13, 20, 0.03)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={listingsSearchRef}
                  type="text"
                  value={listingsSearchQuery}
                  onChange={(e) => { setListingsSearchQuery(e.target.value); setListingsPage(1); }}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search by name"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: colors.textPrimary,
                    backgroundColor: 'transparent',
                    fontFamily: '"Geist", sans-serif',
                    fontWeight: 400
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
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: 'auto' }}>
                <div style={{ position: 'relative' }}>
                  <select
                    value={listingsCityFilter}
                    onChange={(e) => { setListingsCityFilter(e.target.value); setListingsPage(1); }}
                    style={{
                      padding: '6px 36px 6px 12px',
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
                      minWidth: '120px'
                    }}
                  >
                    <option value="">City</option>
                    {listingsCityOptions.map((c: string) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', pointerEvents: 'none' }} alt="" />
                </div>
                <div style={{ position: 'relative' }}>
                  <select
                    value={listingsStatusFilter}
                    onChange={(e) => { setListingsStatusFilter(e.target.value); setListingsPage(1); }}
                    style={{
                      padding: '6px 36px 6px 12px',
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
                      minWidth: '120px'
                    }}
                  >
                    <option value="">Status</option>
                    {listingsStatusOptions.map((s: string) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', pointerEvents: 'none' }} alt="" />
                </div>
              </div>
            </div>

            {/* Property table */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`listings-${listingsPage}-${listingsSearchQuery}-${listingsCityFilter}-${listingsStatusFilter}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ flex: 1, overflow: 'auto', backgroundColor: colors.bg, minHeight: 0 }}
              >
                <table style={{ width: '100%', maxWidth: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <colgroup>
                    <col />
                    <col style={{ width: '180px' }} />
                    <col style={{ width: '160px' }} />
                    <col style={{ width: '280px' }} />
                  </colgroup>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                    <tr style={{
                      backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
                      borderBottom: `1px solid ${colors.border}`,
                      height: '42px'
                    }}>
                      <th onClick={() => toggleListingsSort('property')} style={{ padding: '0 16px 0 24px', textAlign: 'left', fontSize: '13px', lineHeight: '20px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.02em', borderBottom: `1px solid ${colors.border}`, backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)', cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Property <ArrowUpDown size={14} color={listingsSortKey === 'property' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                      <th onClick={() => toggleListingsSort('status')} style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', lineHeight: '20px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.02em', borderBottom: `1px solid ${colors.border}`, backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)', cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Status <ArrowUpDown size={14} color={listingsSortKey === 'status' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                      <th onClick={() => toggleListingsSort('price')} style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', lineHeight: '20px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.02em', borderBottom: `1px solid ${colors.border}`, backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)', cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Price <ArrowUpDown size={14} color={listingsSortKey === 'price' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', lineHeight: '20px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.02em', borderBottom: `1px solid ${colors.border}`, backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentListingsData.map((item: any, idx: number) => (
                      <motion.tr
                        key={`listing-${listingsStartIndex + idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.03, ease: [0.4, 0, 0.2, 1] }}
                        style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.bg }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = isDarkMode ? 'rgba(23, 23, 23, 0.6)' : 'rgba(250, 250, 250, 0.7)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.bg; }}
                      >
                        <td style={{ padding: '8px 16px 8px 24px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '148px', height: '80px', borderRadius: '5.35px', overflow: 'hidden', flexShrink: 0, backgroundColor: colors.border }}>
                              <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                              <span style={{ fontSize: '16px', lineHeight: '24px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif' }}>{item.title}</span>
                              <span style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 400, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>{item.address}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '8px', verticalAlign: 'middle' }}>{getStatusBadge(item.listingStatus)}</td>
                        <td style={{ padding: '8px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 400, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>Starts at</span>
                            <span style={{ fontSize: 0, lineHeight: '20px', whiteSpace: 'nowrap' }}>
                              <span style={{ fontFamily: '"Geist Mono", monospace', fontWeight: 500, fontSize: '16px', lineHeight: '20px', color: colors.textPrimary }}>${item.priceAmount}/</span>
                              <span style={{ fontFamily: '"Geist", sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: '16px', color: colors.textSecondary }}>{item.priceUnit}</span>
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '8px 24px 8px 8px', verticalAlign: 'middle', textAlign: 'left' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px' }}>
                            <button
                              type="button"
                              onClick={() => { playClickSound(); setShowCommissionModal(true); }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                border: `1px solid ${colors.border}`,
                                borderRadius: '8px',
                                background: isDarkMode ? 'rgba(10, 10, 10, 1)' : '#ffffff',
                                color: colors.textPrimary,
                                fontSize: '14px',
                                fontWeight: 500,
                                fontFamily: '"Inter", sans-serif',
                                letterSpacing: '-0.084px',
                                cursor: 'pointer',
                                boxShadow: 'none'
                              }}
                            >
                              <DollarSign size={20} strokeWidth={2} color={colors.textPrimary} aria-hidden />
                              Commissions
                            </button>
                            {/* Commission Modal rendered via portal at bottom */}
                            <button
                              type="button"
                              onClick={() => { playClickSound(); }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '8px',
                                border: `1px solid ${colors.border}`,
                                borderRadius: '8px',
                                background: isDarkMode ? 'rgba(10, 10, 10, 1)' : '#ffffff',
                                boxShadow: '0px 1px 2px 0px rgba(10, 13, 20, 0.05)',
                                cursor: 'pointer'
                              }}
                              aria-label="Hand pause listing"
                            >
                              <Hand size={16} strokeWidth={2} color={colors.textPrimary} aria-hidden />
                            </button>
                            <button
                              type="button"
                              onClick={() => { playClickSound(); }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '8px',
                                border: `1px solid ${colors.border}`,
                                borderRadius: '8px',
                                background: isDarkMode ? 'rgba(10, 10, 10, 1)' : '#ffffff',
                                boxShadow: '0px 1px 2px 0px rgba(10, 13, 20, 0.05)',
                                cursor: 'pointer'
                              }}
                              aria-label="Open listing"
                            >
                              <ExternalLink size={16} strokeWidth={2} color={colors.textPrimary} aria-hidden />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </AnimatePresence>

            <footer style={{
              minHeight: '68px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: `1px solid ${colors.border}`,
              marginTop: 'auto',
              backgroundColor: colors.bg,
              flexShrink: 0
            }}>
              <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>
                Showing {currentListingsData.length} of {listingsTotalItems} entries
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
            {/* Invoices header */}
            <header style={{
              height: '56px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : '#fafafa',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ cursor: 'pointer' }} onClick={() => setActiveNavigation('Insights')}>
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <div style={{ height: '16px', borderLeft: `1px solid ${colors.border}` }} />
                <span style={{
                  fontSize: '14px',
                  color: colors.textPrimary,
                  fontFamily: '"Geist Mono", monospace',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  lineHeight: '20px'
                }}>Invoices</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Export button — outlined */}
                <button
                  type="button"
                  onClick={() => playClickSound()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    background: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                    cursor: 'pointer',
                    boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)',
                  }}
                >
                  <FileInput size={20} color={colors.textPrimary} strokeWidth={1.5} aria-hidden />
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 500, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.084px' }}>Export</span>
                </button>
                {/* Raise a request — fancy gradient button */}
                <button
                  type="button"
                  onClick={() => playClickSound()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 20px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 100%), linear-gradient(90deg, #0c63f8 0%, #0c63f8 100%)',
                    boxShadow: '0px 1px 2px 0px rgba(14,18,27,0.24), 0px 0px 0px 1px #1b6df8',
                    overflow: 'hidden',
                  }}
                >
                  <Hand size={20} color="white" strokeWidth={1.5} aria-hidden />
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: 500, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.084px', padding: '0 4px' }}>Raise a request</span>
                </button>
              </div>
            </header>

            {/* Scrollable area: stats scroll away, invoice age + filter + thead stick */}
            <div style={{ flex: 1, overflow: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>

            {/* Invoices Stats Banner — scrolls away */}
            <div style={{
              minHeight: '168px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              backgroundColor: isDarkMode ? colors.bg : '#ffffff',
              borderBottom: `1px solid ${colors.border}`,
              flexShrink: 0,
            }}>
              {[
                { label: 'Total Amount Pending', value: '$33,474', delta: '3%', up: false, bar: '#9333ea' },
                { label: 'Total Invoices Pending', value: '12', delta: '6%', up: false, bar: '#22d3ee' },
                { label: 'Total Amount Overdue', value: '$3,474', delta: '1%', up: true, bar: '#9333ea' },
                { label: 'Total Invoices Overdue', value: '08', delta: '3%', up: false, bar: '#22d3ee' },
              ].map((kpi, ki) => (
                <React.Fragment key={kpi.label}>
                  {ki > 0 && (
                    <div style={{ width: '0px', alignSelf: 'stretch', borderLeft: `1px dashed ${colors.border}` }} />
                  )}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', height: '120px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif', lineHeight: '20px' }}>{kpi.label}</span>
                      <span style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', lineHeight: '28px' }}>{kpi.value}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ alignSelf: 'center' }}>
                          {kpi.up
                            ? <path d="M4 10l4-4 4 4" fill="#16a34a" />
                            : <path d="M4 6l4 4 4-4" fill="#dc2626" />}
                        </svg>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: kpi.up ? '#16a34a' : '#dc2626', fontFamily: '"Geist Mono", monospace', lineHeight: '22px' }}>{kpi.delta}</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#5c5c5c', fontFamily: '"Geist", sans-serif', lineHeight: '16px', paddingBottom: '2px' }}>vs last week</span>
                    </div>
                    <div style={{ height: '4px', borderRadius: '1.5px', backgroundColor: kpi.bar, width: '100%' }} />
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Invoice Age — sticky */}
            <div style={{
              backgroundColor: isDarkMode ? colors.bg : '#ffffff',
              borderTop: `1px solid ${colors.border}`,
              borderBottom: `1px solid ${colors.border}`,
              padding: '17px 24px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'nowrap',
              minWidth: 0,
              position: 'sticky',
              top: 0,
              zIndex: 12,
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '16px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif', lineHeight: '24px', whiteSpace: 'nowrap', flexShrink: 0 }}>Invoice Age:</span>
              <div style={{
                flex: 1,
                minWidth: 0,
                overflowX: 'auto',
                overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch',
                scrollbarGutter: 'stable',
                paddingBottom: '4px',
                marginBottom: '-4px',
              }}>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '12px', alignItems: 'center', width: 'max-content' }}>
                {([
                  { key: 'current', dot: '#2563eb', title: 'Current', amount: '$200k', count: '123 invoices', titleVariant: 'body' as const },
                  { key: '1-15', dot: '#16a34a', title: '1–15 days', amount: '$200k', count: '123 invoices', titleVariant: 'mono' as const },
                  { key: '16-30', dot: '#ca8a04', title: '16–30 days', amount: '$150k', count: '98 invoices', titleVariant: 'mono' as const },
                  { key: '31-45', dot: '#ea580c', title: '31–45 days', amount: '$200k', count: '123 invoices', titleVariant: 'mono' as const },
                  { key: 'gt45', dot: '#dc2626', title: '>45 days', amount: '$75k', count: '45 invoices', titleVariant: 'mono' as const },
                ] as const).map((card) => {
                  const active = invoiceAgeBucket === card.key;
                  return (
                    <button
                      key={card.key}
                      type="button"
                      onClick={() => { setInvoiceAgeBucket(active ? '' : card.key); setInvoicesPage(1); playClickSound(); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '8px',
                        borderRadius: '8px',
                        border: active ? '1px solid #1b6df8' : `1px solid ${colors.border}`,
                        background: isDarkMode ? 'rgba(10,10,10,1)' : '#fff',
                        boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: 8, height: 8, borderRadius: 9999, backgroundColor: card.dot, flexShrink: 0 }} />
                        {card.titleVariant === 'body' ? (
                          <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif', lineHeight: '20px' }}>{card.title}</span>
                        ) : (
                          <span style={{
                            fontSize: '12px', fontWeight: 600, color: card.dot, fontFamily: '"Geist Mono", monospace',
                            lineHeight: '16px', letterSpacing: '0.48px', textTransform: 'uppercase'
                          }}>{card.title}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', lineHeight: '16px' }}>
                        <span style={{ fontFamily: '"Geist Mono", monospace', fontWeight: 400, color: colors.textPrimary }}>{card.amount}</span>
                        <span style={{ color: colors.textSecondary, fontFamily: '"Geist", sans-serif', fontWeight: 400 }}>·</span>
                        <span style={{ color: colors.textSecondary, fontFamily: '"Geist", sans-serif', fontWeight: 400 }}>{card.count}</span>
                      </div>
                    </button>
                  );
                })}
                </div>
              </div>
            </div>

            {/* Invoices Filter / Search Bar — sticky */}
            <div style={{
              minHeight: '68px',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? colors.bg : '#ffffff',
              gap: '16px',
              flexWrap: 'wrap',
              position: 'sticky',
              top: '69px',
              zIndex: 11,
              flexShrink: 0,
            }}>
              <div style={{
                width: '320px',
                maxWidth: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 8px 6px 8px',
                border: searchFocused ? `1px solid ${colors.accent}` : `1px solid ${colors.border}`,
                borderRadius: '8px',
                backgroundColor: isDarkMode ? colors.bg : '#fff',
                boxShadow: searchFocused ? `0px 0px 0px 1px ${colors.accent}` : '0px 1px 2px 0px rgba(10, 13, 20, 0.03)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={invoiceSearchRef}
                  type="text"
                  placeholder="Invoice Number"
                  value={invoiceSearchQuery}
                  onChange={(e) => { setInvoiceSearchQuery(e.target.value); setInvoicesPage(1); }}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    color: colors.textPrimary,
                    backgroundColor: 'transparent',
                    fontFamily: '"Geist", sans-serif',
                    fontWeight: 400
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
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', flex: '1 1 320px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => playClickSound()} style={{
                  flex: '1 1 140px', maxWidth: '200px', height: '36px', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : '#fff',
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 400, fontFamily: '"Geist", sans-serif', color: colors.textSecondary
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Invoice Date</span>
                </button>
                <button type="button" onClick={() => playClickSound()} style={{
                  flex: '1 1 140px', maxWidth: '200px', height: '36px', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px',
                  background: isDarkMode ? 'rgba(10, 10, 10, 1)' : '#fff',
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 400, fontFamily: '"Geist", sans-serif', color: colors.textSecondary
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Due Date</span>
                </button>
                <div style={{ position: 'relative' }}>
                  <select
                    value={invoiceStatusFilter}
                    onChange={(e) => { setInvoiceStatusFilter(e.target.value); setInvoicesPage(1); }}
                    style={{
                      padding: '6px 40px 6px 12px',
                      height: '36px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      background: isDarkMode ? 'rgba(10, 10, 10, 1)' : '#fff',
                      color: isDarkMode ? colors.textPrimary : '#404040',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: '"Geist", sans-serif',
                      cursor: 'pointer',
                      appearance: 'none',
                      outline: 'none',
                    }}
                  >
                    <option value="">Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                  <ChevronDown size={20} color={colors.textSecondary} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} aria-hidden />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`invoices-${invoicesPage}-${invoiceSearchQuery}-${invoiceStatusFilter}-${invoiceAgeBucket}-${invoiceSortKey}-${invoiceSortDir}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ backgroundColor: isDarkMode ? colors.bg : '#fff' }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead style={{ position: 'sticky', top: '137px', zIndex: 10 }}>
                    <tr style={{
                      backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : '#fafafa',
                      borderBottom: `1px solid ${colors.border}`,
                      height: '42px'
                    }}>
                      <th style={{ padding: '0 8px 0 24px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', lineHeight: '20px', backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : '#fafafa' }}>INVOICE NUMBER</th>
                      <th style={{ padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', lineHeight: '20px', backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : '#fafafa', cursor: 'pointer' }} onClick={() => toggleInvoiceSort('invoiceDate')}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                          INVOICE DATE
                          <ArrowUpDown size={16} color={invoiceSortKey === 'invoiceDate' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} aria-hidden />
                        </span>
                      </th>
                      <th style={{ padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', lineHeight: '20px', backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : '#fafafa', cursor: 'pointer' }} onClick={() => toggleInvoiceSort('total')}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          TOTAL AMOUNT
                          <ArrowUpDown size={14} color={invoiceSortKey === 'total' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} aria-hidden />
                        </span>
                      </th>
                      <th style={{ padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', lineHeight: '20px', backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : '#fafafa', cursor: 'pointer' }} onClick={() => toggleInvoiceSort('balance')}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          BALANCE
                          <ArrowUpDown size={14} color={invoiceSortKey === 'balance' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} aria-hidden />
                        </span>
                      </th>
                      <th style={{ padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', lineHeight: '20px', backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : '#fafafa', cursor: 'pointer' }} onClick={() => toggleInvoiceSort('dueDate')}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          DUE DATE
                          <ArrowUpDown size={14} color={invoiceSortKey === 'dueDate' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} aria-hidden />
                        </span>
                      </th>
                      <th style={{ padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', lineHeight: '20px', backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : '#fafafa' }}>STATUS</th>
                      <th style={{ padding: '0 24px 0 8px', textAlign: 'right', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', lineHeight: '20px', backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : '#fafafa' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoicesData.map((row: any, idx: number) => (
                      <motion.tr
                        key={`${row.invoiceNumber}-${invoicesStartIndex + idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.3), ease: [0.4, 0, 0.2, 1] }}
                        style={{ borderBottom: `1px solid ${colors.border}`, height: '56px', backgroundColor: isDarkMode ? colors.bg : '#fff' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = isDarkMode ? 'rgba(23, 23, 23, 0.6)' : 'rgba(250, 250, 250, 0.85)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = isDarkMode ? colors.bg : '#fff'; }}
                      >
                        <td style={{ padding: '8px 8px 8px 24px', fontSize: '14px', fontWeight: 500, color: isDarkMode ? colors.textPrimary : '#171717', fontFamily: '"Geist Mono", monospace', verticalAlign: 'middle' }}>{row.invoiceNumber}</td>
                        <td style={{ padding: '8px', fontSize: '14px', fontWeight: 400, color: colors.textSecondary, fontFamily: '"Geist Mono", monospace', verticalAlign: 'middle', textAlign: 'center' }}>{row.invoiceDate}</td>
                        <td style={{ padding: '8px', fontSize: '14px', fontWeight: 400, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', textAlign: 'center', verticalAlign: 'middle' }}>{row.total}</td>
                        <td style={{ padding: '8px', fontSize: '14px', fontWeight: 400, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', textAlign: 'center', verticalAlign: 'middle' }}>{row.balance}</td>
                        <td style={{ padding: '8px', fontSize: '14px', fontWeight: 400, color: colors.textSecondary, fontFamily: '"Geist Mono", monospace', verticalAlign: 'middle', textAlign: 'center' }}>{row.dueDate}</td>
                        <td style={{ padding: '8px', textAlign: 'center', verticalAlign: 'middle' }}>{getStatusBadge(row.status)}</td>
                        <td style={{ padding: '8px 24px 8px 8px', textAlign: 'right', verticalAlign: 'middle' }}>
                          <button
                            type="button"
                            onClick={() => playClickSound()}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 10px',
                              border: `1px solid ${colors.border}`,
                              borderRadius: '8px',
                              background: isDarkMode ? 'rgba(10, 10, 10, 1)' : '#fff',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 500,
                              fontFamily: '"Geist", sans-serif',
                              color: colors.textPrimary
                            }}
                          >
                            <Download size={14} strokeWidth={2} aria-hidden />
                            Download
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </AnimatePresence>

            </div>{/* end invoices scrollable area */}

            <footer style={{
              height: '68px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: `1px solid ${colors.border}`,
              backgroundColor: isDarkMode ? colors.bg : '#ffffff'
            }}>
              <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif', fontWeight: 400, lineHeight: '20px' }}>
                Showing {currentInvoicesData.length} of {invoicesTotalItems} entries
              </span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button type="button" onClick={handleInvoicesPrevious} disabled={invoicesPage === 1} style={{
                  padding: '4px 6px',
                  border: 'none',
                  borderRadius: '8px',
                  background: isDarkMode ? 'rgba(39, 39, 42, 1)' : colors.white,
                  boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                  cursor: invoicesPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: invoicesPage === 1 ? 0.5 : 1
                }}>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/01c076b6-3528-475d-af10-7b71b96e0863.svg" alt="" style={{ width: '16px' }} />
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif' }}>Previous</span>
                </button>
                {getInvoicesPageNumbers().map((page, i) => (
                  <button
                    type="button"
                    key={`ip-${page}-${i}`}
                    onClick={() => handleInvoicesPageClick(page)}
                    disabled={page === -1}
                    style={{
                      width: '28px',
                      height: '28px',
                      border: page === invoicesPage ? (isDarkMode ? '1px solid rgba(115, 115, 115, 1)' : `1px solid ${colors.paginationBlue}`) : 'none',
                      borderRadius: '8px',
                      cursor: page === -1 ? 'default' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: '"Geist", sans-serif',
                      backgroundColor: page === invoicesPage ? (isDarkMode ? 'rgba(82, 82, 91, 1)' : colors.paginationBlueBg) : 'transparent',
                      color: page === invoicesPage ? (isDarkMode ? '#FFFFFF' : colors.paginationBlue) : colors.textPrimary
                    }}
                  >
                    {page === -1 ? '...' : page}
                  </button>
                ))}
                <button type="button" onClick={handleInvoicesNext} disabled={invoicesPage === invoicesTotalPages} style={{
                  padding: '4px 6px',
                  border: 'none',
                  borderRadius: '8px',
                  background: isDarkMode ? 'rgba(39, 39, 42, 1)' : colors.white,
                  boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                  cursor: invoicesPage === invoicesTotalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: invoicesPage === invoicesTotalPages ? 0.5 : 1
                }}>
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif' }}>Next</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/607c4c87-4637-410f-bdea-5d4899aac524.svg" alt="" style={{ width: '16px' }} />
                </button>
              </div>
            </footer>

          </>
        ) : activeNavigation === 'Campaigns' ? (
            <PageSection pageKey="Campaigns">
            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden font-sans antialiased">
                <header className="bg-sidebar flex h-14 w-full min-w-0 shrink-0 items-center justify-between gap-4 border-b border-border px-6">
                  <div className="flex min-w-0 items-center gap-4">
                    <img
                      src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg"
                      alt=""
                      className="size-5 shrink-0 cursor-pointer"
                      onClick={() => setActiveNavigation('Insights')}
                    />
                    <div className="h-4 w-px shrink-0 bg-border" aria-hidden />
                    <span
                      className="truncate text-sm font-normal uppercase text-foreground"
                      style={{ fontFamily: '"Geist Mono", monospace' }}
                    >
                      Campaign Calendar
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    {/* Month navigation group */}
                    <div className="inline-flex items-stretch shrink-0">
                      <button
                        type="button"
                        onClick={() => navigateCalendar(-1)}
                        className="bg-background hover:bg-accent/60 flex items-center justify-center border border-input p-2 rounded-l-[10px] text-foreground transition-colors"
                        style={{ boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
                        aria-label="Previous month"
                      >
                        <ChevronLeft className="size-4" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={goToToday}
                        className="bg-background hover:bg-accent/60 flex items-center justify-center border border-border px-3 py-1.5"
                        style={{ boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
                      >
                        <span className="select-none whitespace-nowrap text-center text-sm font-medium leading-none text-foreground">
                          <span style={{ fontFamily: '"Geist", sans-serif' }}>{calendarMonthNames[campaignCalendarMonth]} </span>
                          <span style={{ fontFamily: '"Geist Mono", monospace' }}>{campaignCalendarYear}</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateCalendar(1)}
                        className="bg-background hover:bg-accent/60 flex items-center justify-center border border-input p-2 rounded-r-[10px] text-foreground transition-colors"
                        style={{ boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
                        aria-label="Next month"
                      >
                        <ChevronRight className="size-4" strokeWidth={2} />
                      </button>
                    </div>
                    {/* Month View dropdown */}
                    <button
                      type="button"
                      className="bg-background hover:bg-accent/60 flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors"
                      style={{ boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)', fontFamily: '"Geist", sans-serif' }}
                    >
                      Month View
                      <ChevronDown className="size-4 text-foreground" strokeWidth={2} />
                    </button>
                    {/* Create Campaign — fancy gradient button */}
                    <button
                      type="button"
                      className="flex shrink-0 items-center gap-1 overflow-hidden rounded-[10px] px-5 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90"
                      style={{
                        backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 100%), linear-gradient(90deg, #0c63f8 0%, #0c63f8 100%)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: '0px 1px 2px 0px rgba(14,18,27,0.24), 0px 0px 0px 1px #1b6df8',
                        letterSpacing: '-0.084px',
                        fontFamily: '"Inter", sans-serif'
                      }}
                    >
                      <Plus className="size-5" strokeWidth={2} />
                      <span className="px-1">Create Campaign</span>
                    </button>
                  </div>
                </header>

                <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
                {(() => {
                  const allDays = getCalendarDays(campaignCalendarMonth, campaignCalendarYear);
                  const totalWeeks = Math.ceil(allDays.length / 7);
                  return (
                  <>
                    <div className="bg-muted/40 grid shrink-0 grid-cols-7 border-b border-border">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                        <div
                          key={day}
                          className={`flex items-center justify-center border-border p-2 text-xs font-medium text-muted-foreground ${i < 6 ? 'border-r' : ''}`}
                          style={{ fontFamily: '"Geist", sans-serif' }}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div
                      className="min-h-0 flex-1 overflow-hidden"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                        gridTemplateRows: `repeat(${totalWeeks}, minmax(0, 1fr))`
                      }}
                    >
                      {allDays.map((dayInfo, idx) => {
                        const row = Math.floor(idx / 7);
                        const colIdx = idx % 7;
                        const today = isToday(dayInfo.date);
                        const dayEvents = getEventsForDate(dayInfo.date);
                        const maxShow = 3;
                        const visibleEvents = dayEvents.slice(0, maxShow);
                        const moreCount = dayEvents.length - maxShow;
                        return (
                          <div
                            key={idx}
                            className={`flex min-h-0 min-w-0 flex-col gap-1 overflow-hidden border-border p-2 ${dayInfo.isCurrentMonth ? 'bg-card' : 'bg-muted'} ${colIdx < 6 ? 'border-r' : ''} ${row < totalWeeks - 1 ? 'border-b' : ''}`}
                          >
                            <div className="shrink-0">
                              <div className="relative h-6 w-full shrink-0">
                                {today ? (
                                  <span className="absolute left-0 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground" style={{ fontFamily: '"Geist Mono", monospace' }}>{dayInfo.day}</span>
                                ) : (
                                  <span className={`absolute left-1 top-1/2 -translate-y-1/2 text-xs font-medium ${dayInfo.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} style={{ fontFamily: '"Geist Mono", monospace' }}>{dayInfo.day}</span>
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                flex: 1,
                                minHeight: 0,
                                minWidth: 0,
                                width: '100%',
                                overflow: 'hidden'
                              }}
                            >
                              {visibleEvents.map((evt) => {
                                const cs = getEventColorStyles(evt.color);
                                return (
                                  <div key={evt.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    minHeight: 0,
                                    flexShrink: 1,
                                    background: cs.bg,
                                    border: `1px solid ${cs.border}`,
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    overflow: 'hidden',
                                    gap: '2px',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                  }}>
                                    {evt.dot && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cs.text, flexShrink: 0, marginRight: '2px' }} />}
                                    <span style={{
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      color: cs.text,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      lineHeight: '16px',
                                      flex: 1,
                                      minWidth: 0,
                                      fontFamily: '"Geist", sans-serif',
                                    }}>{evt.title}</span>
                                    <span style={{
                                      fontSize: '12px',
                                      fontWeight: 400,
                                      color: cs.time,
                                      whiteSpace: 'nowrap',
                                      flexShrink: 0,
                                      lineHeight: '16px',
                                      fontFamily: '"Geist", sans-serif',
                                    }}>{evt.time}</span>
                                  </div>
                                );
                              })}
                              {moreCount > 0 && (
                                <span className="shrink-0 cursor-pointer pl-0.5 text-xs font-medium leading-4 text-muted-foreground">{moreCount} more...</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                  );
                })()}
              </div>

              {/* Right Sidebar */}
              <div className="flex h-full min-h-0 w-[289px] shrink-0 flex-col overflow-y-auto overflow-x-hidden border-l border-border bg-background p-4">
                <img
                  src="/assets/campaign-sidebar.png"
                  alt="Campaign sidebar"
                  className="w-full h-auto object-contain"
                  style={{ borderRadius: '0px' }}
                />
              </div>
            </div>
            </div>
            </PageSection>
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ cursor: 'pointer' }} onClick={() => setActiveNavigation('Insights')}>
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <div style={{ height: '16px', borderLeft: `1px solid ${colors.border}` }} />
                <span style={{ fontSize: '14px', color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Reviews</span>
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
            <div style={{ flex: 1, overflow: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Reviews Stats Banner */}
            <div style={{
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'stretch',
              gap: '16px',
              backgroundColor: colors.bg,
              borderBottom: `1px solid ${colors.border}`,
              flexShrink: 0,
            }}>
              {/* Average Rating */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', height: '120px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif', lineHeight: '20px' }}>Average Rating</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', lineHeight: '28px' }}>4.7</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                    {/* Red down-triangle */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ alignSelf: 'center' }}>
                      <path d="M4 6l4 4 4-4" fill="#dc2626" />
                    </svg>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#dc2626', fontFamily: '"Geist Mono", monospace', lineHeight: '22px' }}>16%</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#5c5c5c', fontFamily: '"Geist", sans-serif', lineHeight: '16px', paddingBottom: '2px' }}>vs last week</span>
                </div>
                <div style={{ height: '4px', borderRadius: '1.5px', backgroundColor: '#9333ea', width: '100%' }} />
              </div>

              {/* Dashed divider */}
              <div style={{ width: '0px', alignSelf: 'stretch', borderLeft: `1px dashed ${colors.border}` }} />

              {/* Total Ratings */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', height: '120px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif', lineHeight: '20px' }}>Total Ratings</span>
                  <span style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', lineHeight: '28px' }}>12</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                    {/* Green up-triangle */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ alignSelf: 'center' }}>
                      <path d="M4 10l4-4 4 4" fill="#16a34a" />
                    </svg>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#16a34a', fontFamily: '"Geist Mono", monospace', lineHeight: '22px' }}>15%</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#5c5c5c', fontFamily: '"Geist", sans-serif', lineHeight: '16px', paddingBottom: '2px' }}>vs last week</span>
                </div>
                <div style={{ height: '4px', borderRadius: '1.5px', backgroundColor: '#22d3ee', width: '100%' }} />
              </div>

              {/* Empty space for 3rd/4th hidden cards */}
              <div style={{ flex: 3 }} />
            </div>

            {/* Reviews Filter Bar — right-aligned, matching Figma */}
            <div style={{
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: colors.bg,
              position: 'sticky',
              top: 0,
              zIndex: 12,
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, maxWidth: '801px' }}>
                {/* City */}
                <div style={{ position: 'relative', width: '94px', flexShrink: 0 }}>
                  <select style={{
                    width: '100%', padding: '6px 32px 6px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px',
                    background: isDarkMode ? colors.bg : 'white', color: colors.sidebarForeground,
                    fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif', cursor: 'pointer',
                    appearance: 'none', outline: 'none'
                  }}>
                    <option value="">City</option>
                    <option value="London">London</option>
                    <option value="Manchester">Manchester</option>
                    <option value="Edinburgh">Edinburgh</option>
                  </select>
                  <ChevronDown size={20} color={colors.sidebarForeground} strokeWidth={1.5} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
                {/* Listing */}
                <div style={{ position: 'relative', width: '167px', flexShrink: 0 }}>
                  <select style={{
                    width: '100%', padding: '6px 32px 6px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px',
                    background: isDarkMode ? colors.bg : 'white', color: colors.sidebarForeground,
                    fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif', cursor: 'pointer',
                    appearance: 'none', outline: 'none'
                  }}>
                    <option value="">Listing</option>
                  </select>
                  <ChevronDown size={20} color={colors.sidebarForeground} strokeWidth={1.5} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
                {/* Rating */}
                <div style={{ position: 'relative', width: '94px', flexShrink: 0 }}>
                  <select style={{
                    width: '100%', padding: '6px 32px 6px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px',
                    background: isDarkMode ? colors.bg : 'white', color: colors.sidebarForeground,
                    fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif', cursor: 'pointer',
                    appearance: 'none', outline: 'none'
                  }}>
                    <option value="">Rating</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                  <ChevronDown size={20} color={colors.sidebarForeground} strokeWidth={1.5} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
                {/* Source */}
                <div style={{ position: 'relative', width: '94px', flexShrink: 0 }}>
                  <select style={{
                    width: '100%', padding: '6px 32px 6px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px',
                    background: isDarkMode ? colors.bg : 'white', color: colors.sidebarForeground,
                    fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif', cursor: 'pointer',
                    appearance: 'none', outline: 'none'
                  }}>
                    <option value="">Source</option>
                    <option value="Google">Google</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Ambassador">Ambassador</option>
                  </select>
                  <ChevronDown size={20} color={colors.sidebarForeground} strokeWidth={1.5} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
                {/* Date Picker — shadcn */}
                <Popover open={reviewsDateOpen} onOpenChange={setReviewsDateOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setReviewsDateOpen(prev => !prev); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        width: '260px', flexShrink: 0, height: '34px', padding: '6px 12px',
                        border: `1px solid ${colors.border}`, borderRadius: '8px',
                        background: isDarkMode ? colors.bg : 'white',
                        boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)',
                        cursor: 'pointer', outline: 'none', boxSizing: 'border-box'
                      }}
                    >
                      <Calendar size={16} color={colors.textSecondary} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                      <span style={{
                        flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif',
                        color: reviewsDate ? colors.sidebarForeground : colors.textSecondary
                      }}>
                        {reviewsDate ? reviewsDate.toLocaleDateString() : 'Date'}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start" sideOffset={6}>
                    <CalendarComponent
                      mode="single"
                      selected={reviewsDate}
                      onSelect={(date) => { setReviewsDate(date); setReviewsDateOpen(false); }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Reviews Table */}
            <div style={{ backgroundColor: colors.bg }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead style={{ position: 'sticky', top: '68px', zIndex: 11 }}>
                  <tr style={{
                    backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
                    borderBottom: `1px solid ${colors.border}`
                  }}>
                    <th onClick={() => toggleReviewsSort('listing')} style={{ textAlign: 'left', padding: '12px 24px', fontSize: '13px', color: colors.textSecondary, fontFamily: '"Geist Mono"', fontWeight: 500, width: '18%', backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)', cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>LISTING <ArrowUpDown size={14} color={reviewsSortKey === 'listing' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: colors.textSecondary, fontFamily: '"Geist Mono"', fontWeight: 500, width: '32%', backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)' }}>REVIEWS</th>
                    <th onClick={() => toggleReviewsSort('rating')} style={{ textAlign: 'center', padding: '12px 8px', fontSize: '13px', color: colors.textSecondary, fontFamily: '"Geist Mono"', fontWeight: 500, width: '14%', backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)', cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>RATING <ArrowUpDown size={14} color={reviewsSortKey === 'rating' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                    <th onClick={() => toggleReviewsSort('studentName')} style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: colors.textSecondary, fontFamily: '"Geist Mono"', fontWeight: 500, width: '14%', backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)', cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>STUDENT NAME <ArrowUpDown size={14} color={reviewsSortKey === 'studentName' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                    <th onClick={() => toggleReviewsSort('source')} style={{ textAlign: 'center', padding: '12px 8px', fontSize: '13px', color: colors.textSecondary, fontFamily: '"Geist Mono"', fontWeight: 500, width: '10%', backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)', cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>SOURCE <ArrowUpDown size={14} color={reviewsSortKey === 'source' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                    <th onClick={() => toggleReviewsSort('date')} style={{ textAlign: 'right', padding: '12px 24px', fontSize: '13px', color: colors.textSecondary, fontFamily: '"Geist Mono"', fontWeight: 500, width: '12%', backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)', cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>DATE <ArrowUpDown size={14} color={reviewsSortKey === 'date' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
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
            </div>{/* end scroll wrapper */}

            {/* Reviews Pagination Footer */}
            <footer style={{
              height: '68px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderTop: `1px solid ${colors.border}`, marginTop: 'auto', backgroundColor: colors.bg, flexShrink: 0
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
                <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/7535b31f-4722-4f37-b3f2-a80994c6c8e2.svg" style={{ width: '20px', cursor: 'pointer' }} alt="" onClick={() => setActiveNavigation('Insights')} />
                <div style={{ height: '20px', borderLeft: `1px solid ${colors.border}` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', fontWeight: 400, textTransform: 'uppercase', lineHeight: '20px' }}>Bookings</span>
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

            {/* Scrollable area: stats scroll away, filter + thead stick */}
            <div style={{ flex: 1, overflow: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>

            {/* Bookings Stats Banner — scrolls away */}
            <div style={{
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'stretch',
              gap: '16px',
              backgroundColor: colors.bg,
              borderBottom: `1px solid ${colors.border}`,
              flexShrink: 0,
            }}>
              {[
                { label: 'Total Bookings', value: '4,849', delta: '3%', up: false, bar: '#9333ea' },
                { label: 'Processing', value: '574', delta: '6%', up: false, bar: '#22d3ee' },
                { label: 'Invoiced', value: '243', delta: '1%', up: true, bar: '#9333ea' },
              ].map((kpi, ki) => (
                <React.Fragment key={kpi.label}>
                  {ki > 0 && (
                    <div style={{ width: '0px', alignSelf: 'stretch', borderLeft: `1px dashed ${colors.border}` }} />
                  )}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', height: '120px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif', lineHeight: '20px' }}>{kpi.label}</span>
                      <span style={{ fontSize: '24px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist Mono", monospace', lineHeight: '28px' }}>{kpi.value}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ alignSelf: 'center' }}>
                          {kpi.up
                            ? <path d="M4 10l4-4 4 4" fill="#16a34a" />
                            : <path d="M4 6l4 4 4-4" fill="#dc2626" />}
                        </svg>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: kpi.up ? '#16a34a' : '#dc2626', fontFamily: '"Geist Mono", monospace', lineHeight: '22px' }}>{kpi.delta}</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#5c5c5c', fontFamily: '"Geist", sans-serif', lineHeight: '16px', paddingBottom: '2px' }}>vs last week</span>
                    </div>
                    <div style={{ height: '4px', borderRadius: '1.5px', backgroundColor: kpi.bar, width: '100%' }} />
                  </div>
                </React.Fragment>
              ))}
            </div>


            {/* Bookings Filter / Search Bar — sticky */}
            <div style={{
              minHeight: '68px',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: colors.bg,
              gap: '16px',
              flexWrap: 'wrap',
              position: 'sticky',
              top: 0,
              zIndex: 11,
              flexShrink: 0,
            }}>
              <div style={{
                width: '320px',
                maxWidth: '100%',
                minHeight: '36px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 8px 6px 8px',
                border: searchFocused ? `1px solid ${colors.accent}` : `1px solid ${colors.border}`,
                borderRadius: '8px',
                backgroundColor: colors.bg,
                boxShadow: searchFocused ? `0px 0px 0px 1px ${colors.accent}` : '0px 1px 2px 0px rgba(10, 13, 20, 0.03)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={bookingsSearchRef}
                  type="text"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Student Name or Booking Id"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    color: colors.textPrimary,
                    backgroundColor: 'transparent',
                    fontFamily: '"Geist", sans-serif',
                    fontWeight: 400
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
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <select style={{
                    padding: '6px 36px 6px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    background: isDarkMode ? 'rgba(10, 10, 10, 1)' : colors.white,
                    color: isDarkMode ? colors.textPrimary : colors.sidebarForeground,
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: '"Geist", sans-serif',
                    cursor: 'pointer',
                    appearance: 'none',
                    outline: 'none',
                    minWidth: '94px'
                  }}>
                    <option value="">Status</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" alt="" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '20px', pointerEvents: 'none' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <select style={{
                    padding: '6px 36px 6px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    background: isDarkMode ? 'rgba(10, 10, 10, 1)' : colors.white,
                    color: isDarkMode ? colors.textPrimary : colors.sidebarForeground,
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: '"Geist", sans-serif',
                    cursor: 'pointer',
                    appearance: 'none',
                    outline: 'none',
                    minWidth: '167px'
                  }}>
                    <option value="">Listing</option>
                  </select>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/bdac8b93-a7aa-419c-bf92-50e0ad68ec5c.svg" alt="" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '20px', pointerEvents: 'none' }} />
                </div>
                <button
                  type="button"
                  onClick={() => playClickSound()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '36px',
                    padding: '8px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    background: isDarkMode ? 'rgba(10, 10, 10, 1)' : colors.white,
                    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    minWidth: '200px',
                    fontSize: '14px',
                    fontWeight: 400,
                    fontFamily: '"Geist", sans-serif',
                    color: colors.textSecondary
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <span style={{ flex: 1, textAlign: 'left' }}>Move-In date</span>
                </button>
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
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead style={{ position: 'sticky', top: '68px', zIndex: 10 }}>
                    <tr style={{
                      backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)',
                      borderBottom: `1px solid ${colors.border}`,
                      height: '42px'
                    }}>
                      <th style={{ padding: '0 8px 0 24px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: '20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)' }}>Amber ID</th>
                      <th style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: '20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)' }}>Booking ID</th>
                      <th onClick={() => toggleBookingsSort('studentName')} style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: '20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)', cursor: 'pointer', verticalAlign: 'middle' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Student Name <ArrowUpDown size={14} color={bookingsSortKey === 'studentName' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                      <th onClick={() => toggleBookingsSort('listing')} style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: '20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)', cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Listing <ArrowUpDown size={14} color={bookingsSortKey === 'listing' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                      <th onClick={() => toggleBookingsSort('status')} style={{ padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: '20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)', cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>Status <ArrowUpDown size={14} color={bookingsSortKey === 'status' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                      <th style={{ padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: '20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)' }}>Created At</th>
                      <th onClick={() => toggleBookingsSort('moveInDate')} style={{ padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: '20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)', cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>Move In Date <ArrowUpDown size={14} color={bookingsSortKey === 'moveInDate' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                      <th onClick={() => toggleBookingsSort('tenure')} style={{ padding: '0 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: '20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : 'rgba(250, 250, 250, 1)', cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>Tenure Length <ArrowUpDown size={14} color={bookingsSortKey === 'tenure' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBookingsData.map((item: any, idx: number) => (
                      <motion.tr
                        key={`booking-${bookingsStartIndex + idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.03, ease: [0.4, 0, 0.2, 1] }}
                        style={{ borderBottom: `1px solid ${colors.border}`, height: '56px', backgroundColor: colors.bg, cursor: 'pointer' }}
                        onClick={() => { setSelectedInvoice(item); setInvoiceDetailTab('booking'); }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = isDarkMode ? 'rgba(23, 23, 23, 0.6)' : 'rgba(250, 250, 250, 0.7)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.bg; }}
                      >
                        <td style={{ padding: '8px 8px 8px 24px', fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif', lineHeight: '20px', verticalAlign: 'middle' }}>{item.amberId}</td>
                        <td style={{ padding: '8px', fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif', lineHeight: '20px', verticalAlign: 'middle' }}>{item.bookingId}</td>
                        <td style={{ padding: '8px', fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif', lineHeight: '20px', textAlign: 'left', verticalAlign: 'middle' }}>{item.studentName}</td>
                        <td style={{ padding: '8px', fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif', lineHeight: '20px', verticalAlign: 'middle' }}>{item.listing}</td>
                        <td style={{ padding: '8px', textAlign: 'center', verticalAlign: 'middle' }}>{getStatusBadge(item.status)}</td>
                        <td style={{ padding: '8px', fontSize: '14px', fontWeight: 400, color: colors.textSecondary, fontFamily: '"Geist Mono", monospace', lineHeight: '20px', textAlign: 'center', verticalAlign: 'middle' }}>{item.createdAt ?? item.moveInDate}</td>
                        <td style={{ padding: '8px', fontSize: '14px', fontWeight: 400, color: colors.textSecondary, fontFamily: '"Geist Mono", monospace', lineHeight: '20px', textAlign: 'center', verticalAlign: 'middle' }}>{item.moveInDate}</td>
                        <td style={{ padding: '8px', fontSize: '14px', fontWeight: 400, color: colors.textSecondary, fontFamily: '"Geist Mono", monospace', lineHeight: '20px', textAlign: 'center', verticalAlign: 'middle' }}>{String(item.tenure).toUpperCase()}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </AnimatePresence>

            </div>{/* end scrollable area */}

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
              <span style={{ fontSize: '14px', color: colors.textSecondary, fontFamily: '"Geist", sans-serif', fontWeight: 400, lineHeight: '20px' }}>
                Showing {currentBookingsData.length} of {bookingsTotalItems} entries
              </span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button type="button" onClick={handleBookingsPrevious} disabled={bookingsPage === 1} style={{
                  padding: '4px 6px',
                  border: 'none',
                  borderRadius: '8px',
                  background: isDarkMode ? 'rgba(39, 39, 42, 1)' : colors.white,
                  boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                  cursor: bookingsPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: bookingsPage === 1 ? 0.5 : 1
                }}>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/01c076b6-3528-475d-af10-7b71b96e0863.svg" alt="" style={{ width: '16px' }} />
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif' }}>Previous</span>
                </button>
                {getBookingsPageNumbers().map((page, i) => (
                  <button
                    type="button"
                    key={`bp-${page}-${i}`}
                    onClick={() => handleBookingsPageClick(page)}
                    disabled={page === -1}
                    style={{
                      width: '28px',
                      height: '28px',
                      border: page === bookingsPage ? (isDarkMode ? '1px solid rgba(115, 115, 115, 1)' : `1px solid ${colors.paginationBlue}`) : 'none',
                      borderRadius: '8px',
                      cursor: page === -1 ? 'default' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: '"Geist", sans-serif',
                      backgroundColor: page === bookingsPage ? (isDarkMode ? 'rgba(82, 82, 91, 1)' : colors.paginationBlueBg) : 'transparent',
                      color: page === bookingsPage ? (isDarkMode ? '#FFFFFF' : colors.paginationBlue) : colors.textPrimary
                    }}
                  >
                    {page === -1 ? '...' : page}
                  </button>
                ))}
                <button type="button" onClick={handleBookingsNext} disabled={bookingsPage === bookingsTotalPages} style={{
                  padding: '4px 6px',
                  border: 'none',
                  borderRadius: '8px',
                  background: isDarkMode ? 'rgba(39, 39, 42, 1)' : colors.white,
                  boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
                  cursor: bookingsPage === bookingsTotalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: bookingsPage === bookingsTotalPages ? 0.5 : 1
                }}>
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif' }}>Next</span>
                  <img src="https://storage.googleapis.com/storage.magicpath.ai/user/374800043472998400/figma-assets/607c4c87-4637-410f-bdea-5d4899aac524.svg" alt="" style={{ width: '16px' }} />
                </button>
              </div>
            </footer>

            {/* Booking Detail Sidebar */}
            <AnimatePresence>
              {selectedInvoice && (
                <>
                  {/* Overlay — covers entire page including sidebar */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedInvoice(null)}
                    style={{ position: 'fixed', inset: 0, backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(23,23,23,0.1)', zIndex: 50 }}
                  />
                  {/* Sidebar panel */}
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      position: 'fixed', top: '16px', right: '16px', bottom: '16px',
                      width: '720px', maxWidth: 'calc(100% - 32px)',
                      backgroundColor: isDarkMode ? '#0a0a0a' : 'white',
                      borderRadius: '20px',
                      boxShadow: isDarkMode ? '0px 0px 0px 1px rgba(255,255,255,0.06), 0px 24px 24px -12px rgba(0,0,0,0.4)' : '0px 0px 0px 1px rgba(51,51,51,0.04), 0px 1px 1px 0.5px rgba(51,51,51,0.04), 0px 6px 6px -3px rgba(51,51,51,0.04), 0px 12px 12px -6px rgba(51,51,51,0.04), 0px 24px 24px -12px rgba(51,51,51,0.04)',
                      zIndex: 51, display: 'flex', flexDirection: 'column', overflow: 'hidden'
                    }}
                  >
                    {/* Header */}
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: isDarkMode ? '#0a0a0a' : 'white', flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="button" onClick={() => {
                              const curIdx = currentBookingsData.findIndex((r: any) => r.bookingId === selectedInvoice.bookingId);
                              if (curIdx > 0) setSelectedInvoice(currentBookingsData[curIdx - 1]);
                            }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', border: `1px solid ${colors.border}`, borderRadius: '8px', background: isDarkMode ? '#141414' : 'white', cursor: 'pointer', boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}>
                              <ChevronLeft size={16} color={colors.textPrimary} strokeWidth={2} />
                            </button>
                            <button type="button" onClick={() => {
                              const curIdx = currentBookingsData.findIndex((r: any) => r.bookingId === selectedInvoice.bookingId);
                              if (curIdx < currentBookingsData.length - 1) setSelectedInvoice(currentBookingsData[curIdx + 1]);
                            }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', border: `1px solid ${colors.border}`, borderRadius: '8px', background: isDarkMode ? '#141414' : 'white', cursor: 'pointer', boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}>
                              <ChevronRight size={16} color={colors.textPrimary} strokeWidth={2} />
                            </button>
                          </div>
                          <span style={{ fontSize: '18px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Geist", sans-serif', lineHeight: '28px' }}>#{selectedInvoice.bookingId}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          {getStatusBadge(selectedInvoice.status)}
                          <button type="button" onClick={() => setSelectedInvoice(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', border: `1px solid ${colors.border}`, borderRadius: '8px', background: isDarkMode ? '#141414' : 'white', cursor: 'pointer', boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}>
                            <X size={16} color={colors.textPrimary} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: `1px solid ${colors.border}`, borderRadius: '8px', background: isDarkMode ? '#141414' : 'white', cursor: 'pointer' }}>
                          <Hand size={20} color={colors.textPrimary} strokeWidth={1.5} />
                          <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, fontFamily: '"Inter", sans-serif', letterSpacing: '-0.084px' }}>Raise a request</span>
                        </button>
                      </div>
                    </div>

                    {/* Lead Summary section header */}
                    <div style={{ padding: '6px 20px', backgroundColor: isDarkMode ? '#1a1a1a' : '#fafafa', flexShrink: 0 }}>
                      <span style={{ fontSize: '12px', fontWeight: 500, fontFamily: '"Geist Mono", monospace', color: isDarkMode ? '#e5e5e5' : '#171717', textTransform: 'uppercase', letterSpacing: '0.48px' }}>Lead Summary</span>
                    </div>

                    {/* Lead Summary data */}
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: `1px solid ${colors.border}`, backgroundColor: isDarkMode ? '#0a0a0a' : 'white', flexShrink: 0 }}>
                      {[
                        ['Name', selectedInvoice.studentName || 'Sakshi Surve'],
                        ['Email', 'sakshisurve53@gmail.com'],
                        ['Phone', '+917773901983'],
                      ].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', lineHeight: '20px' }}>
                          <span style={{ fontWeight: 400, color: isDarkMode ? '#e5e5e5' : '#171717', fontFamily: '"Geist", sans-serif' }}>{label}</span>
                          <span style={{ fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: `1px solid ${colors.border}`, padding: '0 16px', backgroundColor: isDarkMode ? '#0a0a0a' : 'white', flexShrink: 0 }}>
                      {(['booking', 'student', 'invoices'] as const).map((tab) => (
                        <button key={tab} type="button" onClick={() => setInvoiceDetailTab(tab)} style={{
                          padding: '14px 8px', fontSize: '14px', fontWeight: 500, fontFamily: '"Geist", sans-serif',
                          color: invoiceDetailTab === tab ? '#3F83F8' : colors.textSecondary,
                          background: 'none', border: 'none', borderBottomWidth: '2px', borderBottomStyle: 'solid',
                          borderBottomColor: invoiceDetailTab === tab ? '#3F83F8' : 'transparent',
                          cursor: 'pointer', whiteSpace: 'nowrap'
                        }}>
                          {tab === 'booking' ? 'Booking Details' : tab === 'student' ? 'Student Details' : 'Invoices'}
                        </button>
                      ))}
                    </div>

                    {/* Tab content — scrollable */}
                    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px 16px 16px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: isDarkMode ? '#0a0a0a' : 'white' }}>
                      {invoiceDetailTab === 'booking' && (
                        <>
                          {[0, 1].map((cardIdx) => (
                            <div key={cardIdx} style={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                              <div style={{ padding: '6px 20px', backgroundColor: isDarkMode ? '#1a1a1a' : '#fafafa', borderBottom: `1px solid ${colors.border}` }}>
                                <span style={{ fontSize: '12px', fontWeight: 500, fontFamily: '"Geist Mono", monospace', color: isDarkMode ? '#e5e5e5' : '#171717', textTransform: 'uppercase', letterSpacing: '0.48px' }}>Lead Details</span>
                              </div>
                              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: isDarkMode ? '#111111' : 'white' }}>
                                {[
                                  ['Property Name', selectedInvoice.listing || 'Southall And Soul, London'],
                                  ['Room Type', 'Nook'],
                                  ['Tenure Length', selectedInvoice.tenure || '02/7/2025'],
                                  ['Rent ( per week)', '1050 GBP'],
                                ].map(([label, value]) => (
                                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', lineHeight: '20px' }}>
                                    <span style={{ fontWeight: 400, color: isDarkMode ? '#e5e5e5' : '#171717', fontFamily: '"Geist", sans-serif' }}>{label}</span>
                                    <span style={{ fontWeight: 500, color: colors.textSecondary, fontFamily: label === 'Tenure Length' || label === 'Rent ( per week)' ? '"Geist Mono", monospace' : '"Geist", sans-serif' }}>{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      {invoiceDetailTab === 'student' && (
                        <>
                          {/* Student Details */}
                          <div style={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                            <div style={{ padding: '6px 20px', backgroundColor: isDarkMode ? '#1a1a1a' : '#fafafa', borderBottom: `1px solid ${colors.border}` }}>
                              <span style={{ fontSize: '12px', fontWeight: 500, fontFamily: '"Geist Mono", monospace', color: isDarkMode ? '#e5e5e5' : '#171717', textTransform: 'uppercase', letterSpacing: '0.48px' }}>Student Details</span>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: isDarkMode ? '#111111' : 'white' }}>
                              {[
                                ['DOB', '02/7/2025'],
                                ['Gender', 'Female'],
                                ['Nationality', 'India'],
                                ['Address line 1', 'Pune'],
                                ['Address line 2', '--'],
                                ['City', '--'],
                                ['State/Province', 'Maharashtra'],
                                ['Country', 'India'],
                                ['ZIP code', '411015'],
                              ].map(([label, value]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', lineHeight: '20px' }}>
                                  <span style={{ fontWeight: 400, color: isDarkMode ? '#e5e5e5' : '#171717', fontFamily: '"Geist", sans-serif' }}>{label}</span>
                                  <span style={{ fontWeight: 500, color: colors.textSecondary, fontFamily: label === 'DOB' || label === 'ZIP code' ? '"Geist Mono", monospace' : '"Geist", sans-serif' }}>{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Emergency Contact Details */}
                          <div style={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                            <div style={{ padding: '6px 20px', backgroundColor: isDarkMode ? '#1a1a1a' : '#fafafa', borderBottom: `1px solid ${colors.border}` }}>
                              <span style={{ fontSize: '12px', fontWeight: 500, fontFamily: '"Geist Mono", monospace', color: isDarkMode ? '#e5e5e5' : '#171717', textTransform: 'uppercase', letterSpacing: '0.48px' }}>Emergency Contact Details</span>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: isDarkMode ? '#111111' : 'white' }}>
                              {[
                                ['Name', 'Siddhi Surve'],
                                ['Relationship', 'Sister'],
                                ['Email', 'siddhisurve098@gmail.com'],
                                ['Phone Number', '+918080973179'],
                              ].map(([label, value]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', lineHeight: '20px' }}>
                                  <span style={{ fontWeight: 400, color: isDarkMode ? '#e5e5e5' : '#171717', fontFamily: '"Geist", sans-serif' }}>{label}</span>
                                  <span style={{ fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Guarantor Details */}
                          <div style={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                            <div style={{ padding: '6px 20px', backgroundColor: isDarkMode ? '#1a1a1a' : '#fafafa', borderBottom: `1px solid ${colors.border}` }}>
                              <span style={{ fontSize: '12px', fontWeight: 500, fontFamily: '"Geist Mono", monospace', color: isDarkMode ? '#e5e5e5' : '#171717', textTransform: 'uppercase', letterSpacing: '0.48px' }}>Guarantor Details</span>
                            </div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: isDarkMode ? '#111111' : 'white' }}>
                              {[
                                ['Name', 'Siddhi Surve'],
                                ['Relationship', 'Sister'],
                                ['Email', 'siddhisurve098@gmail.com'],
                                ['Phone Number', '+918080973179'],
                              ].map(([label, value]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', lineHeight: '20px' }}>
                                  <span style={{ fontWeight: 400, color: isDarkMode ? '#e5e5e5' : '#171717', fontFamily: '"Geist", sans-serif' }}>{label}</span>
                                  <span style={{ fontWeight: 500, color: colors.textSecondary, fontFamily: '"Geist", sans-serif' }}>{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                      {invoiceDetailTab === 'invoices' && (
                        <div style={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#fafafa' }}>
                                <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: '12px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.48px', borderBottom: `1px solid ${colors.border}` }}>Invoice Number</th>
                                <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: '12px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.48px', borderBottom: `1px solid ${colors.border}` }}>Date</th>
                                <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: '12px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.48px', borderBottom: `1px solid ${colors.border}` }}>Total Amount</th>
                                <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: '12px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.48px', borderBottom: `1px solid ${colors.border}` }}>Due Date</th>
                                <th style={{ padding: '10px 20px', textAlign: 'center', fontSize: '12px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.48px', borderBottom: `1px solid ${colors.border}` }}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { num: 'INV-025708', date: '02/7/2025', amount: 'GBP 117.09', due: '12/1/2025' },
                                { num: 'INV-025709', date: '02/7/2025', amount: 'GBP 125.50', due: '12/2/2025' },
                                { num: 'INV-025710', date: '02/7/2025', amount: 'GBP 132.75', due: '12/3/2025' },
                                { num: 'INV-025711', date: '02/7/2025', amount: 'GBP 140.20', due: '12/4/2025' },
                              ].map((inv) => (
                                <tr key={inv.num} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                  <td style={{ padding: '16px 20px', fontSize: '14px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: '#3F83F8' }}># {inv.num}</td>
                                  <td style={{ padding: '16px 8px', fontSize: '14px', fontFamily: '"Geist Mono", monospace', fontWeight: 400, color: colors.textSecondary, textAlign: 'center' }}>{inv.date}</td>
                                  <td style={{ padding: '16px 8px', fontSize: '14px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textPrimary, textAlign: 'center' }}>{inv.amount}</td>
                                  <td style={{ padding: '16px 8px', fontSize: '14px', fontFamily: '"Geist Mono", monospace', fontWeight: 400, color: colors.textSecondary, textAlign: 'center' }}>{inv.due}</td>
                                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                    <span style={{ display: 'inline-block', padding: '2px 6px', borderRadius: '6px', fontSize: '12px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: '#16a34a', backgroundColor: 'rgba(22,163,74,0.1)', textTransform: 'uppercase', lineHeight: '16px' }}>SENT</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        ) : activeNavigation === 'AccountDetails' ? (
          <PageSection pageKey="AccountDetails">
            {/* Account Details Header */}
            <header style={{
              minHeight: '56px',
              padding: '8px 24px',
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
                }} alt="back" onClick={() => setActiveNavigation(mainNavBeforeProfilePageRef.current)} />
                <div style={{
                  height: '16px',
                  borderLeft: `1px solid ${colors.border}`
                }} />
                <span style={{
                  fontSize: '14px',
                  color: colors.textPrimary,
                  fontFamily: '"Geist Mono", monospace',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em'
                }}>Profile</span>
              </div>
            </header>

            {/* Account Details Content — Figma 5165:52374 */}
            <div style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              padding: '24px',
              backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: '40px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Subscription Details — Figma 5165:52508 */}
              <div style={{
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : '#ffffff'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: isDarkMode ? 'rgba(23, 23, 23, 1)' : '#fafafa',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    fontFamily: '"Geist", sans-serif',
                    color: colors.textPrimary,
                    lineHeight: '24px',
                    whiteSpace: 'nowrap'
                  }}>Subscription Details</span>
                </div>
                <div style={{
                  padding: '16px',
                  overflowX: 'auto',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box'
                  }}>
                    {/* Basic (current) — 5186:54881 */}
                    <div style={{
                      position: 'relative',
                      flex: '1 1 0',
                      minWidth: 0,
                      height: '84px',
                      borderRadius: '8px',
                      border: `1px solid ${colors.border}`,
                      backgroundColor: '#171717',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      boxSizing: 'border-box'
                    }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '8px',
                        height: '52px',
                        width: '100%',
                        flexShrink: 0,
                        boxSizing: 'border-box'
                      }}>
                        <div style={{
                          position: 'relative',
                          width: '40px',
                          height: '40px',
                          flexShrink: 0,
                          boxShadow: SUB_BADGE_SHADOW_XS
                        }}>
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            overflow: 'hidden',
                            pointerEvents: 'none'
                          }}>
                            <img
                              src={SUB_PLAN_BASIC}
                              alt=""
                              decoding="async"
                              style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '100%',
                                height: '100%',
                                maxWidth: 'none',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
                          <span style={{
                            fontSize: '16px',
                            fontWeight: 500,
                            fontFamily: '"Geist", sans-serif',
                            lineHeight: '24px',
                            color: '#ffffff'
                          }}>Basic</span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 400,
                            fontFamily: '"Geist", sans-serif',
                            lineHeight: '20px',
                            color: '#fafafa'
                          }}>Essential features for getting started</span>
                        </div>
                      </div>
                      <div style={{
                        position: 'absolute',
                        right: '11.67px',
                        top: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        border: `1px solid ${colors.border}`,
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box'
                      }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          fontFamily: '"Geist", sans-serif',
                          lineHeight: '16px',
                          color: '#0a0a0a',
                          textAlign: 'center',
                          whiteSpace: 'nowrap'
                        }}>Current</span>
                      </div>
                    </div>
                    {/* Silver — 5183:54530 */}
                    <div style={{
                      flex: '1 1 0',
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'stretch'
                    }}>
                      <div style={{
                        flex: '1 1 0',
                        minWidth: 0,
                        height: '100%',
                        minHeight: '84px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        borderRadius: '8px',
                        border: `2px solid ${colors.border}`,
                        backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : '#ffffff',
                        opacity: 0.5,
                        boxSizing: 'border-box'
                      }}>
                        <div style={{
                          position: 'relative',
                          width: '40px',
                          height: '40px',
                          flexShrink: 0,
                          boxShadow: SUB_BADGE_SHADOW_XS
                        }}>
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            overflow: 'hidden',
                            pointerEvents: 'none'
                          }}>
                            <img
                              src={SUB_PLAN_SILVER}
                              alt=""
                              decoding="async"
                              style={{
                                position: 'absolute',
                                height: '115.79%',
                                width: '105.26%',
                                left: '-3.27%',
                                top: '0.31%',
                                maxWidth: 'none'
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
                          <span style={{
                            fontSize: '16px',
                            fontWeight: 500,
                            fontFamily: '"Geist", sans-serif',
                            lineHeight: '24px',
                            color: isDarkMode ? colors.textPrimary : '#0a0a0a'
                          }}>Silver</span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 400,
                            fontFamily: '"Geist", sans-serif',
                            lineHeight: '20px',
                            color: isDarkMode ? colors.textSecondary : '#737373'
                          }}>Advanced features with extended limits</span>
                        </div>
                      </div>
                    </div>
                    {/* Gold — 5183:54544 */}
                    <div style={{
                      flex: '1 1 0',
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'stretch'
                    }}>
                      <div style={{
                        flex: '1 1 0',
                        minWidth: 0,
                        height: '100%',
                        minHeight: '84px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        borderRadius: '8px',
                        border: `2px solid ${colors.border}`,
                        backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : '#ffffff',
                        opacity: 0.5,
                        boxSizing: 'border-box'
                      }}>
                        <div style={{
                          position: 'relative',
                          width: '40px',
                          height: '40px',
                          flexShrink: 0,
                          boxShadow: SUB_BADGE_SHADOW_XS
                        }}>
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            overflow: 'hidden',
                            pointerEvents: 'none'
                          }}>
                            <img
                              src={SUB_PLAN_GOLD}
                              alt=""
                              decoding="async"
                              style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '100%',
                                height: '100%',
                                maxWidth: 'none',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
                          <span style={{
                            fontSize: '16px',
                            fontWeight: 500,
                            fontFamily: '"Geist", sans-serif',
                            lineHeight: '24px',
                            color: isDarkMode ? colors.textPrimary : '#0a0a0a'
                          }}>Gold</span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 400,
                            fontFamily: '"Geist", sans-serif',
                            lineHeight: '20px',
                            color: isDarkMode ? colors.textSecondary : '#737373'
                          }}>Premium features with priority support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details (personal) */}
              <div style={{
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
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
                        <button type="button" onClick={() => setEditingAccountDetails(false)} style={{
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
                        <button type="button" onClick={() => setEditingAccountDetails(false)} style={{
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
                      <button type="button" onClick={() => setEditingAccountDetails(true)} style={{
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
                    gap: '40px',
                    alignItems: 'flex-start',
                    width: '100%',
                    flexWrap: 'wrap'
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
                      <div style={{ display: 'flex', width: '100%', alignItems: 'stretch' }}>
                        <div
                          role="button"
                          tabIndex={0}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            height: '40px',
                            padding: '6px 12px',
                            border: `1px solid ${editingAccountDetails ? '#a3a3a3' : colors.border}`,
                            borderRight: 'none',
                            borderRadius: '8px 0 0 8px',
                            backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                            boxShadow: editingAccountDetails ? '0px 0px 0px 3px rgba(161, 161, 170, 0.5)' : '0px 1px 2px rgba(0,0,0,0.05)',
                            cursor: 'pointer'
                          }}
                        >
                          <img src="https://flagcdn.com/w40/us.png" alt="" style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' }} />
                          <span style={{ fontSize: '14px', color: colors.textPrimary }}>+1</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                            <path d="M4 6l4 4 4-4" stroke={colors.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <input
                          type="tel"
                          defaultValue="(555) 000-0000"
                          readOnly={!editingAccountDetails}
                          placeholder="(555) 000-0000"
                          style={{
                            flex: 1,
                            minWidth: 0,
                            height: '40px',
                            padding: '6px 12px',
                            border: `1px solid ${editingAccountDetails ? '#a3a3a3' : colors.border}`,
                            borderRadius: '0 8px 8px 0',
                            backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                            boxShadow: editingAccountDetails ? '0px 0px 0px 3px rgba(161, 161, 170, 0.5)' : '0px 1px 2px rgba(0,0,0,0.05)',
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

                  <div style={{
                    display: 'flex',
                    gap: '40px',
                    alignItems: 'flex-start',
                    width: '100%',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flex: 1, minWidth: '258px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Date of birth</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        height: '40px',
                        padding: '8px 12px',
                        border: `1px solid ${editingAccountDetails ? '#a3a3a3' : colors.border}`,
                        borderRadius: '8px',
                        backgroundColor: isDarkMode ? 'rgba(10, 10, 10, 1)' : 'white',
                        boxShadow: editingAccountDetails ? '0px 0px 0px 3px rgba(161, 161, 170, 0.5)' : '0px 1px 2px rgba(0,0,0,0.05)',
                        cursor: editingAccountDetails ? 'pointer' : 'default'
                      }}>
                        <Calendar size={16} color={colors.textSecondary} aria-hidden />
                        <span style={{ fontSize: '14px', color: colors.textMuted, lineHeight: '20px' }}>Date of birth</span>
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: '258px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Role</span>
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
                  </div>
                </div>
              </div>
              </div>

              {/* Account Details (organization) — Figma 5165:52540 */}
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

                {/* Card Body — Figma: org row, address, then location row */}
                <div style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '44px',
                    alignItems: 'flex-start',
                    width: '100%',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flex: 1, minWidth: '258px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Account Name</span>
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
                    <div style={{ flex: 1, minWidth: '258px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>Account Email Address</span>
                      </div>
                      <input
                        type="email"
                        defaultValue="arthur@alignui.com"
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
                  </div>

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

                  <div style={{
                    display: 'flex',
                    gap: '44px',
                    alignItems: 'flex-start',
                    width: '100%',
                    flexWrap: 'wrap'
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
          </PageSection>
        ) : activeNavigation === 'Teams' ? (
          <PageSection pageKey="Teams">
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
                }} alt="back" onClick={() => setActiveNavigation(mainNavBeforeProfilePageRef.current)} />
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
                  border: searchFocused ? `1px solid ${colors.accent}` : `1px solid ${colors.border}`,
                  backgroundColor: colors.bg,
                  boxShadow: searchFocused ? `0px 0px 0px 1px ${colors.accent}` : '0px 1px 2px 0px rgba(10, 13, 20, 0.03)'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    ref={teamsSearchRef}
                    type="text"
                    value={teamsSearchQuery}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
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
                      <th onClick={() => toggleTeamsSort('name')} style={{ padding: '0 16px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}`, cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Partners <ArrowUpDown size={14} color={teamsSortKey === 'name' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                      <th onClick={() => toggleTeamsSort('status')} style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}`, cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Status <ArrowUpDown size={14} color={teamsSortKey === 'status' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
                      <th onClick={() => toggleTeamsSort('role')} style={{ padding: '0 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", sans-serif', fontWeight: 500, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.3px', borderBottom: `1px solid ${colors.border}`, cursor: 'pointer' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Role <ArrowUpDown size={14} color={teamsSortKey === 'role' ? colors.textPrimary : colors.textSecondary} strokeWidth={2} /></span></th>
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
                      .sort((a, b) => {
                        if (!teamsSortKey) return 0;
                        const cmp = a[teamsSortKey].localeCompare(b[teamsSortKey]);
                        return teamsSortDir === 'asc' ? cmp : -cmp;
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
          </PageSection>
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

      {/* Commission Table Modal */}
      <AnimatePresence>
        {showCommissionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowCommissionModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(2px)',
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '1100px',
                maxWidth: '95vw',
                backgroundColor: isDarkMode ? '#171717' : 'white',
                border: `1px solid ${isDarkMode ? '#2e2e2e' : '#ebebeb'}`,
                borderRadius: '16px',
                boxShadow: '0px 16px 32px -12px rgba(14,18,27,0.1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderBottom: `1px solid ${isDarkMode ? '#2e2e2e' : '#ebebeb'}`,
                backgroundColor: isDarkMode ? '#171717' : 'white',
              }}>
                <span style={{ fontSize: '18px', fontWeight: 600, color: colors.textPrimary, fontFamily: '"Geist", sans-serif', lineHeight: '28px' }}>Commission Table</span>
                <button
                  type="button"
                  onClick={() => setShowCommissionModal(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    background: isDarkMode ? '#171717' : 'white',
                    cursor: 'pointer',
                    boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)',
                  }}
                >
                  <X size={16} color={colors.textPrimary} strokeWidth={2} />
                </button>
              </div>
              {/* Modal Content — Table */}
              <div style={{ padding: '20px', backgroundColor: isDarkMode ? '#171717' : 'white' }}>
                <div style={{ border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: isDarkMode ? 'rgba(23,23,23,1)' : '#fafafa' }}>
                        <th style={{ padding: '11px 8px 11px 24px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, lineHeight: '20px', borderBottom: `1px solid ${colors.border}`, width: '120px' }}>SR.NO.</th>
                        <th style={{ padding: '11px 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, lineHeight: '20px', borderBottom: `1px solid ${colors.border}`, width: '180px' }}>NAME</th>
                        <th style={{ padding: '11px 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, lineHeight: '20px', borderBottom: `1px solid ${colors.border}`, width: '140px' }}>VALUE</th>
                        <th style={{ padding: '11px 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, lineHeight: '20px', borderBottom: `1px solid ${colors.border}`, width: '140px' }}>FORMULA</th>
                        <th style={{ padding: '11px 16px 11px 8px', textAlign: 'left', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, lineHeight: '20px', borderBottom: `1px solid ${colors.border}` }}>DESCRIPTION</th>
                        <th style={{ padding: '11px 8px', textAlign: 'center', fontSize: '13px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textSecondary, lineHeight: '20px', borderBottom: `1px solid ${colors.border}`, width: '160px' }}>STATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { sr: '7907', name: '23-24 Commission', value: '500', formula: 'percentage', desc1: 'Flat AU$ 500 Commission for 23-24AY', desc2: 'Academic term from 2nd March 2023' },
                        { sr: '7906', name: '23-24 Commission', value: '250', formula: 'fixed', desc1: 'Flat AU$ 500 Commission for 23-24AY', desc2: 'Academic term from 2nd March 2023' },
                        { sr: '7905', name: '23-24 Commission', value: '400', formula: 'percentage', desc1: 'Flat AU$ 500 Commission for 23-24AY', desc2: 'Academic term from 2nd March 2023' },
                      ].map((row) => (
                        <tr key={row.sr} style={{ borderBottom: `1px solid ${colors.border}` }}>
                          <td style={{ padding: '18px 8px 18px 24px', fontSize: '14px', fontFamily: '"Geist Mono", monospace', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>{row.sr}</td>
                          <td style={{ padding: '18px 8px', fontSize: '14px', fontFamily: '"Geist", sans-serif', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>{row.name}</td>
                          <td style={{ padding: '18px 8px', fontSize: '14px', fontFamily: '"Geist Mono", monospace', fontWeight: 400, color: colors.textSecondary, lineHeight: '20px', textAlign: 'center' }}>{row.value}</td>
                          <td style={{ padding: '18px 8px', fontSize: '14px', fontFamily: '"Geist", sans-serif', fontWeight: 500, color: colors.textSecondary, lineHeight: '20px', textAlign: 'center' }}>{row.formula}</td>
                          <td style={{ padding: '18px 16px 18px 8px', fontSize: '14px', fontFamily: '"Geist", sans-serif', fontWeight: 500, color: colors.textPrimary, lineHeight: '20px' }}>
                            <div>{row.desc1}</div>
                            <div>{row.desc2}</div>
                          </td>
                          <td style={{ padding: '18px 8px', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 6px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontFamily: '"Geist Mono", monospace',
                              fontWeight: 500,
                              color: '#16a34a',
                              backgroundColor: 'rgba(22,163,74,0.1)',
                              textTransform: 'uppercase',
                              lineHeight: '16px',
                            }}>ACTIVE</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>;
};