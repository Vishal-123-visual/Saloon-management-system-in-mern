import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import { MENU_SIDEBAR } from '@/config/menu.config';
import { useMenu } from '@/hooks/use-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/providers/settings-provider';
import CartPage from '../../pages/store-client/components/sheets/CartPage';
import { Search } from '../../pages/store-client/home';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Sidebar } from './components/sidebar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function Demo1Layout() {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const { getCurrentItem } = useMenu(pathname);
  const item = getCurrentItem(MENU_SIDEBAR);
  const { settings, setOption } = useSettings();

  useEffect(() => {
    const bodyClass = document.body.classList;

    if (settings.layouts.demo1.sidebarCollapse) {
      bodyClass.add('sidebar-collapse');
    } else {
      bodyClass.remove('sidebar-collapse');
    }
  }, [settings]); // Runs only on settings update

  useEffect(() => {
    // Set current layout
    setOption('layout', 'demo1');
  }, [setOption]);

  useEffect(() => {
    const bodyClass = document.body.classList;

    // Add a class to the body element
    bodyClass.add('demo1');
    bodyClass.add('sidebar-fixed');
    bodyClass.add('header-fixed');

    const timer = setTimeout(() => {
      bodyClass.add('layout-initialized');
    }, 1000); // 1000 milliseconds

    // Remove the class when the component is unmounted
    return () => {
      bodyClass.remove('demo1');
      bodyClass.remove('sidebar-fixed');
      bodyClass.remove('sidebar-collapse');
      bodyClass.remove('header-fixed');
      bodyClass.remove('layout-initialized');
      clearTimeout(timer);
    };
  }, []); // Runs only once on mount

  return (
    <>
      <Helmet>
        <title>{item?.title}</title>
      </Helmet>

      <div className=" w-full h-[calc(100vh-80px)] overflow-hidden      flex mt-20  ">
        <div className="hidden xl:block"><Sidebar /></div>
        {/* <div className="">{!isMobile && <Sidebar />}</div> */}
        <div className=" w-full flex justify-center items-center">
          <div className=" h-full  flex  justify-between   lg:border-e flex-col  ">
            {/* <Search/> */}

            <ScrollArea>
              <main
                className=" h-screen overflow-y-auto border-b  "
                role="content"
              >
                <Outlet />
              </main>

              <ScrollBar orientation="vertical" />
            </ScrollArea>

            <Footer />
          </div>
        </div>
        <div className="  lg:border-e lg:border-border h-full  max-w-md font-sans font-medium hidden lg:block         ">
          <CartPage />
        </div>
      </div>
    </>
  );
}
