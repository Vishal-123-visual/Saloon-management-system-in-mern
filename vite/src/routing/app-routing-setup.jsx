import { Navigate, Route, Routes } from 'react-router';
import { AuthRouting } from '../auth/auth-routing';
import { UpdateCustomerDetails } from '../auth/pages/UpdateCustomerDetails';
import { RequireAuth } from '../auth/require-auth';
import { ErrorRouting } from '../errors/error-routing';
import { Header } from '../layouts/demo1/components/header';
import { Demo1Layout } from '../layouts/demo1/layout';
import { AccountGetStartedPage } from '../pages/account/home/get-started';
import { AccountUserProfilePage } from '../pages/account/home/user-profile';
import { DefaultPage, Demo1DarkSidebarPage } from '../pages/dashboards';
import { ProfileDefaultPage } from '../pages/public-profile/profiles/default';
import AddCategory from '../pages/store-admin/category/AddCategory';
import EditCategory from '../pages/store-admin/category/EditCategory';
import { DashboardPage } from '../pages/store-admin/dashboard';
import AddProduct from '../pages/store-admin/inventory/products/AddProduct';
import EditProduct from '../pages/store-admin/inventory/products/EditProduct';
import { ProductList } from '../pages/store-admin/inventory/products/ProductList';
import SavedCartsPage from '../pages/store-admin/inventory/SaveCartItems/GetAllSavedCartItems';
import { UserList } from '../pages/store-admin/manage/AdminAndStaff';
import { CustomerList } from '../pages/store-admin/manage/customer/AllCustomer';
import UpdateUserRole from '../pages/store-admin/manage/UpdateUserRole';
import InvoicePage from '../pages/store-admin/payment/Invoice';
import PaymentPage from '../pages/store-admin/payment/PaymentPage';
import CartPage from '../pages/store-client/components/sheets/CartPage';
import { Deals, StoreClientPage } from '../pages/store-client/home';
import PrivateRoute from './PrivateRoute';
import { OneTimeVisitedCustomerList } from '../pages/store-admin/manage/customer/OneTimeVisitedCustomer';
import { MultipleTimeVisitedCustomerList } from '../pages/store-admin/manage/customer/MultipleTimeVisitedCustomer';
import { AllCategories } from '../pages/store-admin/category/AllCategories';
import { AllPayments } from '../pages/store-admin/payment/AllPayment';

export function AppRoutingSetup() {
  return (
    <>
      <Header />
      <Routes>
        <Route element={<RequireAuth />}>
          <Route element={<Demo1Layout />}>
            <Route path="/" element={<StoreClientPage />} />
            <Route path="/dark-sidebar" element={<Demo1DarkSidebarPage />} />
            <Route
              path="/public-profile/profiles/default/"
              element={<ProfileDefaultPage />}
            />
            <Route
              path="/account/home/user-profile"
              element={<AccountUserProfilePage />}
            />
            <Route path="/store-client/cart-page" element={<CartPage />} />
            <Route
              path="/store-admin/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/store-admin/add-category"
              element={
                <PrivateRoute>
                  <AddCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="/store-admin/edit-category/:id"
              element={
                <PrivateRoute>
                  <EditCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="/store-admin/add-product"
              element={
                <PrivateRoute>
                  <AddProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/store-admin/edit-product/:id"
              element={
                <PrivateRoute>
                  <EditProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/store-admin/saved-carts"
              element={
                <PrivateRoute>
                  <SavedCartsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/store-admin/payment"
              element={
                <PrivateRoute>
                  <PaymentPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/store-admin/all-payment"
              element={
                <PrivateRoute>
                  <AllPayments />
                </PrivateRoute>
              }
            />
            <Route
              path="/store-admin/invoice/:id"
              element={
                <PrivateRoute>
                  <InvoicePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/store-admin/inventory/all-products"
              element={
                <PrivateRoute>
                  <ProductList />
                </PrivateRoute>
              }
            />
            <Route
              path="/store-admin/inventory/all-categories"
              element={
                <PrivateRoute>
                  <AllCategories />
                </PrivateRoute>
              }
            />
            <Route
              path="store-admin/edit-user/:id"
              element={
                <PrivateRoute>
                  <UpdateUserRole />
                </PrivateRoute>
              }
            />
            <Route
              path="store-admin/edit-customer/:id"
              element={
                <PrivateRoute>
                  <UpdateCustomerDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="store-admin/all-user"
              element={
                <PrivateRoute>
                  <UserList />
                </PrivateRoute>
              }
            />
            <Route
              path="store-admin/all-customers"
              element={
                <PrivateRoute>
                  <CustomerList />
                </PrivateRoute>
              }
            />
            <Route
              path="store-admin/one-time-visited-customer"
              element={
                <PrivateRoute>
                  <OneTimeVisitedCustomerList />
                </PrivateRoute>
              }
            />
            <Route
              path="store-admin/multiple-time-visited-customer"
              element={
                <PrivateRoute>
                  <MultipleTimeVisitedCustomerList />
                </PrivateRoute>
              }
            />

            <Route
              path="/auth/get-started"
              element={<AccountGetStartedPage />}
            />
          </Route>
        </Route>
        <Route path="error/*" element={<ErrorRouting />} />
        <Route path="auth/*" element={<AuthRouting />} />
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Routes>
    </>
  );
}


 {/* <Route
            path="/public-profile/profiles/creator"
            element={<ProfileCreatorPage />}
          />

          <Route
            path="/public-profile/profiles/company"
            element={<ProfileCompanyPage />}
          />

          <Route
            path="/public-profile/profiles/nft"
            element={<ProfileNFTPage />}
          />

          <Route
            path="/public-profile/profiles/blogger"
            element={<ProfileBloggerPage />}
          />

          <Route
            path="/public-profile/profiles/crm"
            element={<ProfileCRMPage />}
          />

          <Route
            path="/public-profile/profiles/gamer"
            element={<ProfileGamerPage />}
          />

          <Route
            path="/public-profile/profiles/feeds"
            element={<ProfileFeedsPage />}
          />

          <Route
            path="/public-profile/profiles/plain"
            element={<ProfilePlainPage />}
          />

          <Route
            path="/public-profile/profiles/modal"
            element={<ProfileModalPage />}
          />

          <Route
            path="/public-profile/projects/3-columns"
            element={<ProjectColumn3Page />}
          />

          <Route
            path="/public-profile/projects/2-columns"
            element={<ProjectColumn2Page />}
          />

          <Route path="/public-profile/works" element={<ProfileWorksPage />} />
          <Route path="/public-profile/teams" element={<ProfileTeamsPage />} />
          <Route
            path="/public-profile/network"
            element={<ProfileNetworkPage />}
          />

          <Route
            path="/public-profile/activity"
            element={<ProfileActivityPage />}
          />

          <Route
            path="/public-profile/campaigns/card"
            element={<CampaignsCardPage />}
          />

          <Route
            path="/public-profile/campaigns/list"
            element={<CampaignsListPage />}
          />

          <Route path="/public-profile/empty" element={<ProfileEmptyPage />} />
          <Route
            path="/account/home/get-started"
            element={<AccountGetStartedPage />}
          /> */}

            {/*
          <Route
            path="/account/home/company-profile"
            element={<AccountCompanyProfilePage />}
          />

          <Route
            path="/account/home/settings-sidebar"
            element={<AccountSettingsSidebarPage />}
          />

          <Route
            path="/account/home/settings-enterprise"
            element={<AccountSettingsEnterprisePage />}
          />

          <Route
            path="/account/home/settings-plain"
            element={<AccountSettingsPlainPage />}
          />

          <Route
            path="/account/home/settings-modal"
            element={<AccountSettingsModalPage />}
          />

          <Route path="/account/billing/basic" element={<AccountBasicPage />} />
          <Route
            path="/account/billing/enterprise"
            element={<AccountEnterprisePage />}
          />

          <Route path="/account/billing/plans" element={<AccountPlansPage />} />
          <Route
            path="/account/billing/history"
            element={<AccountHistoryPage />}
          />

          <Route
            path="/account/security/get-started"
            element={<AccountSecurityGetStartedPage />}
          />

          <Route
            path="/account/security/overview"
            element={<AccountOverviewPage />}
          />

          <Route
            path="/account/security/allowed-ip-addresses"
            element={<AccountAllowedIPAddressesPage />}
          />

          <Route
            path="/account/security/privacy-settings"
            element={<AccountPrivacySettingsPage />}
          />

          <Route
            path="/account/security/device-management"
            element={<AccountDeviceManagementPage />}
          />

          <Route
            path="/account/security/backup-and-recovery"
            element={<AccountBackupAndRecoveryPage />}
          />

          <Route
            path="/account/security/current-sessions"
            element={<AccountCurrentSessionsPage />}
          />

          <Route
            path="/account/security/security-log"
            element={<AccountSecurityLogPage />}
          />

          <Route
            path="/account/members/team-starter"
            element={<AccountTeamsStarterPage />}
          />

          <Route path="/account/members/teams" element={<AccountTeamsPage />} />
          <Route
            path="/account/members/team-info"
            element={<AccountTeamInfoPage />}
          />

          <Route
            path="/account/members/members-starter"
            element={<AccountMembersStarterPage />}
          />

          <Route
            path="/account/members/team-members"
            element={<AccountTeamMembersPage />}
          />

          <Route
            path="/account/members/import-members"
            element={<AccountImportMembersPage />}
          />

          <Route path="/account/members/roles" element={<AccountRolesPage />} />
          <Route
            path="/account/members/permissions-toggle"
            element={<AccountPermissionsTogglePage />}
          />

          <Route
            path="/account/members/permissions-check"
            element={<AccountPermissionsCheckPage />}
          />

          <Route
            path="/account/integrations"
            element={<AccountIntegrationsPage />}
          />

          <Route
            path="/account/notifications"
            element={<AccountNotificationsPage />}
          />

          <Route path="/account/api-keys" element={<AccountApiKeysPage />} />
          <Route
            path="/account/appearance"
            element={<AccountAppearancePage />}
          />

          <Route
            path="/account/invite-a-friend"
            element={<AccountInviteAFriendPage />}
          />

          <Route path="/account/activity" element={<AccountActivityPage />} />
          <Route
            path="/network/get-started"
            element={<NetworkGetStartedPage />}
          />

          <Route
            path="/network/user-cards/mini-cards"
            element={<NetworkMiniCardsPage />}
          />

          <Route
            path="/network/user-cards/team-crew"
            element={<NetworkUserCardsTeamCrewPage />}
          />

          <Route
            path="/network/user-cards/author"
            element={<NetworkAuthorPage />}
          />

          <Route path="/network/user-cards/nft" element={<NetworkNFTPage />} />
          <Route
            path="/network/user-cards/social"
            element={<NetworkSocialPage />}
          />

          <Route
            path="/network/user-table/team-crew"
            element={<NetworkUserTableTeamCrewPage />}
          />

          <Route
            path="/network/user-table/app-roster"
            element={<NetworkAppRosterPage />}
          />

          <Route
            path="/network/user-table/market-authors"
            element={<NetworkMarketAuthorsPage />}
          />

          <Route
            path="/network/user-table/saas-users"
            element={<NetworkSaasUsersPage />}
          />

          <Route
            path="/network/user-table/store-clients"
            element={<NetworkStoreClientsPage />}
          />

          <Route
            path="/network/user-table/visitors"
            element={<NetworkVisitorsPage />}
          />

          <Route
            path="/auth/welcome-message"
            element={<AuthWelcomeMessagePage />}
          />

          <Route
            path="/auth/account-deactivated"
            element={<AuthAccountDeactivatedPage />}
          />

          <Route path="/store-client/store-client-page" element={<StoreClientPage />} />
          <Route
            path="/store-client/search-results-grid"
            element={<SearchResultsGridPage />}
          />

          <Route
            path="/store-client/search-results-list"
            element={<SearchResultsListPage />}
          />

          <Route
            path="/store-client/product-details"
            element={<ProductDetailsPage />}
          /> */}

            {/* <Route path="/store-client/wishlist" element={<WishlistPage />} />
          <Route
          path="/store-client/checkout/order-summary"
          element={<OrderSummaryPage />}
          />
          
          <Route
          path="/store-client/checkout/shipping-info"
          element={<ShippingInfoPage />}
          />

          <Route
          path="/store-client/checkout/payment-method"
          element={<PaymentMethodPage />}
          />
          
          <Route
            path="/store-client/checkout/order-placed"
            element={<OrderPlacedPage />}
          />
          
          <Route path="/store-client/my-orders" element={<MyOrdersPage />} />
          <Route
          path="/store-client/order-receipt"
          element={<OrderReceiptPage />} 
          />
          */}