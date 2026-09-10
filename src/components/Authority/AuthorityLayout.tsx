import React, { useState } from 'react';
import { AuthorityProfile, EmergencyAlert, SosRequest, RescueTeam } from '../../types';
import {
  LayoutDashboard,
  Map as MapIcon,
  Radio,
  AlertOctagon,
  Truck,
  Home,
  Package,
  Satellite,
  Activity,
  BookOpen,
  BarChart3,
  FileText,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { ShieldLogo } from '../ShieldLogo';
import { BackButton } from '../BackButton';

interface AuthorityLayoutProps {
  authority: AuthorityProfile;
  alerts: EmergencyAlert[];
  sosRequests: SosRequest[];
  teams: RescueTeam[];
  isSimulating: boolean;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onSwitchToPublic: () => void;
  children: React.ReactNode;
}

export const AuthorityLayout: React.FC<AuthorityLayoutProps> = ({
  authority,
  alerts,
  sosRequests,
  teams,
  isSimulating,
  activeTab,
  onSelectTab,
  onLogout,
  onSwitchToPublic,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;
  const pendingSosCount = sosRequests.filter((s) => s.status !== 'RESOLVED').length;
  const availableTeamsCount = teams.filter((t) => t.currentStatus === 'AVAILABLE').length;

  const NAV_ITEMS = [
    { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
    { id: 'alerts', label: 'Emergency Alerts', icon: Radio, badge: activeAlertsCount > 0 ? activeAlertsCount : undefined, badgeColor: 'bg-[#8B3A3A]' },
    { id: 'sos', label: 'SOS Incident Desk', icon: AlertOctagon, badge: pendingSosCount > 0 ? pendingSosCount : undefined, badgeColor: 'bg-[#D4A373]' },
    { id: 'teams', label: 'Rescue Units', icon: Truck, badge: `${availableTeamsCount}/${teams.length}` },
    { id: 'shelters', label: 'Shelters & Evac', icon: Home },
    { id: 'resources', label: 'Relief Stockpile', icon: Package },
    { id: 'satellite', label: 'Satellite Intelligence', icon: Satellite },
    { id: 'simulation', label: 'Scenario Simulation', icon: Activity, badge: isSimulating ? 'SIM' : undefined, badgeColor: 'bg-[#5A5A40]' },
    { id: 'archive', label: 'Historical Archive', icon: BookOpen },
    { id: 'analytics', label: 'Incident Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit & Compliance', icon: FileText },
    { id: 'settings', label: 'Gateway Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#434338] flex flex-col">
      {/* Top Authority Control Header */}
      <header className="sticky top-0 z-40 bg-[#fdfbf7] text-[#434338] border-b border-[#e8e4db] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#7a7a67] hover:text-[#434338] hover:bg-[#f1efe9]"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <ShieldLogo size={32} showText={false} />
            <div>
              <div className="flex items-center gap-2.5">
                <span
                  className="font-bold text-base tracking-tight text-[#434338] font-serif"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  SURAKSHA COMMAND
                </span>
                {isSimulating ? (
                  <span className="px-2.5 py-0.5 text-[9px] font-bold bg-[#faf3eb] text-[#B37D4E] border border-[#ecdacb] rounded-full uppercase tracking-wider animate-pulse">
                    DRILL ACTIVE
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-[9px] font-semibold bg-[#edf1eb] text-[#5A5A40] border border-[#d8ded3] rounded-full uppercase tracking-wider">
                    OPERATIONAL
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#8c8c73] hidden sm:inline">
                {authority.department} &bull; {authority.district} EOC
              </span>
            </div>
          </div>

          {/* Quick status badges on desktop */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="px-3.5 py-1.5 bg-white rounded-full border border-[#e8e4db] flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#8B3A3A]"></span>
              <span className="text-[#434338] font-medium">{activeAlertsCount} Alerts Active</span>
            </div>
            <div className="px-3.5 py-1.5 bg-white rounded-full border border-[#e8e4db] flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#D4A373]"></span>
              <span className="text-[#434338] font-medium">{pendingSosCount} SOS Queued</span>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-[#434338]">{authority.name}</div>
              <div className="text-[10px] text-[#8c8c73] font-mono">{authority.authorityId}</div>
            </div>
            <button
              onClick={onSwitchToPublic}
              className="px-3 py-1.5 bg-[#f1efe9] hover:bg-[#e8e4db] text-[#434338] text-xs font-semibold rounded-full border border-[#e8e4db] transition-colors cursor-pointer"
              title="View Public Citizen Portal"
            >
              Public View
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 text-[#8c8c73] hover:text-[#8B3A3A] rounded-full hover:bg-[#f1efe9] transition-colors cursor-pointer"
              title="Logout Authority"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 border-r border-[#e8e4db] bg-[#fdfbf7] p-5 space-y-1.5 self-stretch flex-shrink-0">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73]">
            Command Modules
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#f1efe9] text-[#5A5A40] font-semibold'
                    : 'text-[#7a7a67] hover:bg-[#f5f5f0] hover:text-[#434338]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? 'text-[#5A5A40]' : 'text-[#8c8c73]'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      item.badgeColor
                        ? `${item.badgeColor} text-white`
                        : isActive
                        ? 'bg-[#5A5A40] text-white'
                        : 'bg-[#e8e4db] text-[#434338]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-[#434338]/50 backdrop-blur-xs flex">
            <div className="w-64 bg-[#fdfbf7] p-5 space-y-1.5 h-full shadow-xl border-r border-[#e8e4db]">
              <div className="flex items-center justify-between pb-3 border-b border-[#e8e4db] mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73]">
                  Command Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#8c8c73] hover:text-[#434338]"
                >
                  <X size={18} />
                </button>
              </div>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#f1efe9] text-[#5A5A40] font-semibold'
                        : 'text-[#7a7a67] hover:bg-[#f5f5f0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={isActive ? 'text-[#5A5A40]' : 'text-[#8c8c73]'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#e8e4db] text-[#434338]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 bg-[#f5f5f0]">
          {activeTab !== 'overview' && (
            <div className="mb-4">
              <BackButton
                onClick={() => onSelectTab('overview')}
                label="Command Overview"
              />
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};
