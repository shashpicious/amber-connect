import { useMemo } from 'react';
import { Container } from './settings/types';
import { NavigationMenu } from './components/generated/NavigationMenu';

let container: Container = 'none';

function App() {
  const generatedComponent = useMemo(() => {
    return <NavigationMenu />;
  }, []);

  if (container === 'centered') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        {generatedComponent}
      </div>
    );
  } else {
    return generatedComponent;
  }
}

export default App;
