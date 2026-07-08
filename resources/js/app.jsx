import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import AppLayout from './Layouts/AppLayout'
import "../css/app.css";

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    let page = pages[`./Pages/${name}.jsx`]

    if (!page) {
        throw new Error(`Page ${name} tidak ditemukan`)
    }

    page.default.layout = page.default.layout || ((page) => (
      <AppLayout>{page}</AppLayout>
    ))

    return page
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
})