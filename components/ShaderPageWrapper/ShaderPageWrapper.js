import Image from "next/image";
import Link from "next/link";

const ShaderPageWrapper = ({props, children}) => {
    return ( 
        <div style={{backgroundColor: 'blue'}}>
            <div style={{padding: '10px 15px'}}><Link href="/" priority><a><Image src="/icons/arrow.svg" height={50} width={80} style={{zIndex: 9}} /></a></Link></div>
            {children}
        </div>
    );
}
 
export default ShaderPageWrapper;