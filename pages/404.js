import Link from "next/link";

const FourOhFour = (props) => {
    return ( 
        <div className="centered fourohfour">
            <h1>404: This page does not exist.</h1>
            <Link href="/"><button>Back to Home</button></Link>
        </div>
     );
}
 
export default FourOhFour;