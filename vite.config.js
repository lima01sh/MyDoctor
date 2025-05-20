import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  //base: "/vote/uatClinic/",
  base: "/service-ui/service-my-clinic/",
  plugins: [react()],
  // server:{
  //   proxy:{
  //     '/api':{
  //       target:'https://www.addpay.co.th/service-api/api_doctor/api',
  //       changeOrigin:true,
  //       rewrite: path => path.replace(/^\/api/,'')
  //     }
  //   }
  // }
});
