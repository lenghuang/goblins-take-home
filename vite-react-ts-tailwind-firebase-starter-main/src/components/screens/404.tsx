import { Head } from '~/components/shared/Head';

function Page404() {
  return (
    <>
      <Head title={'Page not found'}></Head>
      <div className="hero min-h-screen bg-white">
        <div className="text-center hero-content text-3xl font-bold">
          <div>
            <h1>Oops! This page doesn't exist.</h1>
            <div className="mt-4">
              <a href="/" className="link-primary">
                Go back home.
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page404;
