import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { SidebarHeader } from './sidebar-header';
import { SidebarMenu } from './sidebar-menu';

export function Sidebar() {
  const { settings } = useSettings();
  const { pathname } = useLocation();

  return (
    <div
      className={cn(
        ' h-full border-e ',
        (settings.layouts.demo1.sidebarTheme === 'dark' ||
          pathname.includes('dark-sidebar')) &&
          'dark',
      )}
    >
      {/* <SidebarHeader /> */}
      <div className="overflow-hidden">
        <div className="w-(--sidebar-default-width)">
          <SidebarMenu />
        </div>
      </div>
    </div>
    // <div
    //   className={cn(
    //     ' bg-background lg:border-e lg:border-border lg:fixed  border-b   lg:flex flex-col items-stretch shrink-0',
    //     (settings.layouts.demo1.sidebarTheme === 'dark' ||
    //       pathname.includes('dark-sidebar')) &&
    //       'dark',
    //   )}
    // >
    //   {/* <SidebarHeader /> */}
    //   <div className="overflow-hidden">
    //     <div className="w-(--sidebar-default-width)">
    //       <SidebarMenu />
    //     </div>
    //   </div>
    // </div>
  );
}
