/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                gary: {
                    50: '#F2F2F2',
                    100: '#E6E6E6',
                    200: '#CCCCCC',
                    300: '#B3B3B3',
                    400: '#999999',
                    700: '#3C3C3C',
                },
                purple: {
                    50: '#E5EAFF',
                    100: '#CCD5FF',
                    500: '#6687FF',
                },
                red: {
                    500: '#F34C3D',
                    600: '#BF1C0D',
                },
            },
            textColor: {
                primary: '#6C87FF',
                '3c': '#3C3C3C',
                b3: '#B3B3B3',
                error: '#F34D3D',
                warning: '#FF9940',
                success: '#38C728',
                99: '#999999',
                85: '#858585',
                29: '#2946C7',
                25: '#0025CC',
            },
            backgroundColor: {
                primary: '#6C87FF',
                primary20: '#6C87FF33',
                e5: '#E5EAFF',
                f2: '#F2F2F2',
                e6: '#E6E6E6',
                49: '#4966E633',
                fa: '#FAFBFF',
            },
            borderColor: {
                e6: '#E6E6E6',
            },
            height: {
                calc48: 'calc(100% - 48px)',
                calc56: 'calc(100% - 56px)',
            },
            borderRadius: {
                3: '3px',
            },
        },
    },
    plugins: [],
    corePlugins: {
        preflight: false,
    },
};
