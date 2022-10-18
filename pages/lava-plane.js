import LavaPlane from "../components/GLSL/LavaPlane";
import ShaderPageWrapper from "../components/ShaderPageWrapper/ShaderPageWrapper";

export default function GhostlyPlanePage({width, height}) {
    return (
        <ShaderPageWrapper backgroundColor={'blue'}>
            <LavaPlane width={width} height={height} />
        </ShaderPageWrapper>
    )
}