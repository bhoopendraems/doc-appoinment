import type {AppProps} from "next/app";

function MyApp ({Component, pageProps}: AppProps){
    // eslint-disable-next-line react/react-in-jsx-scope
    return <Component {...pageProps} />;
} 

export default MyApp;
