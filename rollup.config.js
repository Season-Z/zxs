import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'lib/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  plugins: [
    resolve({ jsnext: true, main: true }),
    commonjs(),
    terser(),
    // typescript({ tsconfig: "tsconfig.json", }),
  ]
};
