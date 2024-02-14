import '@/styles/globals.css'
import TanstackProvider from '@/context/TanstackProvider'
import RecoilProvider from '@/context/RecoilProvider'
import { ToastContainer } from 'react-toastify'
import Navbar from '@/components/NavBar'
import Footer from '@/components/ui/Footer'
import { Providers } from '@/app/providers'
import Script from 'next/script'
import 'react-toastify/dist/ReactToastify.css'

export const metadata = {
  title: {
    default: 'HOTSHARE',
    template: '%s | HOTSHARE',
  },
  description: 'home',
}

export default function RootLayout({ children }) {
  return (
    <html lang='ko'>
      <head>
        <link
          rel='icon'
          type='image/png'
          sizes='128x128'
          href='/hotshare_icon.png'
        />
      </head>
      <body className='font-jalnan w-full h-screen overflow-auto flex flex-col justify-between'>
        <Script
          strategy='beforeInteractive'
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        />
        <Providers>
          <ToastContainer
            position='top-center'
            autoClose={2000}
            pauseOnHover={false}
            pauseOnFocusLoss={false}
          />
          <RecoilProvider>
            <TanstackProvider>
              <header className='fixed top-0 w-full mx-auto bg-white dark:border-slate-600/40 z-[999] dark:bg-base-100'>
                <div className='max-w-screen-xl mx-auto'>
                  <Navbar />
                </div>
                <hr />
              </header>
              <main className='w-full h-auto order-1 max-w-screen-xl mx-auto mt-[72px]'>
                {children}
              </main>
              <Footer />
              <div id='portal'></div>
            </TanstackProvider>
          </RecoilProvider>
        </Providers>
      </body>
    </html>
  )
}
