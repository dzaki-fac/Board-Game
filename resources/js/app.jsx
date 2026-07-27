import React from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp, router } from '@inertiajs/react'
import AppLayout from './Layouts/AppLayout'
import "../css/app.css";

function ProgressBar() {
    const [visible, setVisible] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const timerRef = React.useRef(null);

    React.useEffect(() => {
        const onStart = () => {
            setVisible(true);
            setProgress(0);
            let p = 0;
            const step = () => {
                p += Math.random() * 25;
                if (p > 90) p = 90;
                setProgress(p);
                timerRef.current = setTimeout(step, 350);
            };
            step();
        };
        const onFinish = () => {
            setProgress(100);
            setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 400);
        };

        router.on('start', onStart);
        router.on('finish', onFinish);

        return () => {
            router.off('start', onStart);
            router.off('finish', onFinish);
            clearTimeout(timerRef.current);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                backgroundColor: 'transparent',
                zIndex: 9999,
            }}
        >
            <div
                style={{
                    height: '100%',
                    width: `${progress}%`,
                    backgroundColor: '#0E4A73',
                    transition: 'width 0.3s ease',
                    borderRadius: '0 2px 2px 0',
                }}
            />
        </div>
    );
}

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
    createRoot(el).render(
        <>
            <ProgressBar />
            <App {...props} />
        </>
    )
  },
})