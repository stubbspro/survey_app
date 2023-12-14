import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Survey app',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} h-screen`}>
        <div className='h-[calc(100vh_-_70px)] sm:h-[calc(100vh_-_130px)]'>
          {children}
        </div>
      </body>
    </html>
  );
}
