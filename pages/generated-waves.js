import ShaderPageWrapper from "../components/ShaderPageWrapper/ShaderPageWrapper";
import WaveSimulation from "../components/GLSL/WaveSimulation";

const WaveSimulationPage = ({width, height}) => {
    return (
        <ShaderPageWrapper >
            <WaveSimulation width={width} height={height} />
        </ShaderPageWrapper>
    )
}

export default WaveSimulationPage;