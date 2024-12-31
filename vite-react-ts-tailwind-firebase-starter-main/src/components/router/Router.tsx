import { lazy, Suspense } from 'react';
import { BrowserRouter, Outlet, RouteObject, useRoutes } from 'react-router-dom';
import { AuthNavButton } from '../domain/auth/AuthNavButton';

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

const IndexScreen = lazy(() => import('~/components/screens/Index'));
const TutorialScreen = lazy(() => import('~/components/screens/Tutorial'));
const ProfileScreen = lazy(() => import('~/components/screens/Profile'));
const LabelScreen = lazy(() => import('~/components/screens/Label'));
const CropScreen = lazy(() => import('~/components/screens/Crop'));
const Page404Screen = lazy(() => import('~/components/screens/404'));

function Layout() {
  return (
    <div>
      <nav className="p-4 flex items-center justify-between gap-2 font-bold text-lg">
        <a href="/">
          <img
            className="w-32"
            src="https://framerusercontent.com/images/rnW1Q2GsGTt3hyXFkTM7ooGFa2w.png?scale-down-to=512"
          />
        </a>
        <AuthNavButton />
      </nav>
      <Outlet />
    </div>
  );
}

export const Router = () => {
  return (
    <BrowserRouter>
      <InnerRouter />
    </BrowserRouter>
  );
};

const InnerRouter = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <IndexScreen />,
        },
        {
          path: '/tutorial',
          element: <TutorialScreen />,
        },
        {
          path: '/profile',
          element: <ProfileScreen />,
        },
        {
          path: '/crop',
          element: <CropScreen />,
        },
        {
          path: '/label',
          element: <LabelScreen />,
        },
        {
          path: '*',
          element: <Page404Screen />,
        },
      ],
    },
  ];
  const element = useRoutes(routes);
  return (
    <div>
      <Suspense fallback={<Loading />}>{element}</Suspense>
    </div>
  );
};
