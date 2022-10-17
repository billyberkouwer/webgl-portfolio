import ShaderPageWrapper from "../components/ShaderPageWrapper/ShaderPageWrapper";
import WaveSimulation from "../components/WaveSimulation";

export default function Wave1() {
    return (
        <ShaderPageWrapper backgroundColor={'blue'}>
            <WaveSimulation backgroundColor={'blue'} />
        </ShaderPageWrapper>
    )
}