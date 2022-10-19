import MicrobialDisplacement from "../components/GLSL/MicrobialDisplacement";
import ShaderPageWrapper from "../components/ShaderPageWrapper/ShaderPageWrapper";

const MicrobialDisplacementPage = ({width, height}) => {

    return ( 
        <ShaderPageWrapper>
            <MicrobialDisplacement width={width} height={height} />
        </ShaderPageWrapper>
     );
}
 
export default MicrobialDisplacementPage;