import { useEffect, useState } from 'react';
import { StoreClientTopbar } from '@/pages/store-client/components/common/topbar';
import { SearchDialog } from '@/partials/dialogs/search/search-dialog';
import { AppsDropdownMenu } from '@/partials/topbar/apps-dropdown-menu';
import { ChatSheet } from '@/partials/topbar/chat-sheet';
import { NotificationsSheet } from '@/partials/topbar/notifications-sheet';
import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import {
  Bell,
  LayoutGrid,
  Menu,
  MessageCircleMore,
  Search,
  SquareChevronRight,
} from 'lucide-react';
import { FaShoppingCart } from 'react-icons/fa';
import { TiUserAdd } from 'react-icons/ti';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Container } from '@/components/common/container';
import { CustomAdapter } from '../../../auth/adapters/custome-adapter';
import { useAuth } from '../../../auth/context/auth-context';
import {
  useCart,
  useCustomer,
  useSeacrh,
} from '../../../pages/store-client/components/sheets/CartContext';
import { Breadcrumb } from './breadcrumb';
import { MegaMenu } from './mega-menu';
import { MegaMenuMobile } from './mega-menu-mobile';
import { SidebarMenu } from './sidebar-menu';

export function Header() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const { setCustomer } = useCustomer();
  const { searchQuery, setSearchQuery } = useSeacrh(); // ✅ from context

  const [searchCustomer, setSearchCustomer] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /// quantity of items in cart
  const quantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 🔎 Trigger API when typing (with debounce)
  useEffect(() => {
    if (!searchCustomer.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await CustomAdapter.searchCustomers(searchCustomer);
        setResults(res || []);
        //console.log('res',res)
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchCustomer]);

  // useEffect(() => {
  //   console.log('qty', quantity);
  // }, [quantity]);
  //console.log(user)
  const [isSidebarSheetOpen, setIsSidebarSheetOpen] = useState(false);
  const [isMegaMenuSheetOpen, setIsMegaMenuSheetOpen] = useState(false);

  const { pathname } = useLocation();
  const mobileMode = useIsMobile();

  const scrollPosition = useScrollPosition();
  const headerSticky = scrollPosition > 0;

  // Close sheet when route changes
  useEffect(() => {
    setIsSidebarSheetOpen(false);
    setIsMegaMenuSheetOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        ' w-full fixed top-0 z-10 start-0   flex items-stretch shrink-0 border-b border-transparent  end-0 pe-[var(--removed-body-scroll-bar-size,0px)]',
        headerSticky && 'border-b border-border',
      )}
    >
      <div className=" w-full flex justify-between items-stretch lg:gap-4 gap-5   bg-cyan-400">
        {/* HeaderLogo for mobile */}
        <div className="  flex justify-between  lg:hidden items-center gap-2.5 pl-4 ">
          <Link to="/" className="shrink-0 ">
            <img
              src="/media/app/mini-logo.svg"
              className="h-[25px] w-full"
              alt="mini-logo"
            />
          </Link>
          <div className="flex items-center gap-2">
            {mobileMode && (
              <Sheet
                open={isSidebarSheetOpen}
                onOpenChange={setIsSidebarSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="ghost" mode="icon">
                    <Menu className=" text-neutral-700 " />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  className="p-0 gap-0 w-[275px]"
                  side="left"
                  close={false}
                >
                  <SheetHeader className="p-0 space-y-0" />
                  <SheetBody className="p-0 overflow-y-auto">
                    <SidebarMenu />
                  </SheetBody>
                </SheetContent>
              </Sheet>
            )}
            {/* {mobileMode && (
              <Sheet
                open={isMegaMenuSheetOpen}
                onOpenChange={setIsMegaMenuSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="ghost" mode="icon">
                    <SquareChevronRight className="text-neutral-700" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  className="p-0 gap-0 w-[275px]"
                  side="left"
                  close={false}
                >
                  <SheetHeader className="p-0 space-y-0" />
                  <SheetBody className="p-0 overflow-y-auto">
                    <MegaMenuMobile />
                  </SheetBody>
                </SheetContent>
              </Sheet>
            )} */}
          </div>
        </div>

        {/* HeaderTopbar */}
        <div className=" w-full flex items-center ">
          <div className=" w-full  xl:w-[77.5%]  pl-4 flex justify-start items-center gap-28  overflow-hidden  py-3 pr-2  ">
            <div className=" hidden lg:flex items-center gap-5 md:pl-4  ">
              <Link to="/" className="shrink-0 ">
                <img
                  src="/media/app/mini-logo.svg"
                  className="h-[25px] w-full"
                  alt="mini-logo"
                />
              </Link>
              <div className="flex items-center gap-2">
                {!mobileMode && (
                  <Sheet
                    open={isSidebarSheetOpen}
                    onOpenChange={setIsSidebarSheetOpen}
                  >
                    <SheetTrigger asChild>
                      <Button variant="ghost" mode="icon">
                        <Menu className=" text-neutral-700 " />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      className="p-0 gap-0 w-[275px]"
                      side="left"
                      close={false}
                    >
                      <SheetHeader className="p-0 space-y-0" />
                      <SheetBody className="p-0 overflow-y-auto">
                        <SidebarMenu />
                      </SheetBody>
                    </SheetContent>
                  </Sheet>
                )}
              </div>
              <div className=" text-neutral-50 font-medium border-1 px-10 py-1 rounded-md border-neutral-500">
                <p>{user ? user?.role : 'User'}</p>
              </div>
            </div>

            <div className=" w-full flex lg:justify-between  items-center sm:gap-5">
              <div className=" w-full sm:w-[300px] lg:w-full   bg-gray-100  rounded-lg px-1 sm:px-5 py-1 sm:py-2 lg:py-3 ">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  name="search"
                  id=""
                  placeholder="Search Product by name and other..."
                  className=" w-full outline-none text-black font-semibold"
                />
              </div>
              <div className="relative xl:w-72 hidden sm:block xl:hidden ">
                <input
                  type="text"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  placeholder="Search customer by name / number"
                  className="w-full px-3 py-2 rounded-md outline-none bg-gray-200 text-black font-medium"
                />

                {/* Dropdown Results */}
                {searchCustomer && (
                  <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-y-auto z-20">
                    {loading && (
                      <p className="p-2 text-gray-500">Searching...</p>
                    )}
                    {!loading && results.length === 0 && (
                      <p className="p-2 text-gray-500">No customers found</p>
                    )}
                    {!loading &&
                      results.map((c) => (
                        <div
                          key={c._id}
                          className="p-2  hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setCustomer(c);
                            toast.success('selected');
                            setResults([]);
                            setSearchCustomer('');
                          }}
                        >
                          <p className="font-medium text-black">{c.name}</p>
                          <p className="text-sm text-gray-500">{c.phone}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className=" w-full sm:w-fit flex items-center justify-end gap-3">
                <div className=" flex items-center">
                  {/* <SearchDialog
                  trigger={
                    <Button
                      variant="ghost"
                      mode="icon"
                      shape="circle"
                      className="size-9 block sm:hidden text-neutral-700 hover:bg-primary/10 hover:[&_svg]:text-primary"
                    >
                      <Search className="size-4.5!" />
                    </Button>
                  }
                /> */}
                  <div className=" relative block  lg:hidden border border-red-600  rounded-full p-1">
                    <Link to={'/store-client/cart-page'}>
                      <FaShoppingCart size={14} className=" text-red-900" />
                    </Link>
                    {quantity > 0 && (
                      <div className=" absolute -top-2 -right-2  w-5 h-5 border-2 text-neutral-50 font-bold rounded-full flex justify-center items-center ">
                        <span>{quantity}</span>
                      </div>
                    )}
                  </div>
                </div>

                {user ? (
                  <div>
                    {mobileMode ? (
                      <UserDropdownMenu
                        trigger={
                          <img
                            className="size-9 rounded-full border-2 border-green-500 shrink-0 cursor-pointer"
                            src={'/media/avatars/300-2.png'}
                            alt="User Avatar"
                          />
                        }
                      />
                    ) : (
                      <UserDropdownMenu
                        trigger={
                          <img
                            className="size-12 rounded-full border-2 border-green-500 shrink-0 cursor-pointer"
                            src={'/media/avatars/300-2.png'}
                            alt="User Avatar"
                          />
                        }
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    <Link
                      to={'/auth/signin'}
                      className=" bg-cyan-700 text-white px-4 py-2 rounded-md "
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!mobileMode && (
            <div className="w-[22.5%] hidden h-full  py-3 px-4 bg-cyan-600 xl:flex justify-center items-center gap-4    ">
              <div className=" relative border border-red-600  rounded-full p-1">
                <Link to={'#'}>
                  <FaShoppingCart size={20} className=" text-red-900" />
                </Link>
                {quantity > 0 && (
                  <div className=" absolute -top-2 -right-2  w-5 h-5 border-2 text-neutral-50 font-bold rounded-full flex justify-center items-center ">
                    <span>{quantity}</span>
                  </div>
                )}
              </div>
              {/* Customer Search (desktop view example) */}
              <div className="relative w-72">
                <input
                  type="text"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  placeholder="Search customer by name / number"
                  className="w-full px-3 py-2 rounded-md outline-none bg-gray-100 text-black  font-medium"
                />

                {/* Dropdown Results */}
                {searchCustomer && (
                  <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-y-auto z-20">
                    {loading && (
                      <p className="p-2 text-gray-500">Searching...</p>
                    )}
                    {!loading && results.length === 0 && (
                      <p className="p-2 text-gray-500">No customers found</p>
                    )}
                    {!loading &&
                      results.map((c) => (
                        <div
                          key={c._id}
                          className="p-2 text-black hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setCustomer(c);
                            toast.success('selected');
                            setResults([]);
                            setSearchCustomer(c.phone);
                          }}
                        >
                          <p className="font-medium">{c.name}</p>
                          <p className="text-sm text-gray-500">{c.phone}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div>
                <Link to={'/auth/add-customer'}>
                  <TiUserAdd size={25} className=" text-white" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    // <header
    //   className={cn(
    //     ' w-full fixed top-0 z-10 start-0 py-2 px-8 flex items-stretch shrink-0 border-b border-transparent bg-teal-100 end-0 pe-[var(--removed-body-scroll-bar-size,0px)]',
    //     headerSticky && 'border-b border-border',
    //   )}
    // >
    //   <div className="flex justify-between items-stretch lg:gap-4">
    //     {/* HeaderLogo */}
    //     <div className="flex  lg:hidden items-center gap-2.5">
    //       <Link to="/" className="shrink-0 ">
    //         <img
    //           src='/media/app/mini-logo.svg'
    //           className="h-[25px] w-full"
    //           alt="mini-logo"
    //         />
    //       </Link>
    //       <div className="flex items-center">
    //         {mobileMode && (
    //           <Sheet
    //             open={isSidebarSheetOpen}
    //             onOpenChange={setIsSidebarSheetOpen}
    //           >
    //             <SheetTrigger asChild>
    //               <Button variant="ghost" mode="icon">
    //                 <Menu className="text-muted-foreground/70" />
    //               </Button>
    //             </SheetTrigger>
    //             <SheetContent
    //               className="p-0 gap-0 w-[275px]"
    //               side="left"
    //               close={false}
    //             >
    //               <SheetHeader className="p-0 space-y-0" />
    //               <SheetBody className="p-0 overflow-y-auto">
    //                 <SidebarMenu />
    //               </SheetBody>
    //             </SheetContent>
    //           </Sheet>
    //         )}
    //         {mobileMode && (
    //           <Sheet
    //             open={isMegaMenuSheetOpen}
    //             onOpenChange={setIsMegaMenuSheetOpen}
    //           >
    //             <SheetTrigger asChild>
    //               <Button variant="ghost" mode="icon">
    //                 <SquareChevronRight className="text-muted-foreground/70" />
    //               </Button>
    //             </SheetTrigger>
    //             <SheetContent
    //               className="p-0 gap-0 w-[275px]"
    //               side="left"
    //               close={false}
    //             >
    //               <SheetHeader className="p-0 space-y-0" />
    //               <SheetBody className="p-0 overflow-y-auto">
    //                 <MegaMenuMobile />
    //               </SheetBody>
    //             </SheetContent>
    //           </Sheet>
    //         )}
    //       </div>
    //     </div>

    //     {/* Main Content (MegaMenu or Breadcrumbs) */}
    //     {pathname.startsWith('/account') ? (
    //       <Breadcrumb />
    //     ) : (
    //       !mobileMode && <MegaMenu />
    //     )}

    //     {/* HeaderTopbar */}
    //     <div className="flex items-center gap-3">
    //       {pathname.startsWith('/store-client') ? (
    //         <StoreClientTopbar />
    //       ) : (
    //         <>
    //           {!mobileMode && (
    //             <SearchDialog
    //               trigger={
    //                 <Button
    //                   variant="ghost"
    //                   mode="icon"
    //                   shape="circle"
    //                   className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
    //                 >
    //                   <Search className="size-4.5!" />
    //                 </Button>
    //               }
    //             />
    //           )}
    //           <NotificationsSheet
    //             trigger={
    //               <Button
    //                 variant="ghost"
    //                 mode="icon"
    //                 shape="circle"
    //                 className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
    //               >
    //                 <Bell className="size-4.5!" />
    //               </Button>
    //             }
    //           />

    //           <ChatSheet
    //             trigger={
    //               <Button
    //                 variant="ghost"
    //                 mode="icon"
    //                 shape="circle"
    //                 className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
    //               >
    //                 <MessageCircleMore className="size-4.5!" />
    //               </Button>
    //             }
    //           />

    //           <AppsDropdownMenu
    //             trigger={
    //               <Button
    //                 variant="ghost"
    //                 mode="icon"
    //                 shape="circle"
    //                 className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
    //               >
    //                 <LayoutGrid className="size-4.5!" />
    //               </Button>
    //             }
    //           />

    //           <UserDropdownMenu
    //             trigger={
    //               <img
    //                 className="size-9 rounded-full border-2 border-green-500 shrink-0 cursor-pointer"
    //                 src={'/media/avatars/300-2.png'}
    //                 alt="User Avatar"
    //               />
    //             }
    //           />
    //         </>
    //       )}
    //     </div>
    //   </div>
    // </header>
  );
}
