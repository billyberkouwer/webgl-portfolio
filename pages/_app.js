import '../styles/global.scss';
import Header from "../components/Header/Header";

function MyApp({ Component, pageProps }) {

  return (
    <div className="pageContainer">
      <Header />
      <Component {...pageProps} />
    </div>
    
  )
}

export default MyApp
