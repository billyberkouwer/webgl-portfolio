import GhostlyPlane from "../components/GLSL/GhostlyPlane";
import ShaderPageWrapper from "../components/ShaderPageWrapper/ShaderPageWrapper";


export default function GhostlyPlanePage({width, height}) {

    return (
        <ShaderPageWrapper backgroundColor={'blue'}>
            <GhostlyPlane width={width} height={height}/>
        </ShaderPageWrapper>
    )
}