// config/app.ts
// Замінюється агентом при bootstrap-startup

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'MVP Template',
  domain: process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Built with Venture Factory',

  roles: {
    admin: {
      label: 'Admin',
      defaultRedirect: '/admin/dashboard',
      allowedRoutes: ['/admin', '/dashboard', '/profile', '/billing'],
    },
    user: {
      label: 'User',
      defaultRedirect: '/dashboard',
      allowedRoutes: ['/dashboard', '/profile', '/billing'],
    },
  },

  features: {
    quizBuilder: process.env.NEXT_PUBLIC_FEATURE_QUIZ_BUILDER === 'true',
    mobile: process.env.NEXT_PUBLIC_FEATURE_MOBILE === 'true',
  },
}

export type Role = keyof typeof APP_CONFIG.roles
