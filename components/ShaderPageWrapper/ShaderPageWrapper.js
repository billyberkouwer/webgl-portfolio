import BackArrow from "../BackArrow/BackArrow";

const ShaderPageWrapper = ({ props, children }) => {
  return (
    <>
      <BackArrow />
      {children}
    </>
  );
};

export default ShaderPageWrapper;
