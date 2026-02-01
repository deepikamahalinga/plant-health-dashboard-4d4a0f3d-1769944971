// app/layout.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import AuthProvider from '@/providers/AuthProvider';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Toaster } from '@/components/ui/Toaster';

export const metadata: Metadata = {
  title: 'Agricultural Dashboard',
  description: 'Real-time monitoring of plant and soil health metrics',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <div className="flex min-h-screen">
            <Navigation />
            <main className="flex-1 p-6">
              <Suspense fallback={<LoadingSpinner />}>
                {children}
              </Suspense>
            </main>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

// app/page.tsx
export default function HomePage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Welcome to Agricultural Dashboard</h1>
    </div>
  );
}

// app/(auth)/login/page.tsx
export default function LoginPage() {
  return <LoginForm />;
}

// app/(auth)/register/page.tsx
export default function RegisterPage() {
  return <RegisterForm />;
}

// app/plant-data/page.tsx
export default function PlantDataListPage() {
  return <PlantDataList />;
}

// app/plant-data/[id]/page.tsx
export default function PlantDataDetailPage({ params }: { params: { id: string } }) {
  return <PlantDataDetail id={params.id} />;
}

// app/plant-data/create/page.tsx
export default function PlantDataCreatePage() {
  return <PlantDataForm />;
}

// app/plant-data/[id]/edit/page.tsx
export default function PlantDataEditPage({ params }: { params: { id: string } }) {
  return <PlantDataForm id={params.id} />;
}

// app/not-found.tsx
export default function NotFoundPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2">Page not found</p>
      </div>
    </div>
  );
}

// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const publicPaths = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Allow public paths
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Verify authentication
  const isAuthenticated = token && await verifyAuth(token);
  
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/plant-data/:path*',
    '/dashboard/:path*',
    '/analytics/:path*',
  ],
};