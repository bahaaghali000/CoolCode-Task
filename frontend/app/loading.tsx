import Loader from "./components/Loader";

const loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="large" />
    </div>
  );
};

export default loading;
