import { AppProps } from 'next/app'
import { ExperimentProvider } from "@/app/contexts";

import '@/app/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // This is just mock data, meant to be like that. SSE isn't expecting changes from data.
    <ExperimentProvider experimentId={'exp_live_001'}>
      <Component {...pageProps} />
    </ExperimentProvider>
  )
}

export default MyApp
