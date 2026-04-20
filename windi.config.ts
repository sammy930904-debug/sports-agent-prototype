import { defineConfig } from 'windicss/helpers';

export default defineConfig({
    extract: {
        include: ['**/*.{jsx,js,ts,tsx,css,html}'],
        exclude: ['node_modules', '.git', 'dist/**/*'],
    },
});
